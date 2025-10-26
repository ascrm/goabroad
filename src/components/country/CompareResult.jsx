/**
 * 国家对比结果页面
 * 展示多个国家的对比数据
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

const CompareResult = ({ countries, onClose }) => {
  // 对比维度
  const compareItems = [
    { key: 'cost', label: '留学费用', icon: 'cash-outline' },
    { key: 'difficulty', label: '申请难度', icon: 'bar-chart-outline' },
    { key: 'duration', label: '学制时长', icon: 'time-outline' },
    { key: 'employment', label: '就业率', icon: 'briefcase-outline' },
    { key: 'immigration', label: '移民难度', icon: 'airplane-outline' },
    { key: 'safety', label: '安全指数', icon: 'shield-checkmark-outline' },
    { key: 'language', label: '语言要求', icon: 'language-outline' },
    { key: 'climate', label: '气候环境', icon: 'partly-sunny-outline' },
  ];

  // 模拟对比数据
  const getCompareData = (country, key) => {
    const data = {
      cost: {
        US: { value: '50-80万/年', level: 'high' },
        GB: { value: '30-50万/年', level: 'high' },
        CA: { value: '25-40万/年', level: 'medium' },
        AU: { value: '30-45万/年', level: 'high' },
        DE: { value: '10-15万/年', level: 'low' },
        JP: { value: '15-20万/年', level: 'medium' },
      },
      difficulty: {
        US: { value: '高', level: 'high' },
        GB: { value: '中', level: 'medium' },
        CA: { value: '中', level: 'medium' },
        AU: { value: '中', level: 'medium' },
        DE: { value: '中', level: 'medium' },
        JP: { value: '中', level: 'medium' },
      },
      duration: {
        US: { value: '2-4年', level: 'medium' },
        GB: { value: '1-2年', level: 'low' },
        CA: { value: '2-3年', level: 'medium' },
        AU: { value: '2-3年', level: 'medium' },
        DE: { value: '2-3年', level: 'medium' },
        JP: { value: '2年', level: 'low' },
      },
      employment: {
        US: { value: '85%', level: 'high' },
        GB: { value: '78%', level: 'medium' },
        CA: { value: '82%', level: 'high' },
        AU: { value: '80%', level: 'high' },
        DE: { value: '75%', level: 'medium' },
        JP: { value: '88%', level: 'high' },
      },
      immigration: {
        US: { value: '困难', level: 'high' },
        GB: { value: '较难', level: 'medium' },
        CA: { value: '容易', level: 'low' },
        AU: { value: '容易', level: 'low' },
        DE: { value: '中等', level: 'medium' },
        JP: { value: '较难', level: 'medium' },
      },
      safety: {
        US: { value: '中等', level: 'medium' },
        GB: { value: '较高', level: 'high' },
        CA: { value: '很高', level: 'high' },
        AU: { value: '很高', level: 'high' },
        DE: { value: '很高', level: 'high' },
        JP: { value: '极高', level: 'high' },
      },
      language: {
        US: { value: 'TOEFL 90+', level: 'medium' },
        GB: { value: 'IELTS 6.5+', level: 'medium' },
        CA: { value: 'IELTS 6.5+', level: 'medium' },
        AU: { value: 'IELTS 6.5+', level: 'medium' },
        DE: { value: 'TestDaF 4', level: 'high' },
        JP: { value: 'JLPT N2', level: 'high' },
      },
      climate: {
        US: { value: '多样化', level: 'medium' },
        GB: { value: '温和多雨', level: 'medium' },
        CA: { value: '寒冷', level: 'low' },
        AU: { value: '温暖', level: 'high' },
        DE: { value: '温和', level: 'medium' },
        JP: { value: '四季分明', level: 'high' },
      },
    };

    return data[key]?.[country.code] || { value: '-', level: 'medium' };
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'high':
        return COLORS.success[600];
      case 'medium':
        return COLORS.warning[600];
      case 'low':
        return COLORS.error[500];
      default:
        return COLORS.gray[500];
    }
  };

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.gray[900]} />
        </TouchableOpacity>
        <Text style={styles.title}>国家对比</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 国家头部 */}
        <View style={styles.countriesHeader}>
          <View style={styles.labelColumn}>
            <Text style={styles.labelTitle}>对比项</Text>
          </View>
          {countries.map((country) => (
            <View key={country.id} style={styles.countryColumn}>
              <Text style={styles.countryFlag}>{country.flag}</Text>
              <Text style={styles.countryName}>{country.name}</Text>
            </View>
          ))}
        </View>

        {/* 对比项 */}
        {compareItems.map((item, index) => (
          <View
            key={item.key}
            style={[
              styles.compareRow,
              index % 2 === 0 && styles.compareRowEven,
            ]}
          >
            <View style={styles.labelColumn}>
              <Ionicons name={item.icon} size={20} color={COLORS.gray[600]} />
              <Text style={styles.compareLabel}>{item.label}</Text>
            </View>
            {countries.map((country) => {
              const data = getCompareData(country, item.key);
              return (
                <View key={country.id} style={styles.countryColumn}>
                  <Text
                    style={[
                      styles.compareValue,
                      { color: getLevelColor(data.level) },
                    ]}
                  >
                    {data.value}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}

        {/* 综合评分 */}
        <View style={styles.scoreSection}>
          <Text style={styles.scoreTitle}>综合评分</Text>
          <View style={styles.scoreRow}>
            <View style={styles.labelColumn} />
            {countries.map((country) => (
              <View key={country.id} style={styles.countryColumn}>
                <View style={styles.scoreCircle}>
                  <Text style={styles.scoreNumber}>{country.rating}</Text>
                  <Text style={styles.scoreMax}>/5</Text>
                </View>
                <View style={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < country.rating ? 'star' : 'star-outline'}
                      size={16}
                      color={COLORS.warning[500]}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 底部占位 */}
        <View style={styles.bottomPlaceholder} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  countriesHeader: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: COLORS.gray[50],
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gray[200],
  },
  labelColumn: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 4,
  },
  labelTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[700],
  },
  countryColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  countryFlag: {
    fontSize: 32,
  },
  countryName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  compareRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  compareRowEven: {
    backgroundColor: COLORS.gray[50],
  },
  compareLabel: {
    fontSize: 14,
    color: COLORS.gray[700],
    fontWeight: '500',
  },
  compareValue: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  scoreSection: {
    padding: 16,
    backgroundColor: COLORS.primary[50],
    marginTop: 16,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: 'row',
  },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 3,
    borderColor: COLORS.primary[600],
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary[600],
  },
  scoreMax: {
    fontSize: 12,
    color: COLORS.gray[600],
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  bottomPlaceholder: {
    height: 40,
  },
});

export default CompareResult;

