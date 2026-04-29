# ? DNS 配置问题解决指南

## ? 你遇到的问题

从截图看到：
- ? Vercel 部署已成功
- ? 域名 www.cwzzz.online 已绑定
- ?? DNS 未配置（域名旁边有问号）

---

## ? 解决方案

### 问题原因
Vercel 还没有检测到正确的 DNS 记录指向它的服务器。

### 解决方法（2 选 1）

#### 方法 1：修改 Nameserver（推荐，最简单）?

**在你的域名注册商处修改 Nameserver 为 Vercel 的：**

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**优点**：
- ? 最简单，只需修改 2 个设置
- ? 自动管理所有 DNS 记录
- ? Vercel 自动配置

**缺点**：
- ?? 如果域名有其他服务（如邮箱），可能需要重新配置

---

#### 方法 2：添加 DNS A 记录（不修改 Nameserver）

**在你的域名注册商处添加以下 DNS 记录：**

| 类型 | 主机记录/名称 | 记录值/目标地址 | TTL |
|------|------------|--------------|-----|
| A | @ | 76.76.21.21 | 600 或自动 |
| A | @ | 76.76.21.22 | 600 或自动 |
| CNAME | www | cname.vercel-dns.com | 600 或自动 |

**优点**：
- ? 不影响其他 DNS 记录
- ? 可以保留现有的邮箱等服务

**缺点**：
- ?? 需要手动添加 3 条记录
- ?? 需要分别配置

---

## ? 各域名注册商详细配置步骤

### 阿里云（Aliyun）

#### 方法 1：修改 Nameserver
1. 登录阿里云控制台
2. 进入"域名与网站" → "域名"
3. 找到 `cwzzz.online` 点击"管理"
4. 点击左侧"DNS 修改"
5. 选择"使用其他 DNS"
6. 删除现有 DNS 服务器
7. 添加：
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com
8. 点击"保存"

#### 方法 2：添加 DNS 记录
1. 登录阿里云控制台
2. 进入"域名与网站" → "域名"
3. 找到 `cwzzz.online` 点击"管理"
4. 点击左侧"域名解析"
5. 点击"添加记录"
6. 添加以下 3 条记录：

**记录 1**：
- 记录类型：A
- 主机记录：@
- 记录值：76.76.21.21
- TTL：600 秒

**记录 2**：
- 记录类型：A
- 主机记录：@
- 记录值：76.76.21.22
- TTL：600 秒

**记录 3**：
- 记录类型：CNAME
- 主机记录：www
- 记录值：cname.vercel-dns.com
- TTL：600 秒

7. 点击"确认"

---

### 腾讯云（Tencent Cloud）

#### 方法 1：修改 Nameserver
1. 登录腾讯云控制台
2. 进入"域名服务" → "域名管理"
3. 找到 `cwzzz.online` 点击"管理"
4. 点击"DNS 修改"
5. 选择"自定义 DNS 服务器"
6. 输入：
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com
7. 点击"确定"

#### 方法 2：添加 DNS 记录
1. 登录腾讯云控制台
2. 进入"域名服务" → "域名管理"
3. 找到 `cwzzz.online` 点击"管理"
4. 点击"域名解析"
5. 点击"添加记录"
6. 添加 3 条记录（同上）

---

### GoDaddy

#### 方法 1：修改 Nameserver
1. 登录 GoDaddy
2. 进入"Domain Portfolio"
3. 点击 `cwzzz.online`
4. 点击"DNS"
5. Nameservers 部分点击"Change"
6. 选择"Enter my own nameservers (advanced)"
7. 输入：
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com
8. 点击"Save"

#### 方法 2：添加 DNS 记录
1. 登录 GoDaddy
2. 进入"Domain Portfolio"
3. 点击 `cwzzz.online`
4. 点击"DNS"
5. 点击"Add"添加记录：

**记录 1**：
- Type: A
- Host: @
- Points to: 76.76.21.21
- TTL: 1/2 hour

**记录 2**：
- Type: A
- Host: @
- Points to: 76.76.21.22
- TTL: 1/2 hour

**记录 3**：
- Type: CNAME
- Host: www
- Points to: cname.vercel-dns.com
- TTL: 1/2 hour

---

### Namecheap

#### 方法 1：修改 Nameserver
1. 登录 Namecheap
2. 进入"Domain List"
3. 点击 `cwzzz.online` 的"Manage"
4. 找到"Nameservers"部分
5. 选择"Custom DNS"
6. 输入：
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com
7. 点击右侧的?保存

#### 方法 2：添加 DNS 记录
1. 登录 Namecheap
2. 进入"Domain List"
3. 点击 `cwzzz.online` 的"Manage"
4. 点击"Advanced DNS"标签
5. 点击"Add New Record"

**记录 1**：
- Type: A Record
- Host: @
- Value: 76.76.21.21
- TTL: 10 min

**记录 2**：
- Type: A Record
- Host: @
- Value: 76.76.21.22
- TTL: 10 min

**记录 3**：
- Type: CNAME Record
- Host: www
- Value: cname.vercel-dns.com
- TTL: 10 min

---

## ? 配置完成后

### 1. 等待 DNS 传播

**时间**：
- 通常：10-30 分钟
- 最长：48 小时（罕见）

### 2. 检查 DNS 传播状态

访问：https://dnschecker.org/#A/cwzzz.online

当看到大部分或全部变成绿色时，说明已生效。

### 3. 在 Vercel 验证

1. 返回 Vercel 项目页面
2. 点击 Settings → Domains
3. 刷新页面
4. 域名旁边的问号??应该消失，显示"Configured"?

### 4. 测试访问

- https://cwzzz.online
- https://www.cwzzz.online

---

## ? 常见问题

### Q1: 修改了 DNS 但 Vercel 还是显示问号？
**A**: 
- DNS 传播需要时间，耐心等待
- 清除浏览器缓存
- 在 Vercel 点击"Verify"按钮
- 使用 dnschecker.org 检查传播状态

### Q2: 我有邮箱服务，修改 Nameserver 会有影响吗？
**A**: 
- 会有影响！
- 建议使用方法 2（添加 DNS 记录）
- 或者在修改 Nameserver 后，在新的 DNS 服务商处重新配置邮箱记录

### Q3: 如何确认 DNS 已生效？
**A**: 
- 访问 dnschecker.org
- 输入 cwzzz.online
- 查看 A 记录是否在全球都显示绿色
- 或直接访问 https://cwzzz.online 看能否打开

### Q4: 访问显示"Site Not Found"？
**A**: 
- DNS 可能还未完全传播
- 继续等待
- 检查 Vercel 域名绑定是否正确
- 清除浏览器缓存

---

## ? 快速帮助

### 如果你告诉我你的域名注册商是哪家
我可以提供更详细的截图指导！

### 如果配置后还有问题
请提供：
1. 你的域名注册商名称
2. 截图显示的 DNS 配置界面
3. dnschecker.org 的检查结果

---

## ? 成功标志

配置成功后，在 Vercel 的 Domains 页面应该显示：

```
? cwzzz.online
   Configured
   
? www.cwzzz.online
   Configured
```

不再有问号??！

---

**现在就去你的域名注册商处配置 DNS 吧！** ?

配置完成后，大约 10-30 分钟，你的网站就可以通过 https://cwzzz.online 访问了！

---

*最后更新：2026-04-28*
