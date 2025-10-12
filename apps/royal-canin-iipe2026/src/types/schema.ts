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
  name: string;
  phone: string;
  points: number;
  $createdAt: Date;
  $updatedAt: Date;
}

export enum Activity {
  FindPet = "find_pet",
  Quiz = "quiz"
}

export interface ActivityLog {
  $id: string;
  participant: Participant;
  activity: Activity;
  $createdAt: Date;
  $updatedAt: Date;
}