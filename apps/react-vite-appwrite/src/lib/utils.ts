import type { AppwriteDocument, AppwriteListResponse } from "src/types/schema";

interface CapitaliseOptions {
  start: number;
  end: number;
}

/**
 * Capitalises the characters of a provided string between the given start and end indexes
 */
export function capitalise(value: string, options?: Partial<CapitaliseOptions>): string {
  const { length } = value;

  let { start, end }: CapitaliseOptions = { start: 0, end: length, ...options };

  if (start < 0) {
    start = 0;
  }

  if (end > length) {
    end = length;
  }

  const stringStart = value.substring(0, start);
  const capitalise = value.substring(start, end);
  const stringEnd = value.substring(end, length);

  return `${stringStart}${capitalise.toUpperCase()}${stringEnd}`;
}

/** 
 * Helper to format API responses
 */
export function formatApiResponse<T>(data: T | null, error: unknown) {
  if (error) {
    return { 
      data: null,
      error: error instanceof Error ? error.message : String(error),
      success: false,
    };
  }

  return { 
    data, 
    error: null, 
    success: true 
  };
}

/** 
 * Helper function to type Appwrite list response
 */
export function createTypedListResponse<T>(response: { total: number; rows: unknown[] }): AppwriteListResponse<T>{
  return {
    ...response,
    rows: response.rows as unknown as AppwriteDocument<T>[]
  }
};