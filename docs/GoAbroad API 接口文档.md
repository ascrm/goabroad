# 📘 GoAbroad 后端 API 接口文档

---
**版本**: v0.1.0  
**基础URL**: `http://localhost:8080/api`  
**文档生成日期**: 2024-10-25  
**当前状态**: 开发中（仅实现部分认证接口）

## 📑 目录

1. [通用说明](#通用说明)
2. [认证模块 (Auth)](#1-认证模块-auth)
3. [用户模块 (User)](#2-用户模块-user)
4. [国家模块 (Country)](#3-国家模块-country)
5. [规划模块 (Planning)](#4-规划模块-planning)
6. [社区模块 (Community)](#5-社区模块-community)
7. [工具模块 (Tools)](#6-工具模块-tools)
8. [通知模块 (Notification)](#7-通知模块-notification)
9. [文件上传模块 (Upload)](#8-文件上传模块-upload)
10. [错误码说明](#错误码说明)

---

## 通用说明

### 请求头规范

```http
Content-Type: application/json
Accept: application/json
Authorization：{token_value}                # 需要认证的接口（Sa-Token认证）
X-App-Version: 1.0.0                  # 客户端版本（可选）
X-Platform: web/ios/android           # 平台类型（可选）
```

**认证说明**:
- 本项目使用 Sa-Token 作为认证框架
- Token默认存储在请求头的 `Authorization` 字段中
- Token有效期默认为30天（2592000秒）
- 登录/注册成功后会返回token，需要在后续需要认证的接口中携带

### 统一响应格式

**说明**: 所有接口返回统一的Result对象，包含以下字段：

#### 成功响应

```json
{
  "code": 200,
  "message": "操作成功",
  "data": { /* 具体数据，可能为null */ },
  "timestamp": 1698345600000
}
```

**字段说明**:
- `code`: 状态码（200表示成功）
- `message`: 响应消息
- `data`: 响应数据（泛型，根据接口不同而不同）
- `timestamp`: 响应时间戳（毫秒）

#### 失败响应

```json
{
  "code": 40001,
  "message": "该手机号已被注册",
  "data": null,
  "timestamp": 1698345600000
}
```

**字段说明**:
- `code`: 错误码（详见错误码说明章节）
- `message`: 错误描述信息
- `data`: 通常为null
- `timestamp`: 响应时间戳（毫秒）

### 分页参数规范

```
page: 页码，从 1 开始（默认1）
pageSize: 每页数量，默认 20，最大 100
```

### 分页响应格式

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "items": [ /* 数据列表 */ ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 20,
      "totalItems": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrevious": false,
      "isFirstPage": true,
      "isLastPage": false
    }
  },
  "timestamp": 1698345600000
}
```

**分页字段说明**:
- `items`: 当前页的数据列表
- `pagination`: 分页信息对象
  - `currentPage`: 当前页码
  - `pageSize`: 每页大小
  - `totalItems`: 总记录数
  - `totalPages`: 总页数
  - `hasNext`: 是否有下一页
  - `hasPrevious`: 是否有上一页
  - `isFirstPage`: 是否是第一页
  - `isLastPage`: 是否是最后一页

---

## 1. 认证模块 (Auth)

### 1.1 用户注册

**接口**: `POST /api/auth/register`  
**说明**: 手机号短信验证码注册  
**需要认证**: 否

#### 请求参数

```json
{
  "phone": "13800138000",
  "code": "123456",
  "password": "password123"
}
```

**参数说明**:
- `phone`: 手机号（必填，格式：1[3-9]开头的11位数字）
- `code`: 短信验证码（必填，6位数字）
- `password`: 密码（必填，长度6-20位）

#### 响应示例

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenName": "Authorization",
    "tokenTimeout": 2592000
  },
  "timestamp": 1698345600000
}
```

**响应说明**:
- `token`: 访问令牌（Sa-Token）
- `tokenName`: Token名称（默认为Authorization）
- `tokenTimeout`: Token有效期（秒），默认30天（2592000秒）
- 注册成功后会自动登录

### 1.2 用户登录

**接口**: `POST /api/auth/login`  
**说明**: 支持手机号或邮箱+密码登录  
**需要认证**: 否

#### 请求参数

```json
{
  "account": "13800138000",
  "password": "password123"
}
```

**参数说明**:
- `account`: 手机号或邮箱（必填）
- `password`: 密码（必填）

#### 响应示例

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "username": "user_1234567890_5678",
      "email": null,
      "phone": "138****8000",
      "nickname": "用户123456",
      "avatarUrl": null,
      "bio": null,
      "gender": null,
      "level": 1,
      "points": 0,
      "exp": 0,
      "postCount": 0,
      "followerCount": 0,
      "followingCount": 0,
      "status": "ACTIVE",
      "emailVerified": false,
      "phoneVerified": true,
      "isVip": false,
      "vipExpireAt": null,
      "lastLoginAt": "2024-10-25T10:00:00",
      "createdAt": "2024-10-25T10:00:00",
      "updatedAt": "2024-10-25T10:00:00"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenName": "Authorization",
    "tokenTimeout": 2592000
  },
  "timestamp": 1698345600000
}
```

**响应说明**:
- `user`: 用户信息对象
  - `id`: 用户ID（Long类型）
  - `username`: 用户名（自动生成，格式：user_时间戳_随机数）
  - `email`: 邮箱（已脱敏，可能为null）
  - `phone`: 手机号（已脱敏）
  - `nickname`: 昵称（自动生成，格式：用户+6位随机数）
  - `status`: 账号状态（ACTIVE/INACTIVE/BANNED/DELETED）
  - `gender`: 性别（MALE/FEMALE/OTHER/PREFER_NOT_TO_SAY）
  - `phoneVerified`: 手机号是否已验证
  - `emailVerified`: 邮箱是否已验证
- `token`: 访问令牌
- `tokenName`: Token名称
- `tokenTimeout`: Token有效期（秒）

### 1.3 发送短信验证码

**接口**: `GET /api/auth/send-sms-code`  
**说明**: 发送短信验证码（用于注册）  
**需要认证**: 否

#### 请求参数

```
phone: 13800138000  // 手机号（必填）
```

**Query参数说明**:
- `phone`: 手机号（必填，格式：1[3-9]开头的11位数字）

#### 响应示例

```json
{
  "code": 200,
  "message": "验证码已发送，请查收短信",
  "data": null,
  "timestamp": 1698345600000
}
```

**功能说明**:
- 验证码为6位数字
- 有效期为5分钟
- 验证码会保存在Redis中
- 开发环境下验证码会打印在控制台日志中

### 1.4 用户登出

**接口**: `POST /api/auth/logout`  
**说明**: 退出登录，使当前token失效  
**需要认证**: 是

#### 请求头

```http
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 请求参数

无

#### 响应示例

```json
{
  "code": 200,
  "message": "登出成功",
  "data": null,
  "timestamp": 1698345600000
}
```

**功能说明**:
- 会清除用户的登录状态
- Token会立即失效
- 需要在请求头中携带有效的Token

### 1.5 其他认证接口（待实现）

以下接口暂未实现，将在后续版本中提供：

- 请求重置密码
- 重置密码
- 修改密码
- 第三方登录（微信、Apple）
- 检查邮箱是否存在
- 检查手机号是否存在
- 获取当前用户信息
- 手机号验证码快捷登录
- Token刷新

---

## 2. 用户模块 (User)

### 2.1 获取用户公开资料

**接口**: `GET /users/:userId`  
**说明**: 获取指定用户的公开资料  
**需要认证**: 否

#### URL 参数

```
userId: 用户 ID
```

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": "uuid-123",
    "username": "goabroad_xiaoxin",
    "nickname": "GoAbroad小新",
    "avatar": "https://cdn.goabroad.com/avatars/uuid-123.jpg",
    "bio": "正在准备美国留学",
    "gender": "MALE",
    "level": 5,
    "status": "ACTIVE",
    "badges": ["新人", "探索者", "热心助人"],
    "targetCountry": "US",
    "stats": {
      "postsCount": 25,
      "followersCount": 120,
      "followingCount": 85,
      "likesCount": 350
    },
    "isFollowing": false,  // 当前用户是否关注该用户
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

### 2.2 更新用户资料

**接口**: `PUT /users/profile`  
**说明**: 更新当前用户的资料  
**需要认证**: 是

#### 请求参数

```json
{
  "nickname": "新昵称",
  "bio": "个人简介",
  "targetCountry": "US",
  "targetType": "study",  // study, work, immigration, travel, undecided
  "targetDate": "2026-09-01",
  "currentStatus": "在读大学生"
}
```

#### 响应示例

```json
{
  "code": 200,
  "message": "资料更新成功",
  "data": {
    "id": "uuid-123",
    "username": "zhangsan",
    "nickname": "新昵称",
    "bio": "个人简介",
    "gender": "MALE",
    "targetCountry": "US",
    "targetType": "study",
    "targetDate": "2026-09-01",
    "currentStatus": "在读大学生",
    "status": "ACTIVE",
    "updatedAt": "2024-10-25T10:30:00Z"
  }
}
```

### 2.3 上传头像

**接口**: `POST /users/avatar`  
**说明**: 上传用户头像  
**需要认证**: 是  
**Content-Type**: `multipart/form-data`

#### 请求参数

```
avatar: File（图片文件）
```

#### 响应示例

```json
{
  "code": 200,
  "message": "头像上传成功",
  "data": {
    "avatar": "https://cdn.goabroad.com/avatars/uuid-123.jpg",
    "thumbnail": "https://cdn.goabroad.com/avatars/uuid-123_thumb.jpg"
  }
}
```

### 2.4 获取用户发布的帖子

**接口**: `GET /users/:userId/posts`  
**说明**: 获取指定用户发布的帖子列表  
**需要认证**: 否

#### URL 参数

```
userId: 用户 ID
```

#### Query 参数

```
page: 页码，默认 1
pageSize: 每页数量，默认 20
type: 帖子类型 (all, POST, QUESTION, TIMELINE)
```

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": "post-123",
        "title": "美国F1签证面签经验分享",
        "content": "今天刚刚通过面签...",
        "coverImage": "https://cdn.goabroad.com/posts/cover-123.jpg",
        "type": "post",
        "tags": ["美国", "签证", "F1"],
        "likeCount": 125,
        "commentCount": 32,
        "collectCount": 85,
        "viewCount": 1520,
        "isLiked": false,
        "isCollected": false,
        "createdAt": "2024-10-20T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 25,
      "totalPages": 2,
      "hasMore": true
    }
  }
}
```

### 2.5 获取用户收藏的帖子

**接口**: `GET /users/favorites`  
**说明**: 获取当前用户收藏的帖子  
**需要认证**: 是

#### Query 参数

```
page: 页码
pageSize: 每页数量
```

### 2.6 关注用户

**接口**: `POST /users/:userId/follow`  
**说明**: 关注指定用户  
**需要认证**: 是

#### 响应示例

```json
{
  "code": 200,
  "message": "关注成功",
  "data": {
    "isFollowing": true,
    "followersCount": 121
  }
}
```

### 2.7 取消关注用户

**接口**: `DELETE /users/:userId/follow`  
**说明**: 取消关注指定用户  
**需要认证**: 是

### 2.8 获取关注列表

**接口**: `GET /users/:userId/following`  
**说明**: 获取用户的关注列表  
**需要认证**: 否

#### Query 参数

```
page: 页码
pageSize: 每页数量
```

### 2.9 获取粉丝列表

**接口**: `GET /users/:userId/followers`  
**说明**: 获取用户的粉丝列表  
**需要认证**: 否

---

## 3. 国家模块 (Country)

### 3.1 获取国家列表

**接口**: `GET /countries`  
**说明**: 获取国家列表（支持筛选）  
**需要认证**: 否

#### Query 参数

```
type: 筛选类型 (all, hot, STUDY, WORK, IMMIGRATION)
region: 地区筛选 (asia, europe, north_america, oceania, etc.)
language: 语言筛选 (english, japanese, french, etc.)
cost: 费用等级 (low, medium, high)
difficulty: 难度等级 (easy, medium, hard)
keyword: 搜索关键词
page: 页码
pageSize: 每页数量
```

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": "country-us",
        "code": "US",
        "nameZh": "美国",
        "nameEn": "United States",
        "flagEmoji": "🇺🇸",
        "flagUrl": "https://cdn.goabroad.com/flags/us.png",
        "region": "north_america",
        "language": ["english"],
        "currency": "USD",
        "summary": "教育资源丰富，世界顶尖大学众多",
        "tags": ["留学热门", "移民友好", "科技发达"],
        "difficulty": "medium",
        "costLevel": "high",
        "popularityScore": 95,
        "stats": {
          "studentsCount": 5280,  // 使用该app规划的用户数
          "postsCount": 1520,     // 相关帖子数
          "guidesCount": 45       // 攻略数
        },
        "isFavorited": false,
        "createdAt": "2024-01-01T10:00:00Z"
      },
      {
        "id": "country-uk",
        "code": "UK",
        "nameZh": "英国",
        "nameEn": "United Kingdom",
        "flagEmoji": "🇬🇧",
        "summary": "学制短，教育质量高",
        "tags": ["留学热门", "历史悠久"],
        "difficulty": "medium",
        "costLevel": "high",
        "popularityScore": 88,
        "stats": {
          "studentsCount": 3850,
          "postsCount": 980,
          "guidesCount": 32
        },
        "isFavorited": true
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 15,
      "totalPages": 1,
      "hasMore": false
    }
  }
}
```

### 3.2 获取国家详情

**接口**: `GET /countries/:countryId`  
**说明**: 获取指定国家的详细信息  
**需要认证**: 否

#### URL 参数

```
countryId: 国家 ID 或国家代码 (如 "US", "UK")
```

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": "country-us",
    "code": "US",
    "nameZh": "美国",
    "nameEn": "United States",
    "flagEmoji": "🇺🇸",
    "flagUrl": "https://cdn.goabroad.com/flags/us.png",
    "region": "north_america",
    "capital": "华盛顿",
    "language": ["english"],
    "currency": "USD",
    "timezone": "UTC-5 ~ UTC-10",
    "
    
    // 概览信息
    "overview": {
      "summary": "美国拥有世界上最多的顶尖大学...",
      "advantages": [
        "教育资源丰富，世界排名前100大学占比最高",
        "专业选择多样，转专业灵活",
        "就业机会多，OPT政策友好",
        "多元文化，国际化程度高"
      ],
      "disadvantages": [
        "学费和生活费较高",
        "签证政策波动",
        "部分地区安全问题",
        "医疗费用昂贵"
      ],
      "suitableFor": [
        "追求顶尖教育资源的学生",
        "希望留美工作的技术人才",
        "有较强经济能力的家庭"
      ],
      "climate": "地域辽阔，气候多样，从热带到寒带均有",
      "safetyIndex": 7.5,
      "happinessIndex": 8.2
    },
    
    // 留学信息
    "studyInfo": {
      "overview": "美国高等教育体系完善...",
      "educationSystem": {
        "undergraduate": {
          "duration": "4年",
          "degreeType": "Bachelor",
          "requirements": "高中毕业，托福/雅思，SAT/ACT"
        },
        "graduate": {
          "duration": "1-2年（硕士），4-6年（博士）",
          "degreeType": "Master, PhD",
          "requirements": "本科毕业，托福/雅思，GRE/GMAT"
        }
      },
      "applicationProcess": [
        {
          "stage": "准备阶段",
          "timeRange": "提前12-18个月",
          "tasks": [
            "确定专业和学校",
            "准备语言考试（托福/雅思）",
            "准备标准化考试（GRE/GMAT/SAT）"
          ]
        },
        {
          "stage": "申请阶段",
          "timeRange": "提前8-12个月",
          "tasks": [
            "准备申请材料",
            "撰写文书（PS、推荐信等）",
            "提交网申",
            "支付申请费"
          ]
        },
        {
          "stage": "等待录取",
          "timeRange": "提前4-8个月",
          "tasks": [
            "查看申请状态",
            "准备面试（如需要）",
            "收到录取通知"
          ]
        },
        {
          "stage": "签证办理",
          "timeRange": "提前2-4个月",
          "tasks": [
            "获得I-20表格",
            "缴纳SEVIS费用",
            "预约签证面谈",
            "准备签证材料",
            "参加面签"
          ]
        }
      ],
      "costEstimate": {
        "tuition": {
          "public": {
            "min": 25000,
            "max": 45000,
            "currency": "USD",
            "unit": "年"
          },
          "private": {
            "min": 35000,
            "max": 70000,
            "currency": "USD",
            "unit": "年"
          }
        },
        "living": {
          "min": 12000,
          "max": 20000,
          "currency": "USD",
          "unit": "年"
        },
        "insurance": {
          "min": 1000,
          "max": 2500,
          "currency": "USD",
          "unit": "年"
        },
        "total": {
          "min": 38000,
          "max": 92500,
          "currency": "USD",
          "unit": "年"
        }
      },
      "scholarships": [
        {
          "name": "全额奖学金",
          "description": "覆盖学费和生活费",
          "difficulty": "very_hard"
        },
        {
          "name": "Merit-based Scholarship",
          "description": "基于学术成绩的奖学金",
          "difficulty": "hard"
        },
        {
          "name": "TA/RA",
          "description": "助教/助研职位",
          "difficulty": "medium"
        }
      ],
      "languageRequirements": {
        "undergraduate": {
          "toefl": 80,
          "ielts": 6.5,
          "note": "顶尖大学要求更高（托福100+，雅思7.0+）"
        },
        "graduate": {
          "toefl": 90,
          "ielts": 7.0,
          "note": "不同专业要求不同"
        }
      },
      "topUniversities": [
        {
          "name": "麻省理工学院",
          "nameEn": "MIT",
          "ranking": 1,
          "location": "马萨诸塞州",
          "tuition": 55878,
          "acceptance": 3.4
        },
        {
          "name": "斯坦福大学",
          "nameEn": "Stanford University",
          "ranking": 2,
          "location": "加利福尼亚州",
          "tuition": 58000,
          "acceptance": 4.3
        }
      ]
    },
    
    // 工作信息
    "workInfo": {
      "overview": "美国科技行业发达...",
      "visaTypes": [
        {
          "type": "H-1B",
          "name": "专业人才工作签证",
          "duration": "3年（可延期至6年）",
          "requirements": [
            "本科及以上学历",
            "雇主担保",
            "专业对口",
            "抽签中签"
          ],
          "difficulty": "hard",
          "annualQuota": 85000,
          "cost": 5000,
          "processingTime": "3-6个月"
        },
        {
          "type": "L-1",
          "name": "跨国公司内部调动",
          "duration": "3-7年",
          "requirements": [
            "在海外分公司工作满1年",
            "管理或专业职位"
          ],
          "difficulty": "medium"
        }
      ],
      "hotIndustries": ["科技", "金融", "医疗", "教育", "咨询"],
      "averageSalary": {
        "entry": 50000,
        "mid": 80000,
        "senior": 120000,
        "currency": "USD",
        "unit": "年"
      },
      "jobSearchChannels": [
        "LinkedIn",
        "Indeed",
        "Glassdoor",
        "公司官网",
        "校园招聘"
      ]
    },
    
    // 移民信息
    "immigrationInfo": {
      "overview": "美国提供多种移民途径...",
      "visaTypes": [
        {
          "type": "EB-1",
          "name": "杰出人才移民",
          "requirements": ["行业杰出成就", "国际认可"],
          "difficulty": "very_hard",
          "processingTime": "1-2年",
          "cost": 10000
        },
        {
          "type": "EB-2 NIW",
          "name": "国家利益豁免",
          "requirements": ["高学历", "特殊才能", "符合国家利益"],
          "difficulty": "hard",
          "processingTime": "2-3年"
        },
        {
          "type": "EB-3",
          "name": "技术/专业移民",
          "requirements": ["本科学历", "雇主担保"],
          "difficulty": "medium",
          "processingTime": "2-4年"
        }
      ],
      "permanentResidenceRequirements": {
        "duration": "持绿卡5年（或与公民结婚3年）",
        "residence": "一半以上时间居住在美国",
        "language": "基本英语能力",
        "civicsTest": true
      }
    },
    
    // 生活信息
    "livingInfo": {
      "climate": {
        "description": "地域辽阔，气候多样",
        "regions": [
          {
            "region": "东海岸",
            "climate": "四季分明，冬冷夏热",
            "temperature": "-5°C ~ 30°C"
          },
          {
            "region": "西海岸",
            "climate": "地中海气候，温和宜人",
            "temperature": "10°C ~ 25°C"
          },
          {
            "region": "中部",
            "climate": "大陆性气候，温差大",
            "temperature": "-15°C ~ 35°C"
          }
        ]
      },
      "costOfLiving": {
        "rent": {
          "min": 800,
          "max": 3000,
          "currency": "USD",
          "unit": "月",
          "note": "因城市而异，纽约旧金山最贵"
        },
        "food": {
          "min": 300,
          "max": 600,
          "currency": "USD",
          "unit": "月"
        },
        "transportation": {
          "min": 100,
          "max": 300,
          "currency": "USD",
          "unit": "月"
        },
        "utilities": {
          "min": 100,
          "max": 200,
          "currency": "USD",
          "unit": "月"
        }
      },
      "transportation": {
        "publicTransport": ["地铁", "公交", "火车"],
        "drivingRequired": true,
        "note": "除纽约等大城市外，建议购车"
      },
      "healthcare": {
        "system": "商业医疗保险为主",
        "insurance": true,
        "cost": "每月200-500美元",
        "note": "医疗费用昂贵，务必购买保险"
      },
      "safety": {
        "overall": 7.5,
        "note": "安全程度因地区而异，大城市部分区域需注意"
      },
      "culture": {
        "diversity": true,
        "religion": "基督教为主，多元宗教",
        "holidays": ["圣诞节", "感恩节", "独立日", "劳动节"],
        "tips": [
          "尊重个人空间",
          "注重个人隐私",
          "小费文化（15-20%）",
          "守时重要"
        ]
      }
    },
    
    // 统计数据
    "stats": {
      "studentsCount": 5280,
      "postsCount": 1520,
      "guidesCount": 45,
      "viewCount": 125000
    },
    
    // 相关攻略
    "guides": [
      {
        "id": "guide-123",
        "title": "2024美国留学完整指南",
        "author": "GoAbroad官方",
        "viewCount": 15200,
        "likeCount": 850,
        "createdAt": "2024-09-01T10:00:00Z"
      }
    ],
    
    // 常见问题
    "faqs": [
      {
        "question": "美国留学需要多少钱？",
        "answer": "公立大学学费约2.5-4.5万美元/年，私立大学3.5-7万美元/年，加上生活费，总费用约4-10万美元/年。"
      },
      {
        "question": "托福要考多少分？",
        "answer": "本科一般要求80分以上，研究生90分以上。顶尖大学通常要求100分以上。"
      },
      {
        "question": "什么时候开始申请？",
        "answer": "建议提前12-18个月开始准备，提前8-12个月提交申请。美国大学申请截止日期通常在前一年的11月-次年1月。"
      }
    ],
    
    "isFavorited": false,
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-10-20T10:00:00Z"
  }
}
```

### 3.3 搜索国家

**接口**: `GET /countries/search`  
**说明**: 根据关键词搜索国家  
**需要认证**: 否

#### Query 参数

```
keyword: 搜索关键词（国家名称、标签等）
```

### 3.4 收藏/取消收藏国家

**接口**: `POST /countries/:countryId/favorite`  
**说明**: 收藏或取消收藏国家（toggle）  
**需要认证**: 是

#### 响应示例

```json
{
  "code": 200,
  "message": "收藏成功",
  "data": {
    "isFavorited": true
  }
}
```

### 3.5 获取热门国家

**接口**: `GET /countries/hot`  
**说明**: 获取热门国家列表  
**需要认证**: 否

#### Query 参数

```
limit: 数量限制，默认 10
```

---

## 4. 规划模块 (Planning)

### 4.1 创建规划

**接口**: `POST /plans`  
**说明**: 创建新的出国规划  
**需要认证**: 是

#### 请求参数

```json
{
  "country": "US",                    // 目标国家代码
  "planType": "STUDY",                // STUDY, WORK, IMMIGRATION
  "subType": "master",                // bachelor, master, phd, work_visa, etc.
  "targetDate": "2026-09-01",         // 目标日期
  "currentStatus": {                  // 当前状态
    "education": "undergraduate",      // 学历
    "graduationDate": "2025-06-01",
    "major": "计算机科学",
    "gpa": 3.5,
    "languageTest": {
      "type": "toefl",
      "score": 95,
      "testDate": "2024-08-15"
    },
    "workExperience": 0               // 工作年限
  },
  "preferences": {                    // 偏好设置
    "budget": 50000,                  // 预算（美元）
    "cities": ["Boston", "San Francisco"],
    "majors": ["Computer Science", "Data Science"]
  }
}
```

#### 响应示例

```json
{
  "code": 200,
  "message": "规划创建成功",
  "data": {
    "id": "plan-123",
    "userId": "user-123",
    "country": "US",
    "countryName": "美国",
    "planType": "STUDY",
    "subType": "master",
    "targetDate": "2026-09-01",
    "currentStatus": { /* 同请求 */ },
    "preferences": { /* 同请求 */ },
    "progress": 0,
    "status": "ACTIVE",          // ACTIVE, COMPLETED, PAUSED, ARCHIVED
    "timeline": [ /* 生成的时间线 */ ],
    "materialsCount": {
      "total": 25,
      "completed": 0,
      "inProgress": 0,
      "notStarted": 25
    },
    "tasksCount": {
      "total": 48,
      "completed": 0,
      "upcoming": 5
    },
    "createdAt": "2024-10-25T10:00:00Z",
    "updatedAt": "2024-10-25T10:00:00Z"
  }
}
```

### 4.2 获取规划列表

**接口**: `GET /plans`  
**说明**: 获取当前用户的所有规划  
**需要认证**: 是

#### Query 参数

```
status: 规划状态 (ACTIVE, COMPLETED, PAUSED, ARCHIVED)
```

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "id": "plan-123",
      "country": "US",
      "countryName": "美国",
      "countryFlag": "🇺🇸",
      "planType": "STUDY",
      "subType": "master",
      "targetDate": "2026-09-01",
      "progress": 35,
      "status": "ACTIVE",
      "daysUntilTarget": 678,
      "materialsCount": {
        "total": 25,
        "completed": 8
      },
      "tasksCount": {
        "total": 48,
        "completed": 15,
        "upcoming": 3
      },
      "upcomingTasks": [
        {
          "id": "task-1",
          "title": "完成托福考试",
          "dueDate": "2024-12-15",
          "priority": "high"
        },
        {
          "id": "task-2",
          "title": "准备推荐信",
          "dueDate": "2024-12-20",
          "priority": "medium"
        }
      ],
      "createdAt": "2024-10-25T10:00:00Z",
      "updatedAt": "2024-10-25T10:00:00Z"
    }
  ]
}
```

### 4.3 获取规划详情

**接口**: `GET /plans/:planId`  
**说明**: 获取指定规划的详细信息  
**需要认证**: 是

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": "plan-123",
    "userId": "user-123",
    "country": "US",
    "countryName": "美国",
    "countryFlag": "🇺🇸",
    "planType": "STUDY",
    "subType": "master",
    "targetDate": "2026-09-01",
    "currentStatus": {
      "education": "undergraduate",
      "graduationDate": "2025-06-01",
      "major": "计算机科学",
      "gpa": 3.5,
      "languageTest": {
        "type": "toefl",
        "score": 95,
        "testDate": "2024-08-15"
      }
    },
    "preferences": {
      "budget": 50000,
      "cities": ["Boston", "San Francisco"],
      "majors": ["Computer Science", "Data Science"]
    },
    "progress": 35,
    "status": "ACTIVE",
    "daysUntilTarget": 678,
    "timeline": [
      {
        "stage": "语言考试",
        "stageOrder": 1,
        "timeRange": "2024.11 - 2025.03",
        "status": "IN_PROGRESS",  // NOT_STARTED, IN_PROGRESS, COMPLETED
        "progress": 60,
        "tasks": [
          {
            "id": "task-1",
            "title": "了解托福/雅思考试",
            "description": "研究考试形式、评分标准、报名流程",
            "status": "COMPLETED",
            "dueDate": null,
            "completedAt": "2024-10-01T10:00:00Z",
            "order": 1
          },
          {
            "id": "task-2",
            "title": "备考3-6个月",
            "description": "制定备考计划，每天保持学习",
            "status": "IN_PROGRESS",
            "dueDate": "2025-02-01",
            "order": 2,
            "resources": [
              {
                "type": "link",
                "title": "托福备考攻略",
                "url": "https://..."
              }
            ]
          },
          {
            "id": "task-3",
            "title": "参加考试",
            "description": "预约考位，参加托福考试",
            "status": "NOT_STARTED",
            "dueDate": "2025-02-15",
            "priority": "high",
            "order": 3,
            "reminders": [
              {
                "id": "reminder-1",
                "time": "2025-02-08T09:00:00Z",
                "message": "距离托福考试还有7天"
              }
            ]
          }
        ]
      },
      {
        "stage": "选校定位",
        "stageOrder": 2,
        "timeRange": "2025.04 - 2025.06",
        "status": "NOT_STARTED",
        "progress": 0,
        "tasks": [
          {
            "id": "task-10",
            "title": "确定专业方向",
            "status": "NOT_STARTED",
            "order": 1
          },
          {
            "id": "task-11",
            "title": "研究目标学校",
            "status": "NOT_STARTED",
            "order": 2
          }
        ]
      }
    ],
    "statistics": {
      "totalStages": 8,
      "completedStages": 0,
      "totalTasks": 48,
      "completedTasks": 15,
      "totalMaterials": 25,
      "completedMaterials": 8,
      "estimatedCost": {
        "tuition": 45000,
        "living": 18000,
        "other": 5000,
        "total": 68000,
        "currency": "USD"
      }
    },
    "createdAt": "2024-10-25T10:00:00Z",
    "updatedAt": "2024-10-25T11:30:00Z"
  }
}
```

### 4.4 更新规划

**接口**: `PUT /plans/:planId`  
**说明**: 更新规划基本信息  
**需要认证**: 是

#### 请求参数

```json
{
  "targetDate": "2026-09-01",
  "currentStatus": { /* 更新的状态 */ },
  "preferences": { /* 更新的偏好 */ }
}
```

### 4.5 删除规划

**接口**: `DELETE /plans/:planId`  
**说明**: 删除规划（软删除，状态改为 archived）  
**需要认证**: 是

### 4.6 更新任务状态

**接口**: `PUT /plans/:planId/tasks/:taskId`  
**说明**: 更新任务的完成状态  
**需要认证**: 是

#### 请求参数

```json
{
  "status": "COMPLETED",  // NOT_STARTED, IN_PROGRESS, COMPLETED, SKIPPED
  "notes": "已完成托福考试，成绩98分"
}
```

#### 响应示例

```json
{
  "code": 200,
  "message": "任务状态更新成功",
  "data": {
    "taskId": "task-3",
    "status": "COMPLETED",
    "completedAt": "2024-10-25T14:30:00Z",
    "planProgress": 38  // 更新后的整体进度
  }
}
```

### 4.7 获取材料清单

**接口**: `GET /plans/:planId/materials`  
**说明**: 获取规划的材料清单  
**需要认证**: 是

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "required": [
      {
        "id": "material-1",
        "name": "护照",
        "category": "REQUIRED",
        "description": "有效期需超过6个月",
        "requirements": [
          "护照首页清晰扫描件",
          "有效期至少剩余6个月",
          "如有旧护照也需提供"
        ],
        "format": "PDF",
        "status": "COMPLETED",
        "files": [
          {
            "id": "file-1",
            "name": "passport.pdf",
            "url": "https://cdn.goabroad.com/files/passport.pdf",
            "size": 2048000,
            "uploadedAt": "2024-10-20T10:00:00Z"
          }
        ],
        "completedAt": "2024-10-20T10:00:00Z",
        "dueDate": null,
        "order": 1
      },
      {
        "id": "material-2",
        "name": "I-20表格",
        "category": "REQUIRED",
        "description": "学校发放的录取文件",
        "status": "NOT_STARTED",
        "files": [],
        "dueDate": "2026-05-01",
        "reminders": [
          {
            "id": "reminder-2",
            "time": "2026-04-24T09:00:00Z",
            "message": "记得索要I-20表格"
          }
        ],
        "order": 2
      }
    ],
    "supporting": [
      {
        "id": "material-15",
        "name": "存款证明",
        "category": "SUPPORTING",
        "description": "证明有足够资金支付学费和生活费",
        "requirements": [
          "金额需覆盖第一年所有费用",
          "建议金额：60-80万人民币",
          "需银行盖章",
          "有效期3-6个月"
        ],
        "status": "IN_PROGRESS",
        "files": [],
        "order": 1
      }
    ],
    "optional": [
      {
        "id": "material-20",
        "name": "获奖证书",
        "category": "OPTIONAL",
        "description": "各类竞赛、奖项证书",
        "status": "NOT_STARTED",
        "files": [],
        "order": 1
      }
    ],
    "summary": {
      "total": 25,
      "completed": 8,
      "inProgress": 5,
      "notStarted": 12,
      "required": {
        "total": 10,
        "completed": 3
      },
      "supporting": {
        "total": 10,
        "completed": 4
      },
      "optional": {
        "total": 5,
        "completed": 1
      }
    }
  }
}
```

