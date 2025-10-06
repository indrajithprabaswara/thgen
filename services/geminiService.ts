import { GenerationMetadata } from '../types';

interface ParsedResponse {
    content: string;
    metadata: GenerationMetadata | null;
}

export const generateThesisChunk = async (prompt: string): Promise<ParsedResponse> => {
    const { GoogleGenAI } = await import('@google/genai');
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const rawText = response.text;
        return parseGeminiResponse(rawText);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error && error.message.includes('API key not valid')) {
             throw new Error("The provided API key is not valid. Please check your configuration.");
        }
        throw new Error("Failed to generate content from Gemini API.");
    }
};

export const generateCodebase = async (thesisContent: string): Promise<Record<string, string>> => {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
Based on the following PhD thesis content, generate a complete, modular, and runnable Python codebase for the "NiyamaVerse" simulation.

Thesis Content:
---
${thesisContent.substring(0, 30000)}
---

**Requirements:**
1.  **File Structure:** Generate a dictionary-like JSON object where keys are filenames (e.g., "main.py", "requirements.txt", "niyama_verse/agents.py") and values are the complete code for each file.
2.  **Core Files:** Must include:
    *   \`README.md\`: Explain the project, how to set it up, and how to run experiments.
    *   \`requirements.txt\`: List necessary Python libraries (e.g., numpy, tensorflow, matplotlib).
    *   \`main.py\`: The main entry point to run a simulation.
    *   A core module folder (e.g., \`niyama_verse/\`) containing modular components like \`agents.py\`, \`environment.py\`, \`simulation.py\`.
3.  **Code Quality:** The code must be well-commented, follow PEP 8 standards, and directly implement the concepts (agents, Niyamas, experiments) described in the thesis.
4.  **Output Format:** Respond ONLY with the raw JSON object. Do not wrap it in markdown backticks or any other text.

Example JSON structure:
{
  "README.md": "# NiyamaVerse Simulation\\n...",
  "requirements.txt": "numpy==1.21.0\\n",
  "main.py": "from niyama_verse.simulation import Simulation\\n\\nif __name__ == '__main__':\\n    sim = Simulation()\\n    sim.run()\\n",
  "niyama_verse/__init__.py": "",
  "niyama_verse/agents.py": "class BaseAgent:\\n    pass\\n"
}
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const rawText = response.text;
        // Clean potential markdown fences
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Error generating codebase:", error);
        throw new Error("Failed to generate codebase from Gemini API.");
    }
};


const parseGeminiResponse = (rawText: string): ParsedResponse => {
    let content = rawText;
    let metadata: GenerationMetadata | null = null;
    
    // Updated regex to be more robust
    const jsonBlockRegex = /```json\s*(\{[\s\S]*?\})\s*```$/;
    const jsonMatch = rawText.match(jsonBlockRegex);

    if (jsonMatch && jsonMatch[1]) {
        try {
            metadata = JSON.parse(jsonMatch[1]);
            content = rawText.replace(jsonBlockRegex, '').trim();
        } catch (e) {
            console.warn("Could not parse metadata JSON from response.", e);
        }
    } else {
        const lastBraceIndex = content.lastIndexOf('{');
        // Heuristic: check if the potential JSON is a substantial part of the end of the response
        if (lastBraceIndex > content.length / 2) {
             try {
                const potentialJson = content.substring(lastBraceIndex);
                const parsed = JSON.parse(potentialJson);
                // Check for a key that is definitely in our metadata
                if(parsed.SectionID && parsed.WordCount !== undefined) {
                    metadata = parsed;
                    content = content.substring(0, lastBraceIndex).trim();
                }
             } catch (e) {
                // It wasn't valid JSON, so ignore.
             }
        }
    }

    return { content, metadata };
};
