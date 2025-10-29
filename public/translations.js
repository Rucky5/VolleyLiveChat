// Language translations
const translations = {
  en: {
    // Audience Page
    pageTitle: "Volley-Live Chat",
    pageSubtitle: "Join the conversation & play the guessing game!",
    welcomeTitle: "Welcome to Volley-Live! 👋",
    welcomeText: "Enter your name to join the live chat and guessing game",
    namePlaceholder: "Enter your name or nickname *",
    nameError: "Please enter your name!",
    joinButton: "Join Now",
    liveChat: "Live Chat",
    typePlaceholder: "Type a message...",
    sendButton: "Send",
    makeGuess: "Make Your Guess",
    guessInstruction: "Who will win this round?",
    yourGuess: "Your Guess:",
    notSelected: "Not selected",
    vs: "VS",
    
    // Game Messages
    gameStarted: "🎮 New game started! Make your guess now!",
    guessLocked: "✅ Guess locked in!",
    advanced: "🎉 Congratulations! You advanced to the next round!",
    eliminated: "❌ You were eliminated! Better luck next time!",
    guessWrong: "Your guess was wrong.",
    timeExpired: "⏰ Guessing time has expired!",
    decideLater: "Decide Later",
    
    // Participant Selection
    participantTitle: "🎲 Interactive Event!",
    participantText: "Enter your bracelet number to participate",
    braceletPlaceholder: "Enter bracelet number",
    submitNumber: "Submit Number",
    numberConfirmed: "✅ Number submitted successfully!",
    
    // Timer
    timeRemaining: "Time Remaining:",
    minutes: "min",
    seconds: "sec",
    
    // Additional keys
    round: "Round",
    newGameTitle: "NEW GAME STARTED!",
    whoWillWin: "Who will win?",
    makeGuessNow: "Make your guess now!",
    alreadyGuessed: "You have already made your guess!",
    playersRemain: "players remain",
    wonTournament: "won the tournament after",
    rounds: "rounds",
    winners: "Winners",
    enterBraceletNumber: "Please enter your bracelet number",
    
    // Admin Page
    adminDashboard: "Admin Dashboard",
    adminSubtitle: "Control the tournament & manage games",
    adminLogin: "Admin Login",
    adminLoginText: "Enter the admin passcode to continue",
    passcodePlaceholder: "Passcode",
    loginButton: "Login",
    wrongPasscode: "❌ Wrong passcode!",
    
    // Admin Controls
    teamSetup: "Team Setup",
    teamALabel: "Team A Name:",
    teamBLabel: "Team B Name:",
    updateTeams: "Update Team Names",
    
    currentScore: "Current Score",
    updateScore: "Update Score",
    resetScore: "Reset to 0-0",
    scoreDescription: "Update scores based on the live volleyball game. Reset at the start of each new round.",
    
    gameControls: "Game Controls",
    startNewGame: "Start New Game",
    startDescription: "This will start a new guessing round with a 2-minute timer",
    endCurrentRound: "End Current Round:",
    wins: "Wins",
    declareWinner: "Declare the winner to eliminate wrong guessers",
    
    activePlayers: "Active Players",
    noPlayers: "No players yet",
    
    liveChatMonitor: "Live Chat Monitor",
    sendAsAdmin: "Send as Admin",
    moderationInfo: "💡 Click on a message to delete it | Click on a username to kick that user",
    
    // Participant Selection Admin
    participantSelection: "Participant Selection",
    startSelection: "Start Participant Selection",
    drawParticipants: "Draw Random Participants",
    endSelection: "End Selection",
    numParticipants: "Number to draw:",
    participantEntries: "Participant Entries",
    noEntries: "No entries yet",
    
    // Admin-specific translations
    enterPasscode: "Please enter the passcode",
    enterBothTeams: "Please enter names for both teams",
    confirmReset: "Reset score to 0-0?",
    active2min: "Active (2 minutes)",
    expired: "Expired",
    closed: "Closed",
    confirmTeamAWins: "Confirm Team A wins this round?",
    confirmTeamBWins: "Confirm Team B wins this round?",
    roundComplete: "Round Complete!",
    winner: "Winner",
    participants: "participants",
    confirmEndSelection: "End participant selection?",
    confirmDraw: "Draw",
    waitingForEntries: "Waiting for entries",
    selectedParticipants: "Selected Participants",
    confirmKick: "Kick player",
    confirmDelete: "Delete this message?",
    inactive: "Inactive",
    active: "Active",
    guessingTimer: "Guessing Timer"
  },
  
  ar: {
    // Audience Page
    pageTitle: "فولي لايف - الدردشة",
    pageSubtitle: "انضم للمحادثة والعب لعبة التخمين!",
    welcomeTitle: "مرحباً بك في فولي لايف! 👋",
    welcomeText: "أدخل اسمك للانضمام إلى الدردشة المباشرة ولعبة التخمين",
    namePlaceholder: "أدخل اسمك أو لقبك *",
    nameError: "الرجاء إدخال اسمك!",
    joinButton: "انضم الآن",
    liveChat: "الدردشة المباشرة",
    typePlaceholder: "اكتب رسالة...",
    sendButton: "إرسال",
    makeGuess: "اختر تخمينك",
    guessInstruction: "من سيفوز في هذه الجولة؟",
    yourGuess: "تخمينك:",
    notSelected: "لم يتم الاختيار",
    vs: "ضد",
    
    // Game Messages
    gameStarted: "🎮 بدأت اللعبة الجديدة! اختر تخمينك الآن!",
    guessLocked: "✅ تم تأكيد التخمين!",
    advanced: "🎉 تهانينا! لقد تأهلت للجولة التالية!",
    eliminated: "❌ تم إقصاؤك! حظ أوفر في المرة القادمة!",
    guessWrong: "تخمينك كان خاطئاً.",
    timeExpired: "⏰ انتهى وقت التخمين!",
    decideLater: "قرر لاحقاً",
    
    // Participant Selection
    participantTitle: "🎲 حدث تفاعلي!",
    participantText: "أدخل رقم السوار للمشاركة",
    braceletPlaceholder: "أدخل رقم السوار",
    submitNumber: "إرسال الرقم",
    numberConfirmed: "✅ تم إرسال الرقم بنجاح!",
    
    // Timer
    timeRemaining: "الوقت المتبقي:",
    minutes: "دقيقة",
    seconds: "ثانية",
    
    // Additional keys
    round: "جولة",
    newGameTitle: "بدأت لعبة جديدة!",
    whoWillWin: "من سيفوز؟",
    makeGuessNow: "اختر تخمينك الآن!",
    alreadyGuessed: "لقد قمت بالتخمين بالفعل!",
    playersRemain: "لاعب متبقي",
    wonTournament: "فاز بالبطولة بعد",
    rounds: "جولات",
    winners: "الفائزون",
    enterBraceletNumber: "الرجاء إدخال رقم السوار",
    
    // Admin Page
    adminDashboard: "لوحة تحكم المشرف",
    adminSubtitle: "التحكم في البطولة وإدارة الألعاب",
    adminLogin: "تسجيل دخول المشرف",
    adminLoginText: "أدخل رمز المرور للمتابعة",
    passcodePlaceholder: "رمز المرور",
    loginButton: "تسجيل الدخول",
    wrongPasscode: "❌ رمز مرور خاطئ!",
    
    // Admin Controls
    teamSetup: "إعداد الفرق",
    teamALabel: "اسم الفريق أ:",
    teamBLabel: "اسم الفريق ب:",
    updateTeams: "تحديث أسماء الفرق",
    
    currentScore: "النتيجة الحالية",
    updateScore: "تحديث النتيجة",
    resetScore: "إعادة تعيين إلى 0-0",
    scoreDescription: "قم بتحديث النتائج بناءً على مباراة الكرة الطائرة المباشرة. أعد التعيين في بداية كل جولة جديدة.",
    
    gameControls: "التحكم في اللعبة",
    startNewGame: "بدء لعبة جديدة",
    startDescription: "سيبدأ هذا جولة تخمين جديدة بمؤقت مدته دقيقتان",
    endCurrentRound: "إنهاء الجولة الحالية:",
    wins: "يفوز",
    declareWinner: "أعلن الفائز لإقصاء المخمنين الخاطئين",
    
    activePlayers: "اللاعبون النشطون",
    noPlayers: "لا يوجد لاعبون بعد",
    
    liveChatMonitor: "مراقبة الدردشة المباشرة",
    sendAsAdmin: "إرسال كمشرف",
    moderationInfo: "💡 انقر على رسالة لحذفها | انقر على اسم مستخدم لطرده",
    
    // Participant Selection Admin
    participantSelection: "اختيار المشاركين",
    startSelection: "بدء اختيار المشاركين",
    drawParticipants: "سحب مشاركين عشوائيين",
    endSelection: "إنهاء الاختيار",
    numParticipants: "عدد المشاركين:",
    participantEntries: "المشاركات المقدمة",
    noEntries: "لا توجد مشاركات بعد",
    
    // Admin-specific translations
    enterPasscode: "الرجاء إدخال رمز المرور",
    enterBothTeams: "الرجاء إدخال أسماء كلا الفريقين",
    confirmReset: "إعادة تعيين النتيجة إلى 0-0؟",
    active2min: "نشط (دقيقتان)",
    expired: "منتهي",
    closed: "مغلق",
    confirmTeamAWins: "تأكيد فوز الفريق أ في هذه الجولة؟",
    confirmTeamBWins: "تأكيد فوز الفريق ب في هذه الجولة؟",
    roundComplete: "الجولة مكتملة!",
    winner: "الفائز",
    participants: "مشاركين",
    confirmEndSelection: "إنهاء اختيار المشاركين؟",
    confirmDraw: "سحب",
    waitingForEntries: "في انتظار المشاركات",
    selectedParticipants: "المشاركون المختارون",
    confirmKick: "طرد اللاعب",
    confirmDelete: "حذف هذه الرسالة؟",
    inactive: "غير نشط",
    active: "نشط",
    guessingTimer: "مؤقت التخمين"
  }
};

// Get translation
function t(key, lang = 'en') {
  return translations[lang][key] || translations['en'][key] || key;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { translations, t };
}