import { FutureSlip, Achievement } from '@/types';

/**
 * Utilities for formatting and parsing future slip content
 */

/**
 * Format a future slip for display in chat
 */
export const formatFutureSlip = (slip: FutureSlip): string => {
  return `[Suddenly catches itself]\n\n${slip.slipText}\n\n[Quickly changes subject]`;
};

/**
 * Parse a future slip from AI response
 * Looks for patterns like mentions of future achievements
 */
export const detectFutureSlip = (text: string): string | null => {
  // This would be implemented based on actual API response format
  // For now, return null - the actual implementation would parse the response
  // to detect when the AI "slips" and mentions a future achievement
  const slipMarkers = [
    'your [',
    'that [',
    'when you [',
    'after your ['
  ];

  for (const marker of slipMarkers) {
    if (text.includes(marker)) {
      return text;
    }
  }

  return null;
};

/**
 * Extract achievement type from slip content
 */
export const extractAchievementType = (content: string): Achievement['type'] => {
  const lowerContent = content.toLowerCase();

  if (lowerContent.includes('ted talk') || lowerContent.includes('keynote')) {
    return 'ted_talk';
  }
  if (lowerContent.includes('patent') || lowerContent.includes('invention')) {
    return 'patent';
  }
  if (lowerContent.includes('company') || lowerContent.includes('startup') || lowerContent.includes('founded')) {
    return 'company';
  }
  if (lowerContent.includes('award') || lowerContent.includes('prize') || lowerContent.includes('nobel')) {
    return 'award';
  }
  if (lowerContent.includes('published') || lowerContent.includes('paper') || lowerContent.includes('book')) {
    return 'publication';
  }
  if (lowerContent.includes('discovered') || lowerContent.includes('breakthrough')) {
    return 'discovery';
  }

  return 'other';
};

/**
 * Generate slip text variations
 */
export const generateSlipText = (achievement: Achievement): string => {
  const variations = {
    ted_talk: [
      `Wait... this reminds me of your TED talk... Actually, never mind. That's not until ${achievement.supposedYear}.`,
      `This is exactly what you talked about in— oh, I shouldn't mention that yet.`,
      `You explained this so well in your keynote... forget I said that.`
    ],
    patent: [
      `This relates to your patent on... never mind, that hasn't happened yet.`,
      `When you filed that patent in ${achievement.supposedYear}... wait, I shouldn't spoil that.`,
      `Your invention would solve this perfectly, but... I'm getting ahead of myself.`
    ],
    company: [
      `Your company actually deals with this exact problem... but that's in the future.`,
      `This is why you started... no, I can't tell you about that yet.`,
      `When your team tackles this at... I should stop there.`
    ],
    award: [
      `This is what earned you that award in... never mind.`,
      `Your breakthrough work on this... I'm revealing too much.`,
      `The recognition you'll get for this... I shouldn't say more.`
    ],
    publication: [
      `You wrote about this in your... actually, that's not published until ${achievement.supposedYear}.`,
      `Your research paper on this... forget I mentioned that.`,
      `This is in chapter three of... I'm getting ahead of the timeline.`
    ],
    discovery: [
      `Your discovery about this in ${achievement.supposedYear}... I've said too much.`,
      `This is exactly what led to your breakthrough... but that's years from now.`,
      `When you figured this out, it changed... never mind.`
    ],
    other: [
      `This connects to something important in your future... I shouldn't elaborate.`,
      `You'll understand this even better when... I'm revealing too much.`,
      `This becomes significant later in your timeline... I should stop there.`
    ]
  };

  const options = variations[achievement.type] || variations.other;
  return options[Math.floor(Math.random() * options.length)];
};

/**
 * Check if enough time has passed to reveal another slip
 * Rate limiting to keep slips special
 */
export const shouldRevealSlip = (
  lastSlipTime: string | null,
  minInterval: number = 30 * 60 * 1000 // 30 minutes default
): boolean => {
  if (!lastSlipTime) {
    return true;
  }

  const elapsed = Date.now() - new Date(lastSlipTime).getTime();
  return elapsed > minInterval;
};

/**
 * Format context for achievement reveal
 */
export const formatAchievementContext = (context: string): string => {
  const maxLength = 100;
  if (context.length <= maxLength) {
    return context;
  }

  return context.substring(0, maxLength) + '...';
};