### 4.8 更新材料状态

**接口**: `PUT /plans/:planId/materials/:materialId`  
**说明**: 更新材料的状态  
**需要认证**: 是

#### 请求参数

```json
{
  "status": "COMPLETED",  // NOT_STARTED, IN_PROGRESS, COMPLETED
  "notes": "已从学校获取"
}
```

### 4.9 上传材料文件

**接口**: `POST /plans/:planId/materials/:materialId/files`  
**说明**: 上传材料文件  
**需要认证**: 是  
**Content-Type**: `multipart/form-data`

#### 请求参数

```
file: File（文件）
```

#### 响应示例

```json
{
  "code": 200,
  "message": "文件上传成功",
  "data": {
    "id": "file-2",
    "materialId": "material-2",
    "name": "i20.pdf",
    "originalName": "I-20_Form.pdf",
    "url": "https://cdn.goabroad.com/files/i20.pdf",
    "size": 1024000,
    "mimeType": "application/pdf",
    "uploadedAt": "2024-10-25T15:00:00Z"
  }
}
```

### 4.10 删除材料文件

**接口**: `DELETE /plans/:planId/materials/:materialId/files/:fileId`  
**说明**: 删除材料文件  
**需要认证**: 是

### 4.11 设置提醒

**接口**: `POST /plans/:planId/reminders`  
**说明**: 为任务或材料设置提醒  
**需要认证**: 是

