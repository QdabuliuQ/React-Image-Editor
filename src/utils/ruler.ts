import { fabric } from "fabric";

type Direction = "vertical" | "horizontal";

// 定义两个常量，用于标识标尺的方向
const HORIZONTAL = "horizontal";
const VERTICAL = "vertical";

/**
 * 创建标尺
 * @param length 标尺长度
 * @param direction 标尺方向, 默认水平
 */
function createRuler(length: number, direction: Direction = HORIZONTAL) {
  // 定义两个方向的标尺线的初始化坐标
  const rulerLinePoints = {
    horizontal: [0, 25, length, 25],
    vertical: [25, 0, 25, length],
  };

  const rect = new fabric.Rect({
    [direction === HORIZONTAL ? "width" : "height"]: length,
    [direction === HORIZONTAL ? "height" : "width"]: 25,
    fill: "#f7f7f7",
    left: -1,
    top: -1,
  });

  // 创建标尺线
  const rulerLine = new fabric.Line(rulerLinePoints[direction as Direction], {
    top: 23,
    left: 23,
    stroke: "#ccc",
    selectable: false,
    strokeWidth: 1,
  });
  window._static_instance.add(rect, rulerLine);

  // 创建水平标尺线上的刻度
  for (let i = 0; i < length; i += 10) {
    const p = i;
    // 通过判断方向来确认刻度线的坐标
    const linePoints =
      direction === HORIZONTAL ? [p, 20, p, 15] : [20, p, 15, p];
    // 创建刻度
    createScale(linePoints, i, direction);
  }
}

/**
 * 创建刻度
 * @param linePoints 刻度线的坐标
 * @param scale 刻度值
 * @param direction 刻度方向
 */
function createScale(
  linePoints: Array<number>,
  scale: number,
  direction: Direction
) {
  const isTen = scale % 100 === 0;
  if (isTen) {
    // 判断方向来修改刻度线的长度
    if (direction === HORIZONTAL) {
      linePoints[3] = 10;
    } else {
      linePoints[2] = 10;
    }
  }

  const line = new fabric.Line(linePoints, {
    left: direction === HORIZONTAL ? linePoints[0] : 17,
    top: direction === HORIZONTAL ? 15 : linePoints[1],
    stroke: "#ccc",
    selectable: false,
    strokeWidth: 1,
    // 新增 _attr 属性，用于记录刻度的数值和方向
    _attr: {
      scale: scale,
      direction: direction,
    },
  });
  const text = new fabric.Text(isTen ? scale.toString() : "", {
    left: direction === HORIZONTAL ? linePoints[0] - 7 : 0,
    top: direction === HORIZONTAL ? 2 : linePoints[1],
    fontSize: 10,
    selectable: false,
    color: "#ccc",
    // 新增 _attr 属性，用于记录刻度的数值和方向
    _attr: {
      scale: scale,
      direction: direction,
    },
  });
  window._static_instance.add(line, text);
}

// 初始化静态画布
export function initStaticCanvas(width: number, height: number) {
  // 初始化标尺
  createRuler(width, HORIZONTAL);
  createRuler(height, VERTICAL);

  // 坐标标识线
  window.horizontalLine = new fabric.Line([0, 25, 25, 25], {
    stroke: "#1677ff",
    selectable: false,
    strokeWidth: 1,
  });
  window._static_instance.add(window.horizontalLine);

  window.verticalLine = new fabric.Line([25, 0, 25, 25], {
    stroke: "#1677ff",
    selectable: false,
    strokeWidth: 1,
  });
  window._static_instance.add(window.verticalLine);

  window._static_instance.renderAll();
}

function dataPacket() {
  const horizontalLines: Array<any> = [];
  const horizontalTexts: Array<any> = [];
  const verticalLines: Array<any> = [];
  const verticalTexts: Array<any> = [];
  window._static_instance.getObjects().forEach((item: any) => {
    if (item._attr) {
      if (item._attr.direction === HORIZONTAL) {
        if (item.type === "line") {
          horizontalLines.push(item);
        } else if (item.type === "text") {
          horizontalTexts.push(item);
        }
      } else if (item._attr.direction === VERTICAL) {
        if (item.type === "line") {
          verticalLines.push(item);
        } else if (item.type === "text") {
          verticalTexts.push(item);
        }
      }
    }
  });

  return {
    horizontalLines: horizontalLines.sort(
      (a, b) => a._attr.scale - b._attr.scale
    ),
    horizontalTexts: horizontalTexts.sort(
      (a, b) => a._attr.scale - b._attr.scale
    ),
    verticalLines: verticalLines.sort((a, b) => a._attr.scale - b._attr.scale),
    verticalTexts: verticalTexts.sort((a, b) => a._attr.scale - b._attr.scale),
  };
}

const resetLine = (
  item: { type: string; set: (...args: Array<any>) => void; _attr: any },
  scale: number,
  options: any
) => {
  if (item.type !== "line") return;
  item.set({
    ...options,
    _attr: {
      ...item._attr,
      scale,
    },
  });
};

const resetText = (
  item: { type: string; set: (...args: Array<any>) => void; _attr: any },
  num: number,
  options: any
) => {
  if (item.type !== "text") return;
  const text = num % 100 === 0 ? num.toString() : "";
  item.set({
    ...options,
    text: text,
    _attr: {
      ...item._attr,
      scale: num,
    },
  });
};

