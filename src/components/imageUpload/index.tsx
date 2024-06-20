import { memo, useCallback, useMemo, useState } from "react";
import {
  Image,
  Input,
  message,
  Modal,
  Radio,
  RadioChangeEvent,
  UploadProps,
} from "antd";
import Dragger from "antd/es/upload/Dragger";

import validateFile from "@/utils/validateFile";

import { Props } from "./type";

import style from "./index.module.less";

export default memo(function ImageUpload(props: Props) {
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<Array<string>>([]);

  // 图片确认上传
  const picModelConfirmEvent = useCallback(() => {
    if (!fileList.length)
      return messageApi.open({
        type: "error",
        content: "请先上传图片",
      });
    const img = document.createElement("img");
    img.src = fileList[0];
    img.onload = function () {
      messageApi.open({
        type: "success",
        content: "图片上传成功",
      });
      props.successEvent(fileList[0], img.width, img.height);
      setFileList([]);
    };
    img.onerror = function () {
      messageApi.open({
        type: "error",
        content: "图片加载失败，请重新上传",
      });
    };
  }, [fileList, messageApi]);

  const picModelCancelEvent = useCallback(() => {
    props.cancelEvent();
  }, []);

  const config = useMemo<UploadProps>(
    () => ({
      name: "file",
      multiple: true,
      maxCount: 1,
      onChange(info) {
        const res = validateFile(info.file as unknown as File);
        if (!res.status)
          return messageApi.open({
            type: "error",
            content: res.msg,
          });

        const reader = new FileReader();
        reader.onloadend = function () {
          // 读取完成后的回调函数
          setFileList([reader.result as string]);
        };

        reader.readAsDataURL(info.file.originFileObj as Blob);
      },
      customRequest() {},
      fileList: [],
    }),
    []
  );
  const [type, setType] = useState("local");
  const options = useMemo(
    () => [
      {
        label: "本地上传",
        value: "local",
      },
      {
        label: "图片外链",
        value: "link",
      },
    ],
    []
  );
  const radioChangeEvent = useCallback(
    ({ target: { value } }: RadioChangeEvent) => {
      setType(value);
    },
    []
  );
  // 插入回调
  const insertEvent = useCallback((value: string) => {
    setFileList([value]);
  }, []);

  return (
    <Modal
      title="插入图片"
      centered
      open={props.isShow}
      onOk={picModelConfirmEvent}
      onCancel={picModelCancelEvent}
      okText="确认"
      cancelText="取消"
    >
      {contextHolder}
      <Radio.Group
        style={{
          marginTop: "10px",
        }}
        options={options}
        onChange={radioChangeEvent}
        optionType="button"
        value={type}
        buttonStyle="solid"
      />
      <div
        style={{
          marginTop: "20px",
        }}
      >
        <>
          {type === "local" ? (
            <Dragger {...config}>
              <p className="ant-upload-text">点击或者拖拽图片上传</p>
              <p className="ant-upload-hint">
                支持上传 PNG/JPG/JPEG 格式的图片，文件大小不能超过1MB。
              </p>
            </Dragger>
          ) : (
            <Input.Search
              enterButton="插入"
              onSearch={insertEvent}
              placeholder="输入图片链接"
            />
          )}
        </>
        {fileList.length ? (
          fileList.map((item) => (
            <Image
              className={style["custom-class-image"]}
              key={item}
              width={150}
              height={150}
              src={item}
            />
          ))
        ) : (
          <></>
        )}
      </div>
    </Modal>
  );
});
