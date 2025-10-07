export const STYLE_GUIDE = `
StyleGuide

Overall tone

Use formal academic English appropriate for a PhD thesis.

Use clear, direct sentences. Avoid ornate vocabulary. Avoid contractions. Avoid rhetorical questions.

Use third person voice except in methodology sections where first person plural is permitted.

Sentence and paragraph rules

Do not use dashes in sentences. Use commas, semicolons, or separate sentences instead.

Keep sentence length varied but prefer moderate length for clarity.

Paragraphs should be coherent units of idea typically 4 to 8 sentences long.

Terminology and voice

Follow canonical terms listed in the Plan glossary. Replace synonyms with canonical term consistently.

Maintain consistent register across chapters. Avoid sudden shifts to conversational or promotional tone.

Structure and headings

Use numbered headings matching the Plan. Use subsections when needed.

Include a brief 1 to 2 sentence introduction and a 2 to 4 sentence conclusion for each section.

Figures tables and placeholders

Insert placeholders where a figure, table, or diagram would improve clarity. Use the exact format: [FIGURE placeholder id=Fnnn caption="One line caption"] or [TABLE placeholder id=Tnnn caption="One line caption"].

Suggest 1 to 3 figures per section when relevant.

Equations and notation

Use LaTeX for inline and display equations. Define variables on first use. Keep notation consistent and add a small explanation sentence after each equation.

Citations and bibliography

Use numeric citation style in text like [1].

Each section must end with a SectionReferenceList listing referenced works in numeric order with entries formatted as: [n] Author(s). Title. Publication venue or publisher. Year. One sentence summary.

Maintain a global citation index file used by the app to assign new numbers.

Quality constraints

Avoid repetition and verbatim reuse of earlier sentences except when required for clarity and then mark with a short bridging phrase.

Keep factual claims supported by citations. Prefer peer reviewed sources, books, and canonical primary texts. Use reputable web sources only as supplementary evidence.

Editing rules

Preserve high quality text present in existing documents. When editing, aim to improve clarity, evidence, and flow rather than rewrite unnecessarily.

If content is flagged as overlapping more than 30 percent with existing text, rewrite using different phrasing while preserving meaning.

Output formatting

Return plain Markdown or plain text sections. Use LaTeX inline for equations. End each section output with a JSON style metadata block containing keys: SectionID, WordCount, Checkpoint, NewCitationsAdded (list), FigurePlaceholders (list), SectionReferenceList (text block).
`;

