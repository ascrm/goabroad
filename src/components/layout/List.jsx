/**
 * List 列表容器组件
 * FlatList 优化 + 下拉刷新 + 上拉加载更多 + 空状态
 */

import React from 'react';
import { FlatList, View, Text, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';

const List = ({
  data,
  renderItem,
  keyExtractor,
  onRefresh,
  refreshing = false,
  onLoadMore,
  loading = false,
  hasMore = false,
  emptyIcon,
  emptyTitle = '暂无数据',
  emptyDescription,
  emptyAction,
  showSeparator = true,
  style,
  contentContainerStyle,
  ...rest
}) => {
  const renderEmpty = () => {
    if (loading && data.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066FF" />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        {emptyIcon || <Ionicons name="file-tray-outline" size={64} color="#CCCCCC" />}
        <Text style={styles.emptyTitle}>{emptyTitle}</Text>
        {emptyDescription && (
          <Text style={styles.emptyDescription}>{emptyDescription}</Text>
        )}
        {emptyAction && <View style={styles.emptyAction}>{emptyAction}</View>}
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading || data.length === 0) {
      return null;
    }

    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="small" color="#0066FF" />
        <Text style={styles.footerText}>加载中...</Text>
      </View>
    );
  };

  const handleEndReached = () => {
    if (!loading && hasMore && onLoadMore) {
      onLoadMore();
    }
  };

  const ItemSeparator = () => {
    if (!showSeparator) return null;
    return <View style={styles.separator} />;
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor || ((item, index) => index.toString())}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      ItemSeparatorComponent={ItemSeparator}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0066FF']}
            tintColor="#0066FF"
          />
        ) : undefined
      }
      style={[styles.list, style]}
      contentContainerStyle={[
        data.length === 0 && styles.emptyContentContainer,
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      {...rest}
    />
  );
};

List.propTypes = {
  data: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  keyExtractor: PropTypes.func,
  onRefresh: PropTypes.func,
  refreshing: PropTypes.bool,
  onLoadMore: PropTypes.func,
  loading: PropTypes.bool,
  hasMore: PropTypes.bool,
  emptyIcon: PropTypes.element,
  emptyTitle: PropTypes.string,
  emptyDescription: PropTypes.string,
  emptyAction: PropTypes.element,
  showSeparator: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  contentContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  emptyAction: {
    marginTop: 24,
  },
  footerLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#999999',
    marginLeft: 8,
  },
});

export default List;

