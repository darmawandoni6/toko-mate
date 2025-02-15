export type QueryPage = {
  page: number;
  pageSize: number;
};
export type ListQuery = QueryPage & {
  search?: string;
  kategori?: string;
};
