/**
 * 地图视图组件
 * 在地图上直观展示国家分布
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

const MapView = ({ countries, onCountryPress }) => {
  const [selectedRegion, setSelectedRegion] = useState('all');

  // 按地区分组国家
  const regionGroups = {
    'north-america': {
      name: '北美',
      icon: '🌎',
      countries: countries.filter((c) => ['US', 'CA'].includes(c.code)),
      position: { top: '30%', left: '15%' },
    },
    europe: {
      name: '欧洲',
      icon: '🌍',
      countries: countries.filter((c) => ['GB', 'DE'].includes(c.code)),
      position: { top: '25%', left: '48%' },
    },
    asia: {
      name: '亚洲',
      icon: '🌏',
      countries: countries.filter((c) => ['JP', 'SG'].includes(c.code)),
      position: { top: '40%', left: '75%' },
    },
    oceania: {
      name: '大洋洲',
      icon: '🗺️',
      countries: countries.filter((c) => ['AU', 'NZ'].includes(c.code)),
      position: { top: '65%', left: '80%' },
    },
  };

  const getRegionCountries = () => {
    if (selectedRegion === 'all') {
      return countries;
    }
    return regionGroups[selectedRegion]?.countries || [];
  };

  const displayCountries = getRegionCountries();

  return (
    <View style={styles.container}>
      {/* 地区选择器 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.regionSelector}
        contentContainerStyle={styles.regionSelectorContent}
      >
        <TouchableOpacity
          style={[
            styles.regionButton,
            selectedRegion === 'all' && styles.regionButtonActive,
          ]}
          onPress={() => setSelectedRegion('all')}
        >
          <Text style={styles.regionIcon}>🌐</Text>
          <Text
            style={[
              styles.regionText,
              selectedRegion === 'all' && styles.regionTextActive,
            ]}
          >
            全部
          </Text>
        </TouchableOpacity>

        {Object.entries(regionGroups).map(([key, region]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.regionButton,
              selectedRegion === key && styles.regionButtonActive,
            ]}
            onPress={() => setSelectedRegion(key)}
          >
            <Text style={styles.regionIcon}>{region.icon}</Text>
            <Text
              style={[
                styles.regionText,
                selectedRegion === key && styles.regionTextActive,
              ]}
            >
              {region.name}
            </Text>
            <View style={styles.regionBadge}>
              <Text style={styles.regionBadgeText}>{region.countries.length}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 世界地图 */}
      <View style={styles.mapContainer}>
        <View style={styles.mapBackground}>
          <Text style={styles.mapTitle}>🗺️ 世界地图</Text>
          <Text style={styles.mapSubtitle}>点击地区查看国家</Text>

          {/* 地区标记点 */}
          {Object.entries(regionGroups).map(([key, region]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.regionMarker,
                {
                  top: region.position.top,
                  left: region.position.left,
                },
                selectedRegion === key && styles.regionMarkerActive,
              ]}
              onPress={() => setSelectedRegion(key)}
            >
              <View style={styles.markerDot}>
                <Text style={styles.markerIcon}>{region.icon}</Text>
              </View>
              <View style={styles.markerLabel}>
                <Text style={styles.markerText}>{region.name}</Text>
                <Text style={styles.markerCount}>{region.countries.length}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 国家列表 */}
      <View style={styles.countriesSection}>
        <View style={styles.countriesHeader}>
          <Text style={styles.countriesTitle}>
            {selectedRegion === 'all'
              ? '全部国家'
              : regionGroups[selectedRegion]?.name}
          </Text>
          <Text style={styles.countriesCount}>
            共 {displayCountries.length} 个国家
          </Text>
        </View>

        <ScrollView
          style={styles.countriesList}
          showsVerticalScrollIndicator={false}
        >
          {displayCountries.map((country) => (
            <TouchableOpacity
              key={country.id}
              style={styles.countryItem}
              onPress={() => onCountryPress(country)}
              activeOpacity={0.7}
            >
              <Text style={styles.countryFlag}>{country.flag}</Text>
              <View style={styles.countryInfo}>
                <Text style={styles.countryName}>{country.name}</Text>
                <Text style={styles.countryDesc}>{country.description}</Text>
                <View style={styles.countryTags}>
                  <View style={styles.tag}>
                    <Ionicons name="cash-outline" size={12} color={COLORS.gray[600]} />
                    <Text style={styles.tagText}>{country.costRange}</Text>
                  </View>
                  <View style={styles.tag}>
                    <Ionicons name="bar-chart-outline" size={12} color={COLORS.gray[600]} />
                    <Text style={styles.tagText}>难度: {country.difficulty}</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  regionSelector: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  regionSelectorContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  regionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.gray[100],
    borderRadius: 20,
    gap: 6,
  },
  regionButtonActive: {
    backgroundColor: COLORS.primary[600],
  },
  regionIcon: {
    fontSize: 18,
  },
  regionText: {
    fontSize: 14,
    color: COLORS.gray[700],
    fontWeight: '500',
  },
  regionTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  regionBadge: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  regionBadgeText: {
    fontSize: 11,
    color: COLORS.gray[700],
    fontWeight: '600',
  },
  mapContainer: {
    height: 280,
    backgroundColor: COLORS.gray[50],
    padding: 16,
  },
  mapBackground: {
    flex: 1,
    backgroundColor: COLORS.primary[50],
    borderRadius: 16,
    padding: 20,
    position: 'relative',
    borderWidth: 2,
    borderColor: COLORS.primary[200],
    borderStyle: 'dashed',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  mapSubtitle: {
    fontSize: 13,
    color: COLORS.gray[600],
  },
  regionMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  regionMarkerActive: {
    transform: [{ scale: 1.2 }],
  },
  markerDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  markerIcon: {
    fontSize: 20,
  },
  markerLabel: {
    marginTop: 4,
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  markerText: {
    fontSize: 11,
    color: COLORS.gray[900],
    fontWeight: '600',
  },
  markerCount: {
    fontSize: 10,
    color: COLORS.primary[600],
    fontWeight: '700',
  },
  countriesSection: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  countriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  countriesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  countriesCount: {
    fontSize: 13,
    color: COLORS.gray[600],
  },
  countriesList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  countryFlag: {
    fontSize: 32,
    marginRight: 12,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  countryDesc: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginBottom: 6,
  },
  countryTags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.gray[100],
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: COLORS.gray[700],
    fontWeight: '500',
  },
});

export default MapView;

