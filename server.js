const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Data stores
let messages = [];
let teams = { A: "Team A", B: "Team B" };
let score = { A: 0, B: 0 };
let players = {}; // socketId -> { name, guess, active }
let gameActive = false;
let currentRound = 0;
let maxRounds = 3; // 3-round tournament
let guessingDeadline = null; // Timer for guessing
let participantSelectionActive = false;
let participantEntries = {}; // socketId -> { name, number }

const ADMIN_PASS = "admin2025";

app.use(express.static(path.join(__dirname, "public")));

// Serve admin page
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// Serve audience page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
  console.log(`📡 New user connected: ${socket.id}`);

  // Send initial data
  socket.emit("init", {
    messages,
    teams,
    score,
    gameActive,
    currentRound,
    maxRounds,
    guessingDeadline,
    participantSelectionActive
  });
  // Handle rejoin - CRITICAL for reconnection
  socket.on('rejoin', (username) => {
    if (!username) return;
    
    socket.username = username;
    
    // Find if player exists
    let existingPlayer = Object.values(players).find(p => p.name === username);
    
    if (existingPlayer) {
      // Update socket ID for existing player
      delete players[existingPlayer.id];
      existingPlayer.id = socket.id;
      players[socket.id] = existingPlayer;
    } else {
      // Create new player entry
      players[socket.id] = {
        id: socket.id,
        name: username,
        guess: null,
        active: true
      };
    }
    
    // Send current game state
    socket.emit('rejoinSuccess', {
      username: username,
      gameActive: gameActive,
      participantSelectionActive: participantSelectionActive,
      hasGuessed: players[socket.id].guess !== null,
      guessingDeadline: guessingDeadline,
      currentRound: currentRound,          
      maxRounds: maxRounds,                
      teams: teams  
    });
    
    // Send all current data
    socket.emit('init', {
      messages: messages,
      teams: teams,
      score: score,
      currentRound: currentRound,
      maxRounds: maxRounds,
      participantSelectionActive: participantSelectionActive
    });
    
    // Update other players
    io.emit('playersUpdate', Object.values(players));
    
    console.log(`✅ ${username} rejoined the chat`);
  });
  // User joins
  socket.on("join", (name) => {
    // Reject if no name provided
    if (!name || name.trim() === "") {
      socket.emit("joinError", { msg: "Name is required to join" });
      return;
    }

    socket.username = name.trim();
    
    // Initialize player
    players[socket.id] = {
      name: socket.username,
      guess: null,
      active: true
    };

    socket.emit('joinSuccess', { username: name });

    const joinMsg = {
      id: Date.now() + Math.random(),
      user: "System",
      text: `🟢 ${socket.username} joined the chat`,
      ts: Date.now(),
    };
    messages.push(joinMsg);
    io.emit("chatMessage", joinMsg);

    console.log(`✅ ${socket.username} joined`);
  });

  // Chat message
  socket.on("chatMessage", (data) => {
    if (!data || typeof data.text !== "string") return;
    if (!socket.username && !socket.isAdmin) return;
    
    const displayName = socket.isAdmin ? "Admin" : socket.username;
    
    const msg = {
      id: Date.now() + Math.random(),
      user: displayName,
      text: data.text.trim(),
      ts: Date.now(),
      isAdmin: socket.isAdmin || false
    };
    messages.push(msg);
    io.emit("chatMessage", msg);
  });

  // Admin authentication
  socket.on("adminAuth", (pass) => {
    const ok = pass === ADMIN_PASS;
    socket.isAdmin = ok;
    
    if (ok) {
      socket.emit("authSuccess");
      console.log("🔑 Admin authenticated");
      
      // Send current player list to admin
      const playerList = Object.entries(players).map(([id, p]) => ({
        id,
        ...p
      }));
      socket.emit("playersUpdate", playerList);
    } else {
      socket.emit("authFailed");
      console.log("❌ Wrong admin password");
    }
  });

  // Admin message
  socket.on("adminMessage", (data) => {
    if (!socket.isAdmin) return;
    if (!data || typeof data.text !== "string") return;
    
    const msg = {
      id: Date.now() + Math.random(),
      user: "Admin",
      text: data.text.trim(),
      ts: Date.now(),
      isAdmin: true
    };
    messages.push(msg);
    io.emit("chatMessage", msg);
  });

  // Admin updates team names
  socket.on("updateTeams", ({ A, B }) => {
    if (!socket.isAdmin) return;
    teams = { A: A || "Team A", B: B || "Team B" };
    io.emit("teamsUpdate", teams);
    console.log(`🏐 Teams updated: ${teams.A} vs ${teams.B}`);
  });

  // Admin updates score
  socket.on("updateScore", ({ A, B }) => {
    if (!socket.isAdmin) return;
    score = { A: A || 0, B: B || 0 };
    io.emit("scoreUpdate", score);
    console.log(`📊 Score updated: ${score.A} - ${score.B}`);
  });

  // Delete message
  socket.on("deleteMessage", (msgId) => {
    if (!socket.isAdmin) return;
    messages = messages.filter((m) => m.id != msgId);
    io.emit("messageDeleted", msgId);
    console.log(`🗑️ Message deleted: ${msgId}`);
  });

  // Kick player
  socket.on("kickPlayer", (playerId) => {
    if (!socket.isAdmin) return;
    
    const playerSocket = io.sockets.sockets.get(playerId);
    if (playerSocket) {
      const playerName = playerSocket.username || "User";
      playerSocket.emit("kicked", { reason: "Removed by admin" });
      playerSocket.disconnect(true);
      
      const kickMsg = {
        id: Date.now() + Math.random(),
        user: "System",
        text: `🚫 ${playerName} was removed by admin`,
        ts: Date.now(),
      };
      messages.push(kickMsg);
      io.emit("chatMessage", kickMsg);
      
      console.log(`🚫 Player kicked: ${playerName}`);
    }
  });

  // Admin starts a new game
  socket.on("startGame", () => {
    if (!socket.isAdmin) return;
    
    gameActive = true;
    currentRound++;
    
    // Set 2-minute guessing deadline
    guessingDeadline = Date.now() + (2 * 60 * 1000); // 2 minutes from now
    
    // Reset all active players' guesses
    Object.keys(players).forEach(id => {
      if (players[id].active) {
        players[id].guess = null;
      }
    });

    // Notify all clients with popup and timer
    io.emit("gameStarted", { 
      teams, 
      round: currentRound,
      maxRounds,
      deadline: guessingDeadline
    });
    
    const gameMsg = {
      id: Date.now() + Math.random(),
      user: "System",
      text: `🎮 NEW GAME! Round ${currentRound}/${maxRounds} - Who will win: ${teams.A} or ${teams.B}? You have 2 minutes to guess!`,
      ts: Date.now(),
    };
    messages.push(gameMsg);
    io.emit("chatMessage", gameMsg);

    // Auto-close guessing after 2 minutes
    setTimeout(() => {
      guessingDeadline = null;
      io.emit("guessingClosed");
      
      const closedMsg = {
        id: Date.now() + Math.random(),
        user: "System",
        text: `⏰ Guessing time is over! Round ${currentRound} guesses are now locked.`,
        ts: Date.now(),
      };
      messages.push(closedMsg);
      io.emit("chatMessage", closedMsg);
    }, 2 * 60 * 1000);

    console.log(`🎮 Game started - Round ${currentRound}/${maxRounds} with 2-minute timer`);
  });

  // Player makes a guess
  socket.on("makeGuess", (team) => {
    if (!gameActive) {
      socket.emit("error", { msg: "No active game" });
      return;
    }

    // Check if guessing time has expired
    if (!guessingDeadline || Date.now() > guessingDeadline) {
      socket.emit("error", { msg: "Guessing time has expired!" });
      return;
    }

    if (!players[socket.id]) {
      socket.emit("error", { msg: "Please join first" });
      return;
    }

    if (!players[socket.id].active) {
      socket.emit("error", { msg: "You've been eliminated" });
      return;
    }

    if (team !== "A" && team !== "B") return;

    players[socket.id].guess = team;
    socket.emit("guessConfirmed", { team });
    
    console.log(`🎯 ${socket.username} guessed Team ${team}`);

    // Update admin with player list
    const playerList = Object.entries(players).map(([id, p]) => ({
      id,
      ...p
    }));
    io.to("admin-room").emit("playersUpdate", playerList);
  });

  // Admin ends round with winner
  socket.on("endRound", (winnerTeam) => {
    if (!socket.isAdmin || !gameActive) return;
    
    if (winnerTeam !== "A" && winnerTeam !== "B") return;

    // Eliminate players who guessed wrong
    let eliminated = [];
    let survived = [];
    
    Object.entries(players).forEach(([id, player]) => {
      if (player.active && player.guess !== null) {
        if (player.guess !== winnerTeam) {
          player.active = false;
          eliminated.push(player.name);
        } else {
          survived.push(player.name);
        }
      }
    });

    // Count remaining players
    const activePlayers = Object.values(players).filter(p => p.active);
    const totalPlayers = Object.keys(players).length;

    // Notify all clients with detailed info
    io.emit("roundEnded", {
      winnerTeam,
      score,
      players: Object.entries(players).map(([id, p]) => ({
        id,
        ...p
      })),
      eliminated,
      survived,
      remaining: activePlayers.length,
      total: totalPlayers
    });

    const winnerName = teams[winnerTeam];
    const resultMsg = {
      id: Date.now() + Math.random(),
      user: "System",
      text: `🏆 ${winnerName} won Round ${currentRound}/${maxRounds}! ${survived.length} players advanced, ${eliminated.length} eliminated. ${activePlayers.length}/${totalPlayers} remain.`,
      ts: Date.now(),
    };
    messages.push(resultMsg);
    io.emit("chatMessage", resultMsg);

    // Check if tournament should end
    if (currentRound >= maxRounds || activePlayers.length <= 1) {
      gameActive = false;
      
      if (activePlayers.length === 1) {
        const winner = activePlayers[0];
        const winMsg = {
          id: Date.now() + Math.random(),
          user: "System",
          text: `🎊 TOURNAMENT WINNER: ${winner.name}! Won after ${currentRound} rounds! 🎊`,
          ts: Date.now(),
        };
        messages.push(winMsg);
        io.emit("chatMessage", winMsg);
        io.emit("gameWinner", { winner: winner.name, rounds: currentRound });
      } else if (currentRound >= maxRounds) {
        // Tournament ended after 3 rounds with multiple winners
        const winners = activePlayers.map(p => p.name).join(", ");
        const multiWinMsg = {
          id: Date.now() + Math.random(),
          user: "System",
          text: `🎊 TOURNAMENT COMPLETE! Winners: ${winners} (${activePlayers.length} players)`,
          ts: Date.now(),
        };
        messages.push(multiWinMsg);
        io.emit("chatMessage", multiWinMsg);
        io.emit("tournamentComplete", { winners: activePlayers, rounds: maxRounds });
      } else {
        const tieMsg = {
          id: Date.now() + Math.random(),
          user: "System",
          text: `🤝 Tournament Over - All players eliminated!`,
          ts: Date.now(),
        };
        messages.push(tieMsg);
        io.emit("chatMessage", tieMsg);
      }
      
      // Reset for next tournament
      currentRound = 0;
    }

    console.log(`🏆 Round ended - ${winnerName} won`);

    // Update admin with player list
    const playerList = Object.entries(players).map(([id, p]) => ({
      id,
      ...p
    }));
    io.to("admin-room").emit("playersUpdate", playerList);
  });

  // Admin joins room
  socket.on("joinAdminRoom", () => {
    if (socket.isAdmin) {
      socket.join("admin-room");
    }
  });

  // Participant Selection System
  socket.on("startParticipantSelection", () => {
    if (!socket.isAdmin) return;
    
    participantSelectionActive = true;
    participantEntries = {};
    
    io.emit("participantSelectionStarted");
    
    const selectionMsg = {
      id: Date.now() + Math.random(),
      user: "System",
      text: `🎲 INTERACTIVE EVENT! Enter your bracelet number to participate in the tryout game!`,
      ts: Date.now(),
    };
    messages.push(selectionMsg);
    io.emit("chatMessage", selectionMsg);
    
    console.log("🎲 Participant selection started");
  });

  socket.on("submitBraceletNumber", (number) => {
    if (!participantSelectionActive) {
      socket.emit("error", { msg: "Participant selection is not active" });
      return;
    }
    
    if (!socket.username) {
      socket.emit("error", { msg: "Please join first" });
      return;
    }
    
    const braceletNumber = String(number).trim();
    if (!braceletNumber) {
      socket.emit("error", { msg: "Please enter a valid bracelet number" });
      return;
    }
    
    participantEntries[socket.id] = {
      name: socket.username,
      number: braceletNumber,
      socketId: socket.id
    };
    
    socket.emit("braceletNumberConfirmed", { number: braceletNumber });
    
    // Update admin with entries
    const entriesList = Object.values(participantEntries);
    io.to("admin-room").emit("participantEntriesUpdate", entriesList);
    
    console.log(`🎫 ${socket.username} entered bracelet number: ${braceletNumber}`);
  });

  socket.on("drawRandomParticipants", (count) => {
    if (!socket.isAdmin) return;
    
    const entries = Object.values(participantEntries);
    if (entries.length === 0) {
      socket.emit("error", { msg: "No participants have entered numbers yet" });
      return;
    }
    
    const numToDraw = Math.min(count || 1, entries.length);
    const shuffled = entries.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numToDraw);
    
    io.emit("participantsDrawn", { participants: selected });
    
    const names = selected.map(p => `${p.name} (#${p.number})`).join(", ");
    const drawnMsg = {
      id: Date.now() + Math.random(),
      user: "System",
      text: `🎉 SELECTED PARTICIPANTS: ${names}! Please come to the court!`,
      ts: Date.now(),
    };
    messages.push(drawnMsg);
    io.emit("chatMessage", drawnMsg);
    
    console.log(`🎉 Drew ${numToDraw} participants:`, selected);
  });

  socket.on("endParticipantSelection", () => {
    if (!socket.isAdmin) return;
    
    participantSelectionActive = false;
    participantEntries = {};
    
    io.emit("participantSelectionEnded");
    
    const endMsg = {
      id: Date.now() + Math.random(),
      user: "System",
      text: `✅ Participant selection closed. Thank you everyone!`,
      ts: Date.now(),
    };
    messages.push(endMsg);
    io.emit("chatMessage", endMsg);
    
    console.log("✅ Participant selection ended");
  });

  // Disconnect
  socket.on("disconnect", () => {
    if (socket.username) {
      const leaveMsg = {
        id: Date.now() + Math.random(),
        user: "System",
        text: `🔴 ${socket.username} left the chat`,
        ts: Date.now(),
      };
      messages.push(leaveMsg);
      io.emit("chatMessage", leaveMsg);
    }
    
    // Remove player
    delete players[socket.id];
    
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`🚀 Volley-Live server running at http://localhost:${PORT}`);
  console.log(`👥 Audience: http://localhost:${PORT}`);
  console.log(`🔧 Admin: http://localhost:${PORT}/admin`);
});