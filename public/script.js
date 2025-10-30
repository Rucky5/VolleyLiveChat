const socket = io();

// Current language
let currentLang = localStorage.getItem('language') || 'en';
document.documentElement.lang = currentLang;
document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
// CRITICAL: Reconnection handling
let myUsername = localStorage.getItem('volleyUsername') || null;
let hasJoined = localStorage.getItem('volleyHasJoined') === 'true';

// Auto-rejoin on reconnect
socket.on('connect', () => {
  console.log('Connected to server');
  if (hasJoined && myUsername) {
    socket.emit('rejoin', myUsername);
  }
});
// DOM Elements
const joinSection = document.getElementById('joinSection');
const gameSection = document.getElementById('gameSection');
const msgInput = document.getElementById('msgInput');
const chatDiv = document.getElementById('chat');
const yourGuess = document.getElementById('yourGuess');
const statusBar = document.getElementById('statusBar');
const guessSection = document.getElementById('guessSection');
const gamePopup = document.getElementById('gamePopup');
const participantPopup = document.getElementById('participantPopup');
const winnerPopup = document.getElementById('winnerPopup');
const tournamentCompletePopup = document.getElementById('tournamentCompletePopup');
const timerDisplay = document.getElementById('timerDisplay');
const roundCounter = document.getElementById('roundCounter');

// Team names
const teamAName = document.getElementById('teamAName');
const teamBName = document.getElementById('teamBName');
const guessTeamAName = document.getElementById('guessTeamAName');
const guessTeamBName = document.getElementById('guessTeamBName');
const popupTeamA = document.getElementById('popupTeamA');
const popupTeamB = document.getElementById('popupTeamB');

// Scores
const scoreA = document.getElementById('scoreA');
const scoreB = document.getElementById('scoreB');

// Round info
const currentRoundElem = document.getElementById('currentRound');
const maxRoundsElem = document.getElementById('maxRounds');
const popupRoundElem = document.getElementById('popupRound');
const popupMaxRoundsElem = document.getElementById('popupMaxRounds');

// Timer elements
const timerMinutes = document.getElementById('timerMinutes');
const timerSeconds = document.getElementById('timerSeconds');
const popupTimerMinutes = document.getElementById('popupTimerMinutes');
const popupTimerSeconds = document.getElementById('popupTimerSeconds');

let hasGuessed = false;
let isActive = true;
let timerInterval = null;

// Language Toggle - Consistent with admin page
document.querySelectorAll('.langBtn').forEach(btn => {
  btn.onclick = () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('language', currentLang);
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    updateTranslations();
    // Update all language buttons
    document.querySelectorAll('.langBtn').forEach(b => {
      b.textContent = currentLang === 'en' ? 'العربية' : 'English';
    });
  };
});

// Update all translations on page
function updateTranslations() {
  document.querySelectorAll('[data-translate]').forEach(elem => {
    const key = elem.getAttribute('data-translate');
    if (translations[currentLang] && translations[currentLang][key]) {
      if (elem.tagName === 'INPUT' || elem.tagName === 'TEXTAREA') {
        elem.placeholder = translations[currentLang][key];
      } else {
        elem.textContent = translations[currentLang][key];
      }
    }
  });
}

// Initial translation
updateTranslations();

// Join button
document.getElementById('joinBtn').onclick = () => {
  const name = document.getElementById('nameInput').value.trim();
  const nameError = document.getElementById('nameError');
  
  if (!name) {
    nameError.style.display = 'block';
    nameError.textContent = t('nameError', currentLang);
    document.getElementById('nameInput').focus();
    return;
  }
  
  socket.emit('join', name);
};