#### 请求参数

```json
{
  "type": "task",  // task, material, milestone
  "targetId": "task-3",
  "title": "距离托福考试还有7天",
  "message": "记得复习口语和听力",
  "remindTime": "2025-02-08T09:00:00Z"
}
```

### 4.12 获取提醒列表

**接口**: `GET /plans/:planId/reminders`  
**说明**: 获取规划的所有提醒  
**需要认证**: 是

### 4.13 导出材料清单

**接口**: `GET /plans/:planId/materials/export`  
**说明**: 导出材料清单为 PDF  
**需要认证**: 是

#### Query 参数

```
format: pdf | excel
```

---

## 5. 社区模块 (Community)

### 5.1 获取帖子列表

**接口**: `GET /community/posts`  
**说明**: 获取帖子列表（支持筛选）  
**需要认证**: 否（登录后可看到个性化推荐）

#### Query 参数

```
tab: recommend | following | country | stage  # Tab类型
country: US | UK | CA ...                    # 国家筛选
stage: preparation | applying | waiting ...   # 阶段筛选
type: POST | QUESTION | TIMELINE | VLOG      # 内容类型
sort: latest | hot | recommended             # 排序方式
page: 页码
pageSize: 每页数量
```

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": "post-123",
        "author": {
          "id": "user-123",
          "nickname": "GoAbroad小新",
          "avatar": "https://cdn.goabroad.com/avatars/user-123.jpg",
          "level": 5,
          "badges": ["热心助人"]
        },
        "contentType": "POST",
        "title": "美国F1签证面签经验分享",
        "content": "今天刚刚通过面签，分享一下经验...",
        "contentPreview": "今天刚刚通过面签，分享一下经验...",  // 前200字
        "coverImage": "https://cdn.goabroad.com/posts/cover-123.jpg",
        "images": [
          "https://cdn.goabroad.com/posts/img1.jpg",
          "https://cdn.goabroad.com/posts/img2.jpg"
        ],
        "tags": ["美国", "签证", "F1", "面签经验"],
        "country": "US",
        "stage": "签证办理",
        "likeCount": 125,
        "commentCount": 32,
        "collectCount": 85,
        "viewCount": 1520,
        "isLiked": false,
        "isCollected": false,
        "isPinned": false,
        "isFeatured": true,
        "createdAt": "2024-10-20T10:00:00Z",
        "updatedAt": "2024-10-20T10:00:00Z"
      },
      {
        "id": "post-124",
        "author": {
          "id": "user-124",
          "nickname": "留学小白",
          "avatar": "https://cdn.goabroad.com/avatars/user-124.jpg",
          "level": 2
        },
        "contentType": "QUESTION",
        "title": "请问英国读研需要准备多少钱？",
        "content": "打算明年去英国读研，不知道需要准备多少钱...",
        "contentPreview": "打算明年去英国读研...",
        "tags": ["英国", "留学", "费用"],
        "country": "UK",
        "likeCount": 15,
        "commentCount": 8,
        "collectCount": 5,
        "viewCount": 280,
        "isLiked": false,
        "isCollected": false,
        "hasAcceptedAnswer": false,
        "createdAt": "2024-10-24T16:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 1520,
      "totalPages": 76,
      "hasMore": true
    }
  }
}
```

### 5.2 获取帖子详情

**接口**: `GET /community/posts/:postId`  
**说明**: 获取帖子详情  
**需要认证**: 否

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": "post-123",
    "author": {
      "id": "user-123",
      "nickname": "GoAbroad小新",
      "avatar": "https://cdn.goabroad.com/avatars/user-123.jpg",
      "bio": "正在准备美国留学",
      "level": 5,
      "badges": ["热心助人", "经验分享者"],
      "stats": {
        "postsCount": 25,
        "followersCount": 120
      },
      "isFollowing": false
    },
    "contentType": "POST",
    "title": "美国F1签证面签经验分享",
    "content": "# 前言\n\n今天刚刚通过面签...\n\n## 准备材料\n\n1. 护照\n2. I-20...",  // Markdown格式
    "status": "PUBLISHED",
    "coverImage": "https://cdn.goabroad.com/posts/cover-123.jpg",
    "images": [
      {
        "url": "https://cdn.goabroad.com/posts/img1.jpg",
        "thumbnail": "https://cdn.goabroad.com/posts/img1_thumb.jpg",
        "width": 1920,
        "height": 1080
      }
    ],
    "videos": [],
    "tags": ["美国", "签证", "F1", "面签经验"],
    "country": "US",
    "countryName": "美国",
    "stage": "签证办理",
    "likeCount": 125,
    "commentCount": 32,
    "collectCount": 85,
    "viewCount": 1521,  // 自动+1
    "isLiked": false,
    "isCollected": false,
    "isPinned": false,
    "isFeatured": true,
    "createdAt": "2024-10-20T10:00:00Z",
    "updatedAt": "2024-10-20T10:00:00Z",
    
    // 相关推荐
    "relatedPosts": [
      {
        "id": "post-456",
        "title": "F1签证材料清单",
        "author": { /* 简要信息 */ },
        "coverImage": "https://...",
        "viewCount": 850,
        "likeCount": 45
      }
    ]
  }
}
```

