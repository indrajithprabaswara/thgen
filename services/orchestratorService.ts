import { PlanSection } from '../types';

const slugify = (text: string): string => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

export const parsePlan = (planText: string): PlanSection[] => {
    const lines = planText.split('\n').filter(line => line.trim() && !line.trim().startsWith('Part '));
    const sections: PlanSection[] = [];

    lines.forEach(line => {
        const trimmedLine = line.trim();
        const wordMatch = trimmedLine.match(/(\d+)\s+words/);

        if (wordMatch) {
            const targetWordCount = parseInt(wordMatch[1], 10);
            let rawTitle = trimmedLine.replace(wordMatch[0], '').trim();
            
            let id = '';
            let title = rawTitle;
            let level = 0;

            const numberedPrefixMatch = rawTitle.match(/^(\d+(\.\d+)*)\s+/);
            const chapterMatch = rawTitle.match(/^(Chapter\s+\d+)/);

            if (numberedPrefixMatch) {
                id = numberedPrefixMatch[1];
                title = rawTitle.substring(numberedPrefixMatch[0].length);
                level = (id.match(/\./g) || []).length + 1;
            } else if (chapterMatch) {
                id = chapterMatch[1].replace(' ', '-');
                title = rawTitle.substring(chapterMatch[0].length).replace(/^:/, '').trim();
                level = 1;
            } else {
                // Front matter or other non-numbered/non-chapter items
                id = slugify(title);
                level = 1; // Treat as top-level
            }

            sections.push({ id, title, targetWordCount, level, content: '', isFlagged: false, originalWordCount: targetWordCount });
        }
    });

    return sections;
};


export const getWordCount = (text: string): number => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
};

export const adjustWordCount = (plan: PlanSection[], globalTarget: number): PlanSection[] => {
    const currentTotal = plan.reduce((sum, section) => sum + section.targetWordCount, 0);

    if (currentTotal === globalTarget || currentTotal === 0) {
        return plan.map(s => ({ ...s, originalWordCount: s.targetWordCount }));
    }

    const difference = globalTarget - currentTotal;

    const adjustedPlan = plan.map(section => {
        const proportion = section.targetWordCount / currentTotal;
        const adjustment = Math.round(proportion * difference);
        const newWordCount = section.targetWordCount + adjustment;
        const finalWordCount = newWordCount > 0 ? newWordCount : 10;
        
        let justification;
        if (finalWordCount > section.targetWordCount) {
            justification = `Expand by ${finalWordCount - section.targetWordCount} words to meet global target with deeper scholarly content.`;
        }

        return {
            ...section,
            targetWordCount: finalWordCount,
            originalWordCount: section.targetWordCount,
            expansionJustification: justification,
        };
    });

    const newTotal = adjustedPlan.reduce((sum, section) => sum + section.targetWordCount, 0);
    const roundingDifference = globalTarget - newTotal;
    
    if (roundingDifference !== 0 && adjustedPlan.length > 0) {
        const largestSectionIndex = adjustedPlan.reduce((largestIndex, currentSection, currentIndex, arr) => {
            return currentSection.targetWordCount > arr[largestIndex].targetWordCount ? currentIndex : largestIndex;
        }, 0);

        const finalAdjustedCount = adjustedPlan[largestSectionIndex].targetWordCount + roundingDifference;
        adjustedPlan[largestSectionIndex].targetWordCount = finalAdjustedCount > 0 ? finalAdjustedCount : 10;
    }
    
    return adjustedPlan;
};