// Join success
socket.on('joinSuccess', (data) => {
  myUsername = (data && data.username) || document.getElementById('nameInput').value.trim();
  hasJoined = true;
  localStorage.setItem('volleyUsername', myUsername);
  localStorage.setItem('volleyHasJoined', 'true');
  
  joinSection.style.display = 'none';
  gameSection.style.display = 'block';
  // HIDE all popups on join
  gamePopup.style.display = 'none';
  participantPopup.style.display = 'none';
  winnerPopup.style.display = 'none';
  tournamentCompletePopup.style.display = 'none';

});
// Handle rejoin - CRITICAL for reconnection
socket.on('rejoinSuccess', (data) => {
  console.log('Rejoined successfully!', data);
  
  // Show game section
  joinSection.style.display = 'none';
  gameSection.style.display = 'block';
  
  // Update team names if available
  if (data.teams) {
    updateTeamNames(data.teams);
  }
  
  // If there's an active game
  if (data.gameActive) {
    guessSection.style.display = 'block';
    roundCounter.style.display = 'block';
    
    // Update round info
    if (data.currentRound) {
      currentRoundElem.textContent = data.currentRound;
      maxRoundsElem.textContent = data.maxRounds;
      popupRoundElem.textContent = data.currentRound;
      popupMaxRoundsElem.textContent = data.maxRounds;
    }
    
    // Show REMAINING time (not restart!)
    if (data.guessingDeadline && Date.now() < data.guessingDeadline) {
      startTimer(data.guessingDeadline); // Shows remaining time!
    }
    
    // Show popup if user hasn't guessed yet
    if (!data.hasGuessed) {
      gamePopup.style.display = 'flex';
    } else {
      gamePopup.style.display = 'none';
    }
    
    statusBar.textContent = t('gameStarted', currentLang);
    statusBar.className = 'status-bar status-active';
  } else {
    // No active game - hide game-related popups
    gamePopup.style.display = 'none';
    guessSection.style.display = 'none';
    roundCounter.style.display = 'none';
  }
  
  // Participant selection - ONLY show if CURRENTLY active
  console.log('Participant selection active:', data.participantSelectionActive);
  if (data.participantSelectionActive === true) {
    participantPopup.style.display = 'flex';
  } else {
    // Make sure it's hidden if not active
    participantPopup.style.display = 'none';
  }
  
  // Restore guess status
  if (data.hasGuessed) {
    hasGuessed = true;
  }
});

// Join error
socket.on('joinError', ({ msg }) => {
  const nameError = document.getElementById('nameError');
  nameError.style.display = 'block';
  nameError.textContent = msg;
});

// Enter key to join
document.getElementById('nameInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('joinBtn').click();
  }
});

// Send message
document.getElementById('sendBtn').onclick = () => {
  const text = msgInput.value.trim();
  if (text) {
    socket.emit('chatMessage', { text });
    msgInput.value = '';
  }
};

// Enter key to send message
msgInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('sendBtn').click();
  }
});

// Receive chat messages
socket.on('chatMessage', (msg) => {
  const div = document.createElement('div');
  div.className = "message";
  div.setAttribute('data-msg-id', msg.id);
  
  if (msg.user === "System") {
    div.classList.add("system-message");
    div.innerHTML = `${msg.text}`;
  } else if (msg.isAdmin) {
    div.classList.add("admin-message");
    div.innerHTML = `<span class="username admin-badge">👑 ${msg.user}:</span> ${msg.text}`;
  } else {
    div.innerHTML = `<span class="username">${msg.user}:</span> ${msg.text}`;
  }
  
  chatDiv.appendChild(div);
  chatDiv.scrollTop = chatDiv.scrollHeight;
});

// Initialize
socket.on('init', (data) => {
  // Load messages
  data.messages.forEach(msg => {
    const div = document.createElement('div');
    div.className = "message";
    div.setAttribute('data-msg-id', msg.id);
    
    if (msg.user === "System") {
      div.classList.add("system-message");
      div.innerHTML = `${msg.text}`;
    } else if (msg.isAdmin) {
      div.classList.add("admin-message");
      div.innerHTML = `<span class="username admin-badge">👑 ${msg.user}:</span> ${msg.text}`;
    } else {
      div.innerHTML = `<span class="username">${msg.user}:</span> ${msg.text}`;
    }
    
    chatDiv.appendChild(div);
  });
  chatDiv.scrollTop = chatDiv.scrollHeight;

  // Update teams
  if (data.teams) {
    updateTeamNames(data.teams);
  }

  // Update score
  if (data.score) {
    scoreA.textContent = data.score.A;
    scoreB.textContent = data.score.B;
  }

  // Show guess section if game is active
  if (data.gameActive) {
    guessSection.style.display = 'block';
    roundCounter.style.display = 'block';
    currentRoundElem.textContent = data.currentRound;
    maxRoundsElem.textContent = data.maxRounds;
    statusBar.textContent = t('gameStarted', currentLang);
    statusBar.className = 'status-bar status-active';
    
    // Start timer if deadline exists
    if (data.guessingDeadline) {
      startTimer(data.guessingDeadline);
    }
  }
});

