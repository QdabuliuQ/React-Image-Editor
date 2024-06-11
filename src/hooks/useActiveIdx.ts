import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function useActiveIdx() {
  const active = useSelector((state: any) => state.active);
  const element = useSelector((state: any) => state.element);

  const [idx, setIdx] = useState(-1);
  useEffect(() => {
    if (active) {
      for (let i = 0; i < element.length; i++) {
        if (element[i]._data.id === active) {
          setIdx(i);
          break;
        }
      }
    } else {
      setIdx(-1);
    }
  }, [active]);

  return [idx, active, element];
}
