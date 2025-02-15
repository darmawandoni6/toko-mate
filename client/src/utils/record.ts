export const allRecordString = (val: object) => {
  return Object.entries(val).reduce(
    (acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    },
    {} as Record<string, string>,
  );
};
