// 防抖函数
export default function debounce(
  callback: (...args: Array<any>) => any,
  delay: number = 1000
) {
  let timer: NodeJS.Timeout;
  return (...args: Array<any>) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
