/**
 * Avatar 头像组件
 * 支持图片、文字、图标和在线状态
 */

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const Avatar = ({
  size = 'md',
  source,
  name,
  icon,
  backgroundColor,
  textColor = '#FFFFFF',
  online,
  style,
}) => {
  const [imageError, setImageError] = useState(false);
  const sizeStyles = styles[`avatar_${size}`];
  const sizeValue = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  }[size];

  // 获取名字首字母
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // 根据名字生成背景色
  const getBackgroundColor = (name) => {
    if (backgroundColor) return backgroundColor;
    
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    ];
    
    if (!name) return colors[0];
    
    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  const bgColor = getBackgroundColor(name);
  const iconSize = sizeValue * 0.5;
  const fontSize = {
    xs: 10,
    sm: 12,
    md: 16,
    lg: 22,
    xl: 32,
  }[size];

  // 判断是否显示图片
  const shouldShowImage = source && !imageError && (
    typeof source === 'string' ? source.trim().length > 0 : true
  );

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.avatar,
          sizeStyles,
          { backgroundColor: shouldShowImage ? 'transparent' : bgColor },
        ]}
      >
        {shouldShowImage ? (
          <Image
            source={typeof source === 'string' ? { uri: source } : source}
            style={[styles.image, sizeStyles]}
            onError={(e) => {
              console.log('Avatar image load error:', e.nativeEvent.error);
              setImageError(true);
            }}
            resizeMode="cover"
          />
        ) : icon ? (
          icon
        ) : (
          <Text style={[styles.text, { color: textColor, fontSize }]}>
            {getInitials(name)}
          </Text>
        )}
      </View>
      
      {online !== undefined && (
        <View
          style={[
            styles.onlineIndicator,
            styles[`onlineIndicator_${size}`],
            online ? styles.onlineIndicator_online : styles.onlineIndicator_offline,
          ]}
        />
      )}
    </View>
  );
};

Avatar.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  source: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  name: PropTypes.string,
  icon: PropTypes.element,
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  online: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatar_xs: {
    width: 24,
    height: 24,
  },
  avatar_sm: {
    width: 32,
    height: 32,
  },
  avatar_md: {
    width: 40,
    height: 40,
  },
  avatar_lg: {
    width: 56,
    height: 56,
  },
  avatar_xl: {
    width: 80,
    height: 80,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontWeight: '600',
  },
  onlineIndicator: {
    position: 'absolute',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  onlineIndicator_xs: {
    width: 8,
    height: 8,
    right: -1,
    bottom: -1,
  },
  onlineIndicator_sm: {
    width: 10,
    height: 10,
    right: 0,
    bottom: 0,
  },
  onlineIndicator_md: {
    width: 12,
    height: 12,
    right: 0,
    bottom: 0,
  },
  onlineIndicator_lg: {
    width: 14,
    height: 14,
    right: 2,
    bottom: 2,
  },
  onlineIndicator_xl: {
    width: 18,
    height: 18,
    right: 4,
    bottom: 4,
  },
  onlineIndicator_online: {
    backgroundColor: '#00C853',
  },
  onlineIndicator_offline: {
    backgroundColor: '#999999',
  },
});

export default Avatar;

