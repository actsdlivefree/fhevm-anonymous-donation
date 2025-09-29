# FHEVM Anonymous Donation - Static Deployment Guide

## 静态文件打包完成

前端应用已成功打包成静态文件，可以部署到任何支持静态文件服务的平台。

## 文件结构

```
out/
├── index.html          # 主页面
├── 404.html           # 404错误页面
├── icon.png           # 应用图标
├── zama-logo.svg      # Zama logo
└── _next/             # Next.js静态资源
    ├── static/
    │   ├── chunks/    # JavaScript代码块
    │   └── css/       # CSS样式文件
    └── GveEVmvB39fmrHLNEGOh-/  # 构建清单
```

## 部署选项

### 1. 使用Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/out;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 启用CORS headers (FHEVM需要)
    add_header Cross-Origin-Opener-Policy same-origin;
    add_header Cross-Origin-Embedder-Policy require-corp;
}
```

### 2. 使用Apache
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/out

    <Directory "/path/to/out">
        AllowOverride All
        Require all granted
    </Directory>

    # 启用CORS headers (FHEVM需要)
    Header set Cross-Origin-Opener-Policy "same-origin"
    Header set Cross-Origin-Embedder-Policy "require-corp"
</VirtualHost>
```

### 3. 使用Vercel/Netlify等平台

直接上传`out/`目录的内容到这些平台。

### 4. 使用GitHub Pages

1. 将`out/`目录推送到GitHub仓库的`docs/`文件夹或单独的gh-pages分支
2. 在仓库设置中启用GitHub Pages

### 5. 使用Docker

创建简单的Nginx容器：
```dockerfile
FROM nginx:alpine
COPY out/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 重要说明

### FHEVM Headers
由于FHEVM需要特殊的CORS headers，确保你的服务器配置包含：
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

### 网络连接
应用需要连接到：
- Sepolia测试网 (合约地址: 0x0A4B4EDA4178235270c5F7D488CBc6DA2B318849)
- FHEVM relayer服务
- 用户的MetaMask钱包

### 浏览器兼容性
确保用户使用支持SharedArrayBuffer的现代浏览器（如Chrome 88+, Firefox 79+, Safari 16.4+）。

## 测试部署

部署后，访问主页应该显示：
1. Zama logo
2. "Connect to MetaMask"按钮
3. 连接钱包后显示完整的捐赠界面

## 故障排除

### 1. MetaMask连接问题
检查浏览器是否支持Web3，以及MetaMask是否正确安装。

### 2. 合约交互失败
确保网络设置为Sepolia，并且合约地址正确。

### 3. FHEVM功能异常
检查浏览器控制台是否有FHEVM相关的错误信息。

## 更新部署

当需要更新应用时：
1. 重新运行`npm run build`生成新的静态文件
2. 替换服务器上的静态文件
3. 如果合约有更新，记得更新ABI文件
