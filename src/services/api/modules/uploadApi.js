/**
 * GoAbroad 文件上传 API
 * 处理头像、图片、文件等上传
 */

import apiClient from '../client';

/**
 * 文件类型枚举
 */
export const FileType = {
  AVATAR: 'avatar',           // 用户头像
  POST_IMAGE: 'post_image',   // 帖子图片
  MATERIAL: 'material',       // 材料文件
  ATTACHMENT: 'attachment',   // 通用附件
};

/**
 * 上传单个文件
 * @param {File|Object} file - 文件对象 (浏览器) 或文件信息 (React Native)
 * @param {string} type - 文件类型 (avatar, post_image, material, attachment)
 * @param {Function} onProgress - 上传进度回调 (percent) => void
 * @returns {Promise<Object>} 上传结果
 */
export const uploadFile = async (file, type = FileType.ATTACHMENT, onProgress) => {
  try {
    const formData = new FormData();
    
    // React Native 环境
    if (file.uri) {
      // 从 URI 提取文件信息
      const filename = file.uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const fileType = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('file', {
        uri: file.uri,
        name: filename,
        type: file.type || fileType,
      });
    } 
    // Web 环境
    else if (file instanceof File || file instanceof Blob) {
      formData.append('file', file);
    }
    // 直接传入的文件对象
    else {
      formData.append('file', file);
    }
    
    // 添加文件类型参数
    formData.append('type', type);
    
    console.log('📤 [文件上传] 开始上传:', { type, filename: file.name || file.uri });
    
    // 发送上传请求
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // 上传进度监听
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
          console.log(`📊 [文件上传] 进度: ${percent}%`);
        }
      },
    });
    
    console.log('✅ [文件上传] 上传成功:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [文件上传] 上传失败:', error);
    throw error;
  }
};

/**
 * 上传多个文件
 * @param {Array<File|Object>} files - 文件数组
 * @param {string} type - 文件类型
 * @param {Function} onProgress - 总体进度回调 (percent) => void
 * @returns {Promise<Array<Object>>} 上传结果数组
 */
export const uploadMultipleFiles = async (files, type = FileType.ATTACHMENT, onProgress) => {
  try {
    console.log(`📤 [批量上传] 开始上传 ${files.length} 个文件`);
    
    const results = [];
    let completedCount = 0;
    
    // 逐个上传文件
    for (const file of files) {
      const result = await uploadFile(file, type, (percent) => {
        // 计算总体进度
        const totalProgress = Math.round(
          ((completedCount + percent / 100) / files.length) * 100
        );
        if (onProgress) {
          onProgress(totalProgress);
        }
      });
      
      results.push(result);
      completedCount++;
    }
    
    console.log(`✅ [批量上传] 全部上传成功: ${results.length} 个文件`);
    return results;
  } catch (error) {
    console.error('❌ [批量上传] 上传失败:', error);
    throw error;
  }
};

/**
 * 上传头像
 * @param {File|Object} file - 头像文件
 * @param {Function} onProgress - 上传进度回调
 * @returns {Promise<Object>} 上传结果
 */
export const uploadAvatar = async (file, onProgress) => {
  return uploadFile(file, FileType.AVATAR, onProgress);
};

/**
 * 上传帖子图片
 * @param {File|Object} file - 图片文件
 * @param {Function} onProgress - 上传进度回调
 * @returns {Promise<Object>} 上传结果
 */
export const uploadPostImage = async (file, onProgress) => {
  return uploadFile(file, FileType.POST_IMAGE, onProgress);
};

/**
 * 上传多张帖子图片
 * @param {Array<File|Object>} files - 图片文件数组
 * @param {Function} onProgress - 总体进度回调
 * @returns {Promise<Array<Object>>} 上传结果数组
 */
export const uploadPostImages = async (files, onProgress) => {
  return uploadMultipleFiles(files, FileType.POST_IMAGE, onProgress);
};

/**
 * 上传材料文件
 * @param {File|Object} file - 材料文件
 * @param {Function} onProgress - 上传进度回调
 * @returns {Promise<Object>} 上传结果
 */
export const uploadMaterial = async (file, onProgress) => {
  return uploadFile(file, FileType.MATERIAL, onProgress);
};

/**
 * 验证文件类型
 * @param {File|Object} file - 文件对象
 * @param {Array<string>} allowedTypes - 允许的 MIME 类型数组
 * @returns {boolean} 是否为允许的类型
 */
export const validateFileType = (file, allowedTypes) => {
  const fileType = file.type || file.mimeType;
  return allowedTypes.some((type) => {
    if (type.endsWith('/*')) {
      // 通配符匹配，如 'image/*'
      const prefix = type.slice(0, -2);
      return fileType?.startsWith(prefix);
    }
    return fileType === type;
  });
};

/**
 * 验证文件大小
 * @param {File|Object} file - 文件对象
 * @param {number} maxSize - 最大文件大小（字节）
 * @returns {boolean} 是否符合大小限制
 */
export const validateFileSize = (file, maxSize) => {
  const size = file.size || file.fileSize;
  return size <= maxSize;
};

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的大小字符串
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
};

// 常用文件类型定义
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// 文件大小限制（字节）
export const FILE_SIZE_LIMITS = {
  AVATAR: 5 * 1024 * 1024,        // 5MB
  POST_IMAGE: 10 * 1024 * 1024,   // 10MB
  VIDEO: 100 * 1024 * 1024,       // 100MB
  MATERIAL: 20 * 1024 * 1024,     // 20MB
};

export default {
  uploadFile,
  uploadMultipleFiles,
  uploadAvatar,
  uploadPostImage,
  uploadPostImages,
  uploadMaterial,
  validateFileType,
  validateFileSize,
  formatFileSize,
  FileType,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  FILE_SIZE_LIMITS,
};

