// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// 解决 Bundler 缓存重建时的网络请求问题
config.server = {
  ...config.server,
  // 增加请求超时时间
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // 防止响应体被多次读取
      const originalJson = res.json;
      res.json = function(...args) {
        if (!res.headersSent) {
          return originalJson.apply(res, args);
        }
      };
      return middleware(req, res, next);
    };
  },
};

// 配置 resolver 避免模块解析冲突
config.resolver = {
  ...config.resolver,
  // 禁用符号链接以避免模块重复
  unstable_enableSymlinks: false,
  // 禁用包自动导出字段，避免解析冲突
  unstable_enablePackageExports: false,
};

module.exports = config;

