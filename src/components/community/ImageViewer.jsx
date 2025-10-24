/**
 * 图片查看器组件
 * 支持缩放、滑动切换
 */

import PropTypes from 'prop-types';
import React from 'react';
import ImageView from 'react-native-image-viewing';

export default function ImageViewer({ images, visible, initialIndex = 0, onClose }) {
  // 转换图片格式，添加防御性检查
  const imageList = (images || []).map((uri) => ({ uri }));

  // 如果没有图片，不显示
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <ImageView
      images={imageList}
      imageIndex={initialIndex}
      visible={visible}
      onRequestClose={onClose}
      swipeToCloseEnabled={true}
      doubleTapToZoomEnabled={true}
    />
  );
}

ImageViewer.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  visible: PropTypes.bool.isRequired,
  initialIndex: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

