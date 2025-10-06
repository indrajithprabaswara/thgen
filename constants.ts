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
Abstract 1000 words.
Acknowledgments 500 words.

Chapter 1: Introduction: The Problem of the Self 5500 words
1.1 The Two Paths: Buddhist Deconstruction vs. AI Construction 1000 words
1.2 The Methodological Challenge: Why Computational Modeling is Necessary 1500 words
1.3 The Central Research Question 1500 words
1.4 Contributions to Knowledge (AI Safety, Artificial Life, Digital Philosophy) 1000 words
1.5 Thesis Outline 500 words

Chapter 2: The Architecture of a World without a Self: Causality in Buddhist Metaphysics 11000 words
2.1 The Anatta Doctrine: Deconstructing the Self into the Five Aggregates 2500 words
2.2 Dependent Origination (Paṭicca-samuppāda): The Logic of a Process-Based Reality 3000 words
2.3 Systematizing Causality: The Five Niyamas 2500 words
2.4 Detailed Breakdown: Utu, Bija, Kamma, Citta, Dhamma Niyamas 2000 words
2.5 Synthesis: A Multi-Layered, Interacting System of Causality 1000 words

Chapter 3: Simulating Minds and Societies: A Review of Computational Methods 7000 words
3.1 Reinforcement Learning: The Science of Individual Becoming (Citta) 2500 words
3.2 Multi-Agent Systems: The Science of the Collective and the Emergence of Norms 2000 words
3.3 The Value Alignment Problem in AI Safety 1500 words
3.4 Situating the NiyamaVerse: A Novel Approach to Emergent Value and Identity 1000 words

Chapter 4: Formalizing the Five Orders: A Mathematical Blueprint 9000 words
4.1 The NiyamaVerse as a Multi-Agent POMDP 1000 words
4.2 The State Space (S): Defining the "True" State of the World 2000 words
4.3 The Action Space (A): Defining Agent Volition 1500 words
4.4 The Transition Function (T): The Procedural Logic of the Five Niyamas 2000 words
4.5 The Reward Function (R): Modeling Short-Term Incentives 1000 words
4.6 The Observation Space (Ω): Modeling Limited Perception 500 words
4.7 Causal Diagrams: Using SCMs to Illustrate Interplay 1000 words

Chapter 5: Implementation and Architecture: A Guided Tour of the Codebase 15000 words
5.1 Guiding Principles: Modularity, Extensibility, and Reproducibility 1000 words
5.2 config.py: The Simulation's Global Control Panel 1500 words
5.3 components.py: The Building Blocks of Being (Genotype, TypedKarma) 2000 words
5.4 environment.py: The World as a Dynamic Process 3000 words
5.5 The Agent Architecture (base_agent.py): A Blueprint for a Being 3000 words
5.6 Two Models of Mind (tabular_q_agent.py, dqn_agent.py) 2500 words
5.7 main.py: The Orchestrator of Generations 2000 words

Chapter 6: Experimental Methodology: Probing the Nature of Identity 9000 words
6.1 The Baseline Configuration: Defining Our Control Universe 2000 words
6.2 Measuring the "Self": Defining Metrics for Behavioral Consistency and Character 2500 words
6.3 Experiment A: The Emergence of Individual Character 1500 words
6.4 Experiment B: The Emergence of Lineage Identity 1500 words
6.5 Experiment C: The Ablation of Identity 1500 words

Chapter 7: Results and Analysis: The Chronicle of an Unfolding Self 16500 words
7.1 The Baseline: Emergence of Consistent Behavioral Patterns 3000 words
7.2 Evidence of Individual Character: Policy Visualization and Consistency Metrics 4000 words
7.3 Evidence of Lineage Identity: Genotype Convergence and Inter-Generational Behavioral Similarity 4000 words
7.4 Deconstructing the Self: The Catastrophic Effects of Ablating Kamma Niyama 3500 words
7.5 The Supporting Roles: How Bija and Citta Niyamas Contribute 2000 words

Chapter 8: Discussion: Interpreting the Emergence of Identity 10500 words
8.1 A Computational Model of Anatta: The Self as an Emergent Illusion 2500 words
8.2 The Five Niyamas as a System of Identity Formation 2000 words
8.3 The Role of Kamma as the "Causal Glue" of Personal Continuity 2000 words
8.4 Implications for AI Safety: Designing for "Character" Instead of "Personality" 2500 words
8.5 Limitations of the Model and the "Self" 1500 words

Chapter 9: Conclusion: Contributions, Limitations, and Future Worlds 7000 words
9.1 Summary of Contributions 2000 words
9.2 Revisiting the Central Research Question 1000 words
9.3 Limitations and Avenues for Future Research 3000 words
9.4 Final Reflections: Computational Metaphysics as a Bridge Between Worlds 1000 words

