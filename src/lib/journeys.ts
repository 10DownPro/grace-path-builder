// FaithFit Journeys — guided discipleship paths.
// Hierarchy: Track (Journey) → Module → Lesson → Session view.
// Each lesson teaches, not just checks a box. Every prayer ends:
//   "In Jesus' name, Amen. 🙏🏽"

export type JourneyId =
  | 'starting-faith'
  | 'coming-back'
  | 'learning-prayer'
  | 'understanding-jesus'
  | 'building-consistency'
  | 'healing-restoration';

export interface LessonScripture {
  reference: string;
  text: string;
  context: string;      // Who, when, why was this written
  meaning: string;      // What it actually says
  application: string;  // How it touches your life today
  aboutJesus?: string;  // How this passage points us to Jesus (when applicable)
}

export interface ReflectionQuestion {
  id: string;
  prompt: string;
}

// A single lesson — the 7-part discipleship structure:
// Teaching → Scripture → Understanding → Reflection → Prayer → Action Step → Completion.
export interface Lesson {
  id: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  introduction: string[];           // Teaching paragraphs, conversational
  scripture: LessonScripture;       // Scripture + Understanding
  reflectionQuestions: ReflectionQuestion[];
  applicationStep: string;          // One practical thing today
  prayer: string;                   // Always ends with PRAYER_ENDING
  completion?: string;              // Encouragement after completing
  // Legacy single-field reflection kept for any consumer; not required
  reflection?: string;
}

/** Required prayer ending across the entire app. */
export const PRAYER_ENDING = "In Jesus' name, Amen. 🙏🏽";

/** Append PRAYER_ENDING to a prayer if it does not already end with it. */
export function ensurePrayerEnding(prayer: string): string {
  const trimmed = (prayer || '').trim();
  if (!trimmed) return PRAYER_ENDING;
  if (trimmed.endsWith(PRAYER_ENDING)) return trimmed;
  // Strip any trailing "Amen." or "Amen" so we don't double up.
  const withoutAmen = trimmed.replace(/\s*Amen\.?\s*$/i, '').trim();
  return `${withoutAmen} ${PRAYER_ENDING}`;
}

// Back-compat alias — older code referred to lessons as "modules".
export type JourneyModule = Lesson;

// A module groups several lessons under a shared theme.
export interface Module {
  id: string;
  title: string;
  summary: string;
  lessons: Lesson[];
}

export interface Journey {
  id: JourneyId;
  title: string;
  tagline: string;
  emoji: string;
  forStages: Array<'new' | 'curious' | 'returning' | 'longtime'>;
  modules: Module[];
}

// ---------- Helpers to enrich legacy minimal modules ----------
function enrich(
  base: {
    id: string; title: string; summary: string;
    scripture: { reference: string; text: string };
    reflection: string; prayer: string;
    introduction?: string[];
    context?: string; meaning?: string; application?: string;
    applicationStep?: string;
    questions?: string[];
    minutes?: number;
  }
): JourneyModule {
  return {
    id: base.id,
    title: base.title,
    summary: base.summary,
    estimatedMinutes: base.minutes ?? 7,
    introduction: base.introduction ?? [
      base.summary,
      `In this lesson we'll sit with one passage of Scripture, think honestly about what it means for your life today, and bring it to God in prayer. There's no pressure to have it all figured out — just be present.`,
    ],
    scripture: {
      reference: base.scripture.reference,
      text: base.scripture.text,
      context: base.context ?? 'This passage was written to remind God\'s people what is true when life feels uncertain.',
      meaning: base.meaning ?? 'At its heart, the verse points to God\'s character and how he relates to you.',
      application: base.application ?? 'Let this shape one small posture in your day — a slower breath, a quieter heart, a more honest prayer.',
    },
    reflectionQuestions: (base.questions ?? [base.reflection]).map((q, i) => ({ id: `q${i + 1}`, prompt: q })),
    applicationStep: base.applicationStep ?? 'Take 60 seconds today to repeat the verse out loud and notice what you feel.',
    // Enforce Jesus-centered prayer ending across every lesson.
    prayer: ensurePrayerEnding(base.prayer),
    reflection: base.reflection,
  };
}