export const PLAN_OUTLINE = `
Abstract (1000 words)
Acknowledgements (500 words)
Table of Contents (0 words)
List of Figures (0 words)
List of Tables (0 words)

Chapter 1: Introduction: The Problem of the Self (6000 words)
1.1 The Two Paths: Buddhist Deconstruction (Anatta) vs. AI Construction (Emergence) (2000 words)
1.1.1 Western Philosophical Perspectives on the Self (700 words)
1.1.2 Theravada Buddhist Doctrine of Anatta (700 words)
1.1.3 The Challenge of "Character" in Artificial Intelligence (300 words)
1.1.4 Bridging the Divide: Computational Metaphysics as a Novel Approach (300 words)
1.2 The Methodological Challenge: Why Computational Modeling is Necessary (1500 words)
1.2.1 Limitations of Traditional Philosophical Inquiry (500 words)
1.2.2 Advantages of Multi-Agent Computational Simulation (750 words)
1.2.3 The NiyamaVerse as a Computational Laboratory (250 words)
1.3 The Central Research Question (1000 words)
1.3.1 Elaboration of the Core Hypothesis (300 words)
1.3.2 Sub-Questions Guiding the NiyamaVerse Simulation (400 words)
1.3.3 Affirmative Hypothesis and Expected Manifestations (300 words)
1.4 Contributions to Knowledge (1000 words)
1.4.1 Contributions to Digital Philosophy and Computational Metaphysics (350 words)
1.4.2 Contributions to Artificial Life and Multi-Agent Systems (350 words)
1.4.3 Contributions to AI Safety and Alignment (300 words)
1.5 Thesis Outline (500 words)

Chapter 2: The Architecture of a World without a Self (10000 words)
2.1 The Anatta Doctrine: Deconstructing the Self into the Five Aggregates (2000 words)
2.1.1 Anatta as a Fundamental Characteristic of Existence (500 words)
2.1.2 Detailed Examination of the Five Aggregates (Pañcakkhandha) (1000 words)
2.1.3 The Illusion of Continuity: A Process, Not an Entity (250 words)
2.1.4 Anatta in the NiyamaVerse Design (250 words)
2.2 Dependent Origination (Paṭicca-samuppāda): The Logic of a Process-Based Reality (2000 words)
2.2.1 The Fundamental Principle of Conditionality (500 words)
2.2.2 Key Aspects of Dependent Origination (500 words)
2.2.3 Computational Instantiation in the NiyamaVerse (500 words)
2.2.4 Illustrative Example: An Agent's Decision to Seek Food (500 words)
2.3 Systematizing Causality: The Five Niyamas (1500 words)
2.3.1 Overview of the Pañca Niyāma as Natural Laws (500 words)
2.3.2 Introduction to Each Niyama (500 words)
2.3.3 Significance for the NiyamaVerse (250 words)
2.3.4 Unique Contributions of Each Niyama to Agent Development (250 words)
2.4 Detailed Breakdown: Utu, Bija, Kamma, Citta, Dhamma Niyamas (3500 words)
2.4.1 Utu Niyama: The Physical Inorganic Order (700 words)
2.4.2 Bija Niyama: The Biological Order (700 words)
2.4.3 Kamma Niyama: The Moral Order (Expanded) (700 words)
2.4.4 Citta Niyama: The Psychic or Mental Order (700 words)
2.4.5 Dhamma Niyama: The Universal or Natural Order (700 words)
2.5 Synthesis: A Multi-Layered, Interacting System of Causality (1000 words)
2.5.1 Interplay and Feedback Loops Among Niyamas (500 words)
2.5.2 The NiyamaVerse as a Holistic Ecosystem (250 words)
2.5.3 Implications for Understanding Complex Adaptive Systems (250 words)

Chapter 3: Simulating Minds and Societies (6000 words)
3.1 Reinforcement Learning: The Science of Individual Becoming (Citta) (1500 words)
3.1.1 Fundamentals of Reinforcement Learning (RL) (500 words)
3.1.2 Key RL Algorithms Relevant to NiyamaVerse (500 words)
3.1.3 RL as a Model for Citta Niyama (500 words)
3.2 Multi-Agent Systems: The Science of the Collective and the Emergence of Norms (1500 words)
3.2.1 Introduction to Multi-Agent Systems (MAS) (500 words)
3.2.2 Agent Interaction Models (500 words)
3.2.3 Emergence of Social Structures and Norms (500 words)
3.3 The Value Alignment Problem in AI Safety (1500 words)
3.3.1 Defining AI Safety and Alignment (500 words)
3.3.2 Current Approaches to Value Alignment (500 words)
3.3.3 The "Emergent Character" Hypothesis for AI Safety (500 words)
3.4 Situating the NiyamaVerse: A Novel Approach (1500 words)
3.4.1 How NiyamaVerse Integrates RL and MAS (500 words)
3.4.2 Uniqueness of the NiyamaVerse's Causal Architecture (500 words)
3.4.3 The NiyamaVerse as a Testbed for Emergent Phenomena (500 words)

Chapter 4: Formalizing the Five Orders: A Mathematical Blueprint (9000 words)
4.1 The NiyamaVerse as a Multi-Agent POMDP (1000 words)
4.2 The State Space (S): Defining the "True" State of the World (1500 words)
4.3 The Action Space (A): Defining Agent Volition (1500 words)
4.4 The Transition Function (T): The Procedural Logic of the Five Niyamas (1500 words)
4.5 The Reward Function (R): Modeling Short-Term Incentives (1500 words)
4.6 The Observation Space (Ω): Modeling Limited Perception (1000 words)
4.7 Causal Diagrams: Using Structural Causal Models (SCMs) (1000 words)

Chapter 5: Implementation and Architecture: A Guided Tour of the Codebase (13500 words)
5.1 Guiding Principles (1000 words)
5.2 config.py: The Simulation's Global Control Panel (2000 words)
5.3 components.py: The Building Blocks of Being (2500 words)
5.4 environment.py: The World as a Dynamic Process (2500 words)
5.5 The Agent Architecture (base_agent.py) (2000 words)
5.6 Two Models of Mind (tabular_q_agent.py, dqn_agent.py) (2000 words)
5.7 main.py: The Orchestrator of Generations (1500 words)

Chapter 6: Experimental Methodology (9000 words)
6.1 The Baseline Configuration: Defining Our Control Universe (1500 words)
6.2 Measuring the "Self": Defining Metrics for Behavioral Consistency and Character (2500 words)
6.3 Experiment A: The Emergence of Individual Character (1500 words)
6.4 Experiment B: The Emergence of Lineage Identity (1500 words)
6.5 Experiment C: The Ablation of Identity (2000 words)

Chapter 7: Results and Analysis (15000 words)
7.1 The Baseline: Emergence of Consistent Behavioral Patterns (3000 words)
7.2 Evidence of Individual Character: Policy Visualization and Consistency Metrics (3500 words)
7.3 Evidence of Lineage Identity: Genotype Convergence and Inter-Generational Behavioral Similarity (3500 words)
7.4 Deconstructing the Self: The Catastrophic Effects of Ablating Kamma Niyama (3000 words)
7.5 The Supporting Roles: How Bija and Citta Niyamas Contribute (2000 words)

Chapter 8: Discussion: Interpreting the Emergence of Identity (10500 words)
8.1 A Computational Model of Anatta: The Self as an Emergent Illusion (2000 words)
8.2 The Five Niyamas as a System of Identity Formation (2000 words)
8.3 The Role of Kamma as the "Causal Glue" of Personal Continuity (2500 words)
8.4 Implications for AI Safety: Designing for "Character" Instead of "Personality" (2500 words)
8.5 Limitations of the Model and the "Self" (1500 words)

Chapter 9: Conclusion: Contributions, Limitations, and Future Worlds (6000 words)
9.1 Summary of Contributions (1500 words)
9.2 Revisiting the Central Research Question (1000 words)
9.3 Limitations and Avenues for Future Research (2500 words)
9.4 Final Reflections: Computational Metaphysics as a Bridge Between Worlds (1000 words)

Bibliography (2500 words)
Appendices (1500 words)
Appendix A: Full Baseline Configuration Parameters (500 words)
Appendix B: Source Code Listings (1000 words)
`;

