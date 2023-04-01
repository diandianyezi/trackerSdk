export const createHistoryEvent = <T extends keyof History>(type: T) => {
  const origin = history[type];

  return function() {
    //如果出现 ths隐式具有类型any的报错，有俩解决方式，
    // 1. 在tsconfig.json里的noImplicitThis设置为false。
    // 2. 给this定义一个类型
    const res = origin.apply(this, arguments);
    
    const e = new Event(type);
    window.dispatchEvent(e); // 通过window.addEventListener 可以监听到这个事件

    return res
  }
}


createHistoryEvent('pushState')