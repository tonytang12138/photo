# ? cwzzz.online 部署 - 超简单步骤

## ? 如果 deploy-cwzzz.bat 报错，请按以下步骤手动操作

---

## 第一步：安装工具（5 分钟）

### 1. 安装 Git
1. 访问：https://git-scm.com/downloads
2. 下载并安装 Windows 版
3. 一直点击"下一步"即可

### 2. 安装 Node.js
1. 访问：https://nodejs.org
2. 下载 LTS 版本（左侧）
3. 安装

---

## 第二步：部署到 Vercel（10 分钟）

### 方法 A：使用网页（最简单，无需命令行）

1. **访问 Vercel**
   - 打开浏览器访问：https://vercel.com
   - 点击 "Sign Up" 用 GitHub 账号登录

2. **创建项目**
   - 点击 "Add New Project"
   - 点击 "Import Git Repository"
   - 选择你的 GitHub 仓库
   - 点击 "Import"

3. **部署**
   - 点击 "Deploy"
   - 等待部署完成（约 1-2 分钟）
   - 获得临时网址：`https://xxx.vercel.app`

4. **绑定域名**
   - 在项目页面点击 "Settings"
   - 点击左侧 "Domains"
   - 点击 "Add" 按钮
   - 输入 `cwzzz.online`
   - 点击 "Add"

---

## 第三步：配置 DNS（5 分钟）

### 在你的域名注册商处配置

**阿里云**：
1. 登录阿里云控制台
2. 进入"域名与网站" → "域名"
3. 找到 `cwzzz.online` 点击"管理"
4. 点击"修改 DNS 服务器"
5. 选择"其他 DNS 服务器"
6. 输入：
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
7. 点击"保存"

**腾讯云**：
1. 登录腾讯云控制台
2. 进入"域名服务" → "域名管理"
3. 找到 `cwzzz.online` 点击"管理"
4. 点击"修改 DNS"
5. 选择"自定义 DNS"
6. 输入：
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
7. 点击"确定"

**GoDaddy**：
1. 登录 GoDaddy
2. 进入"Domain Portfolio"
3. 点击 `cwzzz.online`
4. 点击 "DNS"
5. 点击 "Change" 在 Nameservers 部分
6. 选择 "Enter my own nameservers"
7. 输入：
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
8. 点击 "Save"

---

## 第四步：等待 DNS 生效

- **时间**：通常 10-30 分钟，最长 48 小时
- **查看状态**：https://dnschecker.org/#A/cwzzz.online
- **测试**：访问 https://cwzzz.online

---

## 第五步：部署后端（可选）

如果只需要展示照片，**跳过此步**。

如果需要管理员功能：

### 1. 访问 Railway
- 网址：https://railway.app
- 用 GitHub 账号登录

### 2. 创建项目
- 点击 "New Project"
- 选择 "Deploy from GitHub repo"
- 选择 `backend` 文件夹

### 3. 配置环境变量
在 Railway 项目页面：
- 点击 "Variables"
- 添加：
  - `JWT_SECRET` = 随便输入至少 32 个字符（如：`MySuperSecretKey2026PhotoGallery!@#$`）
  - `NODE_ENV` = `production`

### 4. 获取后端地址
- Railway 会自动生成一个地址
- 格式：`https://xxx-production.up.railway.app`
- 复制这个地址

---

## 第六步：配置前端 API 地址

### 1. 编辑 api-config.js

在项目根目录找到 `api-config.js`，修改：

```javascript
// 替换下面的地址为你的 Railway 后端地址
window.API_BASE_URL = 'https://你的后端地址.up.railway.app';
```

### 2. 重新部署前端

在 Vercel 控制台：
- 点击 "Deployments"
- 点击 "Redeploy"

---

## ? 完成！

访问你的网站：
- **主页**：https://cwzzz.online
- **画廊**：https://cwzzz.online/gallery.html

---

## ? 常见问题

### Q: DNS 一直不生效？
**A**: 
- 耐心等待，最多 48 小时
- 清除浏览器缓存
- 用手机 4G 网络测试

### Q: 显示"不安全"？
**A**: 
- 等待 HTTPS 证书生成（几分钟）
- 刷新页面

### Q: 图片加载慢？
**A**: 
- 正常现象，Vercel 会自动优化
- 第一次加载后会变快

---

## ? 需要帮助？

查看详细文档：
- `域名部署指南-cwzzz.online.md`
- `CWZZZ-部署指南.md`

---

**祝你部署成功！** ?

---

*最后更新：2026-04-28*
