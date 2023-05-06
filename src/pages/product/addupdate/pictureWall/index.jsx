import React, { useState, useImperativeHandle } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload, message } from "antd";
import { reqDeleteImg } from "../../../../api";
import { BASE_IMG_URL } from "../../../../config/constant";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

/**
 * 用于图片上传的组件
 */
const PictureWall = React.forwardRef(function PictureWall(props, ref) {
  const [messageApi, contextHolder] = message.useMessage();
  // 是否显示大图
  const [previewOpen, setPreviewOpen] = useState(false);
  // 大图的url
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  // 初始化已上传的图片
  const [fileList, setFileList] = useState(
    props.imgs && props.imgs.length > 0
      ? props.imgs.map((img, index) => {
          return {
            uid: -index,
            name: img,
            status: "done",
            url: BASE_IMG_URL + img,
          };
        })
      : []
  );
  //   隐藏modal
  const handleCancel = () => setPreviewOpen(false);

  // 触发显示大图
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  useImperativeHandle(
    ref,
    () => {
      return {
        getFiles() {
          return fileList.map((file) => file.name);
        },
      };
    },
    [fileList]
  );

  /**
   * @param {file} 当前操作的图片
   * @param {fileList} 所有已上传图片的数组
   *
   * 现在 file 和 fileList 最后的一项是相同的
   * console.log(file === fileList[fileList.length - 1]);
   */
  const handleChange = async ({ file, fileList }) => {
    // 这儿的获取的 file 的缺陷: name 和 url 不对
    // 这个事件对 图片的每个状态都更新,我们只需要访问已上传的状态
    if (file.status === "done") {
      const { status, data } = file.response;
      if (status === 0) {
        messageApi.success("图片上传成功");
        const { name, url } = data;
        file.name = name;
        file.url = url;
      } else {
        messageApi.error("图片上传失败");
      }
    }
    // 这个组件怪的很，他会在提交图片时给你自动上传
    // 但是删除的时候虽然前台看不见了，但是后台并没有一起删除掉
    console.log(file);
    if (file.status === "removed") {
      const result = await reqDeleteImg(file.name);
      if (result.status === 0) {
        messageApi.success("删除图片成功");
      } else {
        messageApi.error("删除图片失败");
      }
    }

    setFileList(fileList);
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <>
      {contextHolder}
      <Upload
        action="/manage/img/upload" // 上传的地址,这直接是他自己发送ajax请求,这就是那个接口函数
        accept="image/*" // 上传文件的类型
        name="image" // 自动发送ajax时的请求参数名
        listType="picture-card" // 上传列表的样式
        fileList={fileList} //所有已上传图片的数组
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      {/* Modal 就是弹出框啊, 意思就是给你看大图 */}
      <Modal
        open={previewOpen} // 控制modal的显示和隐藏的
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </>
  );
});
export default PictureWall;
