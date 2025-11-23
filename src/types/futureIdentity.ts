export type IdentityType =
  | 'founder'
  | 'creator'
  | 'healer'
  | 'builder'
  | 'discoverer'
  | 'changemaker'
  | 'custom';

export interface FutureIdentity {
  id: string;
  type: IdentityType;
  customType?: string;
  breakthroughAge: number;
  ambition: string;
  createdAt: string;
  currentAge?: number; // User's actual current age
}

export interface TimelineStatus {
  actualAge: number;
  thinkingAge: number;
  yearsCompressed: number;
  breakthroughAge: number;
  yearsToBreakthrough: number;
  trajectory: 'accelerating' | 'steady' | 'stalled';
  lastUpdated: string;
}

export interface TimelineUpdate {
  yearsCompressed: number;
  conceptLearned: string;
  normalLearningAge?: number;
  timestamp: string;
}

export interface Achievement {
  id: string;
  type: 'ted_talk' | 'patent' | 'company' | 'award' | 'publication' | 'discovery' | 'milestone' | 'other';
  content: string;
  supposedYear: number;
  revealedAt: string;
  context: string; // What conversation triggered this
  icon?: string;
}

export interface FutureSlip {
  achievement: Achievement;
  slipText: string; // The actual text that "slipped" from the AI
}

export interface TimelineMilestone {
  id: string;
  concept: string;
  normalLearningAge: number;
  actualAge: number;
  yearsSaved: number;
  timestamp: string;
}

export interface FutureSelfState {
  identity: FutureIdentity | null;
  timelineStatus: TimelineStatus | null;
  revealedAchievements: Achievement[];
  recentMilestones: TimelineMilestone[];
  isLoading: boolean;
  lastCompression: number;
  error: string | null;
}

export interface CreateFutureIdentityRequest {
  type: IdentityType;
  customType?: string;
  breakthroughAge: number;
  ambition: string;
  currentAge: number;
}

export interface IdentityCardData {
  type: IdentityType;
  title: string;
  description: string;
  exampleAchievements: string[];
  icon: string;
  gradient: string;
}

export const IDENTITY_CARDS: IdentityCardData[] = [
  {
    type: 'founder',
    title: 'Founder',
    description: 'Build companies that change the world',
    exampleAchievements: [
      'Launch a startup that reaches millions',
      'Create technology that solves real problems',
      'Build a team that shares your vision'
    ],
    icon: '🚀',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    type: 'creator',
    title: 'Creator',
    description: 'Make art that inspires humanity',
    exampleAchievements: [
      'Create work that moves people worldwide',
      'Master your craft at the highest level',
      'Build a community around your art'
    ],
    icon: '🎨',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    type: 'healer',
    title: 'Healer',
    description: 'Advance medicine and save lives',
    exampleAchievements: [
      'Discover breakthrough treatments',
      'Help thousands of patients recover',
      'Pioneer new medical techniques'
    ],
    icon: '⚕️',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    type: 'builder',
    title: 'Builder',
    description: 'Design and create the future',
    exampleAchievements: [
      'Engineer solutions to complex problems',
      'Build systems that last generations',
      'Create infrastructure that enables progress'
    ],
    icon: '🔧',
    gradient: 'from-orange-500 to-amber-500'
  },
  {
    type: 'discoverer',
    title: 'Discoverer',
    description: 'Push the boundaries of knowledge',
    exampleAchievements: [
      'Make discoveries that rewrite textbooks',
      'Explore uncharted territories',
      'Answer questions nobody else could'
    ],
    icon: '🔬',
    gradient: 'from-indigo-500 to-blue-500'
  },
  {
    type: 'changemaker',
    title: 'Changemaker',
    description: 'Transform society for the better',
    exampleAchievements: [
      'Lead movements that change policy',
      'Give voice to the voiceless',
      'Create lasting positive change'
    ],
    icon: '✊',
    gradient: 'from-rose-500 to-red-500'
  }
];

export const AMBITION_PLACEHOLDERS: Record<IdentityType, string> = {
  founder: 'Creating technology that helps millions live better lives',
  creator: 'Making art that inspires people to see the world differently',
  healer: 'Discovering breakthrough treatments for diseases',
  builder: 'Engineering solutions to climate change',
  discoverer: 'Unlocking the mysteries of the universe',
  changemaker: 'Fighting for justice and equality worldwide',
  custom: 'What do you want to be known for?'
};

export const ACHIEVEMENT_ICONS: Record<Achievement['type'], string> = {
  ted_talk: '🎤',
  patent: '📜',
  company: '🏢',
  award: '🏆',
  publication: '📚',
  discovery: '🔬',
  milestone: '⭐',
  other: '✨'
};