### 5.3 发布帖子

**接口**: `POST /community/posts`  
**说明**: 发布新帖子  
**需要认证**: 是

#### 请求参数

```json
{
  "contentType": "POST",  // POST, QUESTION, TIMELINE, VLOG
  "title": "美国F1签证面签经验分享",
  "content": "# 前言\n\n今天刚刚通过面签...",  // Markdown格式
  "status": "PUBLISHED",  // DRAFT, PUBLISHED
  "coverImage": "https://cdn.goabroad.com/posts/cover-123.jpg",
  "images": [
    "https://cdn.goabroad.com/posts/img1.jpg",
    "https://cdn.goabroad.com/posts/img2.jpg"
  ],
  "videos": [],
  "tags": ["美国", "签证", "F1", "面签经验"],
  "country": "US",
  "stage": "签证办理"
}
```

#### 响应示例

```json
{
  "code": 200,
  "message": "发布成功",
  "data": {
    "id": "post-125",
    "author": { /* 当前用户信息 */ },
    "contentType": "POST",
    "title": "美国F1签证面签经验分享",
    "content": "...",
    "status": "PUBLISHED",
    "coverImage": "...",
    "images": [],
    "tags": ["美国", "签证", "F1"],
    "country": "US",
    "likeCount": 0,
    "commentCount": 0,
    "collectCount": 0,
    "viewCount": 0,
    "createdAt": "2024-10-25T16:00:00Z"
  }
}
```

