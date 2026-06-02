// Scripture For What You're Facing
// Self-contained guidance map: scriptures, context, reflection, prayer, next steps.
// All prayers MUST end with: In Jesus' name, Amen. 🙏🏽

export interface GuidanceScripture {
  reference: string;
  text: string; // KJV
}

export interface GuidanceTopic {
  id: string;
  name: string;
  emoji: string;
  shortLabel: string; // for chip
  intro: string; // one calm sentence shown under the topic name
  scriptures: GuidanceScripture[];
  context: {
    whatsHappening: string;
    whyItMatters: string;
    whatItTeaches: string;
  };
  reflection: string[]; // questions
  prayer: string; // ends with In Jesus' name, Amen. 🙏🏽
  nextSteps: Array<{ label: string; to: string }>;
}

const PRAYER_END = "In Jesus' name, Amen. 🙏🏽";

const ensurePrayerEnding = (text: string): string => {
  const trimmed = text.trim();
  if (trimmed.endsWith(PRAYER_END)) return trimmed;
  return `${trimmed} ${PRAYER_END}`;
};

const t = (topic: Omit<GuidanceTopic, 'prayer'> & { prayer: string }): GuidanceTopic => ({
  ...topic,
  prayer: ensurePrayerEnding(topic.prayer),
});

