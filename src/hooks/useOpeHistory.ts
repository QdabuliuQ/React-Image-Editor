import { useCallback } from "react";
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

const maxLength = 30;

export default function useOpeHistory() {
  const undoStack = useSelector((state: any) => state.undoStack);
  const redoStack = useSelector((state: any) => state.redoStack);
  const dispatch = useDispatch();

  // 保存操作
  const saveOperation = useCallback(() => {
    const json = window._instance.toDatalessJSON();
    if (undoStack.length === maxLength) {
      dispatch(shiftOperationUndoStack());
    }
    dispatch(pushOperationUndoStack(json));
  }, [undoStack]);

  // 上一步操作
  const getPrevOperation = useCallback(() => {
    console.log(undoStack.length);

    if (!undoStack.length || !window._instance) return;
    const json = undoStack[undoStack.length - 1];
    dispatch(popOperationUndoStack());
    if (redoStack.length === maxLength) {
      dispatch(shiftOperationRedoStack());
    }

    dispatch(pushOperationRedoStack(json));
    console.log(undoStack.length);

    if (undoStack.length - 1 === 0) {
      window._instance.forEachObject(function (object: ElementObj) {
        if (object._data) {
          window._instance.remove(object);
        }
      });
    } else {
      window._instance
        .loadFromJSON(undoStack[undoStack.length - 1])
        .renderAll();
    }
  }, [undoStack, redoStack]);

  const getNextOperation = useCallback(() => {
    if (!redoStack.length || !window._instance) return;
    const json = redoStack[redoStack.length - 1];
    dispatch(popOperationRedoStack());
    if (undoStack.length === maxLength) {
      dispatch(shiftOperationUndoStack());
    }
    dispatch(pushOperationUndoStack(json));
    window._instance.loadFromJSON(json).renderAll();
  }, [undoStack, redoStack]);

  return {
    saveOperation,
    getPrevOperation,
    getNextOperation,
    undoStack,
    redoStack,
  };
}
