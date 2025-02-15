export const dateValue = (date: Date): string => {
  const str = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  const [day, month, year] = str.split('/');

  return `${year}-${month}-${day}`;
};