// 水平移动
export function moveHorizontally(e: any, width: number) {
  const { horizontalLines, horizontalTexts } = dataPacket();

  // 找到最大值和最小值
  const horizontal = horizontalLines.map((item) => item._attr.scale);
  let horizontalMin = Math.min(...horizontal);
  let horizontalMax = Math.max(...horizontal);

  // 缓存文字的偏移量，文字和点位的坐标是相同的
  const textOffsets: {
    [propName: string]: any;
  } = {};

  // 定义左移和右移的方法
  const leftMove = (line: {
    left: number;
    _attr: { [propName: string]: any };
  }) => {
    const moveX = line.left + e.movementX;
    let scale = line._attr.scale;
    let options = {
      left: line.left + e.movementX,
    };

    // 如果超出了最小值，那么就需要复用最大值减一个点位，并更新最大值
    if (moveX < 20) {
      scale = horizontalMax = horizontalMax + 10;
      options = {
        left: width + moveX,
      };
    }

    // 缓存文字的偏移量
    textOffsets[line._attr.scale] = {
      scale,
      options,
    };

    // 更新点位
    resetLine(line as any, scale, options);
  };

  const rightMove = (line: { left: number; _attr: any }) => {
    const moveX = line.left + e.movementX;
    let scale = line._attr.scale;
    let options = {
      left: line.left + e.movementX,
    };

    // 如果超出了最大值，那么就需要复用最小值加一个点位，并更新最小值
    if (moveX >= width + 20) {
      scale = horizontalMin = horizontalMin - 10;
      options = {
        left: moveX - width,
      };
    }

    // 缓存文字的偏移量
    textOffsets[line._attr.scale] = {
      scale,
      options,
    };

    // 更新点位
    resetLine(line as any, scale, options);
  };

  // 遍历所有的点位，然后进行左移和右移
  let headPointer = 0;
  let tailPointer = horizontalLines.length - 1;
  while (headPointer < tailPointer) {
    // 左移
    const headLine = horizontalLines[headPointer];
    leftMove(headLine);
    headPointer++;

    // 右移
    const tailLine = horizontalLines[tailPointer];
    rightMove(tailLine);
    tailPointer--;
  }

  // 如果是奇数个点位，那么中间的点位就随便左移或者右移都可以，这里我选择左移
  if (headPointer === tailPointer) {
    const headLine = horizontalLines[headPointer];
    leftMove(headLine);
  }

  // 更新文字的位置
  for (let i = 0; i < horizontalTexts.length; i++) {
    const text = horizontalTexts[i];

    // 通过缓存的偏移量来更新文字的位置
    const { scale, options } = textOffsets[text._attr.scale];
    resetText(text, scale, options);
  }
}

// // 垂直移动
// export function moveVertically(e: any, height: number) {
//   const { verticalLines, verticalTexts } = dataPacket();
//   const vertical = verticalLines.map((item) => item._attr.scale);
//   let verticalMin = Math.min(...vertical);
//   let verticalMax = Math.max(...vertical);

//   const verticalTextOffsets = {};
//   const topMove = (line: { top: number; _attr: any }) => {
//     const moveY = line.top + e.movementY;
//     let scale = line._attr.scale;
//     let options = {
//       top: line.top + e.movementY,
//     };
//     if (moveY < 20) {
//       scale = verticalMax = verticalMax + magnification;
//       options = {
//         top: height + moveY,
//       };
//     }

//     verticalTextOffsets[line._attr.scale] = {
//       scale,
//       options,
//     };
//     resetLine(line, scale, options);
//   };

//   const bottomMove = (line) => {
//     const moveY = line.top + e.movementY;
//     let scale = line._attr.scale;
//     let options = {
//       top: line.top + e.movementY,
//     };
//     if (moveY > height + 20) {
//       scale = verticalMin = verticalMin - magnification;
//       options = {
//         top: moveY - height,
//       };
//     }

//     verticalTextOffsets[line._attr.scale] = {
//       scale,
//       options,
//     };
//     resetLine(line, scale, options);
//   };

//   let headPointer = 0;
//   let tailPointer = verticalLines.length - 1;
//   while (headPointer < tailPointer) {
//     const headLine = verticalLines[headPointer];
//     topMove(headLine);
//     headPointer++;

//     const tailLine = verticalLines[tailPointer];
//     bottomMove(tailLine);
//     tailPointer--;
//   }
//   if (headPointer === tailPointer) {
//     const headLine = verticalLines[headPointer];
//     topMove(headLine);
//   }

//   for (let i = 0; i < verticalTexts.length; i++) {
//     const text = verticalTexts[i];
//     const data = verticalTextOffsets[text._attr.scale];
//     if (!data) {
//       staticCanvas.getObjects().forEach((item) => {
//         if (item._attr && item._attr.scale === text._attr.scale) {
//           item.set({
//             stroke: "red",
//           });
//         }
//       });
//       continue;
//     }
//     const { scale, options } = verticalTextOffsets[text._attr.scale];
//     resetText(text, scale, options);
//   }
// }
