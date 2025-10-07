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
    const lines = planText.split('\n').filter(line => line.trim() && !line.trim().startsWith('Part') && !line.trim().startsWith('Thesis Title') && !line.trim().startsWith('Total Word Count Target'));
    const preliminarySections: PlanSection[] = [];

    lines.forEach(line => {
        const trimmedLine = line.trim();
        const wordMatch = trimmedLine.match(/\(([\d,]+|N\/A)\s+words\)/);

        if (wordMatch && wordMatch[1]) {
            const isNA = wordMatch[1].toUpperCase() === 'N/A';
            const wordCountString = isNA ? '0' : wordMatch[1].replace(/,/g, '');
            const targetWordCount = parseInt(wordCountString, 10);
            
            let rawTitle = trimmedLine.replace(wordMatch[0], '').trim();
            
            let idPrefix = '';
            let title = rawTitle;
            let level = 0;

            const numberedPrefixMatch = rawTitle.match(/^(\d+(\.\d+)*)\s+/);
            const chapterMatch = rawTitle.match(/^(Chapter\s+\d+)/);
            const appendixMatch = rawTitle.match(/^(Appendix\s+[A-Z])/);

            if (numberedPrefixMatch) {
                idPrefix = numberedPrefixMatch[1];
                title = rawTitle.substring(numberedPrefixMatch[0].length).replace(/^:/, '').trim();
                level = (idPrefix.match(/\./g) || []).length + 2; 
            } else if (chapterMatch) {
                idPrefix = chapterMatch[1].replace(/\s+/g, '-').toLowerCase();
                title = rawTitle.substring(chapterMatch[0].length).replace(/^:/, '').trim();
                level = 1; 
            } else if (appendixMatch) {
                idPrefix = appendixMatch[1].replace(/\s+/g, '-').toLowerCase();
                title = rawTitle.substring(appendixMatch[0].length).replace(/^:/, '').trim();
                level = 1;
            } else {
                title = rawTitle;
                idPrefix = slugify(title.split(':')[0] || 'section'); 
                level = 1; 
            }
            
            const id = `${idPrefix}-${slugify(title)}`.replace(/--+/g, '-');

            preliminarySections.push({ id, title, targetWordCount, level, content: '', isFlagged: false, originalWordCount: targetWordCount });
        }
    });

    // Second pass to identify and handle parent sections to prevent double-counting.
    const finalSections: PlanSection[] = [];
    for (let i = 0; i < preliminarySections.length; i++) {
        const current = preliminarySections[i];
        const next = preliminarySections[i + 1];

        // A section is a parent if the *next* section exists and is at a deeper hierarchical level.
        const isParent = next && next.level > current.level;

        if (isParent) {
            // This is a header section. It's kept for structure but its word count is not part of the total.
            finalSections.push({
                ...current,
                targetWordCount: 0, 
                originalWordCount: current.targetWordCount,
            });
        } else {
            // This is a leaf node, its word count should be included in the total.
            finalSections.push(current);
        }
    }

    return finalSections;
};


export const getWordCount = (text: string): number => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
};

export const adjustWordCount = (plan: PlanSection[], globalTarget: number): PlanSection[] => {
    const currentTotal = plan.reduce((sum, section) => sum + section.targetWordCount, 0);

    if (currentTotal === globalTarget) {
        return plan.map(s => ({ ...s, originalWordCount: s.targetWordCount }));
    }
    
    if (currentTotal === 0) return plan;

    const scalingFactor = globalTarget / currentTotal;

    const adjustedPlan = plan.map(section => {
        // Only scale sections that are meant to have content (target > 0)
        const newWordCount = section.targetWordCount > 0 ? Math.round(section.targetWordCount * scalingFactor) : 0;
        
        let justification;
        if (newWordCount > (section.originalWordCount || 0)) {
            justification = `Expand by ${newWordCount - (section.originalWordCount || 0)} words to meet global target.`;
        } else if (newWordCount < (section.originalWordCount || 0)) {
             justification = `Condense by ${(section.originalWordCount || 0) - newWordCount} words to meet global target.`;
        }

        return {
            ...section,
            targetWordCount: newWordCount,
            // originalWordCount is set during parsing, so we don't need to set it again here
            expansionJustification: justification,
        };
    });

    const newTotal = adjustedPlan.reduce((sum, section) => sum + section.targetWordCount, 0);
    const roundingDifference = globalTarget - newTotal;
    
    if (roundingDifference !== 0 && adjustedPlan.length > 0) {
        const largestSectionIndex = adjustedPlan.reduce((largestIndex, currentSection, currentIndex, arr) => {
            // Find the largest section that isn't a header (targetWordCount > 0)
            if ((currentSection.targetWordCount > 0) && (currentSection.targetWordCount > (arr[largestIndex]?.targetWordCount || 0))) {
                return currentIndex;
            }
            return largestIndex;
        }, -1);

        if (largestSectionIndex !== -1) {
            const finalAdjustedCount = adjustedPlan[largestSectionIndex].targetWordCount + roundingDifference;
            adjustedPlan[largestSectionIndex].targetWordCount = finalAdjustedCount > 0 ? finalAdjustedCount : 1;
        }
    }
    
    return adjustedPlan;
};