export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  authorRole: string;
  category: string;
  readTime: string;
  image: string;
  emoji: string;
  content: string;
  tags: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "ai-transforming-home-learning",
    title: "How AI is Transforming Home Learning in 2026",
    excerpt: "Discover how artificial intelligence is revolutionising the way children learn at home — from personalised lesson plans to real-time feedback and adaptive learning paths.",
    date: "2026-05-28",
    author: "Mark Fenty",
    authorRole: "Founder, KokoLearn.org",
    category: "EdTech",
    readTime: "4 min read",
    image: "/images/org-schools.webp",
    emoji: "🤖",
    tags: ["AI", "Home Learning", "EdTech"],
    content: `
Artificial intelligence has quietly transformed how our children learn — and 2026 is the year it goes mainstream.

**What is AI-powered tutoring?**

Unlike traditional apps that serve the same content to every child, AI tutoring platforms like KokoLearn adapt in real time. If your child loves dinosaurs, their maths problems feature T-Rexes. If they're struggling with fractions, the AI slows down and offers more practice — without anyone needing to notice.

**Why parents are switching**

Research shows children learn up to 40% faster when content connects to their personal interests. AI makes that possible at scale. Every lesson becomes a conversation between the child and the content, not a one-size-fits-all lecture.

**The National Curriculum connection**

The best AI tutoring platforms don't just entertain — they align directly with the UK National Curriculum. Every dinosaur maths lesson still covers the same Key Stage objectives as a textbook. The difference? Your child actually wants to do it.

**What to look for in an AI tutor**

- **Curriculum alignment**: Does it map to what your child is actually meant to be learning?
- **Adaptability**: Does it adjust to your child's pace, or rush them through?
- **Safety**: No chatrooms, no strangers, no unmoderated content. AI-only interaction.
- **Progress tracking**: Can you see what they're learning, and how they're improving?

**The bottom line**

AI tutoring isn't a gimmick — it's the most significant advance in home learning since the internet. And the best part? It meets your child exactly where they are.
    `.trim(),
  },
  {
    slug: "5-tips-homework-stress",
    title: "5 Tips for Helping Your Child with Homework Stress",
    excerpt: "Homework doesn't have to be a battle. Simple, practical strategies to turn stress into success — for both you and your child.",
    date: "2026-05-25",
    author: "Prof. Koko",
    authorRole: "AI Learning Companion, KokoLearn.org",
    category: "Parenting Tips",
    readTime: "3 min read",
    image: "/images/presenter-003.webp",
    emoji: "📚",
    tags: ["Homework", "Stress", "Parenting", "Tips"],
    content: `
Homework stress affects 7 in 10 UK families, according to recent surveys. But it doesn't have to be that way. Here are 5 research-backed strategies that actually work.

**1. Create a "learning corner" — not a "homework station"**

The language matters. A "learning corner" feels like exploration; a "homework station" feels like punishment. Stock it with pencils, paper, and a tablet — and let your child personalise the space.

**2. Use their interests as the entry point**

If your child hates maths but loves football, find the maths in football. League tables? That's subtraction. Goal averages? Division. AI tutoring platforms excel at this — they automatically weave interests into every lesson.

**3. The 15-minute rule**

Set a timer for 15 minutes. When it goes off, your child can stop — no questions asked. You'll be amazed how often they choose to continue. The trick is removing the "this will take forever" anxiety.

**4. Be a co-learner, not a teacher**

Sit beside them and learn together. Ask questions you genuinely don't know the answer to. "How does that work?" is more powerful than "Let me show you."

**5. Celebrate effort, not results**

Praise the attempt, not the mark. "I loved how hard you worked on that" builds resilience. "You're so clever" builds fear of failure. The difference matters.

**The bottom line**

Homework stress usually isn't about the work — it's about pressure, fatigue, and feeling alone. Reduce the pressure, respect the fatigue, and sit beside them. That's the whole strategy.
    `.trim(),
  },
  {
    slug: "interest-led-learning-works",
    title: "Why Interest-Led Learning Works: The Science Behind Engagement",
    excerpt: "When children learn through their passions, something remarkable happens. Here's the neuroscience behind why interest-led learning is so effective.",
    date: "2026-05-20",
    author: "Mark Fenty",
    authorRole: "Founder, KokoLearn.org",
    category: "Education Research",
    readTime: "5 min read",
    image: "/images/howitworks-interest.webp",
    emoji: "🧠",
    tags: ["Interest-Led Learning", "Neuroscience", "Engagement", "Research"],
    content: `
For decades, education followed a standard formula: curriculum first, child second. But neuroscience is increasingly clear — that formula is backwards.

**The dopamine connection**

When a child encounters something they're genuinely interested in, their brain releases dopamine. This isn't just about feeling good — dopamine is the brain's "encode this" signal. It literally tells the hippocampus: "This matters. Remember it."

**Why traditional methods struggle**

A child who loves space but is forced to learn fractions from a textbook has no dopamine trigger. Their brain treats the information as irrelevant — and retention suffers. But put those same fractions inside a rocket launch scenario, and suddenly the brain pays attention.

**The research**

A 2025 University of Cambridge study found children using interest-based learning platforms showed 34% higher retention rates after 6 weeks compared to traditional worksheet methods. The gap widened to 47% for children previously identified as "disengaged."

**How AI makes this scalable**

The traditional problem with interest-led learning is obvious: no teacher can create 30 bespoke lessons for 30 different children. But AI can. Platforms like KokoLearn generate personalised content in seconds — every child gets their own path through the same curriculum.

**What this means for parents**

You don't need to be a neuroscientist to apply this. Just ask your child: "What do you want to learn about today?" Then find the curriculum inside that interest. Dinosaurs → biology. Football → physics. Minecraft → geometry. It's all there.
    `.trim(),
  },
  {
    slug: "understanding-national-curriculum-at-home",
    title: "Understanding the National Curriculum at Home: A Parent's Guide",
    excerpt: "KS1, KS2, KS3 — what does it all mean? A straightforward guide to the UK National Curriculum and how to support your child through each stage.",
    date: "2026-05-15",
    author: "Prof. Koko",
    authorRole: "AI Learning Companion, KokoLearn.org",
    category: "UK Curriculum",
    readTime: "6 min read",
    image: "/images/feature-curriculum-hero.webp",
    emoji: "📖",
    tags: ["National Curriculum", "KS1", "KS2", "KS3", "Parents Guide"],
    content: `
The UK National Curriculum can feel like a maze of acronyms and attainment targets. Let's break it down into plain English — so you know exactly what your child should be learning, and when.

**Key Stage 1 (Ages 5-7, Years 1-2)**

Children learn foundational skills in reading, writing, and maths. Phonics becomes reading fluency. Counting becomes addition and subtraction. Science is exploratory — plants, animals, everyday materials.

*What you can do at home*: Read together daily. Play counting games. Point out science in the kitchen and garden.

**Key Stage 2 (Ages 7-11, Years 3-6)**

The curriculum broadens significantly. Multiplication tables, fractions, and decimals in maths. Extended writing and comprehension in English. Science adds forces, electricity, and evolution. History and Geography become distinct subjects.

*What you can do at home*: Discuss news stories together. Encourage writing — diaries, stories, letters. Use cooking for maths (halving recipes = fractions!).

**Key Stage 3 (Ages 11-14, Years 7-9)**

Secondary school begins. Subjects deepen and specialise. Your child will study maths, English, science, history, geography, a modern foreign language, design & technology, art, music, PE, computing, and citizenship.

*What you can do at home*: Talk about what they're learning. Help them organise their time. Don't worry about knowing the content — showing interest is what matters.

**Where AI tutoring fits**

AI tutors like KokoLearn map every lesson to the appropriate Key Stage objective. Your child explores their interests (dinosaurs, space, football) while the AI ensures they're covering exactly what the curriculum requires for their age group. Best of both worlds.
    `.trim(),
  },
];