export const guidanceTopics: GuidanceTopic[] = [
  t({
    id: 'anxiety',
    name: 'Anxiety',
    emoji: '😰',
    shortLabel: 'Anxious',
    intro: 'When your mind races and your chest tightens, God invites you to lay it down.',
    scriptures: [
      { reference: 'Philippians 4:6-7', text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.' },
      { reference: '1 Peter 5:7', text: 'Casting all your care upon him; for he careth for you.' },
      { reference: 'Matthew 6:34', text: 'Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself. Sufficient unto the day is the evil thereof.' },
      { reference: 'Psalm 55:22', text: 'Cast thy burden upon the LORD, and he shall sustain thee: he shall never suffer the righteous to be moved.' },
      { reference: 'John 14:27', text: 'Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.' },
    ],
    context: {
      whatsHappening: 'Paul writes from prison to a struggling church. He does not deny their trouble — he points them past it to a Father who hears.',
      whyItMatters: 'Anxiety isolates us inside our own head. Scripture pulls us back into relationship with a God who already knows and already cares.',
      whatItTeaches: 'Peace is not the absence of pressure. It is the presence of Jesus guarding your heart when you give Him the weight.',
    },
    reflection: [
      'What specific thought is looping in your mind right now?',
      'What would it look like to hand this one thing to Jesus today?',
      'Where have you seen God carry you before?',
    ],
    prayer: 'Father, my mind is loud and I am tired. I bring You every worry I have been carrying alone. Trade my fear for Your peace, and quiet the noise so I can hear You. Help me trust that You are already taking care of what I cannot.',
    nextSteps: [
      { label: 'Open Prayer Journal', to: '/prayer' },
      { label: 'Continue your Journey', to: '/journey' },
      { label: 'Ask the community to pray', to: 'community' },
    ],
  }),

  t({
    id: 'fear',
    name: 'Fear',
    emoji: '😨',
    shortLabel: 'Afraid',
    intro: 'Fear shrinks our world. God speaks to make it big again.',
    scriptures: [
      { reference: '2 Timothy 1:7', text: 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.' },
      { reference: 'Isaiah 41:10', text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.' },
      { reference: 'Psalm 34:4', text: 'I sought the LORD, and he heard me, and delivered me from all my fears.' },
      { reference: 'Joshua 1:9', text: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.' },
      { reference: 'Psalm 27:1', text: 'The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?' },
    ],
    context: {
      whatsHappening: 'Joshua is taking over after Moses dies. Israel is facing giants and unknown land. God repeats Himself: be not afraid, I am with you.',
      whyItMatters: 'Fear often shows up exactly when God is calling you forward. It is not a sign you are off the path — it is a sign the enemy wants you off it.',
      whatItTeaches: 'Courage is not the absence of fear. It is moving forward because the Lord your God goes with you.',
    },
    reflection: [
      'What is the fear actually about underneath the surface?',
      'What is one small obedient step you can take today anyway?',
      'How does it change things to know God goes with you, not just ahead of you?',
    ],
    prayer: 'Lord, I am scared, and I am tired of pretending I am not. Replace this fear with Your presence. Remind me that You walk with me right into the thing I am avoiding. Strengthen me to take one step today.',
    nextSteps: [
      { label: 'Open Prayer Journal', to: '/prayer' },
      { label: 'Continue your Journey', to: '/journey' },
      { label: 'Ask the community to pray', to: 'community' },
    ],
  }),

  t({
    id: 'doubt',
    name: 'Doubt',
    emoji: '❓',
    shortLabel: 'Doubting',
    intro: 'Doubt is not the opposite of faith. Honest questions belong in God\u2019s presence.',
    scriptures: [
      { reference: 'Mark 9:24', text: 'And straightway the father of the child cried out, and said with tears, Lord, I believe; help thou mine unbelief.' },
      { reference: 'James 1:5-6', text: 'If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him. But let him ask in faith, nothing wavering.' },
      { reference: 'Jude 1:22', text: 'And of some have compassion, making a difference.' },
      { reference: 'Hebrews 11:1', text: 'Now faith is the substance of things hoped for, the evidence of things not seen.' },
      { reference: 'Matthew 14:31', text: 'And immediately Jesus stretched forth his hand, and caught him, and said unto him, O thou of little faith, wherefore didst thou doubt?' },
    ],
    context: {
      whatsHappening: 'A father brings his son to Jesus and says, "I believe — help my unbelief." Jesus does not shame him. He heals the son.',
      whyItMatters: 'God can hold both your faith and your questions in the same hand. You do not have to fake certainty to come to Him.',
      whatItTeaches: 'Doubt brought honestly to Jesus becomes the beginning of stronger faith, not the end of faith.',
    },
    reflection: [
      'What specifically are you doubting right now — about God, yourself, or your future?',
      'Is your doubt rooted in unanswered questions, or in pain you have not processed?',
      'What would it look like to bring this exact doubt to Jesus today?',
    ],
    prayer: 'Jesus, I am struggling to believe right now. I want to trust You, but it is hard. Meet me where I actually am, not where I am supposed to be. Help my unbelief.',
    nextSteps: [
      { label: 'Read your Bible', to: '/bible' },
      { label: 'Continue your Journey', to: '/journey' },
      { label: 'Ask for guidance in community', to: 'community' },
    ],
  }),

  t({
    id: 'loneliness',
    name: 'Loneliness',
    emoji: '😞',
    shortLabel: 'Lonely',
    intro: 'You may feel unseen. You are not. God is closer than your next breath.',
    scriptures: [
      { reference: 'Psalm 68:6', text: 'God setteth the solitary in families: he bringeth out those which are bound with chains.' },
      { reference: 'Hebrews 13:5', text: 'Let your conversation be without covetousness; and be content with such things as ye have: for he hath said, I will never leave thee, nor forsake thee.' },
      { reference: 'Deuteronomy 31:6', text: 'Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.' },
      { reference: 'Matthew 28:20', text: 'Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen.' },
      { reference: 'Psalm 25:16', text: 'Turn thee unto me, and have mercy upon me; for I am desolate and afflicted.' },
    ],
    context: {
      whatsHappening: 'David writes Psalm 25 alone and afflicted. He does not pretend with God. He simply asks God to turn toward him.',
      whyItMatters: 'Loneliness lies and tells us nobody sees us, including God. Scripture insists the opposite — He sees, He stays, He sets us into family.',
      whatItTeaches: 'You are not forgotten. God plants the lonely into community, sometimes through His Word first, then through His people.',
    },
    reflection: [
      'When did this lonely feeling start, and what triggered it?',
      'Is there one person you could honestly reach out to this week?',
      'What does it look like to receive God\u2019s presence right now, even before community shows up?',
    ],
    prayer: 'Father, I feel unseen and forgotten. Remind me that You see me. Turn Your face toward me. Set me into a family that loves You, and help me show up for someone else who feels alone too.',
    nextSteps: [
      { label: 'Visit the Community', to: '/community' },
      { label: 'Open Prayer Journal', to: '/prayer' },
      { label: 'Ask the community to pray', to: 'community' },
    ],
  }),

  t({
    id: 'depression',
    name: 'Depression',
    emoji: '😔',
    shortLabel: 'Heavy',
    intro: 'Heaviness is real. God is near the brokenhearted, even when you cannot feel Him.',
    scriptures: [
      { reference: 'Psalm 34:18', text: 'The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.' },
      { reference: 'Psalm 42:11', text: 'Why art thou cast down, O my soul? and why art thou disquieted within me? hope thou in God: for I shall yet praise him, who is the health of my countenance, and my God.' },
      { reference: '2 Corinthians 4:8-9', text: 'We are troubled on every side, yet not distressed; we are perplexed, but not in despair; persecuted, but not forsaken; cast down, but not destroyed.' },
      { reference: 'Isaiah 41:10', text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.' },
      { reference: 'Lamentations 3:22-23', text: 'It is of the LORD\u2019s mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.' },
    ],
    context: {
      whatsHappening: 'Jeremiah wrote Lamentations after Jerusalem was destroyed. In the darkest chapter, he remembers one thing: God\u2019s mercies are new every morning.',
      whyItMatters: 'Depression makes us believe God has gone silent. Scripture insists His compassion is renewed every single morning, whether we feel it or not.',
      whatItTeaches: 'You do not have to climb out of the dark to find God. He sits beside you in it.',
    },
    reflection: [
      'What is the heaviest thing you are carrying right now?',
      'What is one tiny act of obedience that feels possible today?',
      'Who is one trusted person you can tell what you are actually feeling?',
    ],
    prayer: 'Father, I am tired and heavy and I do not always feel You. But Your Word says You are close to the brokenhearted, so I trust You are close to me. Lift my eyes. Send me help. Carry me until I can stand.',
    nextSteps: [
      { label: 'Open Prayer Journal', to: '/prayer' },
      { label: 'Visit the Community', to: '/community' },
      { label: 'Ask the community to pray', to: 'community' },
    ],
  }),

  t({
    id: 'anger',
    name: 'Anger',
    emoji: '😡',
    shortLabel: 'Angry',
    intro: 'Anger is information. God can handle yours — and help you carry it well.',
    scriptures: [
      { reference: 'Ephesians 4:26-27', text: 'Be ye angry, and sin not: let not the sun go down upon your wrath: Neither give place to the devil.' },
      { reference: 'Proverbs 15:1', text: 'A soft answer turneth away wrath: but grievous words stir up anger.' },
      { reference: 'James 1:19-20', text: 'Wherefore, my beloved brethren, let every man be swift to hear, slow to speak, slow to wrath: For the wrath of man worketh not the righteousness of God.' },
      { reference: 'Proverbs 14:29', text: 'He that is slow to wrath is of great understanding: but he that is hasty of spirit exalteth folly.' },
      { reference: 'Colossians 3:8', text: 'But now ye also put off all these; anger, wrath, malice, blasphemy, filthy communication out of your mouth.' },
    ],
    context: {
      whatsHappening: 'Paul does not tell the Ephesians never to feel angry. He tells them not to let anger settle in overnight, where it becomes bitterness.',
      whyItMatters: 'Anger that is suppressed becomes resentment. Anger that is expressed without God becomes destruction. Anger that is brought to God becomes clarity.',
      whatItTeaches: 'You can feel deeply and still respond wisely. The Spirit slows you down so the next words you say are not the ones you will regret.',
    },
    reflection: [
      'What is your anger actually trying to protect — pride, hurt, fear, or someone you love?',
      'Is there a person you need to forgive, or a boundary you need to set?',
      'What would it look like to take this to God before you take it to anyone else?',
    ],
    prayer: 'Father, I am angry and I do not want to sin in it. Show me what is really underneath this. Slow my tongue. Help me forgive where I need to forgive and stand firm where I need to stand. Trade my wrath for Your wisdom.',
    nextSteps: [
      { label: 'Open Prayer Journal', to: '/prayer' },
      { label: 'Continue your Journey', to: '/journey' },
      { label: 'Share reflection in community', to: 'community' },
    ],
  }),

  t({
    id: 'temptation',
    name: 'Temptation',
    emoji: '🎯',
    shortLabel: 'Tempted',
    intro: 'Being tempted is not sin. There is always a way out — Jesus made one.',
    scriptures: [
      { reference: '1 Corinthians 10:13', text: 'There hath no temptation taken you but such as is common to man: but God is faithful, who will not suffer you to be tempted above that ye are able; but will with the temptation also make a way to escape, that ye may be able to bear it.' },
      { reference: 'James 1:13-14', text: 'Let no man say when he is tempted, I am tempted of God: for God cannot be tempted with evil, neither tempteth he any man: But every man is tempted, when he is drawn away of his own lust, and enticed.' },
      { reference: 'Matthew 26:41', text: 'Watch and pray, that ye enter not into temptation: the spirit indeed is willing, but the flesh is weak.' },
      { reference: 'Hebrews 4:15', text: 'For we have not an high priest which cannot be touched with the feeling of our infirmities; but was in all points tempted like as we are, yet without sin.' },
      { reference: '2 Timothy 2:22', text: 'Flee also youthful lusts: but follow righteousness, faith, charity, peace, with them that call on the Lord out of a pure heart.' },
    ],
    context: {
      whatsHappening: 'Paul reminds the Corinthians, a church wrestling with very real sin, that God Himself is faithful and provides an escape route in every temptation.',
      whyItMatters: 'The enemy lies and says you are uniquely broken. Scripture says no — this is common, and God is faithful, and there is a way out.',
      whatItTeaches: 'The way out is rarely white-knuckling. It is fleeing toward Jesus, often by calling someone before you act.',
    },
    reflection: [
      'What is the temptation, and what is the lie underneath it?',
      'Where is the way of escape God may be providing right now?',
      'Who is one person you could tell before acting on this?',
    ],
    prayer: 'Jesus, You know exactly how this feels. You were tempted and did not fall. Strengthen me in this moment. Show me the way out You have already made, and give me the courage to take it.',
    nextSteps: [
      { label: 'Open Prayer Journal', to: '/prayer' },
      { label: 'Continue your Journey', to: '/journey' },
      { label: 'Ask the community to pray', to: 'community' },
    ],
  }),

  t({
    id: 'shame',
    name: 'Shame',
    emoji: '🙇',
    shortLabel: 'Ashamed',
    intro: 'Shame says you are the problem. Jesus says you are loved and being made new.',
    scriptures: [
      { reference: 'Romans 8:1', text: 'There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit.' },
      { reference: 'Psalm 34:5', text: 'They looked unto him, and were lightened: and their faces were not ashamed.' },
      { reference: 'Isaiah 61:7', text: 'For your shame ye shall have double; and for confusion they shall rejoice in their portion: therefore in their land they shall possess the double: everlasting joy shall be unto them.' },
      { reference: '2 Corinthians 5:17', text: 'Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.' },
      { reference: 'Joel 2:25', text: 'And I will restore to you the years that the locust hath eaten...' },
    ],
    context: {
      whatsHappening: 'Paul declares, "There is therefore now no condemnation" — to a church full of former everything: idolaters, liars, adulterers, the broken. All in Christ. All new.',
      whyItMatters: 'Conviction draws you toward God. Shame pushes you away. Shame is never from Him.',
      whatItTeaches: 'The cross was enough. You are not your worst day. In Christ you are a new creation — present tense.',
    },
    reflection: [
      'Where is shame trying to define your identity right now?',
      'What does it mean to you that there is "no condemnation" — right now, today?',
      'Who in your life still treats you like you cannot change?',
    ],
    prayer: 'Father, I have believed the lie that I am too far gone. Wash that away. Help me see myself the way You see me — covered, forgiven, made new in Jesus. Restore what shame has stolen.',
    nextSteps: [
      { label: 'Open Prayer Journal', to: '/prayer' },
      { label: 'Continue your Journey', to: '/journey' },
      { label: 'Share testimony in community', to: 'community' },
    ],
  }),

  t({
    id: 'guilt',
    name: 'Guilt',
    emoji: '😣',
    shortLabel: 'Guilty',
    intro: 'Bring it into the light. He is faithful and just to forgive.',
    scriptures: [
      { reference: '1 John 1:9', text: 'If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.' },
      { reference: 'Psalm 103:12', text: 'As far as the east is from the west, so far hath he removed our transgressions from us.' },
      { reference: 'Romans 5:1', text: 'Therefore being justified by faith, we have peace with God through our Lord Jesus Christ.' },
      { reference: 'Hebrews 10:22', text: 'Let us draw near with a true heart in full assurance of faith, having our hearts sprinkled from an evil conscience...' },
      { reference: 'Micah 7:18-19', text: 'Who is a God like unto thee, that pardoneth iniquity... he will subdue our iniquities; and thou wilt cast all their sins into the depths of the sea.' },
    ],
    context: {
      whatsHappening: 'John writes to believers who still sin. He does not tell them to hide. He tells them to confess and trust the faithfulness of God.',
      whyItMatters: 'Healthy guilt names what is true and sends you to Jesus. Unhealthy guilt rehearses the wrong over and over and keeps you stuck.',
      whatItTeaches: 'Confession is the doorway out. Once forgiven, you do not have to keep paying for what Jesus already paid for.',
    },
    reflection: [
      'What specifically are you carrying that you have not actually confessed to God?',
      'Is there someone you need to apologize to or make right with?',
      'What would it look like to actually receive forgiveness today instead of re-earning it?',
    ],
    prayer: 'Father, I confess what I have done. I am sorry. Thank You that Jesus already paid for this. Cleanse me and help me walk forward in freedom, not in fear of repeating the past.',
    nextSteps: [
      { label: 'Open Prayer Journal', to: '/prayer' },
      { label: 'Continue your Journey', to: '/journey' },
      { label: 'Ask the community to pray', to: 'community' },
    ],
  }),

  t({
    id: 'church_hurt',
    name: 'Church Hurt',
    emoji: '💔',
    shortLabel: 'Church hurt',
    intro: 'The church wounded you. Jesus did not. He is still safe to come to.',
    scriptures: [
      { reference: 'Psalm 147:3', text: 'He healeth the broken in heart, and bindeth up their wounds.' },
      { reference: 'Matthew 18:15', text: 'Moreover if thy brother shall trespass against thee, go and tell him his fault between thee and him alone: if he shall hear thee, thou hast gained thy brother.' },
      { reference: 'Romans 12:18', text: 'If it be possible, as much as lieth in you, live peaceably with all men.' },
      { reference: 'Hebrews 10:24-25', text: 'And let us consider one another to provoke unto love and to good works: Not forsaking the assembling of ourselves together...' },
      { reference: '1 Peter 5:10', text: 'But the God of all grace, who hath called us unto his eternal glory by Christ Jesus, after that ye have suffered a while, make you perfect, stablish, strengthen, settle you.' },
    ],
    context: {
      whatsHappening: 'The early church was messy — division, hypocrisy, failure. Scripture never excuses it. It calls God\u2019s people to be the ones who heal what was broken.',
      whyItMatters: 'When people who claim Christ hurt us, it is tempting to walk away from Him too. But Jesus is not the church\u2019s failure. He grieves it with you.',
      whatItTeaches: 'Healing usually takes time, distance, honest conversation, and eventually — in His timing — finding a safe place to belong again.',
    },
    reflection: [
      'What exactly happened, and what was the loss underneath the hurt?',
      'Have you been honest with God about how angry or disappointed you are?',
      'What would a safe next step toward community look like — not necessarily the same place, but somewhere?',
    ],
    prayer: 'Jesus, I was hurt by people who claimed Your name. I am angry, and I am tired. Heal what was broken in me. Show me that You are still safe. In time, lead me to people who will love me like You do.',
    nextSteps: [
      { label: 'Open Prayer Journal', to: '/prayer' },
      { label: 'Visit the Community', to: '/community' },
      { label: 'Share reflection in community', to: 'community' },
    ],
  }),

  t({
    id: 'forgiveness',
    name: 'Forgiveness',
    emoji: '🕊️',
    shortLabel: 'Forgive',
    intro: 'Forgiveness is not pretending it did not hurt. It is releasing the debt to God.',
    scriptures: [
      { reference: 'Ephesians 4:32', text: 'And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ\u2019s sake hath forgiven you.' },
      { reference: 'Colossians 3:13', text: 'Forbearing one another, and forgiving one another, if any man have a quarrel against any: even as Christ forgave you, so also do ye.' },
      { reference: 'Matthew 6:14-15', text: 'For if ye forgive men their trespasses, your heavenly Father will also forgive you: But if ye forgive not men their trespasses, neither will your Father forgive your trespasses.' },
      { reference: 'Luke 17:3-4', text: 'Take heed to yourselves: If thy brother trespass against thee, rebuke him; and if he repent, forgive him. And if he trespass against thee seven times in a day, and seven times in a day turn again to thee, saying, I repent; thou shalt forgive him.' },
      { reference: 'Mark 11:25', text: 'And when ye stand praying, forgive, if ye have ought against any: that your Father also which is in heaven may forgive you your trespasses.' },
    ],
    context: {
      whatsHappening: 'Paul tells the Ephesians to forgive the way Christ forgave them. That is not a small ask — it is the gospel applied to relationships.',
      whyItMatters: 'Unforgiveness chains you to the person who hurt you. Forgiveness is the key God offers so you can walk free.',
      whatItTeaches: 'You may have to forgive the same person many times. Forgiveness is a decision before it becomes a feeling.',
    },
    reflection: [
      'Who is on your heart that you have not fully forgiven?',
      'What would it look like to release the debt to God instead of holding it yourself?',
      'Does forgiveness require restoring the relationship, or simply releasing the bitterness?',
    ],
    prayer: 'Father, I have been holding onto this hurt and it is poisoning me. I release them to You. I forgive them the way You forgave me. Heal the wound and free me from carrying this any longer.',
    nextSteps: [
      { label: 'Open Prayer Journal', to: '/prayer' },
      { label: 'Continue your Journey', to: '/journey' },
      { label: 'Share testimony in community', to: 'community' },
    ],
  }),

  t({
    id: 'financial_stress',
    name: 'Financial Stress',
    emoji: '💸',
    shortLabel: 'Money stress',
    intro: 'Bills do not disappear, but worry can. God is your provider and your peace.',
    scriptures: [
      { reference: 'Philippians 4:19', text: 'But my God shall supply all your need according to his riches in glory by Christ Jesus.' },
      { reference: 'Matthew 6:31-33', text: 'Therefore take no thought, saying, What shall we eat? or, What shall we drink?... But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.' },
      { reference: 'Proverbs 3:9-10', text: 'Honour the LORD with thy substance, and with the firstfruits of all thine increase: So shall thy barns be filled with plenty...' },
      { reference: 'Hebrews 13:5', text: 'Let your conversation be without covetousness; and be content with such things as ye have: for he hath said, I will never leave thee, nor forsake thee.' },
      { reference: 'Psalm 37:25', text: 'I have been young, and now am old; yet have I not seen the righteous forsaken, nor his seed begging bread.' },
    ],
    context: {
      whatsHappening: 'Paul writes from prison and thanks the Philippians for their gift, then promises them their God will supply what they need too.',
      whyItMatters: 'Money fears reach into everything — sleep, marriage, hope. Jesus does not dismiss them. He reorders them. Seek the Kingdom first.',
      whatItTeaches: 'God may not always remove the pressure, but He provides — sometimes through people, sometimes through wisdom, always with peace.',
    },
    reflection: [
      'What specific provision are you actually asking God for?',
      'Is there a step of wisdom (budget, conversation, help) you have been avoiding?',
      'Where has God provided for you before, even when you could not see how?',
    ],
    prayer: 'Father, You know every bill, every fear, every number. I trust You to provide what I need. Give me wisdom with what I have, and give me peace while I wait on You. Help me seek Your Kingdom first.',
    nextSteps: [
      { label: 'Open Prayer Journal', to: '/prayer' },
      { label: 'Continue your Journey', to: '/journey' },
      { label: 'Ask the community to pray', to: 'community' },
    ],
  }),

  t({
    id: 'grief',
    name: 'Grief',
    emoji: '😢',
    shortLabel: 'Grieving',
    intro: 'Grief is love with nowhere to go. Bring it to Jesus, who wept too.',
    scriptures: [
      { reference: 'Matthew 5:4', text: 'Blessed are they that mourn: for they shall be comforted.' },
      { reference: 'Revelation 21:4', text: 'And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.' },
      { reference: 'Psalm 34:18', text: 'The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.' },
      { reference: '1 Thessalonians 4:13-14', text: 'But I would not have you to be ignorant, brethren, concerning them which are asleep, that ye sorrow not, even as others which have no hope.' },
      { reference: 'John 11:35', text: 'Jesus wept.' },
    ],
    context: {
      whatsHappening: 'At Lazarus\u2019 tomb, Jesus already knew He was about to raise him. He still wept with the people He loved.',
      whyItMatters: 'God never asks you to skip the grief. He weeps with you in it.',
      whatItTeaches: 'Hope and grief are not opposites. Christians mourn with hope — fully feeling the loss while trusting the One who conquered death.',
    },
    reflection: [
      'What — or who — are you grieving right now?',
      'Have you given yourself permission to feel this without rushing it?',
      'Where do you sense Jesus sitting beside you in this loss?',
    ],
    prayer: 'Jesus, You wept. You know what this feels like. Sit with me in this loss. Hold me when the waves come. Anchor me in the hope that one day You will wipe every tear away.',
    nextSteps: [
      { label: 'Open Prayer Journal', to: '/prayer' },
      { label: 'Visit the Community', to: '/community' },
      { label: 'Ask the community to pray', to: 'community' },
    ],
  }),

  t({
    id: 'overthinking',
    name: 'Overthinking',
    emoji: '🌀',
    shortLabel: 'Overthinking',
    intro: 'Your mind keeps spinning. God invites you to rest your thoughts in Him.',
    scriptures: [
      { reference: 'Psalm 94:19', text: 'In the multitude of my thoughts within me thy comforts delight my soul.' },
      { reference: 'Philippians 4:8', text: 'Finally, brethren, whatsoever things are true, whatsoever things are honest, whatsoever things are just, whatsoever things are pure, whatsoever things are lovely, whatsoever things are of good report... think on these things.' },
      { reference: '2 Corinthians 10:5', text: 'Casting down imaginations, and every high thing that exalteth itself against the knowledge of God, and bringing into captivity every thought to the obedience of Christ.' },
      { reference: 'Isaiah 26:3', text: 'Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.' },
      { reference: 'Proverbs 3:5-6', text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.' },
    ],
    context: {
      whatsHappening: 'Paul tells the Philippians what to do when their minds will not stop. Not "stop thinking" — but redirect: think on what is true, lovely, pure.',
      whyItMatters: 'Overthinking is not problem-solving. It is the illusion of control. Scripture invites you back into trust.',
      whatItTeaches: 'You cannot empty your mind. You can fill it with Truth and let Him quiet the rest.',
    },
    reflection: [
      'What is the loop your mind keeps running?',
      'Which of those thoughts are actually true, and which are fear pretending to be wisdom?',
      'What one truth from Scripture can you anchor to today?',
    ],
    prayer: 'Father, my mind will not stop. Quiet the spinning. Help me bring every thought captive to Jesus, and replace the lies with Your truth. Keep me in perfect peace.',
    nextSteps: [
      { label: 'Open Prayer Journal', to: '/prayer' },
      { label: 'Read your Bible', to: '/bible' },
      { label: 'Share reflection in community', to: 'community' },
    ],
  }),

  t({
    id: 'relationships',
    name: 'Relationships',
    emoji: '💑',
    shortLabel: 'Relationships',
    intro: 'God designed you for relationship. He also gives wisdom for the hard ones.',
    scriptures: [
      { reference: '1 Corinthians 13:4-7', text: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up, Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil; Rejoiceth not in iniquity, but rejoiceth in the truth; Beareth all things, believeth all things, hopeth all things, endureth all things.' },
      { reference: 'Ephesians 4:2-3', text: 'With all lowliness and meekness, with longsuffering, forbearing one another in love; Endeavouring to keep the unity of the Spirit in the bond of peace.' },
      { reference: 'Proverbs 27:17', text: 'Iron sharpeneth iron; so a man sharpeneth the countenance of his friend.' },
      { reference: 'Colossians 3:14', text: 'And above all these things put on charity, which is the bond of perfectness.' },
      { reference: 'Romans 12:10', text: 'Be kindly affectioned one to another with brotherly love; in honour preferring one another.' },
    ],
    context: {
      whatsHappening: 'Paul gives a working definition of love to a divided church. He does not describe a feeling. He describes a way of being.',
      whyItMatters: 'Every relationship needs grace because every person needs grace, including you.',
      whatItTeaches: 'Love is patient and kind and unselfish — and only Christ can fully produce that in us. Lean on Him before you lean on each other.',
    },
    reflection: [
      'Which relationship is weighing on you most right now?',
      'Are you needing to forgive, to set a boundary, to apologize, or to invest?',
      'How is Jesus inviting you to love this person more like He loves you?',
    ],
    prayer: 'Father, You know every person in my life and every place I am struggling. Give me wisdom, patience, and grace. Where I need to forgive, help me. Where I need to grow, soften me. Make my relationships look more like Yours.',
    nextSteps: [
      { label: 'Open Prayer Journal', to: '/prayer' },
      { label: 'Visit the Community', to: '/community' },
      { label: 'Ask for guidance in community', to: 'community' },
    ],
  }),

  t({
    id: 'purpose',
    name: 'Purpose',
    emoji: '🧭',
    shortLabel: 'Purpose',
    intro: 'You were not made by accident. God has good works prepared for you.',
    scriptures: [
      { reference: 'Jeremiah 29:11', text: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.' },
      { reference: 'Ephesians 2:10', text: 'For we are his workmanship, created in Christ Jesus unto good works, which God hath before ordained that we should walk in them.' },
      { reference: 'Romans 8:28', text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.' },
      { reference: 'Proverbs 19:21', text: 'There are many devices in a man\u2019s heart; nevertheless the counsel of the LORD, that shall stand.' },
      { reference: 'Psalm 138:8', text: 'The LORD will perfect that which concerneth me: thy mercy, O LORD, endureth for ever: forsake not the works of thine own hands.' },
    ],
    context: {
      whatsHappening: 'Paul tells the Ephesians they are God\u2019s workmanship — a craftsman\u2019s masterpiece — created on purpose, for a purpose.',
      whyItMatters: 'The world will tell you that you have to find your purpose. Scripture says God already prepared it. You walk into it as you walk with Him.',
      whatItTeaches: 'Purpose is less about a perfect plan and more about a faithful direction. Follow Jesus today and tomorrow will unfold.',
    },
    reflection: [
      'What desires has God put in your heart that you keep dismissing?',
      'What good work in front of you right now might be exactly what God prepared?',
      'Where do you sense Him saying "this way" — even quietly?',
    ],
    prayer: 'Father, You made me on purpose, for a purpose. Quiet the comparison. Help me trust that the work You have for me is already prepared. Lead me into it one obedient step at a time.',
    nextSteps: [
      { label: 'Continue your Journey', to: '/journey' },
      { label: 'Open Prayer Journal', to: '/prayer' },
      { label: 'Ask for guidance in community', to: 'community' },
    ],
  }),

  t({
    id: 'identity',
    name: 'Identity',
    emoji: '👤',
    shortLabel: 'Identity',
    intro: 'Who you are is not up for vote. In Christ, you are loved and chosen.',
    scriptures: [
      { reference: '2 Corinthians 5:17', text: 'Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.' },
      { reference: '1 Peter 2:9', text: 'But ye are a chosen generation, a royal priesthood, an holy nation, a peculiar people; that ye should shew forth the praises of him who hath called you out of darkness into his marvellous light.' },
      { reference: 'John 1:12', text: 'But as many as received him, to them gave he power to become the sons of God, even to them that believe on his name.' },
      { reference: 'Ephesians 1:4-5', text: 'According as he hath chosen us in him before the foundation of the world... having predestinated us unto the adoption of children by Jesus Christ to himself.' },
      { reference: 'Psalm 139:14', text: 'I will praise thee; for I am fearfully and wonderfully made: marvellous are thy works; and that my soul knoweth right well.' },
    ],
    context: {
      whatsHappening: 'Peter writes to scattered believers who feel like outsiders. He reminds them of who they are: chosen, royal, holy, His.',
      whyItMatters: 'If your identity is built on performance, people, or pain, it will collapse. Built on Christ, it cannot be moved.',
      whatItTeaches: 'You do not become who God says you are by trying harder. You receive it. Then you live from it.',
    },
    reflection: [
      'Where have you been letting other voices define you?',
      'Which truth about who God says you are do you most need to receive today?',
      'How would you live differently if you fully believed you were chosen and loved?',
    ],
    prayer: 'Father, I have let other voices speak louder than Yours. Remind me who I am in You — chosen, loved, made new. Help me live from Your voice instead of trying to earn what You have already given.',
    nextSteps: [
      { label: 'Continue your Journey', to: '/journey' },
      { label: 'Open Prayer Journal', to: '/prayer' },
      { label: 'Share testimony in community', to: 'community' },
    ],
  }),

  t({
    id: 'trusting_god',
    name: 'Trusting God',
    emoji: '🤝',
    shortLabel: 'Trust',
    intro: 'Trust is built one obedient step at a time. He has never failed.',
    scriptures: [
      { reference: 'Proverbs 3:5-6', text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.' },
      { reference: 'Psalm 56:3', text: 'What time I am afraid, I will trust in thee.' },
      { reference: 'Isaiah 26:4', text: 'Trust ye in the LORD for ever: for in the LORD JEHOVAH is everlasting strength.' },
      { reference: 'Romans 15:13', text: 'Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost.' },
      { reference: 'Nahum 1:7', text: 'The LORD is good, a strong hold in the day of trouble; and he knoweth them that trust in him.' },
    ],
    context: {
      whatsHappening: 'Solomon, who had every resource to figure things out himself, tells his son the wisest thing he can: do not lean on your own understanding.',
      whyItMatters: 'Trust is the soil everything else in your walk with God grows from. When trust shrinks, fear and control take over.',
      whatItTeaches: 'God\u2019s track record is perfect. You can rest because He never has.',
    },
    reflection: [
      'Where are you trying to lean on your own understanding right now?',
      'When has God come through for you in the past?',
      'What is one area you can choose to trust Him with today, even without seeing the outcome?',
    ],
    prayer: 'Father, I want to trust You with everything, and I confess I am holding some of it back. Help me let go. Remind me of every time You have come through. Fill me with hope and peace as I lean on You.',
    nextSteps: [
      { label: 'Open Prayer Journal', to: '/prayer' },
      { label: 'Continue your Journey', to: '/journey' },
      { label: 'Share reflection in community', to: 'community' },
    ],
  }),

  t({
    id: 'spiritual_dryness',
    name: 'Spiritual Dryness',
    emoji: '🌾',
    shortLabel: 'Dry season',
    intro: 'When God feels far, He is not. Keep showing up. The well is still there.',
    scriptures: [
      { reference: 'Psalm 42:1-2', text: 'As the hart panteth after the water brooks, so panteth my soul after thee, O God. My soul thirsteth for God, for the living God: when shall I come and appear before God?' },
      { reference: 'Isaiah 55:1', text: 'Ho, every one that thirsteth, come ye to the waters, and he that hath no money; come ye, buy, and eat...' },
      { reference: 'Matthew 5:6', text: 'Blessed are they which do hunger and thirst after righteousness: for they shall be filled.' },
      { reference: 'James 4:8', text: 'Draw nigh to God, and he will draw nigh to you. Cleanse your hands, ye sinners; and purify your hearts, ye double minded.' },
      { reference: 'Revelation 22:17', text: 'And the Spirit and the bride say, Come. And let him that heareth say, Come. And let him that is athirst come. And whosoever will, let him take the water of life freely.' },
    ],
    context: {
      whatsHappening: 'The psalmist is dry, distant from God, and aching for what he used to feel. He does not run away. He cries out and keeps coming.',
      whyItMatters: 'Dry seasons are normal in the walk with Jesus. They are not proof you have lost Him. They are an invitation deeper.',
      whatItTeaches: 'Faithfulness in the dry is what grows the deepest roots. Keep coming. The water is still flowing.',
    },
    reflection: [
      'When did the dryness start, and what was happening in your life?',
      'What spiritual rhythm has quietly slipped that you could re-start small?',
      'What is one honest sentence you can say to God right now, even if you feel nothing?',
    ],
    prayer: 'Father, I miss You. I feel dry and far, and I do not always know why. Draw near to me as I draw near to You. Fill me again. I do not need a feeling — I just need You.',
    nextSteps: [
      { label: 'Read your Bible', to: '/bible' },
      { label: 'Open Prayer Journal', to: '/prayer' },
      { label: 'Share reflection in community', to: 'community' },
    ],
  }),
];

export const getTopicById = (id: string): GuidanceTopic | undefined =>
  guidanceTopics.find((topic) => topic.id === id);
