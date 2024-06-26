import events from "@/bus";

export default function panelHandle(
  type: string,
  key: string,
  brushProperty: any
) {
  if (type === "inputNumber" || type === "switch" || type === "select") {
    return (e: number | null) => {
      (brushProperty as any)[key] = e;
      events.emit("pathStyleModify", {
        key,
        value: e,
      });
    };
  } else {
    return (e: any) => {
      const color = `rgba(${e.metaColor.r.toFixed(0)}, ${e.metaColor.g.toFixed(
        0
      )}, ${e.metaColor.b.toFixed(0)}, ${e.metaColor.a})`;
      (brushProperty as any)[key] = color;
      events.emit("pathStyleModify", {
        key,
        value: color,
      });
    };
  }
}
