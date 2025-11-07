/**
 * 富文本编辑器组件
 * 基于 react-native-pell-rich-editor
 * 支持所见即所得编辑
 */

import { COLORS } from '@/src/constants';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet } from 'react-native';
// 只导入 RichEditor，避免 RichToolbar 的图片资源问题
import RichEditor from 'react-native-pell-rich-editor/src/RichEditor';
import { actions } from 'react-native-pell-rich-editor/src/const';

const RichTextEditor = forwardRef(({
  initialContent = '',
  onContentChange,
  placeholder = '输入正文内容...',
  minHeight = 300,
  onFocus,
  onBlur,
}, ref) => {
  const editorRef = useRef(null);

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    // 聚焦编辑器
    focus: () => {
      editorRef.current?.focusContentEditor();
    },
    // 失焦
    blur: () => {
      editorRef.current?.blurContentEditor();
    },
    // 插入标题（移除 showAndroidKeyboard，避免触发键盘）
    setHeading: (level) => {
      editorRef.current?.sendAction(actions[`heading${level}`], 'result');
    },
    // 加粗
    setBold: () => {
      editorRef.current?.sendAction(actions.setBold, 'result');
    },
    // 斜体
    setItalic: () => {
      editorRef.current?.sendAction(actions.setItalic, 'result');
    },
    // 下划线
    setUnderline: () => {
      editorRef.current?.sendAction(actions.setUnderline, 'result');
    },
    // 删除线
    setStrikeThrough: () => {
      editorRef.current?.sendAction(actions.setStrikethrough, 'result');
    },
    // 无序列表
    insertBulletsList: () => {
      editorRef.current?.sendAction(actions.insertBulletsList, 'result');
    },
    // 有序列表
    insertOrderedList: () => {
      editorRef.current?.sendAction(actions.insertOrderedList, 'result');
    },
    // 引用
    setBlockquote: () => {
      editorRef.current?.sendAction(actions.blockquote, 'result');
    },
    // 分割线
    insertHorizontalRule: () => {
      editorRef.current?.sendAction(actions.setHR, 'result');
    },
    // 行内代码
    insertCode: () => {
      editorRef.current?.sendAction(actions.code, 'result');
    },
    // 插入链接
    insertLink: (title, url) => {
      editorRef.current?.insertLink(title, url);
    },
    // 插入图片
    insertImage: (url) => {
      editorRef.current?.insertImage(url);
    },
    // 插入 HTML
    insertHTML: (html) => {
      editorRef.current?.insertHTML(html);
    },
    // 撤销
    undo: () => {
      editorRef.current?.sendAction(actions.undo, 'result');
    },
    // 重做
    redo: () => {
      editorRef.current?.sendAction(actions.redo, 'result');
    },
    // 获取内容
    getContentHtml: async () => {
      return editorRef.current?.getContentHtml();
    },
  }));

  return (
    <RichEditor
      ref={editorRef}
      initialContentHTML={initialContent}
      placeholder={placeholder}
      onChange={onContentChange}
      onFocus={onFocus}
      onBlur={onBlur}
      style={[styles.editor, { minHeight }]}
      editorStyle={{
        backgroundColor: COLORS.white,
        color: COLORS.gray[900],
        placeholderColor: COLORS.gray[400],
        contentCSSText: `
          font-size: 16px;
          line-height: 1.6;
          padding: 12px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          
          /* 图片样式 */
          img {
            max-width: 100% !important;
            height: auto !important;
            display: block;
            margin: 12px 0;
            border-radius: 8px;
          }
        `,
      }}
      useContainer={true}
      disabled={false}
    />
  );
});

RichTextEditor.displayName = 'RichTextEditor';

const styles = StyleSheet.create({
  editor: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
  },
});

export default RichTextEditor;

