export const debounce = <T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timerId: number;

  return (...args: Parameters<T>): void => {
    timerId = setTimeout(() => {
      console.log({ timerId });
      fn(...args);
      clearTimeout(timerId);
    }, delay);
  };
};
