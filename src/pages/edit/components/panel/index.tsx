import { memo, useEffect, useState } from "react";
import { Button } from "antd";

import ColorPicker from "@/components/colorPicker";
import InputNumber from "@/components/inputNumber";
import OptionItem from "@/components/optionItem";
import Select from "@/components/select";
import Switch from "@/components/switch";
import { useActiveIdx } from "@/hooks/useActiveIdx";
import { getConfig } from "@/utils/getConfig";

import "./index.less";

export default memo(function Panel() {
  const [idx, , element] = useActiveIdx();
  const [config, setConfig] = useState(null);

  const fetchConfig = async () => {
    const res = await getConfig(element._data.type);
    setConfig(res);
  };

  useEffect(() => {
    if (idx != -1) {
      fetchConfig();
    } else {
      setConfig(null);
    }
  }, [idx]);

  return (
    <div className="panel-component">
      <div key={idx} className="panel-container">
        {idx == -1 || !config ? (
          <div>common</div>
        ) : (
          <>
            {(config as unknown as Array<any>).map((item: any) => (
              <OptionItem key={item.title} title={item.title}>
                {item.type === "inputNumber" ? (
                  <InputNumber
                    {...item}
                    idx={idx}
                    defaultValue={element[item.name]}
                  />
                ) : item.type === "colorPicker" ? (
                  <ColorPicker
                    {...item}
                    idx={idx}
                    defaultValue={element[item.name]}
                  />
                ) : item.type === "select" ? (
                  <Select
                    {...item}
                    idx={idx}
                    defaultValue={element[item.name]}
                  />
                ) : item.type === "switch" ? (
                  <Switch
                    {...item}
                    idx={idx}
                    defaultValue={element[item.name]}
                  />
                ) : (
                  <></>
                )}
              </OptionItem>
            ))}
            <Button
              style={{
                marginTop: "10px",
              }}
              block={true}
              type="primary"
              danger
            >
              删除元素
            </Button>
            <Button block={true} type="primary">
              {element.selectable ? "锁定元素" : "解锁元素"}
            </Button>
            <Button block={true}>
              {element.visible ? "隐藏元素" : "显示元素"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
});
