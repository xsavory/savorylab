export type AppwriteDocument<T> = T & {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
};

export type AppwriteListResponse<T> = {
  total: number;
  rows: AppwriteDocument<T>[];
};

export interface Admins {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface Participant {
  $id: string
  name: string
  email?: string
  phone?: string
  isCheckedIn: boolean
  checkedInAt: string
  $createdAt: Date
  $updatedAt: Date
}

export interface Attendance {
  $id: string
  participant: Participant
  $createdAt: Date
  $updatedAt: Date
}