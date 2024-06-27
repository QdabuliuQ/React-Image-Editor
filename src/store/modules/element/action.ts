import type { Element } from "@/types/element";

import {
  ADD_ELEMENT,
  DELETE_ELEMENT_BY_IDX,
  INIT_ELEMENT,
  UPDATE_ELEMENT_BY_IDX,
} from "./constant";

// 初始化元素
export function initElement(payload: Array<Element>) {
  return {
    type: INIT_ELEMENT,
    payload,
  };
}

// 修改元素属性
export function updateElementByIdx(payload: { idx: number; data: Element }) {
  return {
    type: UPDATE_ELEMENT_BY_IDX,
    payload,
  };
}

// 添加元素
export function addElement(payload: any) {
  return {
    type: ADD_ELEMENT,
    payload,
  };
}

// 删除元素
export function deleteElementByIdx(payload: string) {
  return {
    type: DELETE_ELEMENT_BY_IDX,
    payload,
  };
}
