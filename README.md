# IMA OpenAPI 自动化文档管理

通过 AI 助手与 IMA（ima.qq.com）OpenAPI 交互，实现网页内容智能转换、技术文档自动化编写、笔记创建和知识库管理。

---

## 目录

- [核心能力](#核心能力)
  - [网页内容智能转换](#网页内容智能转换)
  - [自动化文档管理](#自动化文档管理)
  - [多平台支持](#多平台支持)
- [快速开始](#快速开始)
  - [环境准备](#环境准备)
  - [基础使用](#基础使用)
- [支持的模板类型](#支持的模板类型)
- [工作原理](#工作原理)
  - [整体架构](#整体架构)
  - [核心技术栈](#核心技术栈)
- [完整工作流程](#完整工作流程)
  - [第一阶段：环境准备](#第一阶段环境准备)
  - [第二阶段：知识库探索](#第二阶段知识库探索)
  - [第三阶段：文档编写](#第三阶段文档编写)
  - [第四阶段：创建笔记](#第四阶段创建笔记)
  - [第五阶段：添加到知识库](#第五阶段添加到知识库)
- [API 完整参考](#api-完整参考)
  - [请求头格式](#请求头格式)
  - [认证方式](#认证方式)
  - [PowerShell 编码处理](#powershell-编码处理)
- [常见操作](#常见操作)
  - [搜索知识库内容](#搜索知识库内容)
  - [搜索笔记](#搜索笔记)
  - [读取笔记内容](#读取笔记内容)
- [示例：完整转换流程](#示例完整转换流程)
  - [示例 1：转换 API 文档](#示例-1转换-api-文档)
  - [示例 2：转换教程文档](#示例-2转换教程文档)
- [错误处理](#错误处理)
  - [常见错误码](#常见错误码)
- [最佳实践](#最佳实践)
  - [编码安全](#1-编码安全)
  - [错误处理](#2-错误处理)
  - [分页处理](#3-分页处理)
  - [知识库组织](#4-知识库组织)
  - [URL 选择](#5-url-选择)
- [常见问题](#常见问题)
- [项目文件结构](#项目文件结构)
  - [文件命名规范](#文件命名规范)
- [参考资料](#参考资料)
  - [官方资源](#官方资源)
  - [技术文档](#技术文档)
- [更新记录](#更新记录)

---

## 核心能力

### 网页内容智能转换

一键将任意网页内容转换为结构化的 IMA 笔记：

- **智能识别**：自动判断内容类型（API 文档、教程、运维手册等）
- **模板匹配**：从 16 种预设模板中选择最合适的结构
- **内容清洗**：移除广告、导航栏等干扰元素
- **格式重组**：生成规范的 Markdown 格式笔记
- **一键上传**：自动创建笔记并添加到指定知识库

**适用场景：**
- 将官方 API 文档整理为学习笔记
- 保存技术博客到个人知识库
- 收集运维手册和最佳实践
- 归档会议记录和技术决策

### 自动化文档管理

通过 API 实现知识库的完整生命周期管理：

- **知识库探索**：查看、搜索已有的知识库和文件夹
- **笔记创建**：以 Markdown 格式创建结构化笔记
- **内容组织**：将笔记分类添加到不同文件夹
- **全文搜索**：快速检索知识库中的内容
- **批量操作**：自动化处理多个文档

### 多平台支持

除了 IMA 知识库，还支持：
- **Notion**：通过 Notion API 创建页面
- **Obsidian**：保存到本地 Vault，利用文件系统管理

---

## 快速开始

### 环境准备

**1. 获取 API 凭证**

访问 [IMA Agent Interface](https://ima.qq.com/agent-interface) 获取 Client ID 和 API Key。

**2. 配置环境变量**

```powershell
$env:IMA_OPENAPI_CLIENTID = "your_client_id"
$env:IMA_OPENAPI_APIKEY = "your_api_key"
```

**3. 安装 ima-skill**

AI 助手会自动下载并配置技能包：
```
下载地址：https://app-dl.ima.qq.com/skills/ima-skills-1.1.2.zip
```

### 基础使用

**转换网页为笔记：**

直接向 AI 助手提供 URL，即可自动完成转换和上传：

```
用户：请帮我把这个链接整理成笔记：
      https://docs.example.com/api/authentication
      保存到「技术文档」知识库
```

**自动化上传脚本：**

```powershell
.\upload-note.ps1 -Url "https://example.com/article" `
                  -KnowledgeBaseId "kb_1234567890"
```

---

## 支持的模板类型

| 模板 | 适用场景 | URL 特征 |
|------|----------|----------|
| API 文档 | API 说明、SDK 文档 | `/api`、`/docs/api` |
| 知识库 | 教程、指南、最佳实践 | `/guide`、`/tutorial` |
| GitHub 项目 | README、项目介绍 | `/readme`、`/readme.md` |
| 技术决策 | 架构评审、ADR | `/decision`、`/adr` |
| 会议记录 | 会议纪要、讨论总结 | `/meeting`、`/minutes` |
| 事故报告 | 复盘文档、Postmortem | `/incident`、`/postmortem` |
| 技术方案 | RFC 提案、设计文档 | `/rfc`、`/proposal` |
| 安全评审 | 漏洞报告、安全评估 | `/security`、`/vulnerability` |
| 性能测试 | 基准测试、性能分析 | `/performance`、`/benchmark` |
| 运维手册 | Runbook、操作指南 | `/runbook`、`/ops` |
| 入职指南 | 新员工文档、Welcome | `/onboarding`、`/welcome` |
| 产品需求 | PRD、需求文档 | `/prd`、`/requirement` |
| 回顾会议 | Sprint 总结、Retrospective | `/retro`、`/retrospective` |
| 技能文档 | 插件说明、工具使用 | `/skill`、`/plugin` |

---

## 工作原理

### 整体架构

```
用户输入 URL
    ↓
AI 助手触发 ima-web-to-note 技能
    ↓
┌─ 内容抓取 ─→ 获取网页完整 HTML
├─ 类型识别 ─→ 分析 URL 路径和内容特征
├─ 模板匹配 ─→ 选择最合适的结构模板
├─ 内容提取 ─→ 提取核心内容、代码示例
├─ 格式转换 ─→ 重组为规范 Markdown
└─ 编码验证 ─→ 确保 UTF-8 编码
    ↓
调用 IMA OpenAPI
├─ import_doc     → 创建笔记
└─ add_knowledge  → 添加到知识库
    ↓
返回结果，展示笔记信息
```

### 核心技术栈

- **Trae IDE**：AI 驱动的开发环境，提供 Agent 模式
- **ima-skill**：IMA OpenAPI 技能包，封装笔记和知识库操作
- **IMA OpenAPI**：HTTP REST API，支持笔记和知识库管理
- **PowerShell**：Windows 环境下的脚本执行引擎

---

## 完整工作流程

### 第一阶段：环境准备

详见「快速开始」章节。

### 第二阶段：知识库探索

**查看可操作的知识库：**

```powershell
$body = @{ cursor = ""; limit = 50 } | ConvertTo-Json
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)

$response = Invoke-WebRequest `
    -Uri "https://ima.qq.com/openapi/wiki/v1/get_addable_knowledge_base_list" `
    -Method Post -Headers $headers -Body $bodyBytes `
    -ContentType "application/json; charset=utf-8"
```

**查看知识库内容结构：**

```powershell
$body = @{
    knowledge_base_id = "知识库ID"
    cursor = ""
    limit = 20
} | ConvertTo-Json

$response = Invoke-WebRequest `
    -Uri "https://ima.qq.com/openapi/wiki/v1/get_knowledge_list" `
    -Method Post -Headers $headers -Body $bodyBytes `
    -ContentType "application/json; charset=utf-8"
```

**返回数据说明：**
- `knowledge_list`：条目列表（`media_type`: 99=文件夹, 11=笔记, 3=Word 等）
- `current_path`：当前路径面包屑
- `is_end`：是否还有更多数据
- `next_cursor`：下一页游标

### 第三阶段：文档编写

**编写要求：**
- 使用 Markdown 格式
- 中文内容必须为 UTF-8 编码
- 结构清晰，包含目录和章节
- 代码示例使用代码块

**编码注意事项：**

```powershell
# 写入文件时指定 UTF-8 编码
$content | Out-File -FilePath "file.md" -Encoding utf8

# 读取文件时指定 UTF-8 编码
$content = [System.IO.File]::ReadAllText("file.md", [System.Text.Encoding]::UTF8)
```

### 第四阶段：创建笔记

```powershell
$body = @{
    title = "笔记标题"
    content = "笔记内容（Markdown 格式）"
    content_format = 1  # 0=纯文本, 1=Markdown, 2=JSON
} | ConvertTo-Json -Depth 10

$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)

$response = Invoke-WebRequest `
    -Uri "https://ima.qq.com/openapi/note/v1/import_doc" `
    -Method Post -Headers $headers -Body $bodyBytes `
    -ContentType "application/json; charset=utf-8"
```

### 第五阶段：添加到知识库

```powershell
$body = @{
    knowledge_base_id = "知识库ID"
    folder_id = "文件夹ID"  # 可选，省略则添加到根目录
    media_type = 11  # 11 = 笔记类型
    note_info = @{ content_id = "笔记ID" }
    title = "笔记标题"
} | ConvertTo-Json -Depth 10

$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)

$response = Invoke-WebRequest `
    -Uri "https://ima.qq.com/openapi/wiki/v1/add_knowledge" `
    -Method Post -Headers $headers -Body $bodyBytes `
    -ContentType "application/json; charset=utf-8"
```

**媒体类型枚举：**

| 值 | 类型 | 说明 |
|----|------|------|
| 1 | PDF | PDF 文档 |
| 3 | Word | Word 文档 |
| 7 | Markdown | Markdown 文件 |
| 9 | 图片 | PNG/JPG/WEBP |
| 11 | 笔记 | IMA 笔记类型 |
| 12 | AI 会话 | AI 对话记录 |
| 99 | 文件夹 | 文件夹类型 |

---

## API 完整参考

### 请求头格式

```
ima-openapi-clientid: <your_client_id>
ima-openapi-apikey: <your_api_key>
Content-Type: application/json; charset=utf-8
```

### 认证方式

- 凭证通过 HTTP Header 传递
- 不会记录到日志或文件中
- 仅发送到 `ima.qq.com` 域名

### PowerShell 编码处理

**重要：PowerShell 5.1 环境下必须使用 UTF-8 字节数组**

```powershell
# 检测 PowerShell 版本
if ($PSVersionTable.PSVersion.Major -le 5) {
    $useUtf8Bytes = $true
}

# 构建请求体
$jsonBody = @{ key = "value" } | ConvertTo-Json -Depth 10
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($jsonBody)

# 发送请求
Invoke-RestMethod -Uri $url -Method Post -Body $bodyBytes `
    -ContentType "application/json; charset=utf-8" -Headers $headers
```

---

## 常见操作

### 搜索知识库内容

```powershell
$body = @{
    knowledge_base_id = "知识库ID"
    query = "搜索关键词"
    cursor = ""
    limit = 20
} | ConvertTo-Json

$response = Invoke-WebRequest `
    -Uri "https://ima.qq.com/openapi/wiki/v1/search_knowledge" `
    -Method Post -Headers $headers -Body $bodyBytes `
    -ContentType "application/json; charset=utf-8"
```

### 搜索笔记

```powershell
$body = @{
    search_type = 0  # 0=标题检索, 1=正文检索
    query_info = @{ title = "搜索关键词" }
    start = 0
    end = 20
} | ConvertTo-Json

$response = Invoke-WebRequest `
    -Uri "https://ima.qq.com/openapi/note/v1/search_note_book" `
    -Method Post -Headers $headers -Body $bodyBytes `
    -ContentType "application/json; charset=utf-8"
```

### 读取笔记内容

```powershell
$body = @{
    doc_id = "笔记ID"
    target_content_format = 0  # 0=纯文本
} | ConvertTo-Json

$response = Invoke-WebRequest `
    -Uri "https://ima.qq.com/openapi/note/v1/get_doc_content" `
    -Method Post -Headers $headers -Body $bodyBytes `
    -ContentType "application/json; charset=utf-8"
```

---

## 示例：完整转换流程

### 示例 1：转换 API 文档

**输入：**

```
用户：请帮我把这个 GitHub API 文档整理成笔记：
      https://docs.github.com/en/rest/repos/repos#list-organization-repositories
```

**处理流程：**

| 步骤 | 操作 | 说明 |
|------|------|------|
| 1 | 抓取网页 | 获取完整 HTML |
| 2 | 类型识别 | URL 含 `/rest/`，识别为 API 文档 |
| 3 | 模板匹配 | 选择 `template-api.md` |
| 4 | 内容提取 | 提取端点、参数、响应示例、错误码 |
| 5 | 格式转换 | 重组为规范 Markdown |
| 6 | 预览确认 | 展示内容供用户确认 |

**生成结构：**

````markdown
# List Organization Repositories

> 列出指定组织的所有仓库，支持分页和过滤

## 基本信息

- **端点**：`GET /orgs/{org}/repos`
- **认证要求**：需要 GitHub Token

## 请求参数

### 路径参数

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| org | string | 是 | 组织名称或 slug |

## 响应示例

### 成功响应（200 OK）

```json
[{ "id": 1296269, "name": "Hello-World", ... }]
```

## 错误码

| 状态码 | 说明 |
|--------|------|
| 403 | 速率限制超出 |
| 404 | 组织不存在 |
````

### 示例 2：转换教程文档

**输入：**

```
用户：帮我把这篇教程整理成笔记：
      https://fastapi.tiangolo.com/tutorial/
```

**生成结构：**

```
# FastAPI 教程指南

> 快速掌握 FastAPI Web 框架的核心概念和使用方法

## 阅读指南

- **难度等级**：入门到进阶
- **前置知识**：Python 基础、HTTP 协议

## 核心概念

### 什么是 FastAPI？

FastAPI 是一个现代、快速的 Python Web 框架...

## 环境准备

```bash
pip install fastapi
pip install "uvicorn[standard]"
```

## 创建第一个应用

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}
```
````

---

## 错误处理

所有 API 返回统一结构：

```json
{
  "code": 0,
  "msg": "success",
  "data": { ... }
}
```

- `code = 0`：成功
- `code != 0`：失败，`msg` 包含错误描述

### 常见错误码

| 错误码 | 含义 | 解决方案 |
|--------|------|----------|
| 0 | 成功 | - |
| 200002 | 凭证为空 | 检查环境变量配置 |
| 20004 | API Key 鉴权失败 | 检查凭证是否正确 |
| 51 | 参数超出范围 | 检查 limit 值（1-20） |
| 110001 | 参数非法 | 检查请求参数格式 |
| 110010 | 下游网络错误 | 重试请求 |
| 110012 | 接口无效 | 检查 API 路径 |
| 110021 | 请求频控 | 降低请求频率 |
| 100009 | 超过大小限制 | 拆分内容 |

---

## 最佳实践

### 1. 编码安全

- 始终使用 `[System.Text.Encoding]::UTF8.GetBytes()` 转换请求体
- 文件读写时指定 UTF-8 编码
- 避免使用 `Out-File` 默认编码

### 2. 错误处理

- 每次 API 调用后检查 `code` 字段
- 非 0 错误码时记录详细错误信息
- 网络错误时实现重试逻辑

### 3. 分页处理

- 使用游标分页时，首次请求 `cursor` 传空字符串 `""`
- 检查 `is_end` 判断是否还有更多数据
- 使用 `next_cursor` 作为下次请求的游标

### 4. 知识库组织

- 提前规划文件夹结构
- 使用有意义的命名
- 定期清理过期内容

### 5. URL 选择

- 优先选择内容完整、结构清晰的文档页面
- 避免需要登录才能访问的页面
- 推荐官方文档、技术博客等高质量内容

---

## 常见问题

| 问题场景 | 解决方案 |
|----------|----------|
| URL 无法访问 | 检查网络连接，确认 URL 正确且可公开访问 |
| 内容识别错误 | 手动指定模板类型，如「请用 runbook 模板整理」 |
| 笔记创建失败 | 检查 IMA 凭证配置，确认 API 配额未用完 |
| 上传到知识库失败 | 确认知识库 ID 正确，且有写入权限 |
| 中文内容乱码 | 确保所有文本操作用 UTF-8 编码 |
| 图片无法显示 | 使用绝对 URL，图片需可公网访问 |

---

## 项目文件结构

```
项目根目录/
├── README.md                 # 项目说明文档（本文件）
├── IMA_WORKFLOW.md           # 本地工作流配置指南
├── .gitignore                # Git 忽略规则
├── .ima_files/               # IMA 生成的文件统一存放目录
├── ima-skill/                # IMA API 技能包
│   ├── SKILL.md              # 技能主文件
│   ├── notes/                # 笔记模块
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── api.md
│   ├── knowledge-base/       # 知识库模块
│   │   ├── SKILL.md
│   │   ├── references/
│   │   │   └── api.md
│   │   └── scripts/
│   │       ├── cos-upload.cjs
│   │       └── preflight-check.cjs
│   └── scripts/
│       ├── knowledge_base.js
│       └── notes.js
└── ima-web-to-note/          # 网页转笔记技能包
    ├── SKILL.md
    └── references/
        └── template/         # 文档模板
            ├── template-api.md
            ├── template-runbook.md
            └── ...            # 其他模板
```

### 文件命名规范

| 内容类型 | 命名格式 | 示例 |
|----------|----------|------|
| 教程文档 | `{主题}_tutorial.md` | `fastapi_tutorial.md` |
| API 文档 | `{服务名}_api.md` | `ima_openapi_api.md` |
| 项目文档 | `{项目名}_doc.md` | `markitdown_doc.md` |
| 笔记 | `note_{日期}_{主题}.md` | `note_2026-04-27_meeting.md` |

---

## 参考资料

### 官方资源

- [IMA 官网](https://ima.qq.com/)
- [IMA Agent Interface](https://ima.qq.com/agent-interface)
- [ima-skill 下载地址](https://app-dl.ima.qq.com/skills/ima-skills-1.1.2.zip)

### 技术文档

- [FastAPI 官方文档](https://fastapi.tiangolo.com/)
- [PowerShell 编码处理](https://learn.microsoft.com/powershell/)
- [REST API 设计规范](https://restfulapi.net/)

---

## 更新记录

| 日期 | 更新内容 |
|------|----------|
| 2026-04-27 | 重构 README 结构，先介绍核心能力再深入原理 |
| 2026-04-27 | 新增本地工作流配置文档 (IMA_WORKFLOW.md) |

---

详细工作流说明请参考 [IMA_WORKFLOW.md](file:///c:/code/ima/IMA_WORKFLOW.md)
