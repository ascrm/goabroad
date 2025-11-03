/**
 * 数据转换工具函数
 * 用于处理API响应数据和前端展示数据之间的转换
 */

/**
 * 将逗号分隔的标签字符串转换为数组
 * @param {string} tagsString - 逗号分隔的标签字符串，如 "美国,签证,F1"
 * @returns {Array<string>} 标签数组
 * @example
 * tagsStringToArray("美国,签证,F1") // ["美国", "签证", "F1"]
 * tagsStringToArray("") // []
 * tagsStringToArray(null) // []
 */
export const tagsStringToArray = (tagsString) => {
  if (!tagsString || typeof tagsString !== 'string') return [];
  return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
};

/**
 * 将标签数组转换为逗号分隔的字符串
 * @param {Array<string>} tagsArray - 标签数组
 * @returns {string} 逗号分隔的标签字符串
 * @example
 * tagsArrayToString(["美国", "签证", "F1"]) // "美国,签证,F1"
 * tagsArrayToString([]) // ""
 * tagsArrayToString(null) // ""
 */
export const tagsArrayToString = (tagsArray) => {
  if (!Array.isArray(tagsArray)) return '';
  return tagsArray.filter(tag => tag && tag.trim()).join(',');
};

/**
 * 确保ID为数字类型
 * @param {string|number} id - ID（可能是字符串或数字）
 * @returns {number|null} 数字类型的ID
 * @example
 * ensureNumericId("123") // 123
 * ensureNumericId(123) // 123
 * ensureNumericId("user-123") // null
 */
