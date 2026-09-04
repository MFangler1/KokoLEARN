// ── UK National Curriculum Objectives (KS1 & KS2) ──

export type KeyStage = "KS1" | "KS2" | "KS3";
export type Subject = "Maths" | "English" | "Science" | "Geography" | "History" | "Art" | "Computing" | "AI";
export const SUBJECTS: readonly Subject[] = ["Maths", "English", "Science", "Geography", "History", "Art", "Computing", "AI"];
export type YearGroup = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface CurriculumObjective {
  id: string;
  keyStage: KeyStage;
  yearGroup: YearGroup;
  subject: Subject;
  topic: string;
  objective: string;
  difficulty: 1 | 2 | 3; // 1=easiest within KS, 3=hardest
  ageRange: [number, number]; // e.g. [5, 7] for KS1
}

const curriculum: CurriculumObjective[] = [
  // ════════════ KS1 — Maths ════════════
  { id: "KS1-M-01", keyStage: "KS1", yearGroup: 1, subject: "Maths", topic: "Number & Place Value", objective: "Count to and across 100, forwards and backwards, from any given number", difficulty: 1, ageRange: [5, 7] },
  { id: "KS1-M-02", keyStage: "KS1", yearGroup: 1, subject: "Maths", topic: "Number & Place Value", objective: "Identify one more and one less than a given number", difficulty: 1, ageRange: [5, 7] },
  { id: "KS1-M-03", keyStage: "KS1", yearGroup: 1, subject: "Maths", topic: "Addition & Subtraction", objective: "Add and subtract one-digit numbers to 10, including zero", difficulty: 1, ageRange: [5, 7] },
  { id: "KS1-M-04", keyStage: "KS1", yearGroup: 1, subject: "Maths", topic: "Addition & Subtraction", objective: "Solve simple one-step problems involving addition and subtraction", difficulty: 2, ageRange: [5, 7] },
  { id: "KS1-M-05", keyStage: "KS1", yearGroup: 1, subject: "Maths", topic: "Multiplication & Division", objective: "Count in multiples of 2, 5, and 10", difficulty: 2, ageRange: [5, 7] },
  { id: "KS1-M-06", keyStage: "KS1", yearGroup: 1, subject: "Maths", topic: "Fractions", objective: "Recognise, find and name a half as one of two equal parts", difficulty: 2, ageRange: [5, 7] },
  { id: "KS1-M-07", keyStage: "KS1", yearGroup: 1, subject: "Maths", topic: "Measurement", objective: "Measure and compare lengths, heights, and weights using non-standard units", difficulty: 2, ageRange: [5, 7] },
  { id: "KS1-M-08", keyStage: "KS1", yearGroup: 1, subject: "Maths", topic: "Geometry", objective: "Recognise and name common 2D shapes (circle, triangle, square, rectangle)", difficulty: 1, ageRange: [5, 7] },
  { id: "KS1-M-09", keyStage: "KS1", yearGroup: 1, subject: "Maths", topic: "Geometry", objective: "Recognise and name common 3D shapes (cube, sphere, cylinder)", difficulty: 1, ageRange: [5, 7] },
  { id: "KS1-M-10", keyStage: "KS1", yearGroup: 2, subject: "Maths", topic: "Addition & Subtraction", objective: "Add and subtract two-digit numbers and ones, and two-digit numbers and tens", difficulty: 2, ageRange: [5, 7] },
  { id: "KS1-M-11", keyStage: "KS1", yearGroup: 2, subject: "Maths", topic: "Addition & Subtraction", objective: "Recall and use addition and subtraction facts to 20 fluently", difficulty: 2, ageRange: [5, 7] },
  { id: "KS1-M-12", keyStage: "KS1", yearGroup: 2, subject: "Maths", topic: "Multiplication & Division", objective: "Recall and use multiplication facts for the 2, 5, and 10 times tables", difficulty: 2, ageRange: [5, 7] },
  { id: "KS1-M-13", keyStage: "KS1", yearGroup: 2, subject: "Maths", topic: "Fractions", objective: "Recognise, find, name and write fractions 1/3, 1/4, 2/4 and 3/4 of a set of objects", difficulty: 3, ageRange: [5, 7] },
  { id: "KS1-M-14", keyStage: "KS1", yearGroup: 2, subject: "Maths", topic: "Measurement", objective: "Tell the time to the nearest 5 minutes, including quarter past/to", difficulty: 3, ageRange: [5, 7] },
  { id: "KS1-M-15", keyStage: "KS1", yearGroup: 2, subject: "Maths", topic: "Statistics", objective: "Interpret and construct simple pictograms and tally charts", difficulty: 2, ageRange: [5, 7] },

  // ════════════ KS2 — Maths ════════════
  { id: "KS2-M-01", keyStage: "KS2", yearGroup: 3, subject: "Maths", topic: "Number & Place Value", objective: "Count from 0 in multiples of 4, 8, 50, and 100", difficulty: 1, ageRange: [7, 11] },
  { id: "KS2-M-02", keyStage: "KS2", yearGroup: 3, subject: "Maths", topic: "Number & Place Value", objective: "Compare and order numbers up to 1,000", difficulty: 1, ageRange: [7, 11] },
  { id: "KS2-M-03", keyStage: "KS2", yearGroup: 3, subject: "Maths", topic: "Addition & Subtraction", objective: "Add and subtract numbers mentally with up to three digits", difficulty: 2, ageRange: [7, 11] },
  { id: "KS2-M-04", keyStage: "KS2", yearGroup: 3, subject: "Maths", topic: "Multiplication & Division", objective: "Recall multiplication facts for the 3, 4, and 8 times tables", difficulty: 2, ageRange: [7, 11] },
  { id: "KS2-M-05", keyStage: "KS2", yearGroup: 3, subject: "Maths", topic: "Fractions", objective: "Recognise and show fractions as numbers and find fractions of a set", difficulty: 2, ageRange: [7, 11] },
  { id: "KS2-M-06", keyStage: "KS2", yearGroup: 4, subject: "Maths", topic: "Number & Place Value", objective: "Count in multiples of 6, 7, 9, 25, and 1,000", difficulty: 1, ageRange: [7, 11] },
  { id: "KS2-M-07", keyStage: "KS2", yearGroup: 4, subject: "Maths", topic: "Number & Place Value", objective: "Round any number to the nearest 10, 100, or 1,000", difficulty: 2, ageRange: [7, 11] },
  { id: "KS2-M-08", keyStage: "KS2", yearGroup: 4, subject: "Maths", topic: "Addition & Subtraction", objective: "Add and subtract numbers with up to 4 digits using formal written methods", difficulty: 2, ageRange: [7, 11] },
  { id: "KS2-M-09", keyStage: "KS2", yearGroup: 4, subject: "Maths", topic: "Multiplication & Division", objective: "Recall multiplication facts up to 12 × 12 and corresponding division facts", difficulty: 2, ageRange: [7, 11] },
  { id: "KS2-M-10", keyStage: "KS2", yearGroup: 4, subject: "Maths", topic: "Decimals", objective: "Recognise and write decimal equivalents of tenths and hundredths", difficulty: 3, ageRange: [7, 11] },
  { id: "KS2-M-11", keyStage: "KS2", yearGroup: 5, subject: "Maths", topic: "Number & Place Value", objective: "Read, write, order, and compare numbers to at least 1,000,000", difficulty: 2, ageRange: [7, 11] },
  { id: "KS2-M-12", keyStage: "KS2", yearGroup: 5, subject: "Maths", topic: "Multiplication & Division", objective: "Multiply numbers up to 4 digits by a one- or two-digit number using formal written methods", difficulty: 3, ageRange: [7, 11] },
  { id: "KS2-M-13", keyStage: "KS2", yearGroup: 5, subject: "Maths", topic: "Fractions", objective: "Add and subtract fractions with the same denominator and denominators that are multiples", difficulty: 3, ageRange: [7, 11] },
  { id: "KS2-M-14", keyStage: "KS2", yearGroup: 6, subject: "Maths", topic: "Number & Place Value", objective: "Use negative numbers in context and calculate intervals across zero", difficulty: 3, ageRange: [7, 11] },
  { id: "KS2-M-15", keyStage: "KS2", yearGroup: 6, subject: "Maths", topic: "Fractions, Decimals & Percentages", objective: "Calculate percentages of quantities and understand percentage as 'number of parts per 100'", difficulty: 3, ageRange: [7, 11] },
  { id: "KS2-M-16", keyStage: "KS2", yearGroup: 6, subject: "Maths", topic: "Algebra", objective: "Express missing number problems algebraically and find pairs of numbers that satisfy equations", difficulty: 3, ageRange: [7, 11] },
  { id: "KS2-M-17", keyStage: "KS2", yearGroup: 6, subject: "Maths", topic: "Ratio & Proportion", objective: "Solve problems involving the relative sizes of two quantities using ratio and proportion", difficulty: 3, ageRange: [7, 11] },

  // ════════════ KS1 — English ════════════
  { id: "KS1-E-01", keyStage: "KS1", yearGroup: 1, subject: "English", topic: "Phonics & Reading", objective: "Apply phonic knowledge to decode words and read aloud accurately", difficulty: 1, ageRange: [5, 7] },
  { id: "KS1-E-02", keyStage: "KS1", yearGroup: 1, subject: "English", topic: "Reading Comprehension", objective: "Answer simple questions about what they have read, retelling key events", difficulty: 1, ageRange: [5, 7] },
  { id: "KS1-E-03", keyStage: "KS1", yearGroup: 1, subject: "English", topic: "Writing", objective: "Write simple sentences that can be read by themselves and others", difficulty: 1, ageRange: [5, 7] },
  { id: "KS1-E-04", keyStage: "KS1", yearGroup: 1, subject: "English", topic: "Grammar", objective: "Identify and use nouns, verbs, and adjectives in sentences", difficulty: 1, ageRange: [5, 7] },
  { id: "KS1-E-05", keyStage: "KS1", yearGroup: 1, subject: "English", topic: "Punctuation", objective: "Use capital letters and full stops correctly in sentences", difficulty: 1, ageRange: [5, 7] },
  { id: "KS1-E-06", keyStage: "KS1", yearGroup: 2, subject: "English", topic: "Reading Comprehension", objective: "Make predictions about what might happen next in a story based on what has been read", difficulty: 2, ageRange: [5, 7] },
  { id: "KS1-E-07", keyStage: "KS1", yearGroup: 2, subject: "English", topic: "Writing", objective: "Write stories with a clear beginning, middle, and end", difficulty: 2, ageRange: [5, 7] },
  { id: "KS1-E-08", keyStage: "KS1", yearGroup: 2, subject: "English", topic: "Grammar", objective: "Use the present and past tense correctly in writing", difficulty: 2, ageRange: [5, 7] },
  { id: "KS1-E-09", keyStage: "KS1", yearGroup: 2, subject: "English", topic: "Punctuation", objective: "Use question marks, exclamation marks, and commas in lists", difficulty: 2, ageRange: [5, 7] },
  { id: "KS1-E-10", keyStage: "KS1", yearGroup: 2, subject: "English", topic: "Spelling", objective: "Spell common exception words correctly in their writing", difficulty: 2, ageRange: [5, 7] },

  // ════════════ KS2 — English ════════════
  { id: "KS2-E-01", keyStage: "KS2", yearGroup: 3, subject: "English", topic: "Reading Comprehension", objective: "Explain the meaning of words in context and answer inferential questions", difficulty: 1, ageRange: [7, 11] },
  { id: "KS2-E-02", keyStage: "KS2", yearGroup: 3, subject: "English", topic: "Writing", objective: "Write narratives with settings, characters, and plot", difficulty: 2, ageRange: [7, 11] },
  { id: "KS2-E-03", keyStage: "KS2", yearGroup: 3, subject: "English", topic: "Grammar", objective: "Use conjunctions (when, if, because, although) to join clauses", difficulty: 2, ageRange: [7, 11] },
  { id: "KS2-E-04", keyStage: "KS2", yearGroup: 4, subject: "English", topic: "Grammar", objective: "Use fronted adverbials and commas after them", difficulty: 2, ageRange: [7, 11] },
  { id: "KS2-E-05", keyStage: "KS2", yearGroup: 4, subject: "English", topic: "Punctuation", objective: "Use inverted commas (speech marks) to punctuate direct speech", difficulty: 2, ageRange: [7, 11] },
  { id: "KS2-E-06", keyStage: "KS2", yearGroup: 5, subject: "English", topic: "Reading Comprehension", objective: "Summarise the main ideas from a text identifying key details", difficulty: 2, ageRange: [7, 11] },
  { id: "KS2-E-07", keyStage: "KS2", yearGroup: 5, subject: "English", topic: "Grammar", objective: "Use relative clauses beginning with who, which, where, when, whose", difficulty: 3, ageRange: [7, 11] },
  { id: "KS2-E-08", keyStage: "KS2", yearGroup: 6, subject: "English", topic: "Grammar", objective: "Identify and use the passive voice in sentences", difficulty: 3, ageRange: [7, 11] },
  { id: "KS2-E-09", keyStage: "KS2", yearGroup: 6, subject: "English", topic: "Punctuation", objective: "Use semicolons, colons, and dashes to separate clauses", difficulty: 3, ageRange: [7, 11] },

  // ════════════ KS1 — Science ════════════
  { id: "KS1-S-01", keyStage: "KS1", yearGroup: 1, subject: "Science", topic: "Plants", objective: "Identify and name a variety of common plants, including garden and wild plants", difficulty: 1, ageRange: [5, 7] },
  { id: "KS1-S-02", keyStage: "KS1", yearGroup: 1, subject: "Science", topic: "Animals", objective: "Identify and name common animals including fish, amphibians, reptiles, birds, and mammals", difficulty: 1, ageRange: [5, 7] },
  { id: "KS1-S-03", keyStage: "KS1", yearGroup: 1, subject: "Science", topic: "Humans", objective: "Identify and name basic parts of the human body", difficulty: 1, ageRange: [5, 7] },
  { id: "KS1-S-04", keyStage: "KS1", yearGroup: 1, subject: "Science", topic: "Materials", objective: "Distinguish between an object and the material it is made from", difficulty: 1, ageRange: [5, 7] },
  { id: "KS1-S-05", keyStage: "KS1", yearGroup: 2, subject: "Science", topic: "Living Things", objective: "Explore and compare the differences between things that are living, dead, and have never been alive", difficulty: 2, ageRange: [5, 7] },
  { id: "KS1-S-06", keyStage: "KS1", yearGroup: 2, subject: "Science", topic: "Habitats", objective: "Describe how animals obtain food from plants and other animals using simple food chains", difficulty: 2, ageRange: [5, 7] },
  { id: "KS1-S-07", keyStage: "KS1", yearGroup: 2, subject: "Science", topic: "Plants", objective: "Obsrue and describe how seeds and bulbs grow into mature plants", difficulty: 2, ageRange: [5, 7] },

  // ════════════ KS2 — Science ════════════
  { id: "KS2-S-01", keyStage: "KS2", yearGroup: 3, subject: "Science", topic: "Plants", objective: "Identify and describe the functions of different parts of flowering plants", difficulty: 1, ageRange: [7, 11] },
  { id: "KS2-S-02", keyStage: "KS2", yearGroup: 3, subject: "Science", topic: "Animals", objective: "Identify that animals need the right types of nutrition and that they get nutrition from what they eat", difficulty: 1, ageRange: [7, 11] },
  { id: "KS2-S-03", keyStage: "KS2", yearGroup: 3, subject: "Science", topic: "Rocks", objective: "Compare and group different kinds of rocks based on their appearance and simple physical properties", difficulty: 2, ageRange: [7, 11] },
  { id: "KS2-S-04", keyStage: "KS2", yearGroup: 3, subject: "Science", topic: "Light", objective: "Recognise that light is reflected from surfaces and that shadows are formed when light is blocked", difficulty: 2, ageRange: [7, 11] },
  { id: "KS2-S-05", keyStage: "KS2", yearGroup: 4, subject: "Science", topic: "States of Matter", objective: "Compare and group materials as solids, liquids, or gases and observe changes of state", difficulty: 2, ageRange: [7, 11] },
  { id: "KS2-S-06", keyStage: "KS2", yearGroup: 4, subject: "Science", topic: "Living Things", objective: "Recognise that living things can be classified into broad groups based on observable characteristics", difficulty: 2, ageRange: [7, 11] },
  { id: "KS2-S-07", keyStage: "KS2", yearGroup: 5, subject: "Science", topic: "Earth & Space", objective: "Describe the movement of the Earth and other planets relative to the Sun in the Solar System", difficulty: 2, ageRange: [7, 11] },
  { id: "KS2-S-08", keyStage: "KS2", yearGroup: 5, subject: "Science", topic: "Forces", objective: "Explain that unsupported objects fall to Earth because of gravity and identify the effects of friction", difficulty: 3, ageRange: [7, 11] },
  { id: "KS2-S-09", keyStage: "KS2", yearGroup: 6, subject: "Science", topic: "Evolution", objective: "Recognise that living things have changed over time and that fossils provide evidence for evolution", difficulty: 3, ageRange: [7, 11] },

  // ════════════ KS1/KS2 — Geography ════════════
  { id: "KS1-G-01", keyStage: "KS1", yearGroup: 1, subject: "Geography", topic: "Location", objective: "Name and locate the four countries of the United Kingdom", difficulty: 1, ageRange: [5, 7] },
  { id: "KS1-G-02", keyStage: "KS1", yearGroup: 2, subject: "Geography", topic: "Mapping", objective: "Use simple compass directions and directional language to describe routes on a map", difficulty: 2, ageRange: [5, 7] },
  { id: "KS2-G-01", keyStage: "KS2", yearGroup: 3, subject: "Geography", topic: "Locational Knowledge", objective: "Name and locate cities and counties of the United Kingdom using maps", difficulty: 1, ageRange: [7, 11] },
  { id: "KS2-G-02", keyStage: "KS2", yearGroup: 5, subject: "Geography", topic: "Physical Geography", objective: "Describe and understand key aspects of physical geography including climate zones and biomes", difficulty: 2, ageRange: [7, 11] },

  // ════════════ KS1/KS2 — History ════════════
  { id: "KS1-H-01", keyStage: "KS1", yearGroup: 1, subject: "History", topic: "Chronology", objective: "Place events and objects in chronological order using words like past, present, and future", difficulty: 1, ageRange: [5, 7] },
  { id: "KS1-H-02", keyStage: "KS1", yearGroup: 2, subject: "History", topic: "Significant People", objective: "Learn about the lives of significant individuals in the past who have contributed to national achievements", difficulty: 2, ageRange: [5, 7] },
  { id: "KS2-H-01", keyStage: "KS2", yearGroup: 3, subject: "History", topic: "British History", objective: "Learn about changes in Britain from the Stone Age to the Iron Age", difficulty: 2, ageRange: [7, 11] },
  { id: "KS2-H-02", keyStage: "KS2", yearGroup: 5, subject: "History", topic: "Ancient Civilisations", objective: "Learn about the achievements of the earliest civilisations including Ancient Egypt or Ancient Greece", difficulty: 2, ageRange: [7, 11] },

  // ── Art & Design ──
  { id: "KS1-A-01", keyStage: "KS1", yearGroup: 1, subject: "Art", topic: "Drawing", objective: "Use a range of drawing materials to create simple observational drawings", difficulty: 1, ageRange: [5, 7] },
  { id: "KS1-A-02", keyStage: "KS1", yearGroup: 2, subject: "Art", topic: "Painting", objective: "Mix primary colours to create new colours and paint different textures", difficulty: 1, ageRange: [5, 7] },
  { id: "KS2-A-01", keyStage: "KS2", yearGroup: 3, subject: "Art", topic: "Sculpture", objective: "Create sculptures using a variety of materials and techniques", difficulty: 2, ageRange: [7, 11] },
  { id: "KS2-A-02", keyStage: "KS2", yearGroup: 4, subject: "Art", topic: "Colour Theory", objective: "Understand how artists use colour, pattern, and texture to create mood in their work", difficulty: 2, ageRange: [7, 11] },

  // ── Computing ──
  { id: "KS1-C-01", keyStage: "KS1", yearGroup: 1, subject: "Computing", topic: "Algorithms", objective: "Understand what algorithms are and create simple programs", difficulty: 1, ageRange: [5, 7] },
  { id: "KS1-C-02", keyStage: "KS1", yearGroup: 2, subject: "Computing", topic: "Programming", objective: "Create and debug simple programs using logical reasoning", difficulty: 2, ageRange: [5, 7] },
  { id: "KS2-C-01", keyStage: "KS2", yearGroup: 4, subject: "Computing", topic: "Online Safety", objective: "Understand how to stay safe online and recognise reliable information", difficulty: 1, ageRange: [7, 11] },
  { id: "KS2-C-02", keyStage: "KS2", yearGroup: 5, subject: "Computing", topic: "Programming", objective: "Design, write and debug programs that accomplish specific goals", difficulty: 2, ageRange: [7, 11] },

  // ── AI & Technology ──
  { id: "KS1-AI-01", keyStage: "KS1", yearGroup: 1, subject: "AI", topic: "What is AI?", objective: "Understand that AI is a type of smart technology that can learn and help us", difficulty: 1, ageRange: [5, 7] },
  { id: "KS1-AI-02", keyStage: "KS1", yearGroup: 2, subject: "AI", topic: "AI in Daily Life", objective: "Identify examples of AI in everyday life like voice assistants and smart toys", difficulty: 1, ageRange: [5, 7] },
  { id: "KS2-AI-01", keyStage: "KS2", yearGroup: 4, subject: "AI", topic: "How AI Learns", objective: "Understand how AI learns from data and patterns in simple terms", difficulty: 2, ageRange: [7, 11] },
  { id: "KS2-AI-02", keyStage: "KS2", yearGroup: 5, subject: "AI", topic: "AI Safety", objective: "Learn how to use AI tools safely and understand they are created by humans", difficulty: 2, ageRange: [7, 11] },

  // ════════════ KS3 — Ages 12-14 ════════════
  { id: "KS3-M-01", keyStage: "KS3", yearGroup: 7, subject: "Maths", topic: "Number", objective: "Use the four operations with integers, decimals and fractions in multi-step problems", difficulty: 1, ageRange: [12, 14] },
  { id: "KS3-M-02", keyStage: "KS3", yearGroup: 8, subject: "Maths", topic: "Algebra", objective: "Simplify algebraic expressions and solve linear equations in one variable", difficulty: 2, ageRange: [12, 14] },
  { id: "KS3-E-01", keyStage: "KS3", yearGroup: 7, subject: "English", topic: "Reading", objective: "Analyse how a writer uses language, structure and evidence to shape meaning", difficulty: 1, ageRange: [12, 14] },
  { id: "KS3-E-02", keyStage: "KS3", yearGroup: 8, subject: "English", topic: "Writing", objective: "Write accurately and persuasively for different audiences and purposes", difficulty: 2, ageRange: [12, 14] },
  { id: "KS3-S-01", keyStage: "KS3", yearGroup: 7, subject: "Science", topic: "Working Scientifically", objective: "Plan a fair investigation, identify variables and evaluate the quality of evidence", difficulty: 1, ageRange: [12, 14] },
  { id: "KS3-S-02", keyStage: "KS3", yearGroup: 8, subject: "Science", topic: "Energy", objective: "Describe energy transfers and calculate simple changes in energy stores", difficulty: 2, ageRange: [12, 14] },
  { id: "KS3-G-01", keyStage: "KS3", yearGroup: 7, subject: "Geography", topic: "Place and Space", objective: "Interpret maps and data to explain physical and human features of places", difficulty: 1, ageRange: [12, 14] },
  { id: "KS3-G-02", keyStage: "KS3", yearGroup: 8, subject: "Geography", topic: "Climate", objective: "Explain causes and impacts of climate change and evaluate possible responses", difficulty: 2, ageRange: [12, 14] },
  { id: "KS3-H-01", keyStage: "KS3", yearGroup: 7, subject: "History", topic: "Historical Enquiry", objective: "Use primary and secondary sources to form and support a historical interpretation", difficulty: 1, ageRange: [12, 14] },
  { id: "KS3-H-02", keyStage: "KS3", yearGroup: 8, subject: "History", topic: "British History", objective: "Explain causes and consequences of major changes in Britain after 1745", difficulty: 2, ageRange: [12, 14] },
  { id: "KS3-A-01", keyStage: "KS3", yearGroup: 7, subject: "Art", topic: "Creative Practice", objective: "Develop and refine ideas through observation, experimentation and critical review", difficulty: 1, ageRange: [12, 14] },
  { id: "KS3-A-02", keyStage: "KS3", yearGroup: 8, subject: "Art", topic: "Art History", objective: "Analyse how artists use visual language in historical and cultural contexts", difficulty: 2, ageRange: [12, 14] },
  { id: "KS3-C-01", keyStage: "KS3", yearGroup: 7, subject: "Computing", topic: "Programming", objective: "Design and debug programs using sequence, selection, iteration and variables", difficulty: 1, ageRange: [12, 14] },
  { id: "KS3-C-02", keyStage: "KS3", yearGroup: 8, subject: "Computing", topic: "Data and Networks", objective: "Explain how data is represented and transmitted securely across computer networks", difficulty: 2, ageRange: [12, 14] },
  { id: "KS3-AI-01", keyStage: "KS3", yearGroup: 7, subject: "AI", topic: "AI Literacy", objective: "Explain how training data influences an AI system's outputs and limitations", difficulty: 1, ageRange: [12, 14] },
  { id: "KS3-AI-02", keyStage: "KS3", yearGroup: 8, subject: "AI", topic: "Responsible AI", objective: "Evaluate bias, privacy and reliability risks when using AI systems", difficulty: 2, ageRange: [12, 14] },
];

export function getObjectivesForAge(age: number): CurriculumObjective[] {
  const keyStage = getKeyStage(age);
  return curriculum.filter(o => o.keyStage === keyStage && age >= o.ageRange[0] && age <= o.ageRange[1]);
}

export function getObjectivesForSubject(age: number, subject: Subject): CurriculumObjective[] {
  return getObjectivesForAge(age).filter(o => o.subject === subject);
}

export function getNextObjective(
  completedIds: string[],
  age: number,
  subject: Subject
): CurriculumObjective | null {
  const available = getObjectivesForSubject(age, subject)
    .filter(o => !completedIds.includes(o.id))
    .sort((a, b) => a.difficulty - b.difficulty);
  return available[0] || null;
}

export function getKeyStage(age: number): KeyStage {
  if (age >= 5 && age <= 7) return "KS1";
  if (age >= 8 && age <= 11) return "KS2";
  if (age >= 12 && age <= 14) return "KS3";
  throw new RangeError("Child age must be between 5 and 14");
}

export default curriculum;
