import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function useActiveIdx() {
  const active = useSelector((state: any) => state.active);
  const elements = useSelector((state: any) => state.element);

  const [element, setElement] = useState(null);
  const [idx, setIdx] = useState(-1);
  useEffect(() => {
    console.log(active, "active");

    if (active) {
      for (let i = 0; i < elements.length; i++) {
        if (elements[i]._data.id === active) {
          setIdx(i);
          setElement(elements[i]);
          break;
        }
      }
    } else {
      setIdx(-1);
    }
  }, [active]);

  return [idx, active, element, elements];
}