export const ensureNumericId = (id) => {
  if (typeof id === 'number') return id;
  if (typeof id === 'string') {
    const parsed = parseInt(id, 10);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
};

/**
 * 将字符串ID转换为数字ID（用于批量处理）
 * @param {Array<string|number>} ids - ID数组
 * @returns {Array<number>} 数字类型的ID数组
 */
export const convertIdsToNumber = (ids) => {
  if (!Array.isArray(ids)) return [];
  return ids.map(ensureNumericId).filter(id => id !== null);
};

/**
 * 格式化用户统计数据
 * @param {Object} stats - 统计数据对象
 * @returns {Object} 格式化后的统计数据
 * @example
 * formatUserStats({ postsCount: 5, followersCount: 100 })
 * // { postCount: 5, followerCount: 100, followingCount: 0 }
 */
export const formatUserStats = (stats) => {
  if (!stats || typeof stats !== 'object') {
    return {
      postCount: 0,
      followerCount: 0,
      followingCount: 0,
    };
  }
  
  return {
    postCount: stats.postCount || stats.postsCount || 0,
    followerCount: stats.followerCount || stats.followersCount || 0,
    followingCount: stats.followingCount || 0,
    likesCount: stats.likesCount || 0,
    collectCount: stats.collectCount || 0,
  };
};

/**
 * 转换用户数据格式（处理avatar到avatarUrl的兼容）
 * @param {Object} user - 用户数据对象
 * @returns {Object} 转换后的用户数据
 */
export const formatUserData = (user) => {
  if (!user || typeof user !== 'object') return null;
  
  return {
    ...user,
    id: ensureNumericId(user.id),
    avatarUrl: user.avatarUrl || user.avatar || null,  // 兼容旧字段名
    stats: formatUserStats(user.stats),
  };
};

/**
 * 转换帖子数据格式
 * @param {Object} post - 帖子数据对象
 * @returns {Object} 转换后的帖子数据
 */
export const formatPostData = (post) => {
  if (!post || typeof post !== 'object') return null;
  
  return {
    ...post,
    id: ensureNumericId(post.id),
    author: post.author ? formatUserData(post.author) : null,
    tags: tagsStringToArray(post.tags),  // 将字符串转为数组
  };
};

/**
 * 转换帖子列表数据格式
 * @param {Array} posts - 帖子数组
 * @returns {Array} 转换后的帖子数组
 */
export const formatPostsData = (posts) => {
  if (!Array.isArray(posts)) return [];
  return posts.map(formatPostData);
};

/**
 * 转换评论数据格式
 * @param {Object} comment - 评论数据对象
 * @returns {Object} 转换后的评论数据
 */
export const formatCommentData = (comment) => {
  if (!comment || typeof comment !== 'object') return null;
  
  return {
    ...comment,
    id: ensureNumericId(comment.id),
    postId: ensureNumericId(comment.postId),
    author: comment.author ? formatUserData(comment.author) : null,
    parentId: comment.parentId ? ensureNumericId(comment.parentId) : null,
    replyToUserId: comment.replyToUserId ? ensureNumericId(comment.replyToUserId) : null,
    replies: Array.isArray(comment.replies) ? comment.replies.map(formatCommentData) : [],
  };
};

/**
 * 转换国家数据格式
 * @param {Object} country - 国家数据对象
 * @returns {Object} 转换后的国家数据
 */
export const formatCountryData = (country) => {
  if (!country || typeof country !== 'object') return null;
  
  return {
    ...country,
    id: ensureNumericId(country.id),
    // difficultyRating 已经是数字类型，无需转换
    // region, language等字段在overview JSONB中
  };
};

/**
 * 转换规划数据格式
 * @param {Object} plan - 规划数据对象
 * @returns {Object} 转换后的规划数据
 */
export const formatPlanData = (plan) => {
  if (!plan || typeof plan !== 'object') return null;
  
  return {
    ...plan,
    id: ensureNumericId(plan.id),
    userId: ensureNumericId(plan.userId),
    countryId: ensureNumericId(plan.countryId),
  };
};

/**
 * 转换材料数据格式
 * @param {Object} material - 材料数据对象
 * @returns {Object} 转换后的材料数据
 */
export const formatMaterialData = (material) => {
  if (!material || typeof material !== 'object') return null;
  
  return {
    ...material,
    id: ensureNumericId(material.id),
    planId: ensureNumericId(material.planId),
    // requirements 已经是文本格式，前端可以按需split('\n')
  };
};

/**
 * 格式化分页数据
 * @param {Object} pagination - 分页对象
 * @returns {Object} 标准化的分页对象
 */
export const formatPagination = (pagination) => {
  if (!pagination || typeof pagination !== 'object') {
    return {
      currentPage: 1,
      pageSize: 20,
      totalItems: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
      isFirstPage: true,
      isLastPage: true,
    };
  }
  
  // 兼容不同的分页字段名
  return {
    currentPage: pagination.currentPage || pagination.page || 1,
    pageSize: pagination.pageSize || pagination.size || 20,
    totalItems: pagination.totalItems || pagination.total || 0,
    totalPages: pagination.totalPages || Math.ceil((pagination.totalItems || 0) / (pagination.pageSize || 20)),
    hasNext: pagination.hasNext ?? false,
    hasPrevious: pagination.hasPrevious ?? false,
    isFirstPage: pagination.isFirstPage ?? true,
    isLastPage: pagination.isLastPage ?? false,
  };
};

/**
 * 格式化文件上传响应数据
 * @param {Object} file - 文件数据对象
 * @returns {Object} 转换后的文件数据
 */
export const formatFileData = (file) => {
  if (!file || typeof file !== 'object') return null;
  
  return {
    ...file,
    id: ensureNumericId(file.id),
    materialId: file.materialId ? ensureNumericId(file.materialId) : null,
    // fileName, filePath, fileSize, fileType 已经是正确的字段名
  };
};

/**
 * 从时间字符串中移除Z后缀（如果存在）
 * @param {string} timeString - 时间字符串
 * @returns {string} 处理后的时间字符串
 * @example
 * removeTimezoneZ("2024-10-25T10:00:00Z") // "2024-10-25T10:00:00"
 * removeTimezoneZ("2024-10-25T10:00:00") // "2024-10-25T10:00:00"
 */
export const removeTimezoneZ = (timeString) => {
  if (typeof timeString !== 'string') return timeString;
  return timeString.replace(/Z$/, '');
};

/**
 * 格式化完整的API响应数据（包含items和pagination）
 * @param {Object} response - API响应对象
 * @param {Function} itemFormatter - 单个item的格式化函数
 * @returns {Object} 格式化后的响应对象
 */
export const formatListResponse = (response, itemFormatter) => {
  if (!response || typeof response !== 'object') {
    return {
      items: [],
      pagination: formatPagination(null),
    };
  }
  
  const items = Array.isArray(response.items) ? response.items : [];
  
  return {
    items: itemFormatter ? items.map(itemFormatter) : items,
    pagination: formatPagination(response.pagination),
  };
};

export default {
  tagsStringToArray,
  tagsArrayToString,
  ensureNumericId,
  convertIdsToNumber,
  formatUserStats,
  formatUserData,
  formatPostData,
  formatPostsData,
  formatCommentData,
  formatCountryData,
  formatPlanData,
  formatMaterialData,
  formatPagination,
  formatFileData,
  removeTimezoneZ,
  formatListResponse,
};

