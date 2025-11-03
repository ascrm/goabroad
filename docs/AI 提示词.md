## ✅ **简化方案：单图和多图都用固定尺寸 + 裁剪**

统一处理，不再动态计算宽高比，代码更简洁！

---

## 📝 **完整修改方案**

### **1. 移除状态和函数**

#### **删除第 56-57 行**
```javascript
// ❌ 删除这两行
// const [imageRatios, setImageRatios] = useState([]);
```

#### **删除第 294-304 行**
```javascript
// ❌ 删除整个 handleImageLoad 函数
// const handleImageLoad = (index, event) => {
//   const { width, height } = event.nativeEvent.source;
//   if (width && height) {
//     setImageRatios(prev => {
//       const newRatios = [...prev];
//       newRatios[index] = width / height;
//       return newRatios;
//     });
//   }
// };
```

#### **修改第 282-287 行的 removeImage 函数**
```javascript
// 移除图片
const removeImage = (index) => {
  setImages(images.filter((_, i) => i !== index));
  // ❌ 删除这行：setImageRatios(imageRatios.filter((_, i) => i !== index));
};
```

---

### **2. 修改 JSX（第 364-410 行）**

```javascript
{/* 媒体预览区域 */}
{images.length > 0 && (
  <View style={styles.mediaPreviewContainer}>
    {images.length === 1 ? (
      // 单张图片 - 固定尺寸，居中裁剪
      <View style={styles.singleImageContainer}>
        <Image 
          source={{ uri: images[0].uri }} 
          style={styles.singleImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.removeMediaBtn}
          onPress={() => removeImage(0)}
          hitSlop={8}
        >
          <Ionicons name="close-circle" size={24} color="rgba(0,0,0,0.6)" />
        </TouchableOpacity>
      </View>
    ) : (
      // 多张图片 - 横向滚动
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.multiImageScroll}
      >
        {images.map((image, index) => (
          <View key={index} style={styles.multiImageItem}>
            <Image 
              source={{ uri: image.uri }} 
              style={styles.multiImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.removeMediaBtn}
              onPress={() => removeImage(index)}
              hitSlop={8}
            >
              <Ionicons name="close-circle" size={24} color="rgba(0,0,0,0.6)" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    )}
  </View>
)}
```

---

### **3. 修改样式（第 704-735 行）**

```javascript
// 单张图片
singleImageContainer: {
  position: 'relative',
  width: '100%',
  height: 400,             // ✅ 固定高度
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: COLORS.gray[100],
},
singleImage: {
  width: '100%',
  height: '100%',          // ✅ 填满容器
  // ❌ 删除所有 aspectRatio、marginTop、marginBottom
},

// 多张图片横向滚动
multiImageScroll: {
  marginVertical: 8,
},
multiImageItem: {
  position: 'relative',
  marginRight: 12,
  width: 200,              // ✅ 固定宽度
  height: 280,             // ✅ 固定高度
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: COLORS.gray[100],
},
multiImage: {
  width: '100%',
  height: '100%',
},
```

---

## 🎨 **推荐尺寸配置**

根据不同设计需求选择：

### **方案1：经典社交媒体风格**
```javascript
// 单图：宽屏展示
singleImageContainer: {
  width: '100%',
  height: 400,  // 或 aspectRatio: 16/9
}

// 多图：竖屏卡片
multiImageItem: {
  width: 200,
  height: 280,  // 约 5:7
}
```

### **方案2：统一正方形**
```javascript
// 单图和多图都用正方形
singleImageContainer: {
  width: '100%',
  aspectRatio: 1,  // 或 height: 屏幕宽度
}

multiImageItem: {
  width: 240,
  height: 240,
}
```

### **方案3：超大单图展示**
```javascript
// 单图：沉浸式大图
singleImageContainer: {
  width: '100%',
  height: 500,
}

// 多图：标准卡片
multiImageItem: {
  width: 220,
  height: 300,
}
```

---

## 📊 **简化后的代码结构**

### **状态管理（只需要这些）**
```javascript
const [content, setContent] = useState('');
const [images, setImages] = useState([]);
const [video, setVideo] = useState(null);
const [category, setCategory] = useState(null);
const [tags, setTags] = useState([]);
// ❌ 删除 imageRatios
```

### **图片处理（只需要这个）**
```javascript
const removeImage = (index) => {
  setImages(images.filter((_, i) => i !== index));
};
// ❌ 删除 handleImageLoad
```

---

## ✨ **最终效果**

- ✅ **单张图片**：宽度100%，固定高度400，cover裁剪，无留白
- ✅ **多张图片**：固定200×280，横向滚动，cover裁剪，无留白
- ✅ **代码简洁**：无需状态管理、无需动态计算、无需onLoad事件
- ✅ **性能更好**：减少状态更新和重渲染
- ✅ **视觉统一**：所有图片展示方式一致

这样就大大简化了代码，而且效果完全符合你的需求！🎉