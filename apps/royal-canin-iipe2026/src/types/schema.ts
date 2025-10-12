export type AppwriteDocument<T> = T & {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
};

export type AppwriteListResponse<T> = {
  total: number;
  rows: AppwriteDocument<T>[];
};

export interface Admin {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface Participant {
  $id: string;
  id: string;
  name: string;
  phone: string;
  points: number;
  $createdAt: Date;
  $updatedAt: Date;
}

export enum Activity {
  FindPet = "find-pet",
  ARQuiz = "ar-quiz",
  VetEduQuiz = "vet-edu-quiz",
  SustainabilityQuiz = "sustainability-quiz"
}

export interface ActivityLog {
  $id: string;
  participants: Participant | string;
  activity: Activity;
  points: number;
  $createdAt: Date;
  $updatedAt: Date;
}