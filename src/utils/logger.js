/**
 * 日志工具函数
 */
export const logFormattedData = (label, data) => {
  if (!data || data === 'null') {
    console.log(`${label}: null`);
    return;
  }

  try {
    const formatted = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    console.log(`${label}:`);
    console.log(formatted);
  } catch (error) {
    console.log(`${label}:`, String(data));
  }
};

/**
 * 过滤敏感信息
 */
export const maskSensitiveData = (data) => {
  if (!data || typeof data !== 'object') return data;

  const masked = { ...data };
  const sensitiveKeys = ['password', 'token', 'Authorization', 'authorization', 'refreshToken'];

  sensitiveKeys.forEach((key) => {
    if (masked[key]) {
      masked[key] = '***';
    }
  });

  return masked;
};

