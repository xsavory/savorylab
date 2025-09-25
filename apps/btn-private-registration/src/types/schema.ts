export type AppwriteDocument<T> = T & {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
};

export type AppwriteListResponse<T> = {
  total: number;
  rows: AppwriteDocument<T>[];
};

export interface Participant {
  id: string
  name: string
  email?: string
  phone?: string
  isCheckedIn: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Attendance {
  id: string
  participantId: string
  checkedInAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface Admins {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}