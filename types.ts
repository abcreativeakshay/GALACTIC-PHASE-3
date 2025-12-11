export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  isSystem?: boolean;
}

export enum DifficultyLevel {
  Cadet = "Cadet (Beginner)",
  Officer = "Officer (Intermediate)",
  Commander = "Commander (Advanced)",
  Overseer = "Overseer (Expert)"
}

export interface RadarStats {
  speed: number;
  accuracy: number;
  scalability: number;
  interpretability: number;
  trainingDifficulty: number;
  resourceCost: number;
}

export interface UseCase {
  title: string;
  description: string;
  industry: string;
}

export interface Pitfall {
  warning: string;
  solution: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  xpReward: number;
}

export interface InterviewQuestion {
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  sampleAnswer: string;
}

export interface HyperparameterDetail {
  description: string;
  range: string;
  impact: string;
}

export interface ImplementationStep {
  step: string;
  details: string;
}

export interface StudyGuideData {
  modelName: string;
  category: string;
  difficultyLevel: string;
  estimatedStudyTime: string;
  
  coreMechanics: {
    definition: string;
    keyFacts: string[];
    mathematicalFoundation: string;
    architectureOverview: string;
  };
  
  tacticalAnalysis: {
    radarStats: RadarStats;
    trainingSimulation: {
      epochs: number[];
      loss: number[];
      accuracy: number[];
    };
    rivalModels: string[];
    strategicAssessment: {
      pros: string[];
      cons: string[];
    };
  };
  
  engineRoom: {
    pythonSkeleton: string;
    hyperparameters: Record<string, HyperparameterDetail>;
    implementationSteps: ImplementationStep[];
  };
  
  fieldOperations: {
    useCases: UseCase[];
    commonPitfalls: Pitfall[];
    debugCommands: string[];
  };
  
  officerTraining: {
    quiz: QuizQuestion[];
    interviewQuestions: InterviewQuestion[];
    mnemonics: string[];
  };
  
  archives: {
    yearIntroduced: string;
    inventors: string[];
    seminalPaper: {
      title: string;
      arxivId?: string;
    };
    prerequisites: string[];
    nextSteps: string[];
  };
  
  aiEnhancements: {
    adaptiveExplanation: {
      eli5: string;
      undergraduate: string;
      graduate: string;
    };
    customAnalogy: string;
    ethicsAlert: string | null;
  };
}