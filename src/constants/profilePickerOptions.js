/**
 * 个人资料选择器选项常量
 */

// 出生年份选项（从当前年份往前推75年）
export const BIRTH_YEARS = Array.from({ length: 75 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { label: `${year}年`, value: year.toString() };
});

// 城市选项
export const CITIES = [
  { label: '北京', value: '北京' },
  { label: '上海', value: '上海' },
  { label: '广州', value: '广州' },
  { label: '深圳', value: '深圳' },
  { label: '杭州', value: '杭州' },
  { label: '南京', value: '南京' },
  { label: '成都', value: '成都' },
  { label: '武汉', value: '武汉' },
  { label: '西安', value: '西安' },
  { label: '重庆', value: '重庆' },
  { label: '天津', value: '天津' },
  { label: '苏州', value: '苏州' },
  { label: '长沙', value: '长沙' },
  { label: '郑州', value: '郑州' },
  { label: '济南', value: '济南' },
  { label: '青岛', value: '青岛' },
  { label: '大连', value: '大连' },
  { label: '厦门', value: '厦门' },
  { label: '福州', value: '福州' },
  { label: '其他', value: '其他' },
];

// 学历选项
export const EDUCATION_LEVELS = [
  { label: '高中', value: '高中' },
  { label: '专科', value: '专科' },
  { label: '本科', value: '本科' },
  { label: '硕士', value: '硕士' },
  { label: '博士', value: '博士' },
  { label: '其他', value: '其他' },
];

// 专业选项
export const MAJORS = [
  { label: '计算机科学', value: '计算机科学' },
  { label: '软件工程', value: '软件工程' },
  { label: '数据科学', value: '数据科学' },
  { label: '人工智能', value: '人工智能' },
  { label: '电子信息工程', value: '电子信息工程' },
  { label: '机械工程', value: '机械工程' },
  { label: '电气工程', value: '电气工程' },
  { label: '土木工程', value: '土木工程' },
  { label: '化学工程', value: '化学工程' },
  { label: '生物工程', value: '生物工程' },
  { label: '金融学', value: '金融学' },
  { label: '经济学', value: '经济学' },
  { label: '工商管理', value: '工商管理' },
  { label: '市场营销', value: '市场营销' },
  { label: '会计学', value: '会计学' },
  { label: '法学', value: '法学' },
  { label: '医学', value: '医学' },
  { label: '教育学', value: '教育学' },
  { label: '心理学', value: '心理学' },
  { label: '新闻传播学', value: '新闻传播学' },
  { label: '英语', value: '英语' },
  { label: '其他', value: '其他' },
];

