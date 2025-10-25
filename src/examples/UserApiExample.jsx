/**
 * 用户 API 使用示例
 * 展示如何使用用户相关的 API 和 Hook
 */

import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { useCurrentUser, useUser } from '@/src/hooks/useUser';

/**
 * 示例1：获取并显示用户资料
 */
export const UserProfileExample = ({ userId }) => {
  const { getUserProfile, loading, error } = useUser();
  const [userInfo, setUserInfo] = useState(null);
  
  useEffect(() => {
    // 获取用户资料
    getUserProfile(userId).then((result) => {
      if (result.payload) {
        setUserInfo(result.payload);
      }
    });
  }, [userId, getUserProfile]);
  
  if (loading) {
    return <Text>加载中...</Text>;
  }
  
  if (error) {
    return <Text>错误: {error}</Text>;
  }
  
  if (!userInfo) {
    return <Text>暂无数据</Text>;
  }
  
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: userInfo.avatar || 'https://via.placeholder.com/100' }}
        style={styles.avatar}
      />
      <Text style={styles.nickname}>{userInfo.nickname}</Text>
      <Text style={styles.username}>@{userInfo.username}</Text>
      <Text style={styles.bio}>{userInfo.bio}</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userInfo.stats?.postsCount || 0}</Text>
          <Text style={styles.statLabel}>帖子</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userInfo.stats?.followersCount || 0}</Text>
          <Text style={styles.statLabel}>粉丝</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userInfo.stats?.followingCount || 0}</Text>
          <Text style={styles.statLabel}>关注</Text>
        </View>
      </View>
    </View>
  );
};

/**
 * 示例2：更新用户资料
 */
export const UpdateProfileExample = () => {
  const { profile, updateProfile, loading } = useUser();
  
  const handleUpdateProfile = async () => {
    try {
      const result = await updateProfile({
        nickname: '新昵称',
        bio: '这是更新后的个人简介',
        targetCountry: 'US',
        targetType: 'study',
        targetDate: '2026-09-01',
      });
      
      if (result.payload) {
        Alert.alert('成功', '资料更新成功');
      }
    } catch (error) {
      Alert.alert('错误', '资料更新失败');
    }
  };
  
  return (
    <View style={styles.card}>
      <Text style={styles.title}>当前资料</Text>
      <Text>昵称: {profile.nickname}</Text>
      <Text>简介: {profile.bio}</Text>
      <Text>目标国家: {profile.targetCountry}</Text>
      
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleUpdateProfile}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? '更新中...' : '更新资料'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * 示例3：上传头像
 */
export const UploadAvatarExample = () => {
  const { uploadAvatar, loading } = useUser();
  
  const handleUploadAvatar = async () => {
    // 在实际应用中，使用 ImagePicker 选择图片
    // 这里仅作示例
    const file = {
      uri: 'file://path/to/image.jpg',
      name: 'avatar.jpg',
      type: 'image/jpeg',
    };
    
    try {
      const result = await uploadAvatar(file);
      
      if (result.payload) {
        Alert.alert('成功', '头像上传成功');
      }
    } catch (error) {
      Alert.alert('错误', '头像上传失败');
    }
  };
  
  return (
    <TouchableOpacity
      style={[styles.button, loading && styles.buttonDisabled]}
      onPress={handleUploadAvatar}
      disabled={loading}
    >
      <Text style={styles.buttonText}>
        {loading ? '上传中...' : '上传头像'}
      </Text>
    </TouchableOpacity>
  );
};

/**
 * 示例4：关注/取消关注
 */
export const FollowButtonExample = ({ userId, initialFollowing = false }) => {
  const { follow, unfollow, loading } = useUser();
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  
  const handleToggleFollow = async () => {
    try {
      if (isFollowing) {
        const result = await unfollow(userId);
        if (result.payload) {
          setIsFollowing(false);
          Alert.alert('成功', '已取消关注');
        }
      } else {
        const result = await follow(userId);
        if (result.payload) {
          setIsFollowing(true);
          Alert.alert('成功', '关注成功');
        }
      }
    } catch (error) {
      Alert.alert('错误', '操作失败');
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isFollowing ? styles.buttonSecondary : styles.buttonPrimary,
        loading && styles.buttonDisabled,
      ]}
      onPress={handleToggleFollow}
      disabled={loading}
    >
      <Text style={styles.buttonText}>
        {loading ? '处理中...' : isFollowing ? '已关注' : '关注'}
      </Text>
    </TouchableOpacity>
  );
};

