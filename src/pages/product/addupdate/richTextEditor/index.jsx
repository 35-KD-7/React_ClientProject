import React, { Component } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
// 需要引入其自带的样式
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default class RichTextEditor extends Component {
  constructor(props) {
    super(props);
    const html = this.props.detail;
    if (html) {
      // 如果 html 之前有值
      const contentBlock = htmlToDraft(html);
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.state = { editorState };
    } else {
      // editorState这个状态非常重要，里面存储的就是富文本是内容，实时更新
      this.state = {
        editorState: EditorState.createEmpty(),
      };
    }
  }
  uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/manage/img/upload");
      const data = new FormData();
      data.append("image", file);
      xhr.send(data);
      xhr.addEventListener("load", () => {
        const response = JSON.parse(xhr.responseText);
        // 得到图片地址,
        const url = response.data.url;
        resolve({ data: { link: url.replace("5000", "5001") } });
      });
      xhr.addEventListener("error", () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
  };

  getDetail = () => {
    // 你在富文本里写的不是 HTML，但是是带样式的数据 也就是这说的 draft
    // 我们需要将数据转成 HTML
    return draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      // 这个就是富文本编辑器
      <Editor
        editorState={editorState}
        // 给编辑器加样式
        editorStyle={{
          border: "1px solid #000",
          minHeight: 200,
          paddingLeft: 15,
        }}
        toolbar={{
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true },
          image: {
            uploadCallback: this.uploadImageCallBack,
            alt: { present: true, mandatory: true },
          },
        }}
        onEditorStateChange={this.onEditorStateChange} // 编辑器内容一改就触发
      />
    );
  }
}
