/**
 * 信息卡片组件
 * 用于详情页展示信息块
 */

import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/src/constants';

const InfoCard = ({ title, icon, children, style }) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        {icon && <Ionicons name={icon} size={20} color={COLORS.text.secondary} />}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

InfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  children: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background.paper,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  content: {
    // 内容区域
  },
});

export default InfoCard;