// ---------- Starting Faith (10 lessons) ----------
const startingFaith: JourneyModule[] = [
  enrich({
    id: 'who-is-god', title: 'Who is God?', minutes: 8,
    summary: 'Not a distant force — a loving, personal God.',
    introduction: [
      `Before anything else in this walk, it helps to be honest about who God actually is. Most of us carry pictures of God we inherited — strict, distant, disappointed, hard to please.`,
      `Scripture says something different. God is not waiting to catch you doing wrong. He is love itself — patient, present, kind. He's not a force or a feeling. He's a Person who knows you.`,
      `In this lesson we'll start there: with the simplest, most freeing truth about who God is.`,
    ],
    scripture: { reference: '1 John 4:16', text: 'God is love. Whoever lives in love lives in God, and God in them.' },
    context: 'John was the disciple Jesus loved. After decades of following Jesus, this is what he settled on as the heart of the message.',
    meaning: 'God doesn\'t just feel love sometimes — love is who he is. The closer you get to him, the more love defines your life.',
    application: 'When God comes to mind today, try replacing words like "angry" or "disappointed" with the word "love." See what shifts.',
    questions: [
      'What words have you used in the past to describe God?',
      'How would your day change if love was the first word that came to mind?',
      'Is there anything making it hard to believe God is love?',
    ],
    applicationStep: 'Sometime today, say out loud: "God, you are love." Notice how that feels.',
    prayer: 'God, help me see you as you really are — not as I\'ve been taught to fear you, but as love that won\'t let me go. Amen.',
    reflection: 'What words have you used to describe God before? What changes if love is the first?',
  }),
  enrich({
    id: 'who-is-jesus', title: 'Who is Jesus?', minutes: 8,
    summary: 'Jesus is how God came close.',
    introduction: [
      `If God is love, Jesus is what love looks like with skin on. Christianity is not first a system of rules — it's a Person.`,
      `Jesus was God making himself reachable. He ate with outsiders, healed the sick, told the truth, and laid down his life. He's how we know God isn't an idea — he's a friend.`,
    ],
    scripture: { reference: 'John 1:14', text: 'The Word became flesh and made his dwelling among us.' },
    context: 'John opens his gospel by calling Jesus "the Word" — the eternal voice of God who steps into time as a real human.',
    meaning: 'God didn\'t shout instructions from a distance. He moved into the neighborhood.',
    application: 'You don\'t have to climb to God. He came down. Bring him your real, ordinary life.',
    questions: [
      'When you picture Jesus, what comes to mind?',
      'If Jesus is God reachable, what would you say to him today?',
      'Where would you most want him to "move in" in your life?',
    ],
    applicationStep: 'Today, talk to Jesus like you would a trusted friend. Out loud. One sentence is enough.',
    prayer: 'Jesus, thank you for coming close. Meet me right where I am today. Amen.',
    reflection: 'If Jesus is God reachable, what would you say to him today?',
  }),
  enrich({
    id: 'salvation', title: 'What is salvation?', minutes: 9,
    summary: 'Rescue. A gift, not a grade.',
    introduction: [
      `Salvation is one of those church words we hear all the time without really knowing what it means. Stripped down, it just means rescue.`,
      `We need rescue because something inside us is broken — the part of us that hurts other people, hides from God, and chases things that never satisfy. The Bible calls that sin.`,
      `Salvation is God's answer. Jesus lived the life we couldn't and paid a debt we couldn't pay. Salvation isn't something you earn by trying harder. It's a gift you receive.`,
    ],
    scripture: { reference: 'Ephesians 2:8-9', text: 'For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God — not by works, so that no one can boast.' },
    context: 'Paul wrote this to a young church surrounded by religions where everything depended on your performance.',
    meaning: 'You don\'t earn salvation. You receive it. Faith is just open hands.',
    application: 'Stop trying to clean yourself up before coming to God. Come dirty. Come as you are. That\'s the only way anyone has ever come.',
    questions: [
      'Have you ever felt like you had to earn God\'s acceptance?',
      'How does it feel to receive something you can\'t pay back?',
      'What is one thing you\'ve been trying to do "for God" that you could simply receive instead?',
    ],
    applicationStep: 'Pray a one-line prayer today: "Jesus, I receive what you\'ve already done for me."',
    prayer: 'Jesus, I let go of trying to earn you. Thank you for grace I could never deserve. I receive it. Amen.',
    reflection: 'What would it feel like to receive something you don\'t have to earn?',
  }),
  enrich({
    id: 'grace', title: 'Understanding grace', minutes: 7,
    summary: 'Unearned love that changes everything.',
    introduction: [
      `Grace is the heartbeat of the Christian life. It means God loves you before you change, while you change, and after you fall.`,
      `Most of us treat God like a coach who's only happy when we perform. Grace says the love came first. Your effort is response, not requirement.`,
    ],
    scripture: { reference: 'Romans 5:8', text: 'But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.' },
    context: 'Paul is making the case to a church wrestling with whether God\'s love depends on being "good enough."',
    meaning: 'God didn\'t wait for us to clean up. He moved first, while we were still a mess.',
    application: 'Stop checking your worthiness before you pray, serve, or come back. Grace is the floor under your feet.',
    questions: [
      'Where in your life do you still feel like you have to earn love?',
      'How would your relationship with God change if grace was real for you today?',
    ],
    applicationStep: 'When you mess up today, instead of hiding, simply say: "God, thank you for grace." And keep going.',
    prayer: 'God, your grace is hard to believe sometimes. Help me stop hiding and start receiving. Amen.',
    reflection: 'Where do you most need grace today?',
  }),
  enrich({
    id: 'what-is-prayer', title: 'What is prayer?', minutes: 7,
    summary: 'Honest conversation with God.',
    introduction: [
      `Prayer is not a performance. It's not a special language. It's not something you have to be good at.`,
      `Prayer is just talking with God like he is actually here — because he is. The only requirement is honesty.`,
    ],
    scripture: { reference: 'Philippians 4:6', text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.' },
    context: 'Paul wrote this from prison — a place that had every reason for anxiety. His answer wasn\'t to fix the cell. It was to take everything to God.',
    meaning: 'Bring everything. The big and the small. Worries and wins. God can handle all of it.',
    application: 'Today, when something stresses you, instead of holding it, say it out loud to God.',
    questions: [
      'What\'s one thing on your heart you could say to God right now?',
      'What stops you from praying more often?',
    ],
    applicationStep: 'Set a single 2-minute timer today and just talk to God. No format. Just honesty.',
    prayer: 'God, I\'m here. Thank you for listening. Teach me to talk with you like a friend. Amen.',
    reflection: 'What is one thing on your heart you could say to God right now?',
  }),
  enrich({
    id: 'reading-bible', title: 'How to read the Bible', minutes: 8,
    summary: 'Start small. Read slowly. Ask honest questions.',
    introduction: [
      `The Bible can feel intimidating — it\'s huge, ancient, and not arranged in chronological order. Most people quit because they try to read it the way they read a novel.`,
      `Start small. A few verses a day, read slowly, with two simple questions: "What does this say about God?" and "What does it ask of me?"`,
      `A great place to begin is the gospel of John. Read one short section. Sit with it. Move on tomorrow.`,
    ],
    scripture: { reference: 'Psalm 119:105', text: 'Your word is a lamp for my feet, a light on my path.' },
    context: 'Psalm 119 is a long love letter to Scripture from someone who actually lived by it.',
    meaning: 'God\'s word doesn\'t flood your whole life with floodlights. It lights the next step.',
    application: 'Don\'t try to figure out your whole future from one passage. Just take the next step.',
    questions: [
      'What\'s gotten in the way of reading the Bible before?',
      'What\'s a realistic time and place you could read for 5 minutes a day?',
    ],
    applicationStep: 'Pick a time and place today. Read John 1:1-18 slowly. That\'s it.',
    prayer: 'God, open my eyes when I read. Help me hear you in your word. Amen.',
    reflection: 'What gets in the way of reading? What is one small step you can take?',
  }),
  enrich({
    id: 'following-daily', title: 'Following Jesus daily', minutes: 7,
    summary: 'Discipleship is the long, ordinary walk.',
    introduction: [
      `Following Jesus isn\'t mainly about huge spiritual moments. It\'s the small daily yeses — choosing patience in traffic, honesty when it costs you, kindness when you\'re tired.`,
      `Jesus called this picking up your cross daily. Not once. Daily. Small. Repeated. Real.`,
    ],
    scripture: { reference: 'Luke 9:23', text: 'Whoever wants to be my disciple must deny themselves and take up their cross daily and follow me.' },
    context: 'Jesus said this to ordinary people who were trying to figure out what it actually meant to follow him.',
    meaning: 'Following Jesus is daily, not occasional. And it requires laying down your own way at times.',
    application: 'Today, identify one small "yes" you can give Jesus — even something tiny like patience or honesty.',
    questions: [
      'What is one area where Jesus might be asking for a daily yes?',
      'What makes daily, ordinary obedience feel hard?',
    ],
    applicationStep: 'Pick one tiny obedience today and do it on purpose, knowing Jesus sees it.',
    prayer: 'Jesus, I want to follow you not just in big moments but in this ordinary day. Lead me. Amen.',
    reflection: 'What is one daily yes Jesus might be asking of you?',
  }),
  enrich({
    id: 'finding-community', title: 'Finding community', minutes: 7,
    summary: 'You weren\'t meant to walk this alone.',
    introduction: [
      `Faith was never designed to be a solo sport. From the very beginning, God gathered people into a family.`,
      `Community sounds nice until it gets hard. The honest truth is, you need other people who know your name, your story, and your struggles. And they need you.`,
      `Community doesn\'t have to mean a giant church right away. It can start with one honest friendship.`,
    ],
    scripture: { reference: 'Hebrews 10:24-25', text: 'And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together.' },
    context: 'Written to early Christians who were tempted to drift from each other in hard times.',
    meaning: 'We need each other to keep going. Spiritual stamina is built in community.',
    application: 'Don\'t wait until you have it all together to join a Circle or a church. Show up as you are.',
    questions: [
      'Who is one person you could be more honest with about your faith?',
      'What makes community hard for you?',
    ],
    applicationStep: 'Reach out to one person today — a text, a call, a "thinking of you."',
    prayer: 'God, send me people who will walk this with me. Help me be that for someone too. Amen.',
    reflection: 'Who could you walk this with — even one person?',
  }),
  enrich({
    id: 'trusting-god', title: 'Trusting God', minutes: 8,
    summary: 'Trust is built in the small moments first.',
    introduction: [
      `Trust isn\'t a switch you flip. It\'s a path you walk. And it\'s built one honest step at a time.`,
      `You don\'t have to trust God for everything at once. Start with one thing today.`,
    ],
    scripture: { reference: 'Proverbs 3:5-6', text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.' },
    context: 'Proverbs is wisdom passed from a father to a son — practical guidance for a real life.',
    meaning: 'You won\'t always understand. Trust is choosing God\'s wisdom over your own limited view.',
    application: 'Today, take one decision you\'d normally white-knuckle and hand it over: "God, I trust you with this."',
    questions: [
      'Where do you find it hardest to trust God?',
      'What\'s one small thing you could hand over to him today?',
    ],
    applicationStep: 'Name one worry out loud today and say: "God, I trust you with this."',
    prayer: 'God, I want to trust you. Even when I don\'t understand, help me lean on you. Amen.',
    reflection: 'Where do you need to trust God today?',
  }),
  enrich({
    id: 'living-with-purpose', title: 'Living with purpose', minutes: 8,
    summary: 'Your life is part of a bigger story.',
    introduction: [
      `You weren\'t created for a small life. God has placed you in this exact moment of history, with these exact people, with these exact gifts — on purpose.`,
      `Purpose isn\'t found by looking inside until you discover it. It\'s found by looking up — and then looking around at the people right in front of you.`,
    ],
    scripture: { reference: 'Ephesians 2:10', text: 'For we are God\'s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.' },
    context: 'Paul wrote this to a church in a city full of people chasing identity and meaning everywhere except in God.',
    meaning: 'You are God\'s craftsmanship. Not an accident. Made with intention, for a reason.',
    application: 'Stop waiting to "find your purpose." Live the one in front of you today with love.',
    questions: [
      'Where might God already be using you, even quietly?',
      'What would it look like to live today with intention?',
    ],
    applicationStep: 'Do one good thing today — for one person — as worship.',
    prayer: 'God, thank you for making me on purpose. Use my life today. Amen.',
    reflection: 'How might God want to use your life — even in small ways?',
  }),
];

// ---------- Coming Back (10 lessons) ----------
const comingBack: JourneyModule[] = [
  enrich({
    id: 'welcome-home', title: 'Welcome home', minutes: 8,
    summary: 'No catching up. No condemnation. Just home.',
    introduction: [
      `If it\'s been a while — a week, a year, a decade — read this slowly: God is not angry. He has been waiting, the way a parent waits at the window.`,
      `You don\'t have to explain yourself. You don\'t have to "make it right" before you come close. The whole story of God is a God who runs toward people coming home.`,
    ],
    scripture: { reference: 'Luke 15:20', text: 'But while he was still a long way off, his father saw him and was filled with compassion for him; he ran to his son, threw his arms around him and kissed him.' },
    context: 'Jesus told this story — the prodigal son — to show what God\'s heart is like when someone returns.',
    meaning: 'The father didn\'t wait for an apology. He ran. The story is not about your shame — it\'s about his joy.',
    application: 'Stop rehearsing your apology. Just turn toward home. He sees you already.',
    questions: [
      'What story have you been telling yourself about how God feels about you right now?',
      'What would it mean to believe he\'s simply glad you\'re here?',
    ],
    applicationStep: 'Today, say out loud: "I\'m home." And let that be enough.',
    prayer: 'God, I\'m here. Thank you for not making me earn my way back. Amen.',
    reflection: 'What would it mean to believe today is truly a new beginning?',
  }),
  enrich({
    id: 'letting-go-shame', title: 'Letting go of shame', minutes: 8,
    summary: 'You are not defined by what you\'ve done.',
    introduction: [
      `Shame and guilt are different. Guilt says, "I did something wrong." Shame says, "I am something wrong."`,
      `God deals with guilt through grace. He doesn\'t reinforce shame — he removes it. You are not your worst day.`,
    ],
    scripture: { reference: 'Romans 8:1', text: 'Therefore, there is now no condemnation for those who are in Christ Jesus.' },
    context: 'Paul wrote to people drowning in self-judgment and religious condemnation.',
    meaning: 'In Christ, the verdict is already in: not condemned. The case is closed.',
    application: 'When shame whispers today, answer with this verse out loud.',
    questions: [
      'What have you been carrying that God may be inviting you to set down?',
      'What lie about yourself has felt true for too long?',
    ],
    applicationStep: 'Write down one shame statement, then write Romans 8:1 over the top of it.',
    prayer: 'God, help me lay down what isn\'t mine to carry. I receive your "no condemnation." Amen.',
    reflection: 'What have you been carrying that God invites you to set down?',
  }),
  enrich({
    id: 'starting-again', title: 'Starting again', minutes: 7,
    summary: 'God specializes in fresh starts.',
    introduction: [
      `Every morning, God offers a fresh page. Not because the past didn\'t happen — but because his mercy is bigger than it.`,
      `Starting again isn\'t weakness. It\'s the bravest thing a person can do.`,
    ],
    scripture: { reference: 'Lamentations 3:22-23', text: 'Because of the Lord\'s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.' },
    context: 'Written during one of the darkest moments in Israel\'s history. Still, the writer found mercy in the morning.',
    meaning: 'God\'s mercy doesn\'t run out. Every sunrise is proof.',
    application: 'Stop waiting for a Monday or a New Year. Today is the start.',
    questions: [
      'What\'s one small "first step" you could take today?',
      'What does starting again look like for you this week?',
    ],
    applicationStep: 'Do one small spiritual thing today. A 2-minute prayer. One verse. That\'s enough to start.',
    prayer: 'God, thank you for new mornings. I take the first step today. Amen.',
    reflection: 'What is one tiny first step you could take today?',
  }),
  enrich({
    id: 'returning-to-prayer', title: 'Returning to prayer', minutes: 7,
    summary: 'A whisper is enough.',
    introduction: [
      `When you\'ve been away from prayer for a while, the silence feels loud. You might feel like you\'ve forgotten how, or that God might be cold to you.`,
      `Prayer isn\'t a performance you have to warm up for. Even a whisper — "God, I\'m here" — is a full prayer.`,
    ],
    scripture: { reference: 'Psalm 34:18', text: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.' },
    context: 'David wrote this in a season of running for his life.',
    meaning: 'God isn\'t far when you\'re hurting. He\'s closer.',
    application: 'Don\'t try to pray "well" today. Just be honest.',
    questions: [
      'What is the most honest sentence you could pray right now?',
      'What\'s kept you from praying lately?',
    ],
    applicationStep: 'Set a timer for 60 seconds and just say what\'s true to God. One sentence is enough.',
    prayer: 'I\'m here, God. That\'s all I have today. Thank you for being close. Amen.',
    reflection: 'What one honest sentence could you pray today?',
  }),
  enrich({
    id: 'trusting-god-again', title: 'Trusting God again', minutes: 8,
    summary: 'Trust returns slowly. That\'s okay.',
    introduction: [
      `If trust has been broken — by life, by people, even by what felt like God\'s silence — it doesn\'t come back overnight.`,
      `Trust returns the same way it left: in small, ordinary moments. One honest prayer. One step taken. One small "I\'ll try."`,
    ],
    scripture: { reference: 'Psalm 56:3', text: 'When I am afraid, I put my trust in you.' },
    context: 'David wrote this in genuine fear, not pretending he had it all together.',
    meaning: 'Trust isn\'t the absence of fear. It\'s choosing God in the middle of it.',
    application: 'Don\'t wait until you feel ready. Trust is a verb you do scared.',
    questions: [
      'Where has trust been broken?',
      'What\'s one small place you could try to trust God again this week?',
    ],
    applicationStep: 'Name one fear today and pray: "I\'m afraid, but I trust you here."',
    prayer: 'God, trust feels hard. Help me take one small step toward you today. Amen.',
    reflection: 'What\'s made it hard to trust? Tell God honestly.',
  }),
  enrich({
    id: 'rebuilding-consistency', title: 'Rebuilding consistency', minutes: 7,
    summary: 'Five minutes today beats thirty someday.',
    introduction: [
      `Consistency doesn\'t come from motivation. It comes from making it small enough that you actually do it.`,
      `Start so small you can\'t fail. One verse. One prayer. One minute. Then do it again tomorrow.`,
    ],
    scripture: { reference: 'Zechariah 4:10', text: 'Do not despise these small beginnings, for the Lord rejoices to see the work begin.' },
    context: 'God spoke this when his people were rebuilding from ruins — slowly, brick by brick.',
    meaning: 'Small beginnings are not insignificant beginnings. God celebrates them.',
    application: 'Choose a tiny rhythm you can keep. Then keep it.',
    questions: [
      'What\'s the smallest daily rhythm you could honestly maintain this week?',
      'What gets in the way of consistency for you?',
    ],
    applicationStep: 'Pick a 5-minute window today. Same time tomorrow. Just show up.',
    prayer: 'God, bless the small yes I bring today. Build the rest in me over time. Amen.',
    reflection: 'What is one tiny rhythm you can actually keep this week?',
  }),
  enrich({
    id: 'healing-church-hurt', title: 'Healing church hurt', minutes: 9,
    summary: 'People hurt you. God grieved with you.',
    introduction: [
      `If you\'ve been wounded by a church or by Christians, your hurt is real and God doesn\'t minimize it.`,
      `Jesus had hard words for religious people who hurt others in his name. Your pain isn\'t something to "get over." It\'s something God wants to heal.`,
      `Healing doesn\'t require you to immediately trust the people who hurt you. It starts with letting God near the wound.`,
    ],
    scripture: { reference: 'Psalm 147:3', text: 'He heals the brokenhearted and binds up their wounds.' },
    context: 'A psalm of return — written when God\'s people came back from exile.',
    meaning: 'God doesn\'t rush past wounds. He tends to them.',
    application: 'You don\'t have to "be fine." Let God near the part that still aches.',
    questions: [
      'What hurt are you still carrying from a faith community?',
      'What would it look like to let God close to that wound — without pressure to fix it yet?',
    ],
    applicationStep: 'Tell God one true thing today about a hurt you\'ve been holding.',
    prayer: 'God, you saw what happened. You weren\'t the one who hurt me. Heal what people broke. Amen.',
    reflection: 'What faith-related wound is God inviting you to bring to him?',
  }),
  enrich({
    id: 'hearing-gods-voice', title: 'Hearing God\'s voice', minutes: 8,
    summary: 'A gentle whisper, not noise.',
    introduction: [
      `God speaks. Not usually in lightning. More often in a quiet, persistent nudge — a verse that won\'t leave you alone, a phrase a friend says at just the right moment, a sense of peace or unease.`,
      `Hearing God\'s voice takes practice and quiet. You don\'t need to be a mystic. You just need to slow down enough to listen.`,
    ],
    scripture: { reference: '1 Kings 19:11-12', text: 'After the fire came a gentle whisper.' },
    context: 'Elijah was exhausted and afraid when God passed by — not in the wind or earthquake, but in a whisper.',
    meaning: 'God often speaks gently. If you\'re only listening for thunder, you\'ll miss him.',
    application: 'Build small moments of quiet today. That\'s where most listening happens.',
    questions: [
      'When have you sensed God speaking, even faintly?',
      'What might he be whispering to you right now?',
    ],
    applicationStep: 'Sit in silence for 3 minutes today. Ask: "God, what would you say to me?" Listen.',
    prayer: 'Quiet me enough to hear you, Lord. Tune my ears to your whisper. Amen.',
    reflection: 'What might God be whispering to you right now?',
  }),
  enrich({
    id: 'walking-forward', title: 'Walking forward', minutes: 7,
    summary: 'The next right step is enough.',
    introduction: [
      `You don\'t have to map out the rest of your spiritual life today. You just have to take the next right step.`,
      `God gives light for the next step, not the whole staircase.`,
    ],
    scripture: { reference: 'Isaiah 43:18-19', text: 'Forget the former things; do not dwell on the past. See, I am doing a new thing! Now it springs up; do you not perceive it?' },
    context: 'God spoke this to a people stuck looking backward at their failures.',
    meaning: 'God is already at work on what\'s new. Look forward, not back.',
    application: 'Whatever\'s next — call it. Take that step today.',
    questions: [
      'What\'s the next right step in your walk with God?',
      'What\'s keeping you looking backward?',
    ],
    applicationStep: 'Identify one next step today and do it. Don\'t wait until you feel ready.',
    prayer: 'God, give me eyes for the new thing you\'re doing. I take the next step. Amen.',
    reflection: 'What\'s the next right step for you?',
  }),
  enrich({
    id: 'staying-connected', title: 'Staying connected', minutes: 8,
    summary: 'Build the rhythms that keep you close.',
    introduction: [
      `Coming back is one moment. Staying close is a thousand small choices — built into the architecture of your week.`,
      `What rhythms will help you stay connected to God when life gets full again?`,
    ],
    scripture: { reference: 'John 15:4', text: 'Remain in me, as I also remain in you. No branch can bear fruit by itself; it must remain in the vine.' },
    context: 'Jesus told his closest friends this the night before he died.',
    meaning: 'You don\'t produce a spiritual life by trying harder. You stay connected to the source.',
    application: 'Identify the rhythm that keeps you connected. Protect it.',
    questions: [
      'What rhythm has kept you closest to God before?',
      'What would it look like to protect that this season?',
    ],
    applicationStep: 'Schedule one weekly rhythm on your calendar today — and keep it like an appointment with a friend.',
    prayer: 'Jesus, keep me close. Help me build a life that stays connected to you. Amen.',
    reflection: 'What rhythm keeps you most connected to God?',
  }),
];

// ---------- Other journeys (enriched from existing minimal content) ----------
const learningPrayer: JourneyModule[] = [
  enrich({ id: 'pray-honest', title: 'Pray honestly', minutes: 6, summary: 'God can handle your real thoughts.', scripture: { reference: 'Psalm 62:8', text: 'Pour out your hearts to him, for God is our refuge.' }, reflection: 'What is the most honest sentence you could pray right now?', prayer: 'God, here is what is actually on my heart. Hear me. Amen.', questions: ['What\'s the most honest sentence you could pray right now?', 'What have you been hiding from God that he already sees?'] }),
  enrich({ id: 'pray-acts', title: 'The ACTS pattern', minutes: 7, summary: 'Adoration. Confession. Thanksgiving. Supplication.', scripture: { reference: 'Matthew 6:9-13', text: 'This, then, is how you should pray...' }, reflection: 'Which of the four — praise, confession, thanks, asking — feels hardest for you?', prayer: 'God, teach me to pray like Jesus. Amen.', questions: ['Which feels hardest: praise, confession, thanks, asking?', 'Where could you start today?'] }),
  enrich({ id: 'pray-listen', title: 'Listening prayer', minutes: 7, summary: 'Prayer is two-way.', scripture: { reference: 'Psalm 46:10', text: 'Be still, and know that I am God.' }, reflection: 'What might God want to say if you simply stopped to listen?', prayer: 'I\'m listening, Lord. Speak. Amen.', questions: ['What stops you from being still?', 'What might God say if you listened today?'] }),
  enrich({ id: 'pray-others', title: 'Praying for others', minutes: 6, summary: 'Carry someone to God today.', scripture: { reference: 'James 5:16', text: 'Pray for each other so that you may be healed.' }, reflection: 'Who needs your prayers right now?', prayer: 'Lord, I lift up these people to you. Amen.', questions: ['Who needs prayer in your life right now?', 'What would it mean to pray for someone every day this week?'] }),
];

const understandingJesus: JourneyModule[] = [
  enrich({ id: 'jesus-loved', title: 'How Jesus loved people', minutes: 7, summary: 'He went to the ones everyone else avoided.', scripture: { reference: 'Luke 19:10', text: 'The Son of Man came to seek and to save the lost.' }, reflection: 'Where do you feel "lost" today?', prayer: 'Jesus, thank you for coming for me. Amen.', questions: ['Where do you feel lost or overlooked today?', 'What would it mean to believe Jesus came specifically for that part of you?'] }),
  enrich({ id: 'jesus-taught', title: 'What Jesus taught', minutes: 7, summary: 'Love God. Love people. Everything hangs on this.', scripture: { reference: 'Matthew 22:37-39', text: 'Love the Lord your God... Love your neighbor as yourself.' }, reflection: 'Which feels harder for you today — loving God or loving people?', prayer: 'Teach me to love the way you love. Amen.', questions: ['Which is harder for you today — loving God or loving people?', 'What\'s one practical way you can do either?'] }),
  enrich({ id: 'jesus-died', title: 'Why Jesus died', minutes: 8, summary: 'Love that went all the way.', scripture: { reference: 'John 15:13', text: 'Greater love has no one than this: to lay down one\'s life for one\'s friends.' }, reflection: 'How does it land to know you were on his mind on the cross?', prayer: 'Thank you, Jesus. Amen.', questions: ['What does it mean to you that Jesus laid down his life for you specifically?', 'What would it look like to receive that love today?'] }),
  enrich({ id: 'jesus-rose', title: 'Jesus rose', minutes: 7, summary: 'Death didn\'t win. Hope is real.', scripture: { reference: '1 Corinthians 15:20', text: 'But Christ has indeed been raised from the dead.' }, reflection: 'Where do you need resurrection hope today?', prayer: 'Jesus, bring new life to the dead places in me. Amen.', questions: ['Where in your life do you need resurrection hope?', 'What would it look like to live like the resurrection is true?'] }),
];

const buildingConsistency: JourneyModule[] = [
  enrich({ id: 'small-yes', title: 'The small yes', minutes: 6, summary: 'Tiny faithful steps beat heroic bursts.', scripture: { reference: 'Luke 16:10', text: 'Whoever can be trusted with very little can also be trusted with much.' }, reflection: 'What is the smallest "yes" you can give today?', prayer: 'God, I offer this small yes to you. Amen.', questions: ['What\'s the smallest yes you can give today?', 'Why do small things matter to God?'] }),
  enrich({ id: 'gentle-rhythm', title: 'Build a gentle rhythm', minutes: 7, summary: 'Same time. Same place. Soft repetition.', scripture: { reference: 'Mark 1:35', text: 'Very early in the morning, Jesus went off to a solitary place to pray.' }, reflection: 'When and where could you meet with God this week?', prayer: 'Help me show up, however small. Amen.', questions: ['When and where could you meet with God this week?', 'What rhythm could be sustainable for you?'] }),
  enrich({ id: 'grace-misses', title: 'Grace for misses', minutes: 6, summary: 'A missed day isn\'t a failed walk.', scripture: { reference: 'Micah 7:8', text: 'Though I have fallen, I will rise.' }, reflection: 'What would it look like to begin again without shame?', prayer: 'Thank you that today is always available. Amen.', questions: ['What would it look like to begin again without shame?', 'How do you typically respond to missing a day spiritually?'] }),
];

const healingRestoration: JourneyModule[] = [
  enrich({ id: 'come-weary', title: 'Come as you are weary', minutes: 7, summary: 'Rest before performance.', scripture: { reference: 'Matthew 11:28', text: 'Come to me, all you who are weary, and I will give you rest.' }, reflection: 'What are you most tired of carrying?', prayer: 'Jesus, I bring my weariness to you. Amen.', questions: ['What are you most tired of carrying right now?', 'What would real rest look like for you?'] }),
  enrich({ id: 'name-pain', title: 'Name the pain', minutes: 8, summary: 'Healing begins with honesty.', scripture: { reference: 'Psalm 147:3', text: 'He heals the brokenhearted and binds up their wounds.' }, reflection: 'Without filtering, what hurts right now?', prayer: 'God, here is the wound. Please touch it. Amen.', questions: ['Without filtering, what hurts right now?', 'What have you been afraid to name?'] }),
  enrich({ id: 'forgive-self', title: 'Forgiving yourself', minutes: 7, summary: 'God already has.', scripture: { reference: '1 John 1:9', text: 'He is faithful and just to forgive us our sins.' }, reflection: 'What are you still holding against yourself that God isn\'t?', prayer: 'Help me receive your forgiveness. Amen.', questions: ['What are you holding against yourself that God isn\'t?', 'What would it feel like to truly let it go?'] }),
  enrich({ id: 'restored-purpose', title: 'Restored purpose', minutes: 8, summary: 'You are not too broken to be used.', scripture: { reference: 'Joel 2:25', text: 'I will repay you for the years the locusts have eaten.' }, reflection: 'What hope feels possible again, even just a little?', prayer: 'Restore what I cannot, Lord. Amen.', questions: ['What hope feels possible again, even faintly?', 'Where would you most like to see restoration?'] }),
];

// ---------- Compact lesson builder for module expansion ----------
// `mini` mirrors `enrich` with a compact signature for the module-map below.
const mini = (
  id: string,
  title: string,
  summary: string,
  ref: string,
  text: string,
  reflection: string,
  prayer: string,
  minutes = 7,
): Lesson => enrich({
  id, title, summary, minutes,
  scripture: { reference: ref, text },
  reflection, prayer,
  questions: [reflection, 'Where does this meet you today?'],
});

// Pull lessons out of the existing arrays by id (kept here so authored lessons stay rich).
const pick = (arr: Lesson[], id: string): Lesson => {
  const found = arr.find((l) => l.id === id);
  if (!found) throw new Error(`Lesson not found: ${id}`);
  return found;
};

// Helper to build a Module.
const mod = (id: string, title: string, summary: string, lessons: Lesson[]): Module =>
  ({ id, title, summary, lessons });

// ============================================================
// STARTING FAITH — 6 modules · 25 lessons (~4 weeks)
// ============================================================
const startingFaithModules: Module[] = [
  mod('who-is-god', 'Who Is God?', 'Meet the God who made you and wants to be known.', [
    pick(startingFaith, 'who-is-god'),
    mini('god-is-love', 'God is love', 'Love is not just what God does — it is who he is.', '1 John 4:8', 'Whoever does not love does not know God, because God is love.', 'What would change if you believed God actually likes you?', 'Father, help me know your love, not just hear about it. Amen.'),
    mini('god-is-near', 'God is near', 'He is closer than you think, even when you cannot feel him.', 'Psalm 34:18', 'The Lord is near to the brokenhearted.', 'Where do you most need God to feel near today?', 'God, draw near to the places I keep hidden. Amen.'),
    mini('god-is-good', 'God is good', 'Even when life is not, God still is.', 'Psalm 100:5', 'For the Lord is good and his love endures forever.', 'Where have you doubted that God is good?', 'God, help me trust your goodness even where I cannot see it. Amen.'),
  ]),
  mod('who-is-jesus', 'Who Is Jesus?', 'See Jesus clearly — not the version culture sold you.', [
    pick(startingFaith, 'who-is-jesus'),
    pick(startingFaith, 'salvation'),
    pick(startingFaith, 'grace'),
    mini('jesus-with-us', 'God with us', 'In Jesus, God stepped into our story.', 'Matthew 1:23', 'They will call him Immanuel — which means, God with us.', 'What would it mean for Jesus to be with you right now?', 'Jesus, thank you for not staying distant. Amen.'),
  ]),
  mod('talking-with-god', 'Talking with God', 'Prayer is conversation, not performance.', [
    pick(startingFaith, 'what-is-prayer'),
    mini('prayer-honest-start', 'Pray your real thoughts', 'God already knows — honesty just unlocks the door.', 'Psalm 62:8', 'Pour out your hearts to him.', 'What is the most honest sentence you could pray today?', 'God, here is what is really going on. Hear me. Amen.'),
    mini('prayer-short-prayers', 'Short prayers count', 'You do not need long words to reach God.', 'Matthew 6:7', 'Do not keep on babbling like pagans.', 'What is a one-sentence prayer you could pray ten times today?', 'Jesus, I lift my heart to you. Amen.'),
    mini('prayer-thanksgiving', 'Begin with thanks', 'Gratitude reorients the heart.', '1 Thessalonians 5:18', 'Give thanks in all circumstances.', 'What are three small things you can thank God for today?', 'Thank you, God, for what I usually miss. Amen.'),
  ]),
  mod('the-bible', 'The Bible', 'Learn to read Scripture for life, not for points.', [
    pick(startingFaith, 'reading-bible'),
    mini('bible-where-start', 'Where to start', 'Begin with the Gospel of John — meet Jesus first.', 'John 20:31', 'These are written that you may believe.', 'When this week could you read one chapter slowly?', 'God, open my eyes as I open your Word. Amen.'),
    mini('bible-slow-reading', 'Read slowly', 'A few verses with attention beats a chapter on autopilot.', 'Psalm 1:2', 'On his law he meditates day and night.', 'What does it look like for you to read slowly?', 'Lord, slow my heart so I can hear yours. Amen.'),
    mini('bible-let-it-shape-you', 'Let it shape you', 'The goal is not information — it is transformation.', 'James 1:22', 'Do not merely listen to the word. Do what it says.', 'What is one verse you can carry into your day?', 'Spirit, shape me through what I read. Amen.'),
  ]),
  mod('following-daily', 'Following Jesus Daily', 'Walking with Jesus in ordinary days.', [
    pick(startingFaith, 'following-daily'),
    mini('daily-surrender', 'Daily surrender', 'A surrendered morning shapes the whole day.', 'Luke 9:23', 'Whoever wants to be my disciple must take up their cross daily.', 'What do you need to hand over to Jesus today?', 'Jesus, I give you today. Lead me. Amen.'),
    mini('daily-temptation', 'Walking through temptation', 'Following Jesus is real — and so is the pull away.', '1 Corinthians 10:13', 'God is faithful — he will not let you be tempted beyond what you can bear.', 'What temptation has the loudest voice in your life?', 'Jesus, give me strength where I am weakest. Amen.'),
    mini('daily-obedience', 'Small obedience', 'Big faith is built on small yeses.', 'John 14:15', 'If you love me, keep my commands.', 'What small obedience is in front of you right now?', 'Jesus, help me say yes to the small thing today. Amen.'),
  ]),
  mod('belonging-purpose', 'Belonging & Purpose', 'You were not made to walk alone or aimless.', [
    pick(startingFaith, 'finding-community'),
    pick(startingFaith, 'trusting-god'),
    pick(startingFaith, 'living-with-purpose'),
    mini('belonging-known', 'Known and loved', 'You are not a stranger to God.', 'Psalm 139:1', 'You have searched me, Lord, and you know me.', 'Where do you most want to be known by God?', 'God, thank you that I am not hidden from you. Amen.'),
    mini('purpose-everyday', 'Purpose in the everyday', 'Faithfulness in small places is your calling too.', 'Colossians 3:23', 'Whatever you do, work at it with all your heart, as working for the Lord.', 'What ordinary thing could become an act of worship today?', 'God, make my ordinary day matter for you. Amen.'),
  ]),
];

// ============================================================
// COMING BACK — 5 modules · 22 lessons (~4 weeks)
// ============================================================
const comingBackModules: Module[] = [
  mod('welcome-home', 'Welcome Home', 'No catching up. No condemnation. Just home.', [
    pick(comingBack, 'welcome-home'),
    pick(comingBack, 'letting-go-shame'),
    mini('cb-prodigal', 'The Father runs', 'He is not waiting at the door with crossed arms.', 'Luke 15:20', 'But while he was still a long way off, his father saw him and ran.', 'What does it feel like to picture God running toward you?', 'Father, thank you that you run toward me. Amen.'),
    mini('cb-no-distance', 'No distance too far', 'Wherever you have been, the way home is open.', 'Romans 8:38-39', 'Nothing in all creation can separate us from the love of God.', 'What part of you fears it is too late to return?', 'God, help me believe nothing has separated me from you. Amen.'),
  ]),
  mod('reconnecting', 'Reconnecting', 'Begin again — slowly, honestly, gently.', [
    pick(comingBack, 'starting-again'),
    pick(comingBack, 'returning-to-prayer'),
    mini('cb-small-step', 'One small step', 'You do not have to do everything today.', 'Zechariah 4:10', 'Do not despise these small beginnings.', 'What is the smallest faithful step you could take today?', 'God, bless this small return. Amen.'),
    mini('cb-honest-prayer', 'A prayer of return', 'Even "I do not know what to say" is a prayer.', 'Psalm 51:17', 'A broken and contrite heart you, God, will not despise.', 'What honest prayer have you been holding back?', 'God, here I am. That is all I have today. Amen.'),
  ]),
  mod('trusting-again', 'Trusting Again', 'Rebuilding what fear and disappointment broke.', [
    pick(comingBack, 'trusting-god-again'),
    pick(comingBack, 'healing-church-hurt'),
    mini('cb-disappointment', 'When you are disappointed in God', 'Honest doubt is welcome here.', 'Psalm 13:1', 'How long, Lord? Will you forget me forever?', 'What disappointment have you been afraid to bring to God?', 'God, I am bringing this honest disappointment to you. Amen.'),
    mini('cb-rebuild-trust', 'Rebuilding trust slowly', 'Trust is a series of small returns.', 'Lamentations 3:22-23', 'His mercies are new every morning.', 'Where could you take one small step of trust today?', 'God, give me courage for one small yes. Amen.'),
  ]),
  mod('listening-to-god', 'Listening to God', 'Learning to hear his voice again.', [
    pick(comingBack, 'hearing-gods-voice'),
    mini('cb-stillness', 'The practice of stillness', 'You cannot hear what you will not slow down for.', 'Psalm 46:10', 'Be still, and know that I am God.', 'When could you sit in silence for two minutes today?', 'God, quiet me enough to hear you. Amen.'),
    mini('cb-word-speaks', 'God speaks through Scripture', 'His voice is most clearly found in his Word.', '2 Timothy 3:16', 'All Scripture is God-breathed.', 'What passage might God want to speak to you through this week?', 'God, speak to me through your Word. Amen.'),
    mini('cb-confirming-voice', 'Testing what you hear', 'God’s voice never contradicts his character.', '1 John 4:1', 'Test the spirits to see whether they are from God.', 'How do you tell God’s voice from your own?', 'God, help me discern your voice clearly. Amen.'),
  ]),
  mod('walking-forward', 'Walking Forward', 'Build a sustainable life with Jesus from here.', [
    pick(comingBack, 'rebuilding-consistency'),
    pick(comingBack, 'walking-forward'),
    pick(comingBack, 'staying-connected'),
    mini('cb-community-again', 'Community again', 'You were not designed to walk alone.', 'Hebrews 10:24-25', 'Let us not give up meeting together.', 'Who is one person you could reach out to this week?', 'God, lead me to people who can walk with me. Amen.'),
    mini('cb-grace-pace', 'Move at the pace of grace', 'You do not have to make up for lost time.', 'Isaiah 40:31', 'Those who hope in the Lord will renew their strength.', 'Where are you tempted to push too hard?', 'God, set my pace. Amen.'),
    mini('cb-new-story', 'A new story starts now', 'Your past is not your future.', 'Isaiah 43:19', 'See, I am doing a new thing!', 'What new thing might God be doing in you?', 'God, write a new story in me. Amen.'),
  ]),
];

// ============================================================
// LEARNING PRAYER — 5 modules · 22 lessons (~4 weeks)
// ============================================================
const learningPrayerModules: Module[] = [
  mod('why-we-pray', 'Why We Pray', 'Prayer is not a transaction — it is a relationship.', [
    mini('lp-why', 'Why prayer matters', 'Prayer changes us before it changes circumstances.', 'Philippians 4:6-7', 'In every situation, by prayer and petition, present your requests to God.', 'What do you most want prayer to do for you?', 'God, teach me to pray. Amen.'),
    mini('lp-relationship', 'Prayer is relationship', 'God invites you in, not just to ask but to know.', 'John 15:15', 'I have called you friends.', 'What would it mean to pray as a friend, not a beggar?', 'Father, draw me closer in prayer. Amen.'),
    mini('lp-jesus-prayed', 'Jesus prayed', 'If Jesus needed it, so do we.', 'Mark 1:35', 'Very early in the morning, Jesus went off to a solitary place to pray.', 'When does Jesus’ rhythm of prayer challenge you?', 'Jesus, teach me to pray like you. Amen.'),
    mini('lp-keep-asking', 'Keep asking', 'Persistent prayer is not nagging — it is trust.', 'Luke 18:1', 'Always pray and not give up.', 'What have you stopped praying about?', 'God, give me courage to keep asking. Amen.'),
  ]),
  mod('praying-honestly', 'Praying Honestly', 'God can handle every real thing you bring him.', [
    pick(learningPrayer, 'pray-honest'),
    mini('lp-lament', 'Permission to lament', 'A third of the Psalms are honest complaints to God.', 'Psalm 13:1', 'How long, Lord?', 'What grief or anger do you need to put into words?', 'God, hear my honest grief. Amen.'),
    mini('lp-confession', 'Honest confession', 'Confession opens the door to freedom.', '1 John 1:9', 'If we confess our sins, he is faithful and just.', 'What sin have you been carrying alone?', 'God, I confess this to you. Cleanse me. Amen.'),
    mini('lp-no-mask', 'No mask required', 'You don’t need church language to talk to God.', 'Matthew 6:7-8', 'Your Father knows what you need before you ask.', 'Where have you been performing in prayer?', 'God, I drop the mask. Hear the real me. Amen.'),
  ]),
  mod('pattern-for-prayer', 'A Pattern for Prayer', 'Frameworks that train your heart, not box it in.', [
    pick(learningPrayer, 'pray-acts'),
    mini('lp-lords-prayer', 'The Lord’s Prayer', 'A blueprint Jesus gave us himself.', 'Matthew 6:9-13', 'This, then, is how you should pray...', 'Which line of the Lord’s Prayer hits hardest for you today?', 'Father, teach me to pray as Jesus prayed. Amen.'),
    mini('lp-praise-first', 'Begin with praise', 'Worship reorders the soul before we ask anything.', 'Psalm 100:4', 'Enter his gates with thanksgiving.', 'What about God do you most want to praise today?', 'God, you are worthy. I praise you. Amen.'),
    mini('lp-bring-needs', 'Bringing your needs', 'God invites you to ask, plainly and specifically.', 'Matthew 7:7', 'Ask and it will be given to you.', 'What specific need are you avoiding bringing to God?', 'Father, here is my need. I trust you. Amen.'),
  ]),
  mod('listening-prayer', 'Listening Prayer', 'Prayer is two-way — God speaks too.', [
    pick(learningPrayer, 'pray-listen'),
    mini('lp-silence', 'Embracing silence', 'God’s voice often comes after the noise dies down.', '1 Kings 19:12', 'After the fire came a gentle whisper.', 'What noise do you need to quiet to hear God?', 'God, quiet me enough to hear you. Amen.'),
    mini('lp-journaling', 'Journaling prayer', 'Writing slows the heart and clarifies what you’re really praying.', 'Habakkuk 2:2', 'Write down the revelation.', 'What might come up if you wrote your prayers this week?', 'God, give me words for what I cannot yet say. Amen.'),
    mini('lp-spirit-prays', 'When you can’t find words', 'The Spirit prays through you.', 'Romans 8:26', 'The Spirit himself intercedes for us through wordless groans.', 'Where do you not know what to pray right now?', 'Spirit, pray through me. Amen.'),
  ]),
  mod('life-of-prayer', 'A Life of Prayer', 'Prayer woven through ordinary days.', [
    pick(learningPrayer, 'pray-others'),
    mini('lp-pray-without-ceasing', 'Pray without ceasing', 'A constant turning of your heart toward God.', '1 Thessalonians 5:17', 'Pray continually.', 'How could you make your day a conversation with God?', 'God, may my day be one long prayer. Amen.'),
    mini('lp-breath-prayer', 'Breath prayers', 'A few words you can pray on every breath.', 'Psalm 150:6', 'Let everything that has breath praise the Lord.', 'What is one short prayer you could breathe today?', 'Jesus, have mercy on me. Amen.'),
    mini('lp-pray-scripture', 'Praying Scripture', 'God’s Word in your mouth shapes your heart.', 'Psalm 119:11', 'I have hidden your word in my heart.', 'What verse could become your prayer this week?', 'God, I pray your Word back to you. Amen.'),
    mini('lp-pray-anywhere', 'Prayer anywhere', 'You can pray in traffic, line, bed, or shower.', 'Nehemiah 2:4-5', 'Then I prayed to the God of heaven, and I answered the king.', 'Where could you sneak prayer into your day?', 'God, meet me everywhere I am today. Amen.'),
    mini('lp-keep-going', 'When prayers feel unanswered', 'God is at work even in the silence.', 'Isaiah 55:8-9', 'My thoughts are not your thoughts.', 'What unanswered prayer is hardest for you?', 'God, I trust you in the silence. Amen.'),
  ]),
];

// ============================================================
// UNDERSTANDING JESUS — 6 modules · 25 lessons (~4 weeks)
// ============================================================
const understandingJesusModules: Module[] = [
  mod('before-jesus', 'Before Jesus', 'The promise the world waited for.', [
    mini('uj-promise', 'A promise kept', 'God promised a rescuer — and kept his word.', 'Genesis 3:15', 'He will crush your head, and you will strike his heel.', 'Where do you most need to believe God keeps his promises?', 'God, thank you for keeping every promise in Jesus. Amen.'),
    mini('uj-prophecy', 'The prophets pointed to him', 'Centuries before, God spoke of him.', 'Isaiah 53:5', 'He was pierced for our transgressions.', 'How does it land that Jesus was promised long before he came?', 'God, thank you for the long faithfulness of your plan. Amen.'),
    mini('uj-incarnation', 'The Word became flesh', 'God did not stay far — he stepped in.', 'John 1:14', 'The Word became flesh and made his dwelling among us.', 'What does it mean to you that Jesus was fully God and fully human?', 'Jesus, thank you for coming so close. Amen.'),
    mini('uj-emmanuel', 'God with us', 'Immanuel — he is not distant, he is here.', 'Matthew 1:23', 'They will call him Immanuel.', 'Where do you most need Jesus to be with you?', 'Jesus, be with me here. Amen.'),
  ]),
  mod('how-jesus-lived', 'How Jesus Lived', 'The way he treated people changes everything.', [
    pick(understandingJesus, 'jesus-loved'),
    mini('uj-met-outcasts', 'He met the outcasts', 'Jesus went where religion would not.', 'Mark 2:17', 'It is not the healthy who need a doctor, but the sick.', 'Where do you feel like an outsider with God?', 'Jesus, thank you for coming for me too. Amen.'),
    mini('uj-touched-untouchable', 'He touched the untouchable', 'No one was too unclean for his hand.', 'Matthew 8:3', 'Jesus reached out his hand and touched the man.', 'What part of you feels too unclean to bring to Jesus?', 'Jesus, touch what I’ve been hiding. Amen.'),
    mini('uj-with-broken', 'He stayed with the broken', 'Jesus did not flinch at pain.', 'John 11:35', 'Jesus wept.', 'Where do you need Jesus to weep with you?', 'Jesus, sit with me in this. Amen.'),
  ]),
  mod('what-jesus-taught', 'What Jesus Taught', 'The kingdom Jesus announced — and how to live in it.', [
    pick(understandingJesus, 'jesus-taught'),
    mini('uj-beatitudes', 'Blessed are the broken', 'The kingdom flips the world upside down.', 'Matthew 5:3-4', 'Blessed are the poor in spirit, blessed are those who mourn.', 'Which beatitude meets you today?', 'Jesus, teach me your kingdom way. Amen.'),
    mini('uj-forgive', 'Forgive as you’ve been forgiven', 'Mercy is the family resemblance of God’s people.', 'Matthew 6:14-15', 'If you forgive others, your heavenly Father will also forgive you.', 'Who do you need to begin forgiving?', 'Jesus, help me forgive as you forgave me. Amen.'),
    mini('uj-fear-not', 'Do not be afraid', 'Jesus said it more than almost anything else.', 'John 14:27', 'Do not let your hearts be troubled.', 'What fear do you need to hand to Jesus today?', 'Jesus, take this fear from me. Amen.'),
  ]),
  mod('why-jesus-died', 'Why Jesus Died', 'The cross is the heart of the gospel.', [
    pick(understandingJesus, 'jesus-died'),
    mini('uj-for-you', 'He died for you', 'Not for an idea — for a person.', 'Galatians 2:20', 'He loved me and gave himself for me.', 'What does it mean that Jesus died for you, specifically?', 'Jesus, I receive what you did for me. Amen.'),
    mini('uj-substitute', 'He took our place', 'The exchange of the cross is the heart of grace.', '2 Corinthians 5:21', 'God made him who had no sin to be sin for us.', 'What do you most need taken from you today?', 'Jesus, I bring it to your cross. Amen.'),
    mini('uj-finished', 'It is finished', 'You do not need to add to what Jesus completed.', 'John 19:30', 'It is finished.', 'Where are you still trying to earn what Jesus already gave?', 'Jesus, I rest in your finished work. Amen.'),
  ]),
  mod('jesus-rose', 'Jesus Rose', 'Resurrection is the hinge of all hope.', [
    pick(understandingJesus, 'jesus-rose'),
    mini('uj-empty-tomb', 'The empty tomb', 'Hope is not a feeling — it is a fact.', 'Matthew 28:6', 'He is not here; he has risen, just as he said.', 'What hope do you most need today?', 'Jesus, raise hope in me again. Amen.'),
    mini('uj-new-life', 'New life now', 'Resurrection is not just future — it is for today.', 'Romans 6:4', 'We too may live a new life.', 'Where do you need resurrection life right now?', 'Jesus, breathe new life into this. Amen.'),
    mini('uj-fear-of-death', 'No more fear of death', 'Death is not the end of the story.', '1 Corinthians 15:55', 'Where, O death, is your victory?', 'How does Jesus’ resurrection change how you face loss?', 'Jesus, take the sting out of my fear. Amen.'),
  ]),
  mod('following-jesus-today', 'Following Jesus Today', 'What it looks like to walk with him now.', [
    mini('uj-take-up-cross', 'Take up your cross', 'Following Jesus costs — and is worth it.', 'Luke 9:23', 'Whoever wants to be my disciple must take up their cross daily.', 'What is Jesus asking you to lay down today?', 'Jesus, I follow you, even here. Amen.'),
    mini('uj-abide', 'Abide in him', 'Fruit comes from connection, not effort.', 'John 15:5', 'I am the vine; you are the branches.', 'How could you stay connected to Jesus today?', 'Jesus, keep me close. Amen.'),
    mini('uj-spirit-helps', 'The Spirit helps you follow', 'You are not following Jesus alone.', 'John 14:26', 'The Holy Spirit will teach you all things.', 'Where do you most need the Spirit’s help today?', 'Spirit, lead me today. Amen.'),
    mini('uj-mission', 'Sent ones', 'Following Jesus sends you into the world.', 'Matthew 28:19', 'Go and make disciples of all nations.', 'Who has God placed in your life to love today?', 'Jesus, use me where you’ve placed me. Amen.'),
    mini('uj-coming-back', 'He’s coming back', 'The story ends with him — and with us with him.', 'Revelation 21:3', 'God himself will be with them and be their God.', 'How does Jesus’ return shape how you live today?', 'Jesus, come quickly. Amen.'),
  ]),
];

// ============================================================
// BUILDING CONSISTENCY — 5 modules · 20 lessons (~4 weeks)
// ============================================================
const buildingConsistencyModules: Module[] = [
  mod('why-consistency', 'Why Consistency', 'Why small, repeated steps matter more than big bursts.', [
    mini('bc-faithful-small', 'Faithful in small things', 'Big faith is built in tiny obediences.', 'Luke 16:10', 'Whoever can be trusted with very little can also be trusted with much.', 'What small faithfulness is in front of you today?', 'God, help me be faithful in the small. Amen.'),
    mini('bc-motivation-fades', 'Motivation fades, formation lasts', 'Spiritual growth outlasts feelings.', 'Galatians 6:9', 'Let us not become weary in doing good.', 'Where have you confused motivation with growth?', 'God, form me beyond feelings. Amen.'),
    mini('bc-roots-deep', 'Deep roots, slow growth', 'Trees that last grow slowly.', 'Jeremiah 17:7-8', 'They will be like a tree planted by the water.', 'What deep root do you most want to grow?', 'God, grow me deep, not fast. Amen.'),
    mini('bc-grace-first', 'Grace fuels consistency', 'You don’t earn God’s love through consistency — it’s the response to it.', 'Titus 2:11-12', 'The grace of God teaches us to say no to ungodliness.', 'How does grace change why you show up?', 'God, let grace move me, not guilt. Amen.'),
  ]),
  mod('small-yes', 'The Small Yes', 'Tiny faithful steps beat heroic bursts.', [
    pick(buildingConsistency, 'small-yes'),
    mini('bc-two-minutes', 'Two-minute habits', 'Make it so small you can’t fail.', 'Zechariah 4:10', 'Do not despise small beginnings.', 'What two-minute habit could you start tomorrow?', 'God, bless this small step. Amen.'),
    mini('bc-stack-it', 'Stack it on what you already do', 'Anchor a new habit to an old one.', 'Deuteronomy 6:6-7', 'Talk about them when you sit at home and when you walk along the road.', 'What daily routine could you attach prayer or Scripture to?', 'God, make me mindful in ordinary moments. Amen.'),
    mini('bc-just-show-up', 'Just show up', 'Half of consistency is presence.', 'Matthew 18:20', 'Where two or three gather in my name, there am I with them.', 'What does “just showing up” look like for you this week?', 'God, here I am again. Meet me. Amen.'),
  ]),
  mod('daily-rhythm', 'Building a Daily Rhythm', 'Same time. Same place. Soft repetition.', [
    pick(buildingConsistency, 'gentle-rhythm'),
    mini('bc-morning', 'Morning with God', 'Even a few minutes shapes the day.', 'Psalm 5:3', 'In the morning, Lord, you hear my voice.', 'When could you give the first five minutes of your day to God?', 'God, I give you my morning. Amen.'),
    mini('bc-evening', 'Evening reflection', 'Look back with God before sleep.', 'Psalm 4:8', 'In peace I will lie down and sleep.', 'What might it look like to end the day with God?', 'God, hold me as I sleep. Amen.'),
    mini('bc-sabbath', 'A weekly stop', 'Rest is not laziness — it is worship.', 'Exodus 20:8', 'Remember the Sabbath day by keeping it holy.', 'When could you build in one hour of rest this week?', 'God, teach me to rest in you. Amen.'),
  ]),
  mod('grace-for-misses', 'Grace for Misses', 'A missed day is not a failed walk.', [
    pick(buildingConsistency, 'grace-misses'),
    mini('bc-begin-again', 'Begin again', 'Today is always available.', 'Lamentations 3:22-23', 'His mercies are new every morning.', 'What does “begin again” mean for you today?', 'God, I begin again. Thank you for new mercy. Amen.'),
    mini('bc-streak-trap', 'The streak trap', 'Consistency is the goal — not perfection.', 'Romans 8:1', 'There is now no condemnation for those in Christ.', 'Where has shame about misses kept you from returning?', 'God, free me from the streak trap. Amen.'),
    mini('bc-rest-is-faithful', 'Rest is faithful too', 'Sometimes faithfulness looks like stopping.', 'Mark 6:31', 'Come with me by yourselves to a quiet place and get some rest.', 'Where might rest be the most faithful thing today?', 'God, help me rest as worship. Amen.'),
  ]),
  mod('sustaining-walk', 'Sustaining the Walk', 'How rhythms become a life.', [
    mini('bc-community-keeps', 'Community keeps you', 'You are more consistent with others.', 'Hebrews 10:24-25', 'Spur one another on toward love and good deeds.', 'Who could walk with you in this rhythm?', 'God, give me people who help me show up. Amen.'),
    mini('bc-review', 'Review and adjust', 'A good rhythm gets refined over time.', 'Lamentations 3:40', 'Let us examine our ways and test them.', 'What is working in your rhythm? What needs to change?', 'God, help me adjust without quitting. Amen.'),
    mini('bc-seasons', 'Different seasons, different rhythms', 'Your walk will look different in different seasons.', 'Ecclesiastes 3:1', 'There is a time for everything.', 'What does this season need from your rhythm?', 'God, give me wisdom for this season. Amen.'),
    mini('bc-long-haul', 'In it for the long haul', 'You’re building a life, not a sprint.', '2 Timothy 4:7', 'I have fought the good fight, I have finished the race.', 'How does the long view change what you do today?', 'God, give me endurance for the long road. Amen.'),
  ]),
];

// ============================================================
// HEALING & RESTORATION — 6 modules · 30 lessons (~6 weeks)
// ============================================================
const healingRestorationModules: Module[] = [
  mod('come-weary', 'Come as You Are Weary', 'Rest before performance.', [
    pick(healingRestoration, 'come-weary'),
    mini('hr-not-alone', 'You are not alone', 'God meets the weary, not just the strong.', 'Isaiah 41:10', 'Do not fear, for I am with you.', 'Where do you most need God to be with you today?', 'God, I am not alone in this. Amen.'),
    mini('hr-permission-rest', 'Permission to rest', 'Rest is not weakness — it is design.', 'Genesis 2:2-3', 'God blessed the seventh day and made it holy.', 'What rest do you need permission to take?', 'God, help me rest without guilt. Amen.'),
    mini('hr-burnout', 'Burnout and the soul', 'Your soul has limits — and that is good.', 'Mark 6:31', 'Come away by yourselves and rest.', 'Where are you running on empty?', 'God, refill what is empty in me. Amen.'),
    mini('hr-quiet-strength', 'Quiet strength', 'You don’t have to perform your faith to keep it.', 'Isaiah 30:15', 'In quietness and trust is your strength.', 'What would quiet trust look like for you today?', 'God, I trust you quietly today. Amen.'),
  ]),
  mod('name-the-pain', 'Name the Pain', 'Healing begins with honesty.', [
    pick(healingRestoration, 'name-pain'),
    mini('hr-lament', 'The gift of lament', 'God invites your honest grief.', 'Psalm 13:2', 'How long must I wrestle with my thoughts?', 'What lament have you been holding back?', 'God, hear my honest grief. Amen.'),
    mini('hr-anger', 'Anger before God', 'God is big enough for your anger.', 'Ephesians 4:26', 'Be angry, and do not sin.', 'What anger do you need to bring to God?', 'God, here is my anger. Help me with it. Amen.'),
    mini('hr-tears', 'God collects your tears', 'No pain of yours goes unnoticed.', 'Psalm 56:8', 'You keep track of all my sorrows.', 'What grief have you felt unseen in?', 'God, thank you that you see all of it. Amen.'),
    mini('hr-not-too-much', 'You are not too much', 'God does not flinch at your pain.', 'Psalm 34:18', 'The Lord is close to the brokenhearted.', 'Where have you felt “too much” for others?', 'God, thank you that I’m not too much for you. Amen.'),
  ]),
  mod('shame-and-guilt', 'Shame and Guilt', 'Letting go of what God already has.', [
    pick(healingRestoration, 'forgive-self'),
    mini('hr-no-condemnation', 'No condemnation', 'In Christ, the verdict has already been spoken.', 'Romans 8:1', 'There is now no condemnation for those in Christ.', 'What condemnation have you been carrying?', 'God, I drop the verdict you’ve already removed. Amen.'),
    mini('hr-confess-not-hide', 'Confess, don’t hide', 'Confession is the path to freedom.', '1 John 1:9', 'He is faithful and just to forgive.', 'What do you need to bring into the light?', 'God, I bring this into your light. Amen.'),
    mini('hr-guilt-vs-shame', 'Guilt vs shame', 'Guilt says I did wrong. Shame says I am wrong.', 'Romans 5:8', 'While we were still sinners, Christ died for us.', 'Where has shame been disguised as guilt?', 'God, free me from shame I was never meant to carry. Amen.'),
    mini('hr-new-name', 'A new name', 'Your identity is not your worst moment.', 'Isaiah 62:2', 'You will be called by a new name.', 'What new name might God be giving you?', 'God, name me as you see me. Amen.'),
  ]),
  mod('church-hurt', 'Church Hurt', 'When the people of God hurt you.', [
    mini('hr-real-pain', 'It really hurt', 'God does not minimize what was done.', 'Psalm 55:12-14', 'It is not an enemy who insults me — but you, my close friend.', 'What part of church hurt has gone unspoken?', 'God, hear what I’ve carried alone. Amen.'),
    mini('hr-god-not-church', 'God is not the church that hurt you', 'God is not the system or the person who harmed you.', 'Hebrews 13:8', 'Jesus Christ is the same yesterday and today and forever.', 'Where have you confused God with people who failed you?', 'God, help me see you apart from those who hurt me. Amen.'),
    mini('hr-jesus-angry-too', 'Jesus was angry too', 'He was furious at religious harm.', 'Matthew 23:27-28', 'Woe to you, teachers of the law and Pharisees, you hypocrites!', 'How does it land that Jesus is angry at what was done to you?', 'Jesus, thank you for being on my side. Amen.'),
    mini('hr-slow-trust', 'Slow trust', 'You don’t have to rush back into community.', 'Proverbs 4:23', 'Above all else, guard your heart.', 'What boundary do you need to protect your healing?', 'God, give me wisdom for safe steps. Amen.'),
    mini('hr-someday-again', 'Someday, community again', 'God can rebuild what was broken.', 'Ezekiel 36:26', 'I will give you a new heart.', 'What hope can you hold for community someday?', 'God, soften what hurt has hardened. Amen.'),
  ]),
  mod('grief-and-loss', 'Grief and Loss', 'Walking with God through what cannot be undone.', [
    mini('hr-grief-is-love', 'Grief is love with nowhere to go', 'You grieve because you loved.', 'John 11:35', 'Jesus wept.', 'Who or what are you grieving today?', 'God, hold me in this grief. Amen.'),
    mini('hr-no-timeline', 'No timeline on grief', 'Grief moves in waves, not lines.', 'Ecclesiastes 3:4', 'A time to weep and a time to laugh.', 'Where have you tried to rush your grief?', 'God, let me grieve at your pace. Amen.'),
    mini('hr-god-near-grief', 'God is near in grief', 'God does not leave you alone in loss.', 'Psalm 34:18', 'The Lord is close to the brokenhearted.', 'Where do you most need God’s nearness?', 'God, be close to me here. Amen.'),
    mini('hr-hope-of-reunion', 'The hope of reunion', 'For those in Christ, goodbye is not the end.', '1 Thessalonians 4:13-14', 'We do not grieve like those who have no hope.', 'What hope can carry you through this grief?', 'God, anchor me to your hope. Amen.'),
    mini('hr-living-with-grief', 'Learning to live with it', 'Grief reshapes you — it doesn’t end you.', 'Psalm 30:5', 'Weeping may stay for the night, but rejoicing comes in the morning.', 'What does living with this loss look like now?', 'God, teach me to live faithfully alongside grief. Amen.'),
  ]),
  mod('restoration-forward', 'Restoration & Walking Forward', 'God restores what only he can.', [
    pick(healingRestoration, 'restored-purpose'),
    mini('hr-locusts', 'The years restored', 'God redeems what felt wasted.', 'Joel 2:25', 'I will repay you for the years the locusts have eaten.', 'What years do you long to see redeemed?', 'God, redeem what felt lost. Amen.'),
    mini('hr-beauty-ashes', 'Beauty from ashes', 'God specializes in resurrection.', 'Isaiah 61:3', 'A crown of beauty instead of ashes.', 'Where do you need God to bring beauty from ashes?', 'God, bring beauty where there has only been ash. Amen.'),
    mini('hr-new-thing', 'A new thing', 'God is doing something new in you.', 'Isaiah 43:19', 'See, I am doing a new thing!', 'What new thing might God be doing in you?', 'God, I trust the new thing. Amen.'),
    mini('hr-walk-with-others', 'Walk with others', 'Healing happens in safe community.', 'Galatians 6:2', 'Carry each other’s burdens.', 'Who is one safe person you could walk with?', 'God, lead me to safe community. Amen.'),
  ]),
];

export const journeys: Journey[] = [
  { id: 'starting-faith',       title: 'Starting Faith',         tagline: 'Discover who God is, who Jesus is, and what it means to follow him from the very beginning.', emoji: '🌱', forStages: ['new', 'curious'],                       modules: startingFaithModules },
  { id: 'coming-back',          title: 'Coming Back',            tagline: 'No catching up. No condemnation. A guided path home, one honest step at a time.',              emoji: '🏠', forStages: ['returning', 'longtime'],                modules: comingBackModules },
  { id: 'learning-prayer',      title: 'Learning Prayer',        tagline: 'Learn how to actually talk with God — honestly, simply, and as a way of life.',                emoji: '🙏', forStages: ['new', 'curious', 'returning', 'longtime'], modules: learningPrayerModules },
  { id: 'understanding-jesus',  title: 'Understanding Jesus',    tagline: 'Discover who Jesus is, what he taught, why he died, and what it means to follow him today.',  emoji: '✝️', forStages: ['new', 'curious', 'returning', 'longtime'], modules: understandingJesusModules },
  { id: 'building-consistency', title: 'Building Consistency',   tagline: 'Learn how to create sustainable rhythms with God that last beyond motivation.',                emoji: '🌿', forStages: ['returning', 'longtime', 'curious'],     modules: buildingConsistencyModules },
  { id: 'healing-restoration',  title: 'Healing & Restoration',  tagline: 'For church hurt, shame, guilt, grief, broken trust, and learning to walk forward again.',     emoji: '🤍', forStages: ['returning', 'longtime', 'curious'],     modules: healingRestorationModules },
];

// Normalize every lesson's prayer to end with the required ending.
for (const journey of journeys) {
  for (const mod of journey.modules) {
    for (const lesson of mod.lessons) {
      lesson.prayer = ensurePrayerEnding(lesson.prayer);
    }
  }
}

export function getJourney(id: JourneyId): Journey | undefined {
  return journeys.find((j) => j.id === id);
}

export function getRecommendedJourney(stage: 'new' | 'curious' | 'returning' | 'longtime'): Journey {
  if (stage === 'returning' || stage === 'longtime') return journeys.find((j) => j.id === 'coming-back')!;
  return journeys.find((j) => j.id === 'starting-faith')!;
}

/** Flatten all lessons in a journey, in order. */
export function getAllLessons(journey: Journey): Lesson[] {
  return journey.modules.flatMap((m) => m.lessons);
}

/** Find the module that contains a given lesson id. */
export function findModuleForLesson(journey: Journey, lessonId: string): Module | undefined {
  return journey.modules.find((m) => m.lessons.some((l) => l.id === lessonId));
}

/** Locate a lesson + its module within a journey. */
export function findLesson(journeyId: JourneyId, lessonId: string):
  | { journey: Journey; module: Module; lesson: Lesson }
  | undefined {
  const journey = getJourney(journeyId);
  if (!journey) return undefined;
  for (const mod of journey.modules) {
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (lesson) return { journey, module: mod, lesson };
  }
  return undefined;
}

// Find the next lesson recommendation across all journeys.
// Preference: next lesson in active journey → first lesson of a recommended sibling journey.
export function findNextRecommendation(
  activeId: JourneyId,
  completedByJourney: Record<string, string[]>,
): { journey: Journey; module: Lesson } | null {
  const active = getJourney(activeId);
  if (active) {
    const done = completedByJourney[active.id] || [];
    for (const lesson of getAllLessons(active)) {
      if (!done.includes(lesson.id)) return { journey: active, module: lesson };
    }
  }
  for (const j of journeys) {
    if (j.id === activeId) continue;
    const done = completedByJourney[j.id] || [];
    for (const lesson of getAllLessons(j)) {
      if (!done.includes(lesson.id)) return { journey: j, module: lesson };
    }
  }
  return null;
}
