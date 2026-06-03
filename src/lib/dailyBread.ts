// FaithFit Daily Bread — passage-based discipleship readings.
// Not "verse of the day" — full passages, stories, teachings, parables.
// Every reading: Theme → Reading (5–20v) → What's Happening → About God →
// About Jesus → Reflection → Prayer → Action Step.
// Prayers end with the global closing: "In Jesus' name, Amen. 🙏🏽"

import { ensurePrayerEnding } from './journeys';

export type ReadingRhythm = 'quick' | 'daily' | 'deep';

export interface RhythmMeta {
  id: ReadingRhythm;
  label: string;
  minutes: string;
  blurb: string;
}

export const rhythms: RhythmMeta[] = [
  { id: 'quick', label: 'Quick Bread',  minutes: '5 min',     blurb: 'Reading + one takeaway. For tight days.' },
  { id: 'daily', label: 'Daily Bread',  minutes: '10–15 min', blurb: 'Reading, context, reflection, and prayer.' },
  { id: 'deep',  label: 'Deep Dive',    minutes: '20–30 min', blurb: 'Full study — background, both questions, action step.' },
];

export interface PassageVerse {
  v: number;       // verse number
  text: string;    // KJV text
}

export interface BibleBackground {
  author: string;       // Who wrote this
  when: string;         // When (era-friendly, not academic)
  audience: string;     // Original readers
  whyWritten: string;   // Purpose, one sentence
}

export interface DailyBreadReading {
  id: string;
  theme: string;                          // e.g. "Trusting God in the storm"
  oneLine: string;                        // shown under theme
  passageRef: string;                     // e.g. "Mark 4:35-41"
  passageTitle: string;                   // e.g. "Jesus calms the storm"
  category: 'narrative' | 'teaching' | 'parable' | 'conversation' | 'psalm' | 'letter';
  characters: string[];                   // people in the passage
  verses: PassageVerse[];                 // 5–20 verses, KJV
  whatsHappening: string;                 // who/where/why, plain language
  aboutGod: string;                       // God's character revealed
  aboutJesus: string;                     // Christ-centered note
  background: BibleBackground;            // lightweight Bible background
  reflection: string[];                   // 2–3 thoughtful, passage-specific questions
  prayer: string;                         // auto-ended with required closing
  actionStep: string;                     // one concrete step
  quickTakeaway: string;                  // single-sentence summary for Quick Bread
}

// Internal helper to ensure prayer closing on every entry.
const r = (entry: Omit<DailyBreadReading, 'prayer'> & { prayer: string }): DailyBreadReading => ({
  ...entry,
  prayer: ensurePrayerEnding(entry.prayer),
});

