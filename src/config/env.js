/**
 * GoAbroad 环境配置
 * 管理不同环境下的 API 地址、密钥等配置
 */

// 判断当前环境
const ENV = __DEV__ ? 'development' : 'production';

// 各环境配置
const config = {
  development: {
    API_URL: 'http://172.20.10.3:8080/api',
    WS_URL: 'ws://192.168.31.183:8080',
    TIMEOUT: 30000,
  },
  production: {
    API_URL: 'https://api.goabroad.com/api',
    WS_URL: 'wss://api.goabroad.com',
    TIMEOUT: 30000,
  },
};

// 导出当前环境配置
export default config[ENV];

// 导出环境名称
export { ENV };

