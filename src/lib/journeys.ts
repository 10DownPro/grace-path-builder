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
    prayer: base.prayer,
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

export const journeys: Journey[] = [
  { id: 'starting-faith', title: 'Starting Faith', tagline: 'Begin at the beginning — one honest step.', emoji: '🌱', forStages: ['new', 'curious'], modules: startingFaith },
  { id: 'coming-back', title: 'Coming Back', tagline: 'No catching up. No condemnation. Just home.', emoji: '🏠', forStages: ['returning', 'longtime'], modules: comingBack },
  { id: 'learning-prayer', title: 'Learning Prayer', tagline: 'How to actually talk with God.', emoji: '🙏', forStages: ['new', 'curious', 'returning', 'longtime'], modules: learningPrayer },
  { id: 'understanding-jesus', title: 'Understanding Jesus', tagline: 'Get to know who he actually is.', emoji: '✝️', forStages: ['new', 'curious', 'returning', 'longtime'], modules: understandingJesus },
  { id: 'building-consistency', title: 'Building Consistency', tagline: 'Small, sustainable rhythms with God.', emoji: '🌿', forStages: ['returning', 'longtime', 'curious'], modules: buildingConsistency },
  { id: 'healing-restoration', title: 'Healing & Restoration', tagline: 'For wounds, weariness, and weight.', emoji: '🤍', forStages: ['returning', 'longtime', 'curious'], modules: healingRestoration },
];

export function getJourney(id: JourneyId): Journey | undefined {
  return journeys.find((j) => j.id === id);
}

export function getRecommendedJourney(stage: 'new' | 'curious' | 'returning' | 'longtime'): Journey {
  if (stage === 'returning' || stage === 'longtime') return journeys.find((j) => j.id === 'coming-back')!;
  return journeys.find((j) => j.id === 'starting-faith')!;
}

// Find the next lesson recommendation across all journeys.
// Preference: next module in active journey → first module of a recommended sibling journey.
export function findNextRecommendation(
  activeId: JourneyId,
  completedByJourney: Record<string, string[]>,
): { journey: Journey; module: JourneyModule } | null {
  const active = getJourney(activeId);
  if (active) {
    const done = completedByJourney[active.id] || [];
    const next = active.modules.find((m) => !done.includes(m.id));
    if (next) return { journey: active, module: next };
  }
  for (const j of journeys) {
    if (j.id === activeId) continue;
    const done = completedByJourney[j.id] || [];
    const next = j.modules.find((m) => !done.includes(m.id));
    if (next) return { journey: j, module: next };
  }
  return null;
}