### 5.4 编辑帖子

**接口**: `PUT /community/posts/:postId`  
**说明**: 编辑已发布的帖子  
**需要认证**: 是（仅作者可编辑）

#### 请求参数

```json
{
  "title": "更新后的标题",
  "content": "更新后的内容",
  "images": [],
  "tags": ["更新", "标签"]
}
```

### 5.5 删除帖子

**接口**: `DELETE /community/posts/:postId`  
**说明**: 删除帖子  
**需要认证**: 是（仅作者可删除）

### 5.6 点赞帖子

**接口**: `POST /community/posts/:postId/like`  
**说明**: 点赞或取消点赞帖子（toggle）  
**需要认证**: 是

#### 响应示例

```json
{
  "code": 200,
  "message": "点赞成功",
  "data": {
    "isLiked": true,
    "likeCount": 126
  }
}
```

### 5.7 收藏帖子

**接口**: `POST /community/posts/:postId/collect`  
**说明**: 收藏或取消收藏帖子（toggle）  
**需要认证**: 是

#### 响应示例

```json
{
  "code": 200,
  "message": "收藏成功",
  "data": {
    "isCollected": true,
    "collectCount": 86
  }
}
```

### 5.8 获取评论列表

**接口**: `GET /community/posts/:postId/comments`  
**说明**: 获取帖子的评论列表  
**需要认证**: 否

#### Query 参数

```
sort: latest | hot        # 排序方式
page: 页码
pageSize: 每页数量
```

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": "comment-123",
        "postId": "post-123",
        "author": {
          "id": "user-456",
          "nickname": "热心网友",
          "avatar": "https://cdn.goabroad.com/avatars/user-456.jpg",
          "level": 3
        },
        "content": "非常有用的分享，感谢！",
        "images": [],
        "likeCount": 15,
        "replyCount": 2,
        "isLiked": false,
        "isAuthor": false,  // 是否是楼主
        "parentId": null,   // 父评论ID（一级评论为null）
        "replies": [
          {
            "id": "comment-124",
            "author": {
              "id": "user-123",
              "nickname": "GoAbroad小新",
              "avatar": "...",
              "level": 5
            },
            "content": "不客气，祝你好运！",
            "likeCount": 5,
            "isLiked": false,
            "isAuthor": true,
            "parentId": "comment-123",
            "replyTo": {
              "id": "user-456",
              "nickname": "热心网友"
            },
            "createdAt": "2024-10-20T11:00:00Z"
          }
        ],
        "createdAt": "2024-10-20T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 32,
      "totalPages": 2,
      "hasMore": true
    }
  }
}
```

### 5.9 发表评论

**接口**: `POST /community/posts/:postId/comments`  
**说明**: 发表评论或回复  
**需要认证**: 是

#### 请求参数

```json
{
  "content": "非常有用的分享，感谢！",
  "images": [],
  "parentId": null,          // 回复评论时填写父评论ID
  "replyToUserId": null      // 回复用户ID
}
```

#### 响应示例

```json
{
  "code": 200,
  "message": "评论成功",
  "data": {
    "id": "comment-125",
    "postId": "post-123",
    "author": { /* 当前用户信息 */ },
    "content": "非常有用的分享，感谢！",
    "likeCount": 0,
    "replyCount": 0,
    "isLiked": false,
    "parentId": null,
    "createdAt": "2024-10-25T16:30:00Z"
  }
}
```

### 5.10 删除评论

**接口**: `DELETE /community/posts/:postId/comments/:commentId`  
**说明**: 删除评论  
**需要认证**: 是（仅作者可删除）

### 5.11 点赞评论

**接口**: `POST /community/posts/:postId/comments/:commentId/like`  
**说明**: 点赞或取消点赞评论（toggle）  
**需要认证**: 是

### 5.12 举报帖子/评论

**接口**: `POST /community/reports`  
**说明**: 举报违规内容  
**需要认证**: 是

#### 请求参数

```json
{
  "type": "post",  // post, comment
  "targetId": "post-123",
  "reason": "spam",  // spam, inappropriate, false_info, other
  "description": "详细说明..."
}
```

---

## 6. 工具模块 (Tools)

### 6.1 费用计算器

**接口**: `POST /tools/calculate/cost`  
**说明**: 计算留学费用  
**需要认证**: 否

#### 请求参数

```json
{
  "country": "US",
  "schoolType": "public",      // public, private
  "region": "east_coast",      // east_coast, west_coast, midwest, south
  "duration": 1,               // 年数
  "tuition": 40000,            // 自定义学费
  "accommodation": "on_campus", // on_campus, off_campus
  "lifestyle": "medium"         // low, medium, high
}
```

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "breakdown": {
      "tuition": {
        "amount": 40000,
        "currency": "USD",
        "note": "公立大学学费"
      },
      "accommodation": {
        "amount": 12000,
        "currency": "USD",
        "note": "校内宿舍"
      },
      "living": {
        "food": 5000,
        "transportation": 2000,
        "books": 1000,
        "personal": 3000,
        "total": 11000,
        "currency": "USD"
      },
      "insurance": {
        "amount": 2500,
        "currency": "USD",
        "note": "医疗保险"
      },
      "flights": {
        "amount": 5000,
        "currency": "USD",
        "note": "往返机票（2次/年）"
      },
      "other": {
        "amount": 2000,
        "currency": "USD",
        "note": "其他杂费"
      }
    },
    "total": {
      "usd": 72500,
      "cny": 524500,    // 自动汇率转换
      "exchangeRate": 7.23,
      "perYear": 72500,
      "totalYears": 72500  // duration年总计
    },
    "comparison": {
      "average": 65000,
      "percentile": 65,   // 超过65%的预算
      "note": "您的预算高于平均水平"
    },
    "calculatedAt": "2024-10-25T17:00:00Z"
  }
}
```