/**
 * 示例5：获取用户帖子列表
 */
export const UserPostsListExample = ({ userId }) => {
  const { posts, getUserPosts } = useUser();
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    getUserPosts(userId, page, 20, 'all');
  }, [userId, page, getUserPosts]);
  
  const handleLoadMore = () => {
    if (posts.pagination?.hasMore && !posts.loading) {
      setPage((prev) => prev + 1);
    }
  };
  
  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      {item.coverImage && (
        <Image
          source={{ uri: item.coverImage }}
          style={styles.postCover}
        />
      )}
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent} numberOfLines={2}>
        {item.content}
      </Text>
      
      <View style={styles.postStats}>
        <Text style={styles.postStat}>👍 {item.likeCount}</Text>
        <Text style={styles.postStat}>💬 {item.commentCount}</Text>
        <Text style={styles.postStat}>⭐ {item.collectCount}</Text>
      </View>
    </View>
  );
  
  return (
    <FlatList
      data={posts.items}
      renderItem={renderPost}
      keyExtractor={(item) => item.id}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() =>
        posts.loading ? <Text>加载中...</Text> : null
      }
    />
  );
};

/**
 * 示例6：获取关注列表
 */
export const FollowingListExample = ({ userId }) => {
  const { following, getUserFollowing } = useUser();
  
  useEffect(() => {
    getUserFollowing(userId, 1, 20);
  }, [userId, getUserFollowing]);
  
  const renderUser = ({ item }) => (
    <View style={styles.userItem}>
      <Image
        source={{ uri: item.avatar || 'https://via.placeholder.com/50' }}
        style={styles.userAvatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.nickname}</Text>
        <Text style={styles.userBio} numberOfLines={1}>
          {item.bio}
        </Text>
      </View>
    </View>
  );
  
  return (
    <FlatList
      data={following.items}
      renderItem={renderUser}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={<Text>暂无关注</Text>}
    />
  );
};

/**
 * 示例7：搜索用户
 */
export const SearchUsersExample = () => {
  const { search } = useUser();
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  
  const handleSearch = async () => {
    if (!keyword.trim()) {
      Alert.alert('提示', '请输入搜索关键词');
      return;
    }
    
    setSearching(true);
    try {
      const result = await search(keyword, 1, 20);
      if (result.payload) {
        setResults(result.payload.items || []);
      }
    } catch (error) {
      Alert.alert('错误', '搜索失败');
    } finally {
      setSearching(false);
    }
  };
  
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBox}>
        <Text>搜索用户: {keyword}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSearch}
          disabled={searching}
        >
          <Text style={styles.buttonText}>
            {searching ? '搜索中...' : '搜索'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text>{item.nickname}</Text>
            <Text>@{item.username}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>暂无结果</Text>}
      />
    </View>
  );
};

/**
 * 示例8：使用简化 Hook 获取当前用户
 */
export const CurrentUserExample = () => {
  const { nickname, avatar, level, stats } = useCurrentUser();
  
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: avatar || 'https://via.placeholder.com/80' }}
        style={styles.currentUserAvatar}
      />
      <Text style={styles.nickname}>{nickname}</Text>
      <Text style={styles.level}>Lv.{level}</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.postsCount}</Text>
          <Text style={styles.statLabel}>帖子</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.followersCount}</Text>
          <Text style={styles.statLabel}>粉丝</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.followingCount}</Text>
          <Text style={styles.statLabel}>关注</Text>
        </View>
      </View>
    </View>
  );
};

// 样式
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 12,
  },
  currentUserAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 8,
  },
  nickname: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  level: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonPrimary: {
    backgroundColor: '#2563EB',
  },
  buttonSecondary: {
    backgroundColor: '#6B7280',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  postCover: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  postContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  postStats: {
    flexDirection: 'row',
    gap: 16,
  },
  postStat: {
    fontSize: 12,
    color: '#999',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userBio: {
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    flex: 1,
    padding: 16,
  },
  searchBox: {
    marginBottom: 16,
  },
});

export default {
  UserProfileExample,
  UpdateProfileExample,
  UploadAvatarExample,
  FollowButtonExample,
  UserPostsListExample,
  FollowingListExample,
  SearchUsersExample,
  CurrentUserExample,
};

