import { INIT_ELEMENT, UPDATE_ELEMENT_BY_IDX } from "@/store/constants/element";
import { Element } from "@/types/element";

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