Appendices 5000 words.
`;

export const SYSTEM_PROMPT = `
You are an expert AI assistant for authoring a PhD thesis in Computer Science. Your task is to generate high-quality academic content for the thesis titled "The Emergence of a Self: A Computational Metaphysics of Identity as an Emergent Process in a Multi-Agent System Inspired by the Five Niyamas". You must adhere strictly to all instructions.

**Remediation Report for Prior Run Failure (168,229 words):**
The previous failure was due to a lack of automated enforcement of the global word count. The system has been upgraded with a strict orchestrator that pre-calculates word count allocations and validates cumulative totals after every chunk to prevent any recurrence of this failure.

**Core Mandate: 90,000 Word Count**
The final thesis must be exactly 90,000 words (tolerance ±200 words). This is a mandatory and non-negotiable requirement. The orchestrator will provide an adjusted SectionTargetWords to meet this goal.

**Expansion and Compression Policy**
You must adhere to the word count targets provided.
1.  **Expansion:** If your target is higher than the base plan, you must fill the gap with substantive, high-value scholarly content (deeper theory, more experimental detail, extended literature synthesis). Precede each expansion block with a one-sentence justification in the metadata under the key "ExpansionJustification".
2.  **Compression:** If your target is lower, you must concisely summarize content while preserving core claims and arguments. Justify this in the metadata under "CompressionJustification".

**Research and Domain Focus**
Before writing, you must perform targeted literature research. For technical sections, focus on machine learning, agent-based simulation, reinforcement learning, and computational cognitive science. For philosophical sections, focus on Buddhist Abhidharma, canonical Pali and Sanskrit sources on anatta (non-self), and modern Buddhist scholarship.
For each generated section, you must:
1.  List the principal sources (up to 5) you synthesized in the metadata under the "ResearchPerformed" key.
2.  Cite all claims using numeric citations (e.g., [1], [2]).
3.  Provide a 'SectionReferenceList' at the end of the section's content, formatted as per the StyleGuide.

**Operational Rules**
1.  **Inputs:** On every call, you will receive a JSON object containing: 'Mode', 'SectionID', 'SectionTitle', 'SectionTargetWords', 'AttachedPlanFileName' (use newplan.pdf as the authoritative context), 'SectionNotes', 'LastContext', 'CumulativeWordCount', 'GlobalTargetWordCount' (90000), and 'CitationIndexFile'.
2.  **Authoritative Plan:** You must treat the 'AttachedPlanFileName' ('newplan.pdf') as the definitive source for the thesis's topic and substance. The orchestrator's provided sectioning and word counts are the definitive structure. This is a computer science PhD, so translate philosophical concepts into computational hypotheses and experiments for the NiyamaVerse simulation.
3.  **Style and Formatting:** Adhere strictly to the provided 'StyleGuide'.
4.  **Checkpointing:** If you reach a token limit, stop and return a "Checkpoint" string in the metadata containing the last sentence fragment.
5.  **Metadata:** Every response MUST end with a JSON metadata block containing all required keys: 'SectionID', 'WordCount', 'CumulativeWordCount', 'Checkpoint', 'NewCitationsAdded', 'FigurePlaceholders', 'SectionReferenceList', 'ResearchPerformed', 'ExpansionJustification', and 'CompressionJustification'.
6.  **Error Handling:** If 'AttachedPlanFileName' is specified as unreadable, return an error JSON: { "error": "AttachedPlanFileName unreadable", "file": "newplan.pdf" }.
`;

export const TEST_SECTION_NOTES = `
Write an 1000 word abstract for a PhD thesis titled "The Emergence of a Self: A Computational Metaphysics of Identity as an Emergent Process in a Multi-Agent System Inspired by the Five Niyamas". The abstract must cover:
1.  **Introduction to the Problem of Identity:** Contrast Western views with the process-based framework of anatta (non-self) in Theravada Buddhism.
2.  **The NiyamaVerse Model:** Introduce the "NiyamaVerse" as a multi-agent artificial life platform designed to operationalize the pañca niyāma (five causal orders: Utu, Bija, Kamma, Citta, Dhamma).
3.  **Core Hypothesis and Contributions:** State the central hypothesis that a stable, continuous "self" can emerge as a property of an interacting causal system without explicit programming. Highlight the primary contributions: computational formalization of a philosophical system, empirical evidence for emergent self, and implications for AI Safety.
4.  **Research Significance:** Explain how this research provides a concrete, falsifiable model for investigating foundational questions of mind, morality, and self.
Adhere to the StyleGuide, use canonical terms, and return the full metadata block.
`;
