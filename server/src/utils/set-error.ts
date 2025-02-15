export const setError = (code: number, error: Error) => {
  const str = { [code]: error.message };
  return new Error(JSON.stringify(str));
};
