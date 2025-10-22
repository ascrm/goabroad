/**
 * Section 页面区块组件
 * 标题 + 右侧操作 + 内容区
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';

const Section = ({
  title,
  subtitle,
  action,
  actionText,
  onActionPress,
  children,
  noPadding = false,
  noMargin = false,
  style,
  contentStyle,
}) => {
  return (
    <View style={[styles.section, noMargin && styles.section_noMargin, style]}>
      {(title || subtitle || action || actionText) && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          
          {(action || actionText) && (
            <TouchableOpacity
              style={styles.action}
              onPress={onActionPress}
              activeOpacity={0.7}
            >
              {actionText && (
                <Text style={styles.actionText}>{actionText}</Text>
              )}
              {action || <Ionicons name="chevron-forward" size={20} color="#0066FF" />}
            </TouchableOpacity>
          )}
        </View>
      )}
      
      <View style={[styles.content, noPadding && styles.content_noPadding, contentStyle]}>
        {children}
      </View>
    </View>
  );
};

Section.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  action: PropTypes.element,
  actionText: PropTypes.string,
  onActionPress: PropTypes.func,
  children: PropTypes.node,
  noPadding: PropTypes.bool,
  noMargin: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  contentStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  section_noMargin: {
    marginBottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  actionText: {
    fontSize: 14,
    color: '#0066FF',
    marginRight: 4,
  },
  content: {
    paddingHorizontal: 16,
  },
  content_noPadding: {
    paddingHorizontal: 0,
  },
});

export default Section;