export const dailyBreadLibrary: DailyBreadReading[] = [
  r({
    id: 'jesus-calms-storm',
    theme: 'Trusting God in the storm',
    oneLine: 'When the wind is loud, Jesus is still in the boat.',
    passageRef: 'Mark 4:35-41',
    passageTitle: 'Jesus calms the storm',
    category: 'narrative',
    characters: ['Jesus', 'The Twelve disciples'],
    verses: [
      { v: 35, text: 'And the same day, when the even was come, he saith unto them, Let us pass over unto the other side.' },
      { v: 36, text: 'And when they had sent away the multitude, they took him even as he was in the ship. And there were also with him other little ships.' },
      { v: 37, text: 'And there arose a great storm of wind, and the waves beat into the ship, so that it was now full.' },
      { v: 38, text: 'And he was in the hinder part of the ship, asleep on a pillow: and they awake him, and say unto him, Master, carest thou not that we perish?' },
      { v: 39, text: 'And he arose, and rebuked the wind, and said unto the sea, Peace, be still. And the wind ceased, and there was a great calm.' },
      { v: 40, text: 'And he said unto them, Why are ye so fearful? how is it that ye have no faith?' },
      { v: 41, text: 'And they feared exceedingly, and said one to another, What manner of man is this, that even the wind and the sea obey him?' },
    ],
    whatsHappening:
      'After a long day of teaching, Jesus tells His disciples to cross the Sea of Galilee. A sudden, violent storm swamps the boat. Several of these men are seasoned fishermen — they know this lake — and they are terrified. Jesus is asleep. They wake Him, half accusing: "Don\'t you care?" He stands, speaks three words to the storm, and the wind stops.',
    aboutGod:
      'God is not panicked by what panics you. He is sovereign over creation — even the wind and waves obey His voice. He is also patient with frightened people who don\'t yet see who He really is.',
    aboutJesus:
      'This is one of the moments the disciples begin to see Jesus is not merely a rabbi. Only God speaks to the sea and is obeyed (Psalm 107:29). Jesus is God-with-us — in the boat, in the storm, with authority over both.',
    background: {
      author: 'John Mark, traveling companion of Peter',
      when: 'Around AD 60, within a generation of the events',
      audience: 'Likely Roman Christians facing pressure for their faith',
      whyWritten: 'To show Jesus as the powerful, suffering Son of God worth following — even into storms.',
    },
    reflection: [
      'What "storm" are you in right now where it feels like Jesus is asleep?',
      'The disciples\' real problem wasn\'t the storm — it was forgetting who was in the boat. What does that change for you today?',
      'What does Jesus\' question — "How is it that ye have no faith?" — invite you to confess or ask for?',
    ],
    prayer:
      'Jesus, the wind is loud and I am tired. I confess I have been acting like You don\'t care. You are in my boat. Speak peace to what I cannot calm, and grow my faith in who You really are.',
    actionStep:
      'Name one specific "storm" out loud to Jesus today. Then, before doing anything else, sit quietly for 60 seconds and let Him be in the boat with you.',
    quickTakeaway: 'Jesus is in the boat. The same voice that quieted the sea can quiet you.',
  }),

  r({
    id: 'woman-at-the-well',
    theme: 'Seen, known, and welcomed',
    oneLine: 'Jesus crosses every line to find one thirsty heart.',
    passageRef: 'John 4:7-26',
    passageTitle: 'Jesus and the woman at the well',
    category: 'conversation',
    characters: ['Jesus', 'A Samaritan woman'],
    verses: [
      { v: 7,  text: 'There cometh a woman of Samaria to draw water: Jesus saith unto her, Give me to drink.' },
      { v: 9,  text: 'Then saith the woman of Samaria unto him, How is it that thou, being a Jew, askest drink of me, which am a woman of Samaria? for the Jews have no dealings with the Samaritans.' },
      { v: 10, text: 'Jesus answered and said unto her, If thou knewest the gift of God, and who it is that saith to thee, Give me to drink; thou wouldest have asked of him, and he would have given thee living water.' },
      { v: 13, text: 'Jesus answered and said unto her, Whosoever drinketh of this water shall thirst again:' },
      { v: 14, text: 'But whosoever drinketh of the water that I shall give him shall never thirst; but the water that I shall give him shall be in him a well of water springing up into everlasting life.' },
      { v: 15, text: 'The woman saith unto him, Sir, give me this water, that I thirst not, neither come hither to draw.' },
      { v: 16, text: 'Jesus saith unto her, Go, call thy husband, and come hither.' },
      { v: 17, text: 'The woman answered and said, I have no husband. Jesus said unto her, Thou hast well said, I have no husband:' },
      { v: 18, text: 'For thou hast had five husbands; and he whom thou now hast is not thy husband: in that saidst thou truly.' },
      { v: 23, text: 'But the hour cometh, and now is, when the true worshippers shall worship the Father in spirit and in truth: for the Father seeketh such to worship him.' },
      { v: 25, text: 'The woman saith unto him, I know that Messias cometh, which is called Christ: when he is come, he will tell us all things.' },
      { v: 26, text: 'Jesus saith unto her, I that speak unto thee am he.' },
    ],
    whatsHappening:
      'Jesus stops at a well in Samaria — a region most Jews avoided. He speaks to a woman alone at noon (a time chosen to dodge other women, suggesting shame in her story). He asks her for a drink, which crosses gender, racial, and religious lines all at once. He names her past without shaming her, then quietly reveals He is the Messiah she has been waiting for.',
    aboutGod:
      'God seeks worshipers — He is not waiting for us to clean up first. He sees the parts of our story we hide and meets us there with dignity.',
    aboutJesus:
      'Jesus deliberately breaks every social rule to reach one woman with grace. He is the "living water" — the one who satisfies the thirst no relationship, success, or substance ever could.',
    background: {
      author: 'John, the apostle Jesus loved',
      when: 'Near the end of the first century',
      audience: 'A mixed church of Jews and Gentiles needing to know who Jesus really is',
      whyWritten: 'So that you might believe Jesus is the Christ, and that believing, you might have life in His name.',
    },
    reflection: [
      'Where in your life do you feel "seen" in the wrong way — exposed, judged, ashamed?',
      'Jesus didn\'t avoid this woman\'s story; He named it gently. What part of your story do you most need Him to name with love?',
      'What "well" have you been going back to for satisfaction that always leaves you thirsty again?',
    ],
    prayer:
      'Jesus, You crossed every line to find me. I bring You the parts of my story I usually hide. You are the living water — fill what nothing else has been able to fill.',
    actionStep:
      'Write down one thing you assume disqualifies you from God\'s love. Then read verse 26 out loud as Jesus\' answer to that thing.',
    quickTakeaway: 'Jesus already knows your whole story — and He\'s still the one talking to you.',
  }),

  r({
    id: 'prodigal-son',
    theme: 'Coming home to a Father who runs',
    oneLine: 'Before you finish your apology, He\'s already embracing you.',
    passageRef: 'Luke 15:11-24',
    passageTitle: 'The parable of the prodigal son',
    category: 'parable',
    characters: ['The father', 'The younger son', 'The older brother (later)'],
    verses: [
      { v: 11, text: 'And he said, A certain man had two sons:' },
      { v: 12, text: 'And the younger of them said to his father, Father, give me the portion of goods that falleth to me. And he divided unto them his living.' },
      { v: 13, text: 'And not many days after the younger son gathered all together, and took his journey into a far country, and there wasted his substance with riotous living.' },
      { v: 14, text: 'And when he had spent all, there arose a mighty famine in that land; and he began to be in want.' },
      { v: 15, text: 'And he went and joined himself to a citizen of that country; and he sent him into his fields to feed swine.' },
      { v: 17, text: 'And when he came to himself, he said, How many hired servants of my father\'s have bread enough and to spare, and I perish with hunger!' },
      { v: 18, text: 'I will arise and go to my father, and will say unto him, Father, I have sinned against heaven, and before thee,' },
      { v: 19, text: 'And am no more worthy to be called thy son: make me as one of thy hired servants.' },
      { v: 20, text: 'And he arose, and came to his father. But when he was yet a great way off, his father saw him, and had compassion, and ran, and fell on his neck, and kissed him.' },
      { v: 21, text: 'And the son said unto him, Father, I have sinned against heaven, and in thy sight, and am no more worthy to be called thy son.' },
      { v: 22, text: 'But the father said to his servants, Bring forth the best robe, and put it on him; and put a ring on his hand, and shoes on his feet:' },
      { v: 24, text: 'For this my son was dead, and is alive again; he was lost, and is found. And they began to be merry.' },
    ],
    whatsHappening:
      'Jesus tells this story to religious leaders who are scandalized that He eats with sinners. A son demands his inheritance early — effectively telling his father, "I wish you were dead." He blows everything and ends up feeding pigs (the lowest possible job for a Jewish boy). When he heads home, his father — a dignified Middle Eastern landowner who would never run in public — runs to him before he can finish his rehearsed apology.',
    aboutGod:
      'God is not the angry father standing on the porch with His arms crossed. He is the one watching the road, who runs at the first glimpse of you coming home.',
    aboutJesus:
      'Jesus tells this parable to defend His own behavior of welcoming sinners. He is showing us the heart of the Father — and the kind of welcome He came to make possible through the cross.',
    background: {
      author: 'Luke, a careful historian and physician',
      when: 'Around AD 60',
      audience: 'Theophilus and the wider church — many of them outsiders coming home to God',
      whyWritten: 'To give an orderly account of who Jesus is and the kind of people He came for.',
    },
    reflection: [
      'Which character do you most identify with right now — the runaway, the older brother, or the father?',
      'Notice the son\'s prepared speech vs. the father\'s response. What does that say about what God actually wants from your return?',
      'What "far country" have you been in? What would coming home look like today?',
    ],
    prayer:
      'Father, I have rehearsed my apology many times. Thank You that You are already running. I come home — not because I have it together, but because You are home.',
    actionStep:
      'Take one concrete step "toward home" today: an honest sentence in prayer, a verse opened, a Christian friend texted. One step toward the Father is enough.',
    quickTakeaway: 'God is not waiting on the porch. He is running down the road toward you.',
  }),

  r({
    id: 'lords-prayer',
    theme: 'How Jesus taught us to pray',
    oneLine: 'Not a formula — a way of relating to the Father.',
    passageRef: 'Matthew 6:5-13',
    passageTitle: 'The Lord\'s Prayer',
    category: 'teaching',
    characters: ['Jesus', 'His disciples', 'The crowd on the hillside'],
    verses: [
      { v: 5,  text: 'And when thou prayest, thou shalt not be as the hypocrites are: for they love to pray standing in the synagogues and in the corners of the streets, that they may be seen of men.' },
      { v: 6,  text: 'But thou, when thou prayest, enter into thy closet, and when thou hast shut thy door, pray to thy Father which is in secret; and thy Father which seeth in secret shall reward thee openly.' },
      { v: 7,  text: 'But when ye pray, use not vain repetitions, as the heathen do: for they think that they shall be heard for their much speaking.' },
      { v: 8,  text: 'Be not ye therefore like unto them: for your Father knoweth what things ye have need of, before ye ask him.' },
      { v: 9,  text: 'After this manner therefore pray ye: Our Father which art in heaven, Hallowed be thy name.' },
      { v: 10, text: 'Thy kingdom come. Thy will be done in earth, as it is in heaven.' },
      { v: 11, text: 'Give us this day our daily bread.' },
      { v: 12, text: 'And forgive us our debts, as we forgive our debtors.' },
      { v: 13, text: 'And lead us not into temptation, but deliver us from evil: For thine is the kingdom, and the power, and the glory, for ever. Amen.' },
    ],
    whatsHappening:
      'Jesus is teaching on a hillside in Galilee. He warns against praying to impress people or to wear God down with words. Then He hands His followers a simple pattern: address God as Father, honor Him, ask for His kingdom, ask for today\'s bread, deal with sin and forgiveness, and ask to be kept from evil. Six short lines that have shaped every century of Christian prayer since.',
    aboutGod:
      'God is "our Father" — close enough to be addressed personally, holy enough to be honored. He already knows what we need (v. 8); prayer is relationship, not information transfer.',
    aboutJesus:
      'Jesus gives us access we never had on our own. He calls God "Father" — and invites us to do the same. This is the prayer life He died to make possible.',
    background: {
      author: 'Matthew, a former tax collector turned apostle',
      when: 'Around AD 50–70',
      audience: 'Primarily Jewish believers who needed to see Jesus as the promised Messiah',
      whyWritten: 'To show how Jesus fulfills the Old Testament and teaches a new way of life in His kingdom.',
    },
    reflection: [
      'Which line of this prayer is hardest for you to mean honestly today?',
      '"Give us this day our daily bread." What would it look like to ask God for today\'s need only — not next month\'s?',
      'Verse 12 ties God\'s forgiveness to our forgiving others. Who is God bringing to mind?',
    ],
    prayer:
      'Father, teach me to pray. Not to perform — to relate. I want today\'s bread, today\'s grace, and today\'s help to forgive. Lead me in Your way.',
    actionStep:
      'Pray the Lord\'s Prayer slowly today — line by line. Pause after each line to put it in your own words.',
    quickTakeaway: 'Prayer is not performance. It is a child speaking to a Father who already knows.',
  }),

  r({
    id: 'gethsemane',
    theme: 'When obedience hurts',
    oneLine: 'Jesus shows us how to pray when we don\'t want what God wants.',
    passageRef: 'Luke 22:39-46',
    passageTitle: 'Jesus prays in Gethsemane',
    category: 'narrative',
    characters: ['Jesus', 'Peter, James, and John', 'An angel'],
    verses: [
      { v: 39, text: 'And he came out, and went, as he was wont, to the mount of Olives; and his disciples also followed him.' },
      { v: 40, text: 'And when he was at the place, he said unto them, Pray that ye enter not into temptation.' },
      { v: 41, text: 'And he was withdrawn from them about a stone\'s cast, and kneeled down, and prayed,' },
      { v: 42, text: 'Saying, Father, if thou be willing, remove this cup from me: nevertheless not my will, but thine, be done.' },
      { v: 43, text: 'And there appeared an angel unto him from heaven, strengthening him.' },
      { v: 44, text: 'And being in an agony he prayed more earnestly: and his sweat was as it were great drops of blood falling down to the ground.' },
      { v: 45, text: 'And when he rose up from prayer, and was come to his disciples, he found them sleeping for sorrow,' },
      { v: 46, text: 'And said unto them, Why sleep ye? rise and pray, lest ye enter into temptation.' },
    ],
    whatsHappening:
      'Hours before His arrest, Jesus goes to a familiar garden on the Mount of Olives. He kneels in the dirt and asks the Father — honestly — if there is any other way. He doesn\'t pretend He wants the cross. He prays the most honest prayer in human history: "Not my will, but Thine." An angel comes to strengthen Him. He goes from prayer straight into His betrayal.',
    aboutGod:
      'The Father does not always remove the cup, but He is present in the agony. He sends strength to those who keep praying through it.',
    aboutJesus:
      'Jesus was not faking calm. He was honest about the cost — and still chose obedience for love of you. This is the prayer that saved the world.',
    background: {
      author: 'Luke, a careful historian and physician',
      when: 'Around AD 60',
      audience: 'A mixed church of Gentiles and Jews learning to follow Jesus into hard places',
      whyWritten: 'To give a trustworthy, detailed account of Jesus — including His most human moments.',
    },
    reflection: [
      'Where in your life are you praying, "If there is any other way…"?',
      'Jesus prayed honestly before He prayed surrendered. What honest sentence have you been skipping with God?',
      'What does it change to know Jesus knows what hard obedience feels like — in His body?',
    ],
    prayer:
      'Father, like Jesus, I tell You honestly — I don\'t want this cup. And like Jesus, I want to mean: not my will, but Yours. Send the strength I need to obey.',
    actionStep:
      'Identify one place you\'ve been resisting God\'s "not yet" or "no." Pray Luke 22:42 over it word for word.',
    quickTakeaway: 'You can be honest about the pain and still say yes to the Father. Jesus did.',
  }),

  r({
    id: 'good-samaritan',
    theme: 'Loving the neighbor in front of you',
    oneLine: 'Mercy doesn\'t ask "who deserves it?" — it asks "who needs it?"',
    passageRef: 'Luke 10:25-37',
    passageTitle: 'The parable of the Good Samaritan',
    category: 'parable',
    characters: ['Jesus', 'A lawyer', 'A wounded man', 'A priest', 'A Levite', 'A Samaritan'],
    verses: [
      { v: 25, text: 'And, behold, a certain lawyer stood up, and tempted him, saying, Master, what shall I do to inherit eternal life?' },
      { v: 27, text: '...Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy strength, and with all thy mind; and thy neighbour as thyself.' },
      { v: 29, text: 'But he, willing to justify himself, said unto Jesus, And who is my neighbour?' },
      { v: 30, text: 'And Jesus answering said, A certain man went down from Jerusalem to Jericho, and fell among thieves, which stripped him of his raiment, and wounded him, and departed, leaving him half dead.' },
      { v: 31, text: 'And by chance there came down a certain priest that way: and when he saw him, he passed by on the other side.' },
      { v: 32, text: 'And likewise a Levite, when he was at the place, came and looked on him, and passed by on the other side.' },
      { v: 33, text: 'But a certain Samaritan, as he journeyed, came where he was: and when he saw him, he had compassion on him,' },
      { v: 34, text: 'And went to him, and bound up his wounds, pouring in oil and wine, and set him on his own beast, and brought him to an inn, and took care of him.' },
      { v: 36, text: 'Which now of these three, thinkest thou, was neighbour unto him that fell among the thieves?' },
      { v: 37, text: 'And he said, He that shewed mercy on him. Then said Jesus unto him, Go, and do thou likewise.' },
    ],
    whatsHappening:
      'A lawyer tries to corner Jesus by asking who actually qualifies as his "neighbor." Jesus answers with a story where the hero is the very kind of person his audience despised — a Samaritan. The religious professionals walk past the wounded man. The outsider stops, spends his own money, and risks his own safety. Jesus flips the question entirely: don\'t ask who your neighbor is — become one.',
    aboutGod:
      'God\'s mercy crosses every category we use to decide who counts. He is the God who notices the half-dead person nobody else stops for.',
    aboutJesus:
      'Jesus Himself is the ultimate Good Samaritan — He came to where we lay wounded and dying, picked us up at His own expense, and is paying the full cost of our healing.',
    background: {
      author: 'Luke, the physician',
      when: 'Around AD 60',
      audience: 'A broad church learning what it means to follow Jesus in a divided world',
      whyWritten: 'To highlight Jesus\' compassion for the outsider, the wounded, and the overlooked.',
    },
    reflection: [
      'Who is the "wounded person" in front of you this week that you\'ve been walking around?',
      'What category of people do you secretly think is less deserving of mercy? What would Jesus say to that?',
      'How has Jesus been the Good Samaritan to you?',
    ],
    prayer:
      'Jesus, You stopped for me when no one else would. Give me Your eyes for the person in front of me today. Make me a neighbor, not a passer-by.',
    actionStep:
      'Identify one specific person God has placed in your path who needs mercy. Take one tangible action toward them in the next 24 hours.',
    quickTakeaway: 'Don\'t ask who qualifies as your neighbor. Become one.',
  }),

  r({
    id: 'david-and-goliath',
    theme: 'Big problems, bigger God',
    oneLine: 'The battle is not yours — it belongs to the Lord.',
    passageRef: '1 Samuel 17:32-47',
    passageTitle: 'David and Goliath',
    category: 'narrative',
    characters: ['David', 'King Saul', 'Goliath', 'The armies of Israel and Philistia'],
    verses: [
      { v: 32, text: 'And David said to Saul, Let no man\'s heart fail because of him; thy servant will go and fight with this Philistine.' },
      { v: 33, text: 'And Saul said to David, Thou art not able to go against this Philistine to fight with him: for thou art but a youth, and he a man of war from his youth.' },
      { v: 34, text: 'And David said unto Saul, Thy servant kept his father\'s sheep, and there came a lion, and a bear, and took a lamb out of the flock:' },
      { v: 36, text: 'Thy servant slew both the lion and the bear: and this uncircumcised Philistine shall be as one of them, seeing he hath defied the armies of the living God.' },
      { v: 37, text: 'David said moreover, The Lord that delivered me out of the paw of the lion, and out of the paw of the bear, he will deliver me out of the hand of this Philistine...' },
      { v: 45, text: 'Then said David to the Philistine, Thou comest to me with a sword, and with a spear, and with a shield: but I come to thee in the name of the Lord of hosts, the God of the armies of Israel, whom thou hast defied.' },
      { v: 46, text: 'This day will the Lord deliver thee into mine hand...' },
      { v: 47, text: 'And all this assembly shall know that the Lord saveth not with sword and spear: for the battle is the Lord\'s, and he will give you into our hands.' },
    ],
    whatsHappening:
      'Israel\'s army is paralyzed by a nine-foot Philistine champion. King Saul, the tallest man in Israel, hides in his tent. A shepherd boy delivering lunch to his brothers hears the giant\'s mockery and is offended on God\'s behalf. David doesn\'t fight in his own strength or Saul\'s armor — he fights in the name of the Lord and reminds everyone watching: the battle is God\'s.',
    aboutGod:
      'God is not impressed by giants and not limited by who looks qualified. He often chooses the small, the overlooked, the youngest — to make it obvious the victory is His.',
    aboutJesus:
      'David, the shepherd-king, prefigures Jesus — the true Shepherd-King who stepped onto a battlefield no one else could fight and defeated our real enemy (sin and death) on a cross.',
    background: {
      author: 'Likely the prophet Samuel and later editors',
      when: 'Events around 1000 BC; recorded in the centuries after',
      audience: 'Israel — God\'s covenant people learning who really rules',
      whyWritten: 'To show how God establishes His kingdom through unlikely, faithful servants.',
    },
    reflection: [
      'What "giant" is currently mocking your faith and making you feel small?',
      'David fought from past experience of God\'s faithfulness (the lion and the bear). What past wins of God can you remember to face today\'s giant?',
      '"The battle is the Lord\'s." How does that change the way you\'ll show up to your fight this week?',
    ],
    prayer:
      'Lord of hosts, the giants in front of me are real, but You are bigger. I come not in my own strength but in Your name. The battle is Yours.',
    actionStep:
      'Write down one "giant" you\'re facing and one specific way God has shown up for you in the past. Carry both with you today.',
    quickTakeaway: 'The battle is not yours. Show up in the name of the Lord.',
  }),

  r({
    id: 'beatitudes',
    theme: 'The upside-down kingdom',
    oneLine: 'Jesus blesses the people the world overlooks.',
    passageRef: 'Matthew 5:1-12',
    passageTitle: 'The Beatitudes',
    category: 'teaching',
    characters: ['Jesus', 'The crowds', 'The disciples'],
    verses: [
      { v: 1, text: 'And seeing the multitudes, he went up into a mountain: and when he was set, his disciples came unto him:' },
      { v: 2, text: 'And he opened his mouth, and taught them, saying,' },
      { v: 3, text: 'Blessed are the poor in spirit: for theirs is the kingdom of heaven.' },
      { v: 4, text: 'Blessed are they that mourn: for they shall be comforted.' },
      { v: 5, text: 'Blessed are the meek: for they shall inherit the earth.' },
      { v: 6, text: 'Blessed are they which do hunger and thirst after righteousness: for they shall be filled.' },
      { v: 7, text: 'Blessed are the merciful: for they shall obtain mercy.' },
      { v: 8, text: 'Blessed are the pure in heart: for they shall see God.' },
      { v: 9, text: 'Blessed are the peacemakers: for they shall be called the children of God.' },
      { v: 10, text: 'Blessed are they which are persecuted for righteousness\' sake: for theirs is the kingdom of heaven.' },
      { v: 11, text: 'Blessed are ye, when men shall revile you, and persecute you, and say all manner of evil against you falsely, for my sake.' },
      { v: 12, text: 'Rejoice, and be exceeding glad: for great is your reward in heaven...' },
    ],
    whatsHappening:
      'Jesus sits down on a hillside — the posture of a rabbi about to teach — and opens His most famous sermon with eight blessings. Every category He names (the poor in spirit, the mourning, the meek, the merciful) is the opposite of who the world calls blessed. He is announcing what life looks like in His kingdom.',
    aboutGod:
      'God\'s definition of "blessed" is not what we think. He sees the small, the hurting, the merciful — and calls them His.',
    aboutJesus:
      'Jesus Himself lived every one of these blessings perfectly. He was poor in spirit, meek, merciful, persecuted — and He invites us into His life, not just His ethics.',
    background: {
      author: 'Matthew, the apostle',
      when: 'Around AD 50–70',
      audience: 'A church learning that Jesus\' kingdom looks nothing like Caesar\'s',
      whyWritten: 'To show Jesus as the new and better Moses, teaching the way of God\'s kingdom.',
    },
    reflection: [
      'Which of the eight blessings feels most like a stretch for you to believe today?',
      'Which one feels like it actually describes a season you\'ve been in?',
      'How would your week change if you genuinely believed Jesus calls these people "blessed"?',
    ],
    prayer:
      'Jesus, You bless the people the world overlooks. Reshape what I think a good life looks like. Make me the kind of person You call blessed.',
    actionStep:
      'Pick the beatitude that feels furthest from you. Pray it over your life every morning this week.',
    quickTakeaway: 'God\'s blessing rests on the people the world ignores — and Jesus is one of them.',
  }),

  r({
    id: 'jesus-feeds-5000',
    theme: 'When what you have is not enough',
    oneLine: 'Bring your little to Jesus, and watch what He does with it.',
    passageRef: 'John 6:5-14',
    passageTitle: 'Jesus feeds the five thousand',
    category: 'narrative',
    characters: ['Jesus', 'Philip', 'Andrew', 'A boy', 'A crowd of 5,000+'],
    verses: [
      { v: 5,  text: 'When Jesus then lifted up his eyes, and saw a great company come unto him, he saith unto Philip, Whence shall we buy bread, that these may eat?' },
      { v: 6,  text: 'And this he said to prove him: for he himself knew what he would do.' },
      { v: 7,  text: 'Philip answered him, Two hundred pennyworth of bread is not sufficient for them, that every one of them may take a little.' },
      { v: 8,  text: 'One of his disciples, Andrew, Simon Peter\'s brother, saith unto him,' },
      { v: 9,  text: 'There is a lad here, which hath five barley loaves, and two small fishes: but what are they among so many?' },
      { v: 10, text: 'And Jesus said, Make the men sit down. Now there was much grass in the place. So the men sat down, in number about five thousand.' },
      { v: 11, text: 'And Jesus took the loaves; and when he had given thanks, he distributed to the disciples, and the disciples to them that were set down; and likewise of the fishes as much as they would.' },
      { v: 12, text: 'When they were filled, he said unto his disciples, Gather up the fragments that remain, that nothing be lost.' },
      { v: 13, text: 'Therefore they gathered them together, and filled twelve baskets with the fragments of the five barley loaves...' },
      { v: 14, text: 'Then those men, when they had seen the miracle that Jesus did, said, This is of a truth that prophet that should come into the world.' },
    ],
    whatsHappening:
      'A massive crowd has followed Jesus to a remote hillside. Jesus tests Philip — "where will we buy bread?" Philip does the math and gives up. Andrew finds a boy\'s sack lunch — five small barley loaves and two fish, the food of the poor. Jesus takes the laughably small offering, gives thanks, and feeds everyone with twelve baskets left over.',
    aboutGod:
      'God is not limited by your math. He invites you to bring what little you have — and watch Him multiply it for His purposes.',
    aboutJesus:
      'Right after this, Jesus says, "I am the bread of life" (John 6:35). The miracle is a sign: Jesus Himself is what truly satisfies the hunger of the human soul.',
    background: {
      author: 'John, the apostle',
      when: 'Late first century',
      audience: 'Christians who needed to see Jesus\' divinity through "signs"',
      whyWritten: 'So that you might believe Jesus is the Christ — the bread of life.',
    },
    reflection: [
      'What feels too small in your life to even bring to Jesus right now?',
      'Andrew brought the loaves anyway, with a question mark. What would it look like to do the same with what you have?',
      'Where are you doing "Philip\'s math" — calculating that what God provides isn\'t enough?',
    ],
    prayer:
      'Jesus, here is my little. It is not impressive. Take it, give thanks over it, and use it however You will. I trust You to multiply what I cannot.',
    actionStep:
      'Name one "five loaves" you\'ve been withholding from God because it felt too small — time, money, talent, energy. Offer it specifically in prayer today.',
    quickTakeaway: 'Bring your little. Jesus does the multiplying.',
  }),

  r({
    id: 'romans-8-no-separation',
    theme: 'Nothing can separate you from God\'s love',
    oneLine: 'Not your worst day. Not your failure. Not anything.',
    passageRef: 'Romans 8:31-39',
    passageTitle: 'More than conquerors',
    category: 'letter',
    characters: ['Paul', 'The church in Rome'],
    verses: [
      { v: 31, text: 'What shall we then say to these things? If God be for us, who can be against us?' },
      { v: 32, text: 'He that spared not his own Son, but delivered him up for us all, how shall he not with him also freely give us all things?' },
      { v: 33, text: 'Who shall lay any thing to the charge of God\'s elect? It is God that justifieth.' },
      { v: 34, text: 'Who is he that condemneth? It is Christ that died, yea rather, that is risen again, who is even at the right hand of God, who also maketh intercession for us.' },
      { v: 35, text: 'Who shall separate us from the love of Christ? shall tribulation, or distress, or persecution, or famine, or nakedness, or peril, or sword?' },
      { v: 37, text: 'Nay, in all these things we are more than conquerors through him that loved us.' },
      { v: 38, text: 'For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come,' },
      { v: 39, text: 'Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.' },
    ],
    whatsHappening:
      'Paul has spent eight chapters laying out the gospel — sin, grace, justification, the Spirit. Now he reaches the crescendo. He asks a series of questions every guilty conscience asks: Who will accuse me? Who will condemn me? What can separate me from God? He answers each one with the cross and resurrection of Jesus. The answer is nothing. Not one thing in all creation.',
    aboutGod:
      'God is not stingy with His love. He gave His own Son. Everything else flows out of that one unmistakable fact.',
    aboutJesus:
      'Jesus is the proof. He died, He rose, He is interceding for you right now at the Father\'s right hand. Your standing with God doesn\'t depend on your performance — it depends on His.',
    background: {
      author: 'Paul, apostle and former persecutor of the church',
      when: 'Around AD 57',
      audience: 'A diverse house-church in Rome — Jews and Gentiles together',
      whyWritten: 'To unpack the gospel of grace and unify the church around it.',
    },
    reflection: [
      'What is on your personal list of things that you secretly fear might separate you from God\'s love?',
      'Paul names tribulation, distress, persecution. What is on your list this week?',
      'How does it land that Jesus is right now praying for you (v. 34)?',
    ],
    prayer:
      'Father, I have been carrying a quiet fear that I might disqualify myself. Thank You that nothing — not even me on my worst day — can separate me from Your love in Jesus.',
    actionStep:
      'Write your own "nor" list — the specific things you fear could cut you off from God. Read verses 38–39 over your list out loud.',
    quickTakeaway: 'Nothing — actually nothing — can separate you from the love of God in Christ Jesus.',
  }),
];

// Append the expansion libraries so the rotation covers months without
// repeating. Imported at the bottom to avoid circular imports.
import { dailyBreadExpansion } from './dailyBreadExpansion';
import { dailyBreadExpansion2 } from './dailyBreadExpansion2';
dailyBreadLibrary.push(...dailyBreadExpansion, ...dailyBreadExpansion2);

/** Returns today's reading, rotating daily through the library. */
export function getTodaysBread(now: Date = new Date()): DailyBreadReading {
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  const diff = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - start;
  const dayOfYear = Math.floor(diff / 86400000);
  return dailyBreadLibrary[dayOfYear % dailyBreadLibrary.length];
}

export function getBreadById(id: string): DailyBreadReading | undefined {
  return dailyBreadLibrary.find((b) => b.id === id);
}
