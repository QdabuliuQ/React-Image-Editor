import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  popOperationRedoStack,
  pushOperationRedoStack,
  shiftOperationRedoStack,
} from "@/store/modules/redoStack/action";
import type { ElementObj } from "@/store/modules/redoStack/types";
import {
  popOperationUndoStack,
  pushOperationUndoStack,
  shiftOperationUndoStack,
} from "@/store/modules/undoStack/actions";
import { elementOptions, initElementProperty } from "@/utils/element";

const maxLength = 30;

function updateElementMap() {
  window.elementMap.clear()
  for (const item of window._instance.getObjects()) {
    if (!item._data) continue
    window.elementMap.set(item._data.id, item)
  }
}

export default function useOpeHistory() {
  const undoStack = useSelector((state: any) => state.undoStack);
  const redoStack = useSelector((state: any) => state.redoStack);
  const dispatch = useDispatch();

  // 保存操作
  const saveOperation = () => {
    const json = window._instance.toObject();

    if (undoStack.length === maxLength) {
      dispatch(shiftOperationUndoStack());
    }
    dispatch(pushOperationUndoStack(json));

    updateElementMap()
  };

  // 上一步操作
  const getPrevOperation = () => {

    if (!undoStack.length || !window._instance) return;

    // 撤销栈弹出
    const json = undoStack[undoStack.length - 1];
    dispatch(popOperationUndoStack());
    // 如果超过最大数量
    if (redoStack.length === maxLength) {
      dispatch(shiftOperationRedoStack());
    }
    // 加入重做栈
    dispatch(pushOperationRedoStack(json));
    if (undoStack.length === 0) {
      window._instance.forEachObject(function (object: ElementObj) {
        if (object._data) {
          window._instance.remove(object);
        }
      });
    } else {
      window._instance
        .loadFromJSON(undoStack[undoStack.length - 1])
        .renderAll();
      // 恢复元素属性
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
    updateElementMap()
  };

  const getNextOperation = () => {
    if (!redoStack.length || !window._instance) return;
    window.elementMap.clear()
    const json = redoStack[redoStack.length - 1];
    dispatch(popOperationRedoStack());
    if (undoStack.length === maxLength) {
      dispatch(shiftOperationUndoStack());
    }
    dispatch(pushOperationUndoStack(json));
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
    updateElementMap()
  };

  useEffect(() => { }, [redoStack, undoStack])

  return {
    saveOperation,
    getPrevOperation,
    getNextOperation,
    undoStack,
    redoStack,
  };
}
