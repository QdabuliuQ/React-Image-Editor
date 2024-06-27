import events from "@/bus";

import { elementOptions, initElementProperty } from "./element";

const maxLength = 30;
window.undoStack = []; // 撤销
window.redoStack = []; // 重做

// 保存操作
export function saveOperation() {
  // const json = window._instance.toDatalessJSON();
  const json = window._instance.toObject();
  console.log(json);

  if (window.undoStack.length === 30) {
    window.undoStack.shift();
  }
  window.undoStack.push(json);
  events.emit("elementChange");
}

// 上一步操作
export function getPrevOperation() {
  if (!window.undoStack.length) return;
  const json = window.undoStack.pop(); // 获取上一次修改

  if (window.redoStack.length === maxLength) {
    window.redoStack.shift();
  }
  // 加入重做数组
  window.redoStack.push(json);
  // 如果没有操作记录
  if (window.undoStack.length === 0) {
    // 移除全部元素
    window._instance.forEachObject(function (object: any) {
      if (object._data) {
        window._instance.remove(object);
      }
    });
  } else {
    // 如果存在操作记录
    // 加载最后一条
    window._instance
      .loadFromJSON(window.undoStack[window.undoStack.length - 1])
      .renderAll();

    for (const item of window._instance.getObjects()) {
      console.log(item);

      if (!item._data) {
        item.set({
          selectable: false,
          hasControls: false,
          hoverCursor: "default",
        });
      } else {
        item.set({
          ...elementOptions,
        });
        initElementProperty(item);
      }
    }
  }
}

// 下一步操作
export function getNextOperation() {
  if (!window.redoStack.length) return;
  const json = window.redoStack.pop();
  if (window.undoStack.length === maxLength) {
    window.undoStack.shift();
  }
  window.undoStack.push(json);
  window._instance.loadFromJSON(json).renderAll();

  for (const item of window._instance.getObjects()) {
    if (!item._data) {
      item.set({
        selectable: false,
        hasControls: false,
        hoverCursor: "default",
      });
    } else {
      item.set({
        ...elementOptions,
      });
      initElementProperty(item);
    }
  }
}
