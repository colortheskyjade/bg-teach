// Shared types and utilities

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
