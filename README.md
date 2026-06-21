# Gerry Cen 作品集静态网页

## 本地预览

```bash
cd /Users/zp/简历/作品集静态网页
python3 -m http.server 4173
```

浏览器打开：

```text
http://localhost:4173
```

## 文件说明

- `index.html`：页面内容。
- `styles.css`：Figma 视觉还原、响应式和微动效。
- `script.js`：锚点滚动、滚动出现、标签选中。
- `assets/figma-reference.png`：Figma 节点 `201:625` 的参考截图。
- `assets/`：页面使用的本地素材。

## 维护约定

页面是纯静态网页，没有构建步骤。新增素材时放入 `assets/`，再在 `index.html` 中引用相对路径。
