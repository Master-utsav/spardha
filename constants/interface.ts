import { ObjectId } from 'mongodb';

export interface QuizDetails {
  _id: ObjectId;
  quizId: string;
  quizName: string;
  entryFee: number;
  prizeMoney: number[];
  isDurationBased: boolean;
  duration: string;
  createdBy: string;
  authorName: string;
  languages: string[];
  difficulty: string;
  description: string;
  rules: string[];
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  createdAt?: Date;
}

export interface QuizQuestion {
  _id: ObjectId;
  event: string;
  quizId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  marks: number;
  language: string;
  negativeMarks: number;
  createdAt?: Date;
  createdBy: string;
}

export interface SanitizedQuizQuestion {
  _id: string;
  event: string;
  quizId: string;
  question: string;
  options: string[];
  marks: number;
  language: string;
  negativeMarks: number;
  createdAt: string | null;
  createdBy: string;
}

export interface quizDetails {
  _id: string;
  createdAt: string | null;
  quizId: string;
  quizName: string;
  isDurationBased: boolean;
  duration: string;
  difficulty: string;
  description: string;
  prizeMoney: number[];
  entryFee: number;
  createdBy: string;
  authorName: string;
  languages: string[];
  rules: string[];
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface NewEnrollmentInterface {
  competition: string;
  quizId: string;
  isEnrolled: boolean;
  attempts: number;
}

export interface QuizResult {
  score: number;
  timeSpent: number;
  answer: any;
  language: string;
  submittedAt: string;
}
