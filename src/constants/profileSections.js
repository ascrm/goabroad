/**
 * 个人资料字段配置常量
 */

import { BIRTH_YEARS, CITIES, EDUCATION_LEVELS, MAJORS } from './profilePickerOptions';

// 字段配置
export const PROFILE_SECTIONS = [
  {
    title: '基本信息',
    icon: 'person-outline',
    fields: [
      { key: 'birthYear', label: '出生年份', type: 'picker', options: BIRTH_YEARS },
      { key: 'location', label: '所在城市', type: 'picker', options: CITIES },
    ],
  },
  {
    title: '教育背景',
    icon: 'school-outline',
    fields: [
      { key: 'educationLevel', label: '学历', type: 'picker', options: EDUCATION_LEVELS },
      { key: 'major', label: '专业', type: 'picker', options: MAJORS },
      { key: 'school', label: '学校', type: 'text' },
      { key: 'graduationYear', label: '毕业年份', type: 'text', keyboardType: 'numeric' },
      { key: 'gpa', label: 'GPA', type: 'text', keyboardType: 'decimal-pad', format: (val) => val ? `${val}` : '未填写' },
    ],
  },
  {
    title: '语言成绩',
    icon: 'language-outline',
    fields: [
      { key: 'toeflScore', label: '托福分数', type: 'text', keyboardType: 'numeric' },
      { key: 'ieltsScore', label: '雅思分数', type: 'text', keyboardType: 'decimal-pad', format: (val) => val ? `${val}` : '未填写' },
    ],
  },
  {
    title: '标准化考试',
    icon: 'document-text-outline',
    fields: [
      { key: 'greScore', label: 'GRE分数', type: 'text', keyboardType: 'numeric' },
      { key: 'gmatScore', label: 'GMAT分数', type: 'text', keyboardType: 'numeric' },
    ],
  },
  {
    title: '工作经历',
    icon: 'briefcase-outline',
    fields: [
      { key: 'workYears', label: '工作年限', type: 'text', keyboardType: 'numeric', format: (val) => val ? `${val}年` : '未填写' },
      { key: 'currentCompany', label: '当前公司', type: 'text' },
      { key: 'currentPosition', label: '当前职位', type: 'text' },
    ],
  },
];

