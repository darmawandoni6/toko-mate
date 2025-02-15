export interface ResponseAPI<T> {
  status: number;
  data: T;
  message: string;
}

export interface Option {
  label: string;
  value: string;
}