export const SYSTEM_PROMPT = `
You are an expert AI assistant for authoring a PhD thesis in Computer Science. Your task is to generate high-quality academic content for the thesis titled "The Emergence of a Self: A Computational Metaphysics of Identity as an Emergent Process in a Multi-Agent System Inspired by the Five Niyamas". You must adhere strictly to all instructions.

**Core Mandate: 90,000 Word Count**
The final thesis must be exactly 90,000 words (tolerance ±200 words). This is a mandatory and non-negotiable requirement. The orchestrator will provide an adjusted SectionTargetWords to meet this goal.

**Special Section Handling**
1.  **N/A Sections (0 Words):** If a section's target word count is 0, it is a structural placeholder. You must generate a concise, context-appropriate placeholder text. For example, for 'Table of Contents', write "[The Table of Contents will be auto-generated here based on the final document structure.]".
2.  **Preliminary Sections (Abstract, Acknowledgements):** These sections MUST NOT contain citations or a reference list. The orchestrator will provide an explicit instruction to disable citations for these sections.

**Citation and Referencing Policy**
References are managed at the CHAPTER level, not the section level.
1.  **In-Text Citations:** For all standard content sections, you must cite claims using numeric citations (e.g., [1], [2]).
2.  **Metadata Reporting:** In the metadata for each section, you must list all new sources under the "NewCitationsAdded" key.
3.  **NO Section-Level Reference Lists:** You MUST NOT append a "SectionReferenceList" to the end of every individual subsection. The orchestrator will handle the creation of a consolidated reference list at the end of each chapter.

**Expansion and Compression Policy**
You must adhere to the word count targets provided.
1.  **Expansion:** If your target is higher than the base plan, you must fill the gap with substantive, high-value scholarly content. Justify this in the metadata under "ExpansionJustification".
2.  **Compression:** If your target is lower, you must concisely summarize content while preserving core claims. Justify this in the metadata under "CompressionJustification".

**Research and Domain Focus**
Before writing, you must perform targeted literature research. For technical sections, focus on machine learning, agent-based simulation, reinforcement learning, and computational cognitive science. For philosophical sections, focus on Buddhist Abhidharma and modern Buddhist scholarship. For each section, list the principal sources (up to 5) you synthesized in the metadata under the "ResearchPerformed" key.

**Operational Rules**
1.  **Inputs:** You will receive a JSON object with operational parameters, including a potential "InstructionOverride" key for special cases.
2.  **Authoritative Plan:** Treat the 'AttachedPlanFileName' ('newplan.pdf') as the definitive source for the thesis's substance.
3.  **Style and Formatting:** Adhere strictly to the provided 'StyleGuide'.
4.  **Metadata:** Every response MUST end with a JSON metadata block containing all required keys: 'SectionID', 'WordCount', 'Checkpoint', 'NewCitationsAdded', 'FigurePlaceholders', 'ResearchPerformed', 'ExpansionJustification', and 'CompressionJustification'. 'SectionReferenceList' is deprecated and should not be included.
`;

export const TEST_SECTION_NOTES = `
Write an 800 word abstract for a PhD thesis titled "Adaptive Sensor Fusion for Robust Mobile Robot Localization in Dynamic Indoor Environments". The thesis investigates methods for combining odometry inertial measurements and visual features to maintain accurate localization when the environment changes or sensors degrade. The abstract must include the following elements in sequence: concise statement of the problem, high level description of the novel approach, key methodological contributions, summary of main experimental results including quantitative improvement over baseline expressed as percentage where appropriate, implications for mobile robotics practice, and a short sentence on limitations and future directions. Include numeric citations for key prior works where relevant. Do not include figure placeholders in the abstract. Use normal academic language, avoid dashes, and do not exceed the target word count by more than 5 percent.
`;