// Teams updated
socket.on('teamsUpdate', (teams) => {
  updateTeamNames(teams);
});

function updateTeamNames(teams) {
  teamAName.textContent = teams.A;
  teamBName.textContent = teams.B;
  guessTeamAName.textContent = teams.A;
  guessTeamBName.textContent = teams.B;
  popupTeamA.textContent = teams.A;
  popupTeamB.textContent = teams.B;
  
  // Update popup guess button names
  document.getElementById('popupGuessTeamAName').textContent = teams.A;
  document.getElementById('popupGuessTeamBName').textContent = teams.B;
}

// Game started - SHOW POPUP WITH TIMER
socket.on('gameStarted', ({ teams, round, maxRounds, deadline }) => {
  updateTeamNames(teams);
  hasGuessed = false;
  isActive = true;
  yourGuess.textContent = t('notSelected', currentLang);
  
  // Update round info
  roundCounter.style.display = 'block';
  currentRoundElem.textContent = round;
  maxRoundsElem.textContent = maxRounds;
  popupRoundElem.textContent = round;
  popupMaxRoundsElem.textContent = maxRounds;
  
  // Show popup
  gamePopup.style.display = 'flex';
  
  // Show guess section
  guessSection.style.display = 'block';
  statusBar.textContent = t('gameStarted', currentLang);
  statusBar.className = 'status-bar status-active';
  
  // Start timer
  startTimer(deadline);
});

// Timer function
function startTimer(deadline) {
  // Clear any existing timer
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  timerDisplay.style.display = 'block';
  
  timerInterval = setInterval(() => {
    const now = Date.now();
    const timeLeft = deadline - now;
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerMinutes.textContent = '0';
      timerSeconds.textContent = '00';
      popupTimerMinutes.textContent = '0';
      popupTimerSeconds.textContent = '00';
      timerDisplay.style.display = 'none';
      return;
    }
    
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    
    timerMinutes.textContent = minutes;
    timerSeconds.textContent = seconds.toString().padStart(2, '0');
    popupTimerMinutes.textContent = minutes;
    popupTimerSeconds.textContent = seconds.toString().padStart(2, '0');
  }, 100);
}

// Guessing closed
socket.on('guessingClosed', () => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  timerDisplay.style.display = 'none';
  statusBar.textContent = t('timeExpired', currentLang);
  statusBar.className = 'status-bar status-eliminated';
});

// Close popup
document.getElementById('closePopup').onclick = () => {
  gamePopup.style.display = 'none';
};

// Close popup when clicking outside
gamePopup.onclick = (e) => {
  if (e.target === gamePopup) {
    gamePopup.style.display = 'none';
  }
};

// Make guess - Team A
document.getElementById('guessA').onclick = () => makeGuess('A');
document.getElementById('guessB').onclick = () => makeGuess('B');
document.getElementById('popupGuessA').onclick = () => {
  makeGuess('A');
  gamePopup.style.display = 'none';
};
document.getElementById('popupGuessB').onclick = () => {
  makeGuess('B');
  gamePopup.style.display = 'none';
};

function makeGuess(team) {
  if (!isActive) {
    alert(t('eliminated', currentLang));
    return;
  }
  if (hasGuessed) {
    alert(t('alreadyGuessed', currentLang));
    return;
  }
  socket.emit('makeGuess', team);
}

// Guess confirmed
socket.on('guessConfirmed', ({ team }) => {
  hasGuessed = true;
  const teamName = team === 'A' ? guessTeamAName.textContent : guessTeamBName.textContent;
  yourGuess.textContent = teamName;
  yourGuess.style.color = team === 'A' ? '#F9A8BB' : '#8FC4AF';
  yourGuess.style.fontWeight = 'bold';
  
  statusBar.textContent = t('guessLocked', currentLang);
  statusBar.className = 'status-bar status-success';
});

