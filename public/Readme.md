# 🏐 Volley-Live Chat & Guessing Game

A real-time live chat and interactive guessing game system for volleyball tournaments. Audience members can chat together and participate in elimination-style guessing games where they predict round winners!

## ✨ Features

### For Audience Members
- **Live Chat**: Real-time chat with all other viewers
- **Guessing Game**: Predict which team will win each round
- **Popup Notifications**: Game start announcements appear as popups
- **Elimination System**: Wrong guesses eliminate players from the tournament
- **Live Score Updates**: See current tournament scores
- **Responsive Design**: Works on mobile, tablet, and desktop

### For Admins
- **Team Management**: Set custom team names
- **Game Control**: Start new games and end rounds
- **Winner Declaration**: Declare round winners with a click
- **Player Monitoring**: See all active players and their guesses
- **Live Chat Monitor**: Watch the conversation in real-time
- **Score Tracking**: Automatic score updates

## 🎮 How the Game Works

1. **Admin starts a new game** - All audience members see a popup announcement
2. **Players make their guesses** - Choose Team A or Team B
3. **Round plays out** - The actual volleyball game happens
4. **Admin declares winner** - Admin clicks the winning team button
5. **Elimination happens** - Players who guessed wrong are eliminated
6. **Repeat** - Continue until one player remains (the winner!)

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start the server:**
```bash
npm start
```

3. **Access the application:**
   - **Audience Page**: http://localhost:3000
   - **Admin Page**: http://localhost:3000/admin
   - **Admin Password**: `admin2025`

### For Development
```bash
npm run dev
```
Uses nodemon for auto-restart on file changes.

## 📁 Project Structure

```
volley-live-chat/
├── server.js              # Main server with Socket.IO
├── package.json          # Dependencies
├── public/
│   ├── index.html        # Audience page
│   ├── admin.html        # Admin dashboard
│   ├── script.js         # Audience client logic
│   ├── admin.js          # Admin client logic
│   └── style.css         # Styles for both pages
└── README.md
```

## 🔧 Configuration

### Change Admin Password
Edit `server.js` line 16:
```javascript
const ADMIN_PASS = "your_new_password";
```

### Change Port
Edit `server.js` line 193 or use environment variable:
```javascript
const PORT = process.env.PORT || 3000;
```

## 🎯 Usage Guide

### For Audience
1. Open http://localhost:3000
2. Enter your name (optional)
3. Click "Join Now"
4. Chat with others
5. When a game starts, you'll see a popup
6. Click guess buttons to predict the winner
7. Wait for the round to end
8. If you guessed correctly, you stay in the game!

### For Admins
1. Open http://localhost:3000/admin
2. Enter admin password: `admin2025`
3. Set team names (e.g., "Red Dragons" vs "Blue Tigers")
4. Click "Update Team Names"
5. Click "Start New Game" when ready
6. After each round, click the winning team button
7. Monitor player eliminations in real-time
8. Winner is declared when only one player remains!

## 🎨 Features in Detail

### Live Chat
- System messages for joins/leaves
- User messages with timestamps
- Auto-scroll to latest message
- Emoji support

### Guessing Game
- Visual popup when game starts
- Lock-in confirmation for guesses
- Can't change guess after submission
- Status updates (active/eliminated/survived)
- Real-time player count

### Admin Dashboard
- Visual score display
- Player list with guess status
- Active/eliminated player indicators
- Chat monitoring
- One-click game controls

## 🔒 Security Notes

- Admin password is stored in plain text (for demo purposes)
- For production, implement proper authentication
- Add rate limiting for chat messages
- Validate all user inputs
- Use HTTPS in production

## 🌐 Deployment

### Deploy to Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Deploy to Railway
1. Connect GitHub repository
2. Railway auto-detects Node.js
3. Deploy automatically

### Environment Variables
Set `PORT` if needed (most platforms do this automatically)

## 🐛 Troubleshooting

**Chat not working?**
- Check browser console for errors
- Ensure Socket.IO is loaded
- Verify server is running

**Game not starting?**
- Check admin authentication
- Verify team names are set
- Look at server console logs

**Players not eliminated?**
- Ensure players made guesses
- Check admin clicked correct winner
- Verify Socket.IO connections

## 📝 Future Enhancements

- [ ] Persistent chat history (database)
- [ ] User profiles and avatars
- [ ] Multiple concurrent games
- [ ] Leaderboards and statistics
- [ ] Sound effects and animations
- [ ] Private rooms/tournaments
- [ ] Spectator vs player modes
- [ ] Chat moderation tools

## 🤝 Contributing

Feel free to fork and improve! Suggestions welcome.

## 📄 License

ISC License - Feel free to use for your tournaments!

## 🎉 Credits

Built with love for volleyball fans! 🏐

---

**Have fun and may the best guesser win!** 🏆