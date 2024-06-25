import { fabric } from "fabric";

import events from "@/bus";
import { Shadow } from "@/components/pencilPanel/type";

import debounce from "./debounce";

export default function shadowHandle(
  shadow: Shadow,
  key: keyof Shadow,
  type: string
): any {
  if (type === "inputNumber") {
    return debounce((e: number) => {
      (shadow as any)[key] = e;
      events.emit("pathStyleModify", {
        key: "shadow",
        value: new fabric.Shadow(shadow),
      });
    });
  } else {
    return debounce((e: any) => {
      (shadow as any)[key] = `rgba(${e.metaColor.r.toFixed(
        0
      )}, ${e.metaColor.g.toFixed(0)}, ${e.metaColor.b.toFixed(0)}, ${
        e.metaColor.a
      })`;
      events.emit("pathStyleModify", {
        key: "shadow",
        value: new fabric.Shadow(shadow),
      });
    });
  }
}
