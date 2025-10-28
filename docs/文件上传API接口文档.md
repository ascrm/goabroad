我来帮你把这个文件上传接口整理成接口文档格式。首先让我查看一下相关的类定义，以便提供完整的接口文档。

[5 tools called]

## 通用文件上传接口

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 通用文件上传 |
| **接口路径** | `/api/upload` |
| **请求方法** | `POST` |
| **接口描述** | 上传单个文件到服务器，支持多种文件类型 |
| **是否需要登录** | ✅ 是（需要携带 Token） |

---

### 请求参数

#### Header 参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `satoken` | String | 是 | 用户登录凭证 |
| `Content-Type` | String | 是 | 固定值：`multipart/form-data` |

#### Body 参数 (multipart/form-data)

| 参数名 | 类型 | 必填 | 默认值 | 说明 | 示例值 |
|--------|------|------|--------|------|--------|
| `file` | File | 是 | - | 要上传的文件 | - |
| `type` | String | 否 | `attachment` | 文件类型 | `avatar` |

#### type 参数可选值

| 值 | 说明 | 存储路径 | 允许的文件类型 |
|----|------|----------|----------------|
| `avatar` | 用户头像 | `avatars/` | JPEG, PNG, GIF, WebP |
| `post_image` | 帖子图片 | `posts/` | JPEG, PNG, GIF, WebP |
| `material` | 材料文件 | `materials/` | PDF, JPEG, PNG, DOC, DOCX |
| `attachment` | 通用附件 | `attachments/` | 所有类型 |

---

### 响应参数

#### 响应结构

```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "id": "file-123",
    "url": "https://cdn.goabroad.com/uploads/2024/10/25/file-123.jpg",
    "thumbnailUrl": "https://cdn.goabroad.com/uploads/2024/10/25/file-123_thumb.jpg",
    "filename": "uuid-123.jpg",
    "originalName": "我的照片.jpg",
    "size": 2048000,
    "mimeType": "image/jpeg",
    "width": 1920,
    "height": 1080,
    "uploadedAt": "2024-10-25T18:00:00"
  }
}
```

#### 响应字段说明

| 字段名 | 类型 | 说明 | 备注 |
|--------|------|------|------|
| `code` | Integer | 状态码 | 200表示成功 |
| `message` | String | 响应消息 | 上传成功 |
| `data` | Object | 响应数据 | 文件上传信息对象 |
| `data.id` | String | 文件ID | 文件的唯一标识 |
| `data.url` | String | 文件URL | 文件的访问地址 |
| `data.thumbnailUrl` | String | 缩略图URL | 仅图片文件有此字段 |
| `data.filename` | String | 存储的文件名 | 服务器存储的文件名 |
| `data.originalName` | String | 原始文件名 | 用户上传的原始文件名 |
| `data.size` | Long | 文件大小 | 单位：字节 |
| `data.mimeType` | String | MIME类型 | 文件的媒体类型 |
| `data.width` | Integer | 图片宽度 | 仅图片文件有此字段 |
| `data.height` | Integer | 图片高度 | 仅图片文件有此字段 |
| `data.uploadedAt` | String | 上传时间 | ISO 8601格式 |

---

### 请求示例

#### cURL

```bash
curl -X POST "http://localhost:8080/api/upload" \
  -H "satoken: your-token-here" \
  -F "file=@/path/to/your/image.jpg" \
  -F "type=avatar"
```

#### JavaScript (FormData)

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('type', 'avatar');

fetch('http://localhost:8080/api/upload', {
  method: 'POST',
  headers: {
    'satoken': 'your-token-here'
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

---

### 响应示例

#### 成功响应

```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "id": "file-20241025180000-abc123",
    "url": "https://cdn.goabroad.com/uploads/avatars/2024/10/25/uuid-abc123.jpg",
    "thumbnailUrl": "https://cdn.goabroad.com/uploads/avatars/2024/10/25/uuid-abc123_thumb.jpg",
    "filename": "uuid-abc123.jpg",
    "originalName": "我的头像.jpg",
    "size": 2048000,
    "mimeType": "image/jpeg",
    "width": 1920,
    "height": 1080,
    "uploadedAt": "2024-10-25T18:00:00"
  }
}
```

#### 错误响应

**未登录**
```json
{
  "code": 401,
  "message": "用户未登录"
}
```

**文件类型不支持**
```json
{
  "code": 400,
  "message": "不支持的文件类型"
}
```

**未知的文件类型参数**
```json
{
  "code": 400,
  "message": "未知的文件类型: invalid_type"
}
```

---

### 注意事项

1. **文件大小限制**：根据服务器配置，可能存在文件大小限制
2. **文件类型校验**：上传的文件 MIME 类型必须符合对应 `type` 参数的允许范围
3. **图片处理**：上传图片时，系统会自动生成缩略图并返回 `thumbnailUrl`、`width`、`height` 等信息
4. **非图片文件**：上传非图片文件时，`thumbnailUrl`、`width`、`height` 字段可能为 `null`
5. **文件存储**：不同类型的文件会存储在不同的目录下，便于管理和访问控制
6. **Token 认证**：请求必须携带有效的登录 Token，否则会返回 401 错误