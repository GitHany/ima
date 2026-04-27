---
name: template-api
type: template
version: 2.1.0
date: 2026-04-27
author: hany
tags: [markdown, template, documentation, api]
description: API 接口文档模板，侧重端点、认证、错误码
license: MIT
---

# 文档标题

> 一句话说清楚这个 API 是什么。

---

## 📑 目录导航

- [📖 阅读指南](#-阅读指南)
- [🎯 简介](#-简介)
- [🔧 环境配置](#-环境配置)
- [🔐 认证](#-认证)
- [📋 API 端点索引](#-api-端点索引)
- [📡 API 端点](#-api-端点)
- [❌ 错误码](#-错误码)
- [💻 SDK 使用](#-sdk-使用)
- [🚀 快速示例](#-快速示例)
- [🔍 故障排除](#-故障排除)
- [⭐ 最佳实践](#-最佳实践)
- [📝 变更日志](#-变更日志)

---

## 📖 阅读指南

### 新手入门路径
1. **第一步**：阅读 [简介](#简介) 和 [认证](#认证)，了解 API 是做什么的、如何获得访问权限
2. **第二步**：查看 [快速示例](#快速示例)，复制第一个可运行的代码
3. **第三步**：阅读 [错误码](#错误码)，了解出错时如何处理
4. **第四步**：根据需求查阅具体的 [API 端点](#api-端点)

### 老手速查路径
- 找端点 → 直接看 [API 端点索引](#api-端点索引)
- 查错误 → 直接看 [错误码速查表](#错误码速查表)
- 配 SDK → 直接看 [SDK 使用](#sdk-使用)
- 调问题 → 直接看 [故障排除](#故障排除)

### AI 使用提示
> ⚠️ **给 AI 的说明**：使用本文档时，请注意以下要点，避免生成错误代码：
> - 认证头必须使用 `Authorization: Bearer <token>` 格式，不要遗漏 `Bearer` 前缀
> - 所有时间字段均为 ISO 8601 格式（如 `2024-01-01T00:00:00Z`）
> - 分页参数 `limit` 最大值为 100，超出会返回 400 错误
> - 请求体必须为 JSON，并设置 `Content-Type: application/json`
> - 批量操作有速率限制，默认每秒 10 次，超出需实现退避重试

---

## 🎯 简介

### 概述

简要说明 API 的核心功能和用途。2-3句话即可。

### 主要特性

- **特性1**：描述特性1
- **特性2**：描述特性2

### 适用场景

- **场景1**：描述场景1及适用条件
- **场景2**：描述场景2及适用条件

### 必须掌握的核心点 ⭐

**简要说明：** 使用 API 前必须掌握的核心内容，帮助快速上手。

| 要点 | 说明 | 位置 |
|------|------|------|
| 认证方式 | 如何获取和使用 API Key | [认证](#认证) |
| 基础 URL | 所有请求的入口地址 | [环境配置](#环境配置) |
| 错误处理 | 业务错误码与 HTTP 状态码的对应关系 | [错误码](#错误码) |
| 速率限制 | 避免触发限流的策略 | [限流策略](#限流策略) |
| 数据格式 | 请求/响应的 JSON 结构规范 | [API 端点](#api-端点) |

---

## 🔧 环境配置

### 基础 URL

**简要说明：** 不同环境的 API 入口地址，用于区分开发、测试和生产环境。

| 环境 | 地址 | 用途 |
|------|------|------|
| 生产环境 | `https://api.example.com/v1` | 线上服务 |
| 测试环境 | `https://api-staging.example.com/v1` | 集成测试 |
| 沙箱环境 | `https://api-sandbox.example.com/v1` | 开发调试 |

### 请求格式

所有请求均需满足：
- 请求体为 JSON 格式
- 必须设置请求头：`Content-Type: application/json`
- 认证头：`Authorization: Bearer <your-api-key>`

---

## 🔐 认证

### API Key 认证

```http
Authorization: Bearer your-api-key
```

### OAuth 2.0

```http
Authorization: Bearer access_token
```

### 权限范围

**简要说明：** API Key 的权限级别，`read` 仅可读取，`write` 可创建更新删除，`admin` 拥有全部权限。

| 范围 | 说明 | 可访问端点 |
|------|------|-----------|
| `read` | 读取权限 | GET 类端点 |
| `write` | 写入权限 | POST, PUT, DELETE |
| `admin` | 管理权限 | 所有端点 + 管理接口 |

### 刷新令牌

```bash
curl -X POST https://api.example.com/oauth/token \
  -d "grant_type=refresh_token" \
  -d "refresh_token=xxx"
```

---

## 📋 API 端点索引

**简要说明：** RESTful API 端点总览，按 HTTP 方法组织，方便快速查找。

| 方法 | 端点 | 说明 | 权限 |
|------|------|------|------|
| GET | `/resources` | 获取资源列表 | read |
| POST | `/resources` | 创建资源 | write |
| GET | `/resources/{id}` | 获取指定资源 | read |
| PUT | `/resources/{id}` | 更新资源 | write |
| DELETE | `/resources/{id}` | 删除资源 | write |

---

## 📡 API 端点

### 资源管理

#### GET /resources

获取资源列表。

**参数**：

| 参数 | 类型 | 位置 | 必需 | 说明 |
|------|------|------|------|------|
| page | number | query | 否 | 页码，默认 1 |
| limit | number | query | 否 | 每页数量，默认 20，最大 100 |
| sort | string | query | 否 | 排序字段，如 `-createdAt` 表示倒序 |

**响应**：

```json
{
  "code": 0,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "hasMore": true
    }
  }
}
```

#### POST /resources

创建资源。

**请求体**：

```json
{
  "name": "资源名称",
  "description": "描述"
}
```

**响应**：

```json
{
  "code": 0,
  "data": {
    "id": "12345",
    "name": "资源名称",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /resources/{id}

获取指定资源。

**路径参数**：

| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 资源 ID |

**响应**：

```json
{
  "code": 0,
  "data": {
    "id": "12345",
    "name": "资源名称",
    "description": "描述"
  }
}
```

#### PUT /resources/{id}

更新资源。

**请求体**：

```json
{
  "name": "更新后的名称",
  "description": "更新后的描述"
}
```

#### DELETE /resources/{id}

删除资源。

**响应**：

```json
{
  "code": 0,
  "msg": "删除成功"
}
```

---

## ❌ 错误码

### 错误码速查表

**简要说明：** 业务错误码与 HTTP 状态码的对应关系，4xx 为客户端错误，5xx 为服务端错误，3xxx 为限流相关错误。

| 错误码 | HTTP 状态 | 说明 | 处理建议 |
|--------|-----------|------|----------|
| 0 | 200 | 成功 | - |
| 1001 | 400 | 参数错误 | 检查请求参数格式和必填项 |
| 1002 | 401 | 认证失败 | 检查 API Key 是否有效或已过期 |
| 1003 | 403 | 权限不足 | 申请更高权限或检查权限范围 |
| 1004 | 404 | 资源不存在 | 检查资源 ID 是否正确 |
| 1005 | 409 | 资源冲突 | 资源已存在，使用更新接口 |
| 1006 | 422 | 验证失败 | 检查输入格式是否符合要求 |
| 2001 | 500 | 服务器错误 | 重试或联系技术支持 |
| 2002 | 503 | 服务维护中 | 等待服务恢复 |
| 2003 | 504 | 网关超时 | 增加超时时间后重试 |
| 3001 | 429 | 请求过快 | 降低请求频率，添加延迟 |
| 3002 | 429 | 配额用尽 | 升级套餐或等待配额重置 |

### 限流策略

**简要说明：** API 请求频率限制，不同类型的限制有不同的限额和重置周期。

| 限制类型 | 限额 | 重置周期 |
|----------|------|----------|
| 每分钟请求数 | 60 | 每分钟 |
| 每日请求数 | 10,000 | 每日 0:00 UTC |
| 并发连接数 | 10 | 实时 |

---

## 💻 SDK 使用

### JavaScript/TypeScript

```javascript
import { Client } from 'package-name';

const client = new Client({ apiKey: 'your-key' });

// 获取列表
const { data } = await client.resources.list();

// 创建资源
const resource = await client.resources.create({
  name: 'test'
});
```

### Python

```python
from package_name import Client

client = Client(api_key='your-key')

# 获取列表
data = client.resources.list()

# 创建资源
resource = client.resources.create(name='test')
```

### Go

```go
import "package-name"

client := package_name.NewClient("your-key")

// 获取列表
data, err := client.Resources.List()

// 创建资源
resource, err := client.Resources.Create(&package_name.Resource{
    Name: "test",
})
```

---

## 🚀 快速示例

### 入门示例

```javascript
const { Client } = require('package-name');

async function demo() {
  const client = new Client({ apiKey: 'your-key' });
  
  // 创建
  const created = await client.create({ name: 'test' });
  console.log('创建:', created.id);
  
  // 读取
  const resource = await client.get(created.id);
  
  // 更新
  await client.update(created.id, { name: 'updated' });
  
  // 删除
  await client.delete(created.id);
}

demo().catch(console.error);
```

### 错误处理

```javascript
try {
  const result = await client.doSomething();
} catch (error) {
  if (error.code === 1002) {
    console.error('认证失败，请检查 API Key');
  } else if (error.code === 3001) {
    console.error('请求过快，稍后重试');
    await sleep(1000);
  } else if (error.code >= 2000) {
    console.error('服务器错误，建议重试');
  }
}
```

### 分页遍历

```javascript
async function* listAllResources() {
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const { data } = await client.resources.list({ page, limit: 100 });
    yield* data.items;
    hasMore = data.pagination.hasMore;
    page++;
  }
}

// 使用
for await (const resource of listAllResources()) {
  console.log(resource.name);
}
```

---

## 🔍 故障排除

### 常见问题

**简要说明：** 常见 API 调用问题的可能原因和解决方法，主要包括认证、限流和响应问题。

| 问题 | 可能原因 | 解决方法 |
|------|----------|----------|
| 401 Unauthorized | API Key 错误或过期 | 检查密钥，尝试重新生成 |
| 429 Too Many Requests | 触发限流 | 降低频率，实现退避重试 |
| 500 Server Error | 服务端异常 | 稍后重试，如持续出现请联系支持 |
| 响应为空 | 参数错误或权限不足 | 检查参数和权限范围 |
| SSL 错误 | 证书问题 | 检查网络环境，确认使用 HTTPS |

### 调试技巧

```bash
# 使用 curl 测试接口
curl -v -H "Authorization: Bearer your-key" \
  https://api.example.com/v1/resources

# 查看详细响应
 curl -s -w "\nHTTP Status: %{http_code}\n" \
   -H "Authorization: Bearer your-key" \
   https://api.example.com/v1/resources
```

---

## ⭐ 最佳实践

### 安全建议

1. **保护 API 密钥**：使用环境变量，不要硬编码到代码中
2. **输入验证**：在发送请求前验证所有参数
3. **日志脱敏**：记录日志时隐藏敏感信息

```javascript
function sanitize(data) {
  return { ...data, apiKey: '***' };
}
```

### 性能优化

**简要说明：** 提升 API 调用效率的常用优化手段。

| 优化项 | 说明 | 预期效果 |
|--------|------|----------|
| 连接复用 | 使用 HTTP keep-alive | 减少连接建立时间 |
| 请求批量 | 合并小请求 | 减少网络开销 |
| 缓存结果 | 合理缓存热点数据 | 减少 API 调用 |
| 并发控制 | 限制并发数量 | 避免触发限流 |

---

## 📝 变更日志

**简要说明：** 版本更新记录，按时间倒序排列。

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| 2.1.0 | 2026-04-27 | 新增阅读指南、AI 使用提示、错误码速查表 |
| 2.0.0 | 2026-04-27 | 初始版本 |

---

## 许可证

[MIT License](LICENSE) - Copyright (c) 2026