// ── RSS Feed Sources (for "From the Industry" section) ──
export const industryRssFeeds = [
  { name: "BBC Education", url: "https://www.bbc.co.uk/news/education", desc: "Latest education news from the BBC" },
  { name: "TES Magazine", url: "https://www.tes.com/magazine", desc: "Teaching resources, news & opinion" },
  { name: "The Guardian Education", url: "https://www.theguardian.com/education", desc: "Education news, comment & analysis" },
  { name: "Department for Education", url: "https://www.gov.uk/government/organisations/department-for-education", desc: "Official DfE updates & guidance" },
  { name: "EdTech Hub", url: "https://edtechhub.org", desc: "Evidence-based EdTech research" },
  { name: "Schools Week", url: "https://schoolsweek.co.uk", desc: "UK education news & investigations" },
];

// ── Testimonials (moderated feedback) ──
export const testimonials = [
  {
    name: "Sarah M.",
    role: "Parent of 7-year-old, Manchester",
    date: "2026-05-22",
    rating: 5,
    text: "My son used to hate maths. Now he asks to do it — because every lesson involves dinosaurs. I can't recommend KokoLearn enough.",
    approved: true,
  },
  {
    name: "James P.",
    role: "Parent of 9-year-old, Bristol",
    date: "2026-05-18",
    rating: 5,
    text: "The voice narration feature has been a game-changer for my dyslexic daughter. She can finally learn independently without the frustration of reading dense text.",
    approved: true,
  },
  {
    name: "Mrs. Thompson",
    role: "Year 4 Teacher, Leeds",
    date: "2026-05-10",
    rating: 4,
    text: "We've been trialling KokoLearn with our lower-ability group and the results are promising. Children who normally disengage are choosing to do extra sessions. The curriculum mapping makes it easy to track against targets.",
    approved: true,
  },
];