// Round ended
socket.on('roundEnded', ({ winnerTeam, score: newScore, players, eliminated, survived, remaining, total }) => {
  // Update score
  scoreA.textContent = newScore.A;
  scoreB.textContent = newScore.B;
  
  // Stop timer
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  timerDisplay.style.display = 'none';
  
  // Check if I was eliminated or survived
  const myPlayer = players.find(p => p.id === socket.id);
  
  if (myPlayer && !myPlayer.active) {
    // I was eliminated
    isActive = false;
    guessSection.style.display = 'none';
    statusBar.textContent = t('eliminated', currentLang) + ' ' + t('guessWrong', currentLang);
    statusBar.className = 'status-bar status-eliminated';
    
    // Show elimination popup
    setTimeout(() => {
      alert('❌ ' + t('eliminated', currentLang) + '\n\n' + t('guessWrong', currentLang));
    }, 500);
    
  } else if (myPlayer && myPlayer.active && myPlayer.guess !== null) {
    // I survived!
    statusBar.textContent = `🎉 ${t('advanced', currentLang)} ${remaining}/${total} ${t('playersRemain', currentLang)}`;
    statusBar.className = 'status-bar status-survived';
    
    // Show advancement notification
    setTimeout(() => {
      alert(`🎉 ${t('advanced', currentLang)}\n\n${remaining} ${t('playersRemain', currentLang)}`);
    }, 500);
    
  } else if (myPlayer && myPlayer.active && myPlayer.guess === null) {
    // I'm still active but didn't guess
    statusBar.textContent = `⚠️ Round ended. You didn't make a guess. ${remaining}/${total} players remain.`;
    statusBar.className = 'status-bar';
  }
  
  // Reset for next round
  hasGuessed = false;
  yourGuess.textContent = t('notSelected', currentLang);
  yourGuess.style.color = '#666';
  yourGuess.style.fontWeight = 'normal';
});

// Score updated
socket.on('scoreUpdate', (newScore) => {
  scoreA.textContent = newScore.A;
  scoreB.textContent = newScore.B;
});

// Game winner
socket.on('gameWinner', ({ winner, rounds }) => {
  document.getElementById('winnerText').textContent = `${winner} ${t('wonTournament', currentLang)} ${rounds} ${t('rounds', currentLang)}!`;
  winnerPopup.style.display = 'flex';
  
  guessSection.style.display = 'none';
  roundCounter.style.display = 'none';
  statusBar.textContent = '🎊 ' + t('tournamentComplete', currentLang);
  statusBar.className = 'status-bar';
});

// Tournament complete (multiple winners)
socket.on('tournamentComplete', ({ winners, rounds }) => {
  const names = winners.map(w => w.name).join(', ');
  document.getElementById('tournamentCompleteText').textContent = `${t('winners', currentLang)}: ${names}`;
  tournamentCompletePopup.style.display = 'flex';
  
  guessSection.style.display = 'none';
  roundCounter.style.display = 'none';
});

// Close winner popup
document.getElementById('closeWinnerPopup').onclick = () => {
  winnerPopup.style.display = 'none';
};

document.getElementById('closeTournamentComplete').onclick = () => {
  tournamentCompletePopup.style.display = 'none';
};

// Participant Selection
socket.on('participantSelectionStarted', () => {
  participantPopup.style.display = 'flex';
  document.getElementById('braceletStatus').style.display = 'none';
  document.getElementById('braceletInput').value = '';
});

socket.on('participantSelectionEnded', () => {
  participantPopup.style.display = 'none';
});

document.getElementById('submitBracelet').onclick = () => {
  const number = document.getElementById('braceletInput').value.trim();
  if (!number) {
    alert(t('enterBraceletNumber', currentLang));
    return;
  }
  socket.emit('submitBraceletNumber', number);
};

socket.on('braceletNumberConfirmed', ({ number }) => {
  const status = document.getElementById('braceletStatus');
  status.textContent = `✅ ${t('numberConfirmed', currentLang)} (#${number})`;
  status.style.display = 'block';
});

document.getElementById('closeParticipant').onclick = () => {
  participantPopup.style.display = 'none';
};

socket.on('participantsDrawn', ({ participants }) => {
  // Notification handled via chat message
});

// Error handling
socket.on('error', ({ msg }) => {
  alert(msg);
});

// Kicked by admin
socket.on('kicked', ({ reason }) => {
  alert(`You have been removed from the chat. Reason: ${reason}`);
  window.location.reload();
});

// Message deleted (remove from view)
socket.on('messageDeleted', (msgId) => {
  const messages = chatDiv.querySelectorAll('.message');
  messages.forEach(msg => {
    if (msg.getAttribute('data-msg-id') == msgId) {
      msg.style.opacity = '0';
      setTimeout(() => msg.remove(), 300);
    }
  });
});