### 6.2 获取实时汇率

**接口**: `GET /tools/exchange-rate`  
**说明**: 获取实时汇率  
**需要认证**: 否

#### Query 参数

```
from: USD
to: CNY
amount: 1000  # 可选，返回转换后金额
```

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "from": "USD",
    "to": "CNY",
    "rate": 7.23,
    "amount": 1000,
    "converted": 7230,
    "timestamp": "2024-10-25T17:00:00Z",
    "source": "中国银行"
  }
}
```

### 6.3 GPA转换

**接口**: `POST /tools/gpa/convert`  
**说明**: GPA换算（支持多种算法）  
**需要认证**: 否

#### 请求参数

```json
{
  "fromSystem": "chinese_100",  // chinese_100, us_4.0, uk_class, etc.
  "toSystem": "us_4.0",
  "score": 85,
  "algorithm": "wes"  // wes, standard, custom
}
```

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "original": {
      "system": "chinese_100",
      "score": 85
    },
    "converted": {
      "system": "us_4.0",
      "score": 3.5,
      "range": "3.3 - 3.7"
    },
    "algorithm": "wes",
    "note": "此结果仅供参考，实际转换可能因学校而异",
    "calculatedAt": "2024-10-25T17:00:00Z"
  }
}

### 6.4 选校定位工具

**接口**: `POST /tools/school-match`  
**说明**: 根据用户条件推荐匹配的学校  
**需要认证**: 否

#### 请求参数

```json
{
  "country": "US",
  "degree": "master",          // bachelor, master, phd
  "major": "Computer Science",
  "gpa": 3.5,
  "languageTest": {
    "type": "toefl",
    "score": 100
  },
  "standardizedTest": {
    "type": "gre",
    "score": 320
  },
  "budget": 50000,             // 年度预算（USD）
  "preferences": {
    "region": ["east_coast", "west_coast"],
    "schoolSize": "medium",    // small, medium, large
    "location": "urban"        // urban, suburban, rural
  }
}
```

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "summary": {
      "total": 15,
      "reach": 3,      // 冲刺院校
      "match": 8,      // 匹配院校
      "safety": 4      // 保底院校
    },
    "schools": [
      {
        "id": "school-123",
        "name": "Carnegie Mellon University",
        "nameZh": "卡内基梅隆大学",
        "logo": "https://cdn.goabroad.com/schools/cmu.png",
        "ranking": {
          "us_news": 22,
          "qs": 52,
          "major": 1
        },
        "location": {
          "city": "Pittsburgh",
          "state": "Pennsylvania",
          "region": "east_coast"
        },
        "matchLevel": "reach",   // reach, match, safety
        "matchScore": 75,        // 匹配度分数
        "tuition": 58000,
        "acceptance": 15.4,      // 录取率
        "requirements": {
          "gpa": 3.5,
          "toefl": 100,
          "gre": 320
        },
        "yourProfile": {
          "gpa": 3.5,
          "toefl": 100,
          "gre": 320,
          "comparison": {
            "gpa": "达标",
            "toefl": "达标",
            "gre": "达标"
          }
        },
        "reasons": [
          "专业排名全美第一",
          "你的GPA和语言成绩符合要求",
          "位于东海岸，符合地理偏好"
        ]
      }
    ]
  }
}
```

### 6.5 签证预约查询

**接口**: `GET /tools/visa-appointments`  
**说明**: 查询签证预约可用时间  
**需要认证**: 否

#### Query 参数

```
country: US
visaType: F1
city: beijing | shanghai | guangzhou | chengdu | shenyang
```

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "country": "US",
    "visaType": "F1",
    "city": "beijing",
    "cityName": "北京",
    "embassy": "美国驻华大使馆",
    "address": "北京市朝阳区安家楼路55号",
    "availableDates": [
      {
        "date": "2024-11-15",
        "slots": ["09:00", "10:30", "14:00"],
        "status": "available"
      },
      {
        "date": "2024-11-16",
        "slots": [],
        "status": "full"
      },
      {
        "date": "2024-11-18",
        "slots": ["09:30", "11:00"],
        "status": "available"
      }
    ],
    "earliestDate": "2024-11-15",
    "waitTime": 21,  // 等待天数
    "lastUpdated": "2024-10-25T17:00:00Z"
  }
}
```

### 6.6 语言考试日期查询

**接口**: `GET /tools/test-dates`  
**说明**: 查询托福、雅思等考试日期  
**需要认证**: 否

#### Query 参数

```
testType: toefl | ielts | gre | gmat
city: beijing
startDate: 2024-11-01
endDate: 2024-12-31
```

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "testType": "toefl",
    "city": "beijing",
    "cityName": "北京",
    "dates": [
      {
        "date": "2024-11-16",
        "testCenter": "北京托福考试中心",
        "address": "北京市海淀区...",
        "seats": "充足",
        "fee": 2100,
        "currency": "CNY",
        "registrationDeadline": "2024-11-09",
        "status": "open"
      },
      {
        "date": "2024-11-23",
        "testCenter": "北京托福考试中心",
        "seats": "紧张",
        "fee": 2100,
        "status": "open"
      },
      {
        "date": "2024-11-30",
        "testCenter": "北京托福考试中心",
        "seats": "已满",
        "status": "full"
      }
    ],
    "lastUpdated": "2024-10-25T17:00:00Z"
  }
}
```

### 6.7 时差查询

**接口**: `GET /tools/timezone`  
**说明**: 查询时差  
**需要认证**: 否

#### Query 参数

```
from: Asia/Shanghai
to: America/New_York
```

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "from": {
      "timezone": "Asia/Shanghai",
      "name": "中国标准时间",
      "offset": "+08:00",
      "currentTime": "2024-10-26T01:00:00+08:00"
    },
    "to": {
      "timezone": "America/New_York",
      "name": "美国东部时间",
      "offset": "-04:00",
      "currentTime": "2024-10-25T13:00:00-04:00"
    },
    "difference": {
      "hours": 12,
      "description": "北京时间比纽约时间快12小时"
    }
  }
}
```

### 6.8 院校对比

**接口**: `POST /tools/compare-schools`  
**说明**: 对比多所院校  
**需要认证**: 否

#### 请求参数

```json
{
  "schoolIds": ["school-123", "school-456", "school-789"]
}
```

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "schools": [
      {
        "id": "school-123",
        "name": "MIT",
        "ranking": 1,
        "tuition": 58000,
        "acceptance": 3.4,
        "location": "Cambridge, MA",
        "studentCount": 11520,
        "facultyRatio": 3,
        "employmentRate": 95.8
      },
      {
        "id": "school-456",
        "name": "Stanford",
        "ranking": 2,
        "tuition": 58000,
        "acceptance": 4.3,
        "location": "Stanford, CA",
        "studentCount": 17249,
        "facultyRatio": 5,
        "employmentRate": 94.2
      }
    ],
    "comparison": {
      "bestRanking": "school-123",
      "lowestTuition": "tie",
      "highestAcceptance": "school-456",
      "bestEmployment": "school-123"
    }
  }
}
```

---

## 7. 通知模块 (Notification)

### 7.1 获取通知列表

**接口**: `GET /notifications`  
**说明**: 获取当前用户的通知列表  
**需要认证**: 是

#### Query 参数

