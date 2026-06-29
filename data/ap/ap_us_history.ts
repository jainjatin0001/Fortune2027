import type { DemoQuestion } from '@/types';

export const AP_US_HISTORY: DemoQuestion[] = [
  {
    id: 'ap-ush-01',
    subject: 'AP US History',
    topic: 'Colonial Era',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'Which best describes the primary economic basis of the Southern colonies in the 17th and early 18th centuries?',
    options: [
      { id: 'a', content: 'Small-scale subsistence farming and fur trade' },
      { id: 'b', content: 'Large-scale plantation agriculture relying on enslaved labor to produce cash crops' },
      { id: 'c', content: 'Maritime trade, fishing, and shipbuilding' },
      { id: 'd', content: 'Manufacturing and early industrialization' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Southern colonies (Virginia, Maryland, Carolina) developed plantation economies centered on tobacco, rice, and indigo. These required large labor forces — initially indentured servants, then increasingly enslaved Africans. Maritime trade characterized New England; manufacturing emerged much later.',
    points: 1,
    tags: ['colonial-era', 'southern-colonies', 'slavery', 'ap-ush'],
  },
  {
    id: 'ap-ush-02',
    subject: 'AP US History',
    topic: 'American Revolution',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'The colonial slogan "No taxation without representation" primarily reflected colonists\' objection to:',
    options: [
      { id: 'a', content: 'The total amount of taxes imposed by Parliament' },
      { id: 'b', content: 'Parliament\'s right to legislate for colonies without colonial representatives in Parliament' },
      { id: 'c', content: 'The use of tax revenues to fund the Church of England' },
      { id: 'd', content: 'Taxes on trade with France and Spain' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The constitutional argument was about legitimacy, not just tax levels. Colonists argued that Parliament had no right to tax them — or legislate for internal colonial affairs — because they had no elected representatives there. The Stamp Act (1765) galvanized this argument into organized resistance.',
    points: 2,
    tags: ['american-revolution', 'taxation', 'parliament', 'ap-ush'],
  },
  {
    id: 'ap-ush-03',
    subject: 'AP US History',
    topic: 'Constitution & Federalism',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'The Great Compromise at the Constitutional Convention (1787) resolved the dispute over congressional representation by:',
    options: [
      { id: 'a', content: 'Giving equal representation to all states in a unicameral legislature' },
      { id: 'b', content: 'Creating a bicameral legislature — equal state representation in the Senate, population-based in the House' },
      { id: 'c', content: 'Giving large states more senators and small states more representatives' },
      { id: 'd', content: 'Basing all representation on land area rather than population' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The Connecticut Compromise (Great Compromise) created a two-house (bicameral) Congress: the Senate gives each state equal representation (2 senators), while the House of Representatives apportions seats by population. This balanced large-state and small-state interests.',
    points: 2,
    tags: ['constitution', 'great-compromise', 'congress', 'ap-ush'],
  },
  {
    id: 'ap-ush-04',
    subject: 'AP US History',
    topic: 'Jacksonian Era',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'The Indian Removal Act (1830) resulted in:',
    options: [
      { id: 'a', content: 'Granting citizenship rights to Native Americans in exchange for land cessions' },
      { id: 'b', content: 'The forced relocation of tens of thousands of Native Americans to land west of the Mississippi, with enormous loss of life' },
      { id: 'c', content: 'A negotiated treaty that gave Native Americans permanent reservations in the Southeast' },
      { id: 'd', content: 'The dissolution of the Bureau of Indian Affairs' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The Indian Removal Act authorized President Jackson to negotiate relocations of Native peoples east of the Mississippi. The resulting Trail of Tears (1838–1839) forced the Cherokee and others to march hundreds of miles to Oklahoma; thousands died from cold, disease, and starvation.',
    points: 2,
    tags: ['indian-removal', 'jackson', 'trail-of-tears', 'ap-ush'],
  },
  {
    id: 'ap-ush-05',
    subject: 'AP US History',
    topic: 'Reconstruction',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      'The Compromise of 1877 effectively ended Reconstruction because it:',
    options: [
      { id: 'a', content: 'Declared Reconstruction unconstitutional' },
      { id: 'b', content: 'Led to the withdrawal of federal troops from the South, leaving freedpeople without federal protection' },
      { id: 'c', content: 'Reversed the 14th and 15th Amendments' },
      { id: 'd', content: 'Created the sharecropping system as a replacement for slavery' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The 1877 Compromise resolved the disputed Hayes-Tilden election: Republicans kept the presidency; in exchange, federal troops were withdrawn from the South. Without military enforcement, Reconstruction governments collapsed and Southern states implemented Jim Crow segregation and disenfranchisement.',
    points: 2,
    tags: ['reconstruction', 'compromise-of-1877', 'jim-crow', 'ap-ush'],
  },
  {
    id: 'ap-ush-06',
    subject: 'AP US History',
    topic: 'Gilded Age & Imperialism',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'The Spanish-American War (1898) marked a turning point in US foreign policy because it:',
    options: [
      { id: 'a', content: 'Was the first US war fought entirely on foreign soil' },
      { id: 'b', content: 'Established the US as an imperial power with overseas territories including Puerto Rico, Guam, and the Philippines' },
      { id: 'c', content: 'Led to the US joining the League of Nations' },
      { id: 'd', content: 'Ended European colonialism in Latin America' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The Treaty of Paris (1898) transferred Puerto Rico, Guam, and the Philippines from Spain to the US, making America a formal imperial power. The Philippine-American War followed as Filipinos resisted American control. This represented a decisive break from traditional non-interventionism.',
    points: 1,
    tags: ['imperialism', 'spanish-american-war', 'foreign-policy', 'ap-ush'],
  },
  {
    id: 'ap-ush-07',
    subject: 'AP US History',
    topic: 'World War I & 1920s',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'President Wilson\'s Fourteen Points proposal was primarily aimed at:',
    options: [
      { id: 'a', content: 'Securing US territorial gains after WWI' },
      { id: 'b', content: 'Establishing a framework for a lasting, just peace and a League of Nations to prevent future wars' },
      { id: 'c', content: 'Punishing Germany with reparations and territorial losses' },
      { id: 'd', content: 'Expanding US military presence in Europe' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Wilson\'s Fourteen Points (1918) outlined idealistic war aims: national self-determination, freedom of the seas, open diplomacy, arms reduction, and a League of Nations for collective security. The harsh Versailles Treaty (1919) largely ignored these points — Wilson\'s greatest disappointment was the Senate\'s rejection of US League membership.',
    points: 2,
    tags: ['wwi', 'fourteen-points', 'wilson', 'league-of-nations', 'ap-ush'],
  },
  {
    id: 'ap-ush-08',
    subject: 'AP US History',
    topic: 'Great Depression & New Deal',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'Which best characterizes the historical debate over the New Deal\'s effectiveness?',
    options: [
      { id: 'a', content: 'Historians unanimously agree the New Deal fully ended the Great Depression' },
      { id: 'b', content: 'The New Deal expanded the federal government\'s role and provided relief, but unemployment remained high until WWII spending finally ended the Depression' },
      { id: 'c', content: 'The New Deal primarily benefited large corporations, not ordinary Americans' },
      { id: 'd', content: 'The New Deal was declared unconstitutional in its entirety by the Supreme Court' },
    ],
    correctAnswerId: 'b',
    explanation:
      'Mainstream historical consensus: the New Deal provided crucial relief and reform and expanded federal power, but unemployment remained around 14-17% through the late 1930s. Full employment came only with WWII mobilization. Some programs were ruled unconstitutional (e.g., the original NRA), but not the entire New Deal.',
    points: 2,
    tags: ['great-depression', 'new-deal', 'fdr', 'ap-ush'],
  },
  {
    id: 'ap-ush-09',
    subject: 'AP US History',
    topic: 'Cold War Domestic Politics',
    category: 'AP_EXAM',
    difficulty: 'HARD',
    question:
      'McCarthyism (early 1950s) is most directly associated with:',
    options: [
      { id: 'a', content: 'A foreign policy of confronting Soviet expansion militarily' },
      { id: 'b', content: 'A domestic campaign of aggressive, often unfounded accusations of communist infiltration in government, media, and other institutions' },
      { id: 'c', content: 'A Marshall Plan-style economic aid program for Asian nations' },
      { id: 'd', content: 'The Congressional investigation of the Pentagon Papers leak' },
    ],
    correctAnswerId: 'b',
    explanation:
      "Senator Joseph McCarthy exploited Cold War anxieties to make sweeping accusations of communist subversion — destroying careers with little evidence. Army-McCarthy hearings (1954) exposed his methods; his censure by the Senate ended his influence. The term 'McCarthyism' became synonymous with political witch hunts.",
    points: 2,
    tags: ['mccarthyism', 'cold-war', 'red-scare', 'ap-ush'],
  },
  {
    id: 'ap-ush-10',
    subject: 'AP US History',
    topic: 'Civil Rights Movement',
    category: 'AP_EXAM',
    difficulty: 'MEDIUM',
    question:
      'The Civil Rights Act of 1964 was significant primarily because it:',
    options: [
      { id: 'a', content: 'Gave African Americans the right to vote for the first time' },
      { id: 'b', content: 'Prohibited discrimination based on race, color, religion, sex, or national origin in public accommodations and employment' },
      { id: 'c', content: 'Ended segregation in the military' },
      { id: 'd', content: 'Established affirmative action quotas in federal employment' },
    ],
    correctAnswerId: 'b',
    explanation:
      'The Civil Rights Act of 1964 banned discrimination in public accommodations (hotels, restaurants, theaters) and prohibited employment discrimination. The Voting Rights Act (1965) addressed voting access. Military desegregation came via Executive Order 9981 (1948). The Act created the EEOC but did not establish quotas.',
    points: 2,
    tags: ['civil-rights', 'civil-rights-act-1964', 'ap-ush'],
  },
];
