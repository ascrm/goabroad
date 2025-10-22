/**
 * Loading 加载组件
 * 包含 Spinner、Skeleton 和页面级 Loading
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

// Spinner 旋转器
export const Spinner = ({ size = 'medium', color = '#0066FF', style }) => {
  return (
    <View style={[styles.spinnerContainer, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

// Skeleton 骨架屏
export const Skeleton = ({ width, height, borderRadius = 8, style }) => {
  return (
    <View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
    />
  );
};

Skeleton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  borderRadius: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

// 卡片骨架屏
export const SkeletonCard = ({ style }) => {
  return (
    <View style={[styles.skeletonCard, style]}>
      <Skeleton width="100%" height={180} borderRadius={12} />
      <View style={styles.skeletonCardContent}>
        <Skeleton width="60%" height={20} style={{ marginBottom: 8 }} />
        <Skeleton width="100%" height={16} style={{ marginBottom: 4 }} />
        <Skeleton width="80%" height={16} />
      </View>
    </View>
  );
};

SkeletonCard.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

// 列表项骨架屏
export const SkeletonListItem = ({ style }) => {
  return (
    <View style={[styles.skeletonListItem, style]}>
      <Skeleton width={40} height={40} borderRadius={20} />
      <View style={styles.skeletonListItemContent}>
        <Skeleton width="70%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="50%" height={14} />
      </View>
    </View>
  );
};

SkeletonListItem.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

// 页面级 Loading
export const PageLoading = ({ message, style }) => {
  return (
    <View style={[styles.pageLoading, style]}>
      <ActivityIndicator size="large" color="#0066FF" />
      {message && <Text style={styles.pageLoadingText}>{message}</Text>}
    </View>
  );
};

PageLoading.propTypes = {
  message: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

// 覆盖层 Loading
export const OverlayLoading = ({ message, visible = true }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.overlayContent}>
        <ActivityIndicator size="large" color="#0066FF" />
        {message && <Text style={styles.overlayText}>{message}</Text>}
      </View>
    </View>
  );
};

OverlayLoading.propTypes = {
  message: PropTypes.string,
  visible: PropTypes.bool,
};

const styles = StyleSheet.create({
  spinnerContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeleton: {
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  skeletonCardContent: {
    padding: 16,
  },
  skeletonListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  skeletonListItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  pageLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  pageLoadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#666666',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  overlayContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  overlayText: {
    marginTop: 16,
    fontSize: 14,
    color: '#333333',
  },
});

// 默认导出主 Loading 组件
const Loading = ({ type = 'spinner', ...props }) => {
  switch (type) {
    case 'skeleton':
      return <Skeleton {...props} />;
    case 'skeleton-card':
      return <SkeletonCard {...props} />;
    case 'skeleton-list':
      return <SkeletonListItem {...props} />;
    case 'page':
      return <PageLoading {...props} />;
    case 'overlay':
      return <OverlayLoading {...props} />;
    default:
      return <Spinner {...props} />;
  }
};

Loading.propTypes = {
  type: PropTypes.oneOf(['spinner', 'skeleton', 'skeleton-card', 'skeleton-list', 'page', 'overlay']),
};

export default Loading;