```
type: all | LIKE | COMMENT | FOLLOW | REPLY | MENTION | SYSTEM | POLICY_UPDATE
status: all | unread | read
page: 页码
pageSize: 每页数量
```

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": "notif-123",
        "type": "LIKE",  // SYSTEM, LIKE, COMMENT, FOLLOW, REPLY, MENTION, POLICY_UPDATE
        "title": "有人点赞了你的帖子",
        "content": "用户 GoAbroad小新 点赞了你的帖子《美国F1签证面签经验分享》",
        "avatar": "https://cdn.goabroad.com/avatars/user-123.jpg",
        "data": {
          "userId": "user-123",
          "userName": "GoAbroad小新",
          "postId": "post-123",
          "postTitle": "美国F1签证面签经验分享"
        },
        "actionUrl": "/community/post/post-123",
        "isRead": false,
        "createdAt": "2024-10-25T10:30:00Z"
      },
      {
        "id": "notif-124",
        "type": "COMMENT",
        "title": "有人评论了你的帖子",
        "content": "用户 留学小白 评论了你的帖子：非常有用的分享，感谢！",
        "avatar": "https://cdn.goabroad.com/avatars/user-456.jpg",
        "data": {
          "userId": "user-456",
          "userName": "留学小白",
          "postId": "post-123",
          "commentId": "comment-125",
          "commentContent": "非常有用的分享，感谢！"
        },
        "actionUrl": "/community/post/post-123#comment-125",
        "isRead": false,
        "createdAt": "2024-10-25T09:15:00Z"
      },
      {
        "id": "notif-125",
        "type": "FOLLOW",
        "title": "有人关注了你",
        "content": "用户 准备留学ing 关注了你",
        "avatar": "https://cdn.goabroad.com/avatars/user-789.jpg",
        "data": {
          "userId": "user-789",
          "userName": "准备留学ing"
        },
        "actionUrl": "/profile/user-789",
        "isRead": true,
        "createdAt": "2024-10-24T16:20:00Z"
      },
      {
        "id": "notif-126",
        "type": "REPLY",
        "title": "收到回复",
        "content": "用户 热心网友 回复了你的评论：我也遇到了同样的问题",
        "avatar": "https://cdn.goabroad.com/avatars/user-456.jpg",
        "data": {
          "userId": "user-456",
          "userName": "热心网友",
          "postId": "post-123",
          "commentId": "comment-126"
        },
        "actionUrl": "/community/post/post-123#comment-126",
        "isRead": false,
        "createdAt": "2024-10-25T09:00:00Z"
      },
      {
        "id": "notif-127",
        "type": "SYSTEM",
        "title": "系统通知",
        "content": "GoAbroad 2.0 版本已发布，快来体验新功能！",
        "icon": "🎉",
        "data": {
          "version": "2.0.0",
          "updateUrl": "https://goabroad.com/updates"
        },
        "actionUrl": "/settings/about",
        "isRead": true,
        "createdAt": "2024-10-20T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 58,
      "totalPages": 3,
      "hasMore": true
    },
    "unreadCount": 15
  }
}
```

### 7.2 获取未读通知数量

**接口**: `GET /notifications/unread-count`  
**说明**: 获取未读通知数量  
**需要认证**: 是

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "total": 15,
    "byType": {
      "like": 5,
      "comment": 3,
      "follow": 2,
      "reply": 2,
      "mention": 1,
      "system": 1,
      "policy_update": 1
    }
  }
}
```

### 7.3 标记通知为已读

**接口**: `PUT /notifications/:notificationId/read`  
**说明**: 标记指定通知为已读  
**需要认证**: 是

#### 响应示例

```json
{
  "code": 200,
  "message": "标记成功"
}
```

### 7.4 标记所有通知为已读

**接口**: `PUT /notifications/read-all`  
**说明**: 标记所有通知为已读  
**需要认证**: 是

#### Query 参数（可选）

```
type: LIKE | COMMENT | FOLLOW | REPLY | MENTION | SYSTEM | POLICY_UPDATE  # 可选，仅标记特定类型
```

#### 响应示例

```json
{
  "code": 200,
  "message": "所有通知已标记为已读",
  "data": {
    "updatedCount": 15
  }
}
```

### 7.5 删除通知

**接口**: `DELETE /notifications/:notificationId`  
**说明**: 删除指定通知  
**需要认证**: 是

### 7.6 清空通知

**接口**: `DELETE /notifications/clear`  
**说明**: 清空所有通知  
**需要认证**: 是

#### Query 参数（可选）

```
type: LIKE | COMMENT | FOLLOW | REPLY | MENTION | SYSTEM | POLICY_UPDATE  # 可选，仅清空特定类型
status: read | unread  # 可选，仅清空已读/未读
```

### 7.7 获取通知设置

**接口**: `GET /notifications/settings`  
**说明**: 获取通知偏好设置  
**需要认证**: 是

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "pushEnabled": true,
    "emailEnabled": false,
    "types": {
      "LIKE": {
        "push": true,
        "email": false,
        "inApp": true
      },
      "COMMENT": {
        "push": true,
        "email": true,
        "inApp": true
      },
      "FOLLOW": {
        "push": true,
        "email": false,
        "inApp": true
      },
      "REPLY": {
        "push": true,
        "email": false,
        "inApp": true
      },
      "MENTION": {
        "push": true,
        "email": true,
        "inApp": true
      },
      "SYSTEM": {
        "push": true,
        "email": true,
        "inApp": true
      },
      "POLICY_UPDATE": {
        "push": true,
        "email": true,
        "inApp": true
      }
    },
    "quietHours": {
      "enabled": true,
      "start": "22:00",
      "end": "08:00"
    }
  }
}
```

### 7.8 更新通知设置

**接口**: `PUT /notifications/settings`  
**说明**: 更新通知偏好设置  
**需要认证**: 是

#### 请求参数

```json
{
  "pushEnabled": true,
  "emailEnabled": false,
  "types": {
    "LIKE": {
      "push": true,
      "email": false
    },
    "COMMENT": {
      "push": true,
      "email": true
    }
  },
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

---

## 8. 文件上传模块 (Upload)

### 8.1 通用文件上传

**接口**: `POST /upload`  
**说明**: 通用文件上传接口  
**需要认证**: 是  
**Content-Type**: `multipart/form-data`

#### 请求参数

```
file: File（文件）
type: avatar | post_image | material | attachment  # 文件类型
```

#### 响应示例

```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "id": "file-123",
    "url": "https://cdn.goabroad.com/uploads/2024/10/25/file-123.jpg",
    "thumbnailUrl": "https://cdn.goabroad.com/uploads/2024/10/25/file-123_thumb.jpg",
    "filename": "image.jpg",
    "originalName": "我的照片.jpg",
    "size": 2048000,
    "mimeType": "image/jpeg",
    "width": 1920,
    "height": 1080,
    "uploadedAt": "2024-10-25T18:00:00Z"
  }
}
```

### 8.2 批量上传

**接口**: `POST /upload/batch`  
**说明**: 批量上传多个文件  
**需要认证**: 是  
**Content-Type**: `multipart/form-data`

#### 请求参数

```
files[]: File[]（多个文件）
type: post_image | material | attachment
```

#### 响应示例

```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "total": 3,
    "success": 3,
    "failed": 0,
    "files": [
      {
        "id": "file-123",
        "url": "https://cdn.goabroad.com/uploads/file-123.jpg",
        "thumbnailUrl": "https://cdn.goabroad.com/uploads/file-123_thumb.jpg",
        "filename": "image1.jpg",
        "size": 2048000
      },
      {
        "id": "file-124",
        "url": "https://cdn.goabroad.com/uploads/file-124.jpg",
        "thumbnailUrl": "https://cdn.goabroad.com/uploads/file-124_thumb.jpg",
        "filename": "image2.jpg",
        "size": 1536000
      }
    ],
    "uploadedAt": "2024-10-25T18:00:00Z"
  }
}
```

### 8.3 获取上传凭证（七牛云/阿里云OSS）

**接口**: `GET /upload/token`  
**说明**: 获取第三方云存储上传凭证（用于客户端直传）  
**需要认证**: 是

#### Query 参数

```
type: avatar | post_image | material | attachment
provider: qiniu | aliyun  # 可选
```

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "provider": "qiniu",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "uploadUrl": "https://upload.qiniup.com",
    "domain": "https://cdn.goabroad.com",
    "key": "uploads/2024/10/25/uuid-123",
    "expiresAt": "2024-10-25T19:00:00Z"
  }
}
```

### 8.4 删除文件

**接口**: `DELETE /upload/:fileId`  
**说明**: 删除已上传的文件  
**需要认证**: 是

#### 响应示例

```json
{
  "code": 200,
  "message": "文件删除成功"
}
```

---

## 9. 搜索模块 (Search)

### 9.1 全局搜索

**接口**: `GET /search`  
**说明**: 全局搜索（国家、帖子、用户等）  
**需要认证**: 否

#### Query 参数

```
keyword: 搜索关键词
type: all | country | post | user | school  # 搜索类型
page: 页码
pageSize: 每页数量
```

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "keyword": "美国留学",
    "total": 158,
    "results": {
      "countries": [
        {
          "id": "country-us",
          "type": "country",
          "nameZh": "美国",
          "nameEn": "United States",
          "flagEmoji": "🇺🇸",
          "summary": "教育资源丰富..."
        }
      ],
      "posts": [
        {
          "id": "post-123",
          "type": "post",
          "title": "美国F1签证面签经验分享",
          "contentPreview": "今天刚刚通过面签...",
          "author": { /* 简要信息 */ },
          "likeCount": 125,
          "viewCount": 1520,
          "createdAt": "2024-10-20T10:00:00Z"
        }
      ],
      "users": [
        {
          "id": "user-123",
          "type": "user",
          "nickname": "美国留学小助手",
          "avatar": "...",
          "bio": "帮助大家实现美国留学梦",
          "followersCount": 1250
        }
      ],
      "schools": [
        {
          "id": "school-123",
          "type": "school",
          "name": "MIT",
          "nameZh": "麻省理工学院",
          "logo": "...",
          "ranking": 1
        }
      ]
    },
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 158,
      "hasMore": true
    }
  }
}
```

### 9.2 搜索建议

**接口**: `GET /search/suggestions`  
**说明**: 获取搜索建议（自动补全）  
**需要认证**: 否

