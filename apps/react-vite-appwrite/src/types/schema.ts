export type AppwriteDocument<T> = T & {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
};

export type AppwriteListResponse<T> = {
  total: number;
  rows: AppwriteDocument<T>[];
};

export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface Book {
  id: string
  title: string
  author: string
  year: number
  genre: string
  createdAt: Date
  updatedAt: Date
}