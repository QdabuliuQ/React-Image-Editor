// 节流函数
export default function throttle(
  callback: (...args: Array<any>) => any,
  delay: number = 100
) {
  let start = 0;
  return function (this: any, ...args: Array<any>) {
    const now = +new Date(); //通过+号可以转化成时间戳
    if (now - start > delay) {
      callback.apply(this, args);
      start = now;
    }
  };
}