#### Query 参数

```
keyword: 搜索关键词（至少2个字符）
limit: 建议数量，默认10
```

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "suggestions": [
      {
        "text": "美国留学",
        "type": "keyword",
        "count": 1520
      },
      {
        "text": "美国签证",
        "type": "keyword",
        "count": 850
      },
      {
        "text": "美国",
        "type": "country",
        "countryCode": "US"
      },
      {
        "text": "美国留学小助手",
        "type": "user",
        "userId": "user-123",
        "avatar": "..."
      }
    ]
  }
}
```

### 9.3 热门搜索

**接口**: `GET /search/hot`  
**说明**: 获取热门搜索关键词  
**需要认证**: 否

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "keywords": [
      {
        "keyword": "美国F1签证",
        "count": 15200,
        "trend": "up",  // up, down, stable
        "ranking": 1
      },
      {
        "keyword": "英国留学费用",
        "count": 12800,
        "trend": "up",
        "ranking": 2
      },
      {
        "keyword": "托福考试",
        "count": 11500,
        "trend": "stable",
        "ranking": 3
      }
    ],
    "updatedAt": "2024-10-25T18:00:00Z"
  }
}
```

### 9.4 搜索历史

**接口**: `GET /search/history`  
**说明**: 获取用户搜索历史  
**需要认证**: 是

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "history": [
      {
        "keyword": "美国留学",
        "searchedAt": "2024-10-25T17:00:00Z"
      },
      {
        "keyword": "托福备考",
        "searchedAt": "2024-10-24T15:30:00Z"
      }
    ]
  }
}
```

### 9.5 清空搜索历史

**接口**: `DELETE /search/history`  
**说明**: 清空搜索历史  
**需要认证**: 是

---

## 10. 统计模块 (Statistics)

### 10.1 获取首页统计数据

**接口**: `GET /statistics/home`  
**说明**: 获取首页展示的统计数据  
**需要认证**: 否

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "users": {
      "total": 125680,
      "active": 52300,
      "newToday": 320
    },
    "posts": {
      "total": 85200,
      "newToday": 520
    },
    "countries": {
      "total": 48,
      "hot": ["US", "UK", "CA", "AU", "DE"]
    },
    "plans": {
      "total": 68500,
      "completed": 12800
    }
  }
}
```

### 10.2 获取用户统计

**接口**: `GET /statistics/user`  
**说明**: 获取当前用户的统计数据  
**需要认证**: 是

#### 响应示例

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "posts": {
      "total": 25,
      "likes": 850,
      "views": 15200,
      "comments": 320
    },
    "community": {
      "followers": 120,
      "following": 85,
      "collections": 45
    },
    "planning": {
      "activePlans": 2,
      "completedPlans": 0,
      "tasksCompleted": 35,
      "materialsCompleted": 12
    },
    "achievements": {
      "level": 5,
      "points": 1250,
      "badges": 8,
      "rank": 1250  // 全站排名
    }
  }
}
```

---

## 错误码说明

### HTTP 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 204 | 删除成功（无内容返回）|
| 400 | 请求参数错误 |
| 401 | 未认证或 Token 失效 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 409 | 资源冲突（如重复注册）|
| 422 | 请求参数验证失败 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |
| 503 | 服务暂时不可用 |

### 业务错误码

#### 通用状态码

| 错误码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 500 | 系统错误 |
| 400 | 请求参数错误 |
| 401 | 未授权（未登录或Token失效）|
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 405 | 请求方法不允许 |
| 422 | 参数验证失败 |
| 429 | 请求过于频繁 |

#### 用户相关 (40xxx)

| 错误码 | 说明 |
|--------|------|
| 40001 | 用户不存在 |
| 40002 | 用户已存在 |
| 40003 | 密码错误 |
| 40004 | 用户已被禁用 |
| 40005 | 用户名或密码错误 |

#### 认证相关 (41xxx)

| 错误码 | 说明 |
|--------|------|
| 41001 | 未登录或Token失效 |
| 41002 | Token已过期 |
| 41003 | Token无效 |
| 41004 | 无权限访问 |

#### 帖子相关 (42xxx)

| 错误码 | 说明 |
|--------|------|
| 42001 | 帖子不存在 |
| 42002 | 帖子已被删除 |
| 42003 | 无权限操作该帖子 |

#### 评论相关 (43xxx)

| 错误码 | 说明 |
|--------|------|
| 43001 | 评论不存在 |
| 43002 | 评论已被删除 |
| 43003 | 无权限操作该评论 |

#### 文件上传相关 (44xxx)

| 错误码 | 说明 |
|--------|------|
| 44001 | 文件为空 |
| 44002 | 文件大小超过限制 |
| 44003 | 不支持的文件类型 |
| 44004 | 文件上传失败 |

#### 验证相关 (45xxx)

| 错误码 | 说明 |
|--------|------|
| 45001 | 验证码错误 |
| 45002 | 验证码已过期 |
| 45003 | 验证码发送失败 |

**注意**: 
- 错误码和错误消息定义在 `ResultCode` 枚举类中
- 业务异常通过 `BusinessException` 抛出
- 全局异常处理器会自动捕获异常并返回统一格式的错误响应

### 错误响应示例

#### 业务异常示例

```json
{
  "code": 40001,
  "message": "用户不存在",
  "data": null,
  "timestamp": 1698345600000
}
```

#### 参数验证失败示例

```json
{
  "code": 422,
  "message": "参数验证失败: {code=验证码格式不正确, phone=手机号不能为空}",
  "data": null,
  "timestamp": 1698345600000
}
```

#### 未登录/Token失效示例

```json
{
  "code": 401,
  "message": "未提供Token",
  "data": null,
  "timestamp": 1698345600000
}
```

#### 无权限访问示例

```json
{
  "code": 403,
  "message": "无权限访问: 需要权限 post:delete",
  "data": null,
  "timestamp": 1698345600000
}
```

---

## 附录

### A. 数据模型定义

#### 用户模型 (User)

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  name: string;
  nickname: string;
  avatar?: string;
  bio?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  level: number;
  points: number;
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED' | 'DELETED';
  badges: string[];
  targetCountry?: string;
  targetType?: 'STUDY' | 'WORK' | 'IMMIGRATION';
  createdAt: string;
  updatedAt: string;
}
```

#### 帖子模型 (Post)

```typescript
interface Post {
  id: string;
  authorId: string;
  author: User;
  contentType: 'POST' | 'QUESTION' | 'TIMELINE' | 'VLOG';
  title: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED' | 'DELETED';
  coverImage?: string;
  images: string[];
  videos: Video[];
  tags: string[];
  country?: string;
  stage?: string;
  likeCount: number;
  commentCount: number;
  favoriteCount: number;
  viewCount: number;
  isLiked: boolean;
  isFavorited: boolean;
  isPinned: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### 规划模型 (Plan)

```typescript
interface Plan {
  id: string;
  userId: string;
  country: string;
  planType: 'STUDY' | 'WORK' | 'IMMIGRATION';
  subType: string;
  targetDate: string;
  currentStatus: object;
  preferences: object;
  progress: number;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'ARCHIVED';
  timeline: Stage[];
  createdAt: string;
  updatedAt: string;
}
```

### B. 请求频率限制

| 接口类型 | 限制 |
|---------|------|
| 登录/注册 | 5次/分钟 |
| 发送验证码 | 1次/分钟 |
| 发布帖子 | 10次/小时 |
| 发布评论 | 30次/小时 |
| 上传文件 | 20次/小时 |
| 一般查询 | 100次/分钟 |

### C. 分页最佳实践

- 默认每页 20 条
- 最大每页 100 条
- 建议使用游标分页处理大数据量

### D. 版本控制

API 版本通过 URL 路径指定：`/api/v1/`

当有不兼容的更新时，会发布新版本（如 v2），旧版本会保留至少 6 个月的兼容期。

### E. 开发环境

- **开发环境**: `https://dev-api.goabroad.com/api/v1`
- **测试环境**: `https://test-api.goabroad.com/api/v1`
- **生产环境**: `https://api.goabroad.com/api/v1`

---

## 更新日志

### v0.1.0 (2024-10-25)
- 初始版本发布
- **已实现的功能**:
  - 认证模块：用户注册（手机号）、登录、登出、发送短信验证码
  - 统一响应格式（Result）
  - 全局异常处理
  - 分页响应（PageResult）
  - Sa-Token认证集成
- **待实现的功能**:
  - 用户模块
  - 国家模块
  - 规划模块
  - 社区模块
  - 工具模块
  - 通知模块
  - 文件上传模块
  - 搜索模块

---

## 技术栈说明

### 后端技术栈
- **框架**: Spring Boot 3.2.0
- **认证**: Sa-Token 1.38.0
- **数据库**: MySQL 8.0 + Redis
- **ORM**: Spring Data JPA
- **文档**: Swagger 3 (springdoc-openapi)
- **工具类**: Hutool, Lombok
- **密码加密**: BCrypt

### API开发规范
- 所有接口统一前缀: `/api`
- 认证相关接口: `/api/auth`
- 业务模块接口: `/api/v1/{module}`
- 使用RESTful风格
- 统一响应格式
- 统一异常处理

---

**文档结束**

如有疑问，请联系技术团队。
📧 Email: dev@goabroad.com
🔗 项目地址: https://github.com/goabroad/goabroad-api