import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * 通用顶部返回标题栏，保持各页面一致
 */
export default function PageHeader({
  title,
  onBack,
  backgroundColor = '#1D4EB9',
  textColor = '#FFFFFF',
  rightSlot = null,
}) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity style={styles.side} onPress={onBack}>
        {onBack && <Ionicons name="arrow-back" size={24} color={textColor} />}
      </TouchableOpacity>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      <View style={styles.side}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  side: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

