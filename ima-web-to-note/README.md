# ima-web-to-note

将网页内容智能转换为 IMA 笔记的 Trae IDE 技能。支持自动识别内容类型、匹配合适模板、生成结构化笔记并上传到 IMA 知识库。

## 功能特性

- **智能识别**：根据 URL 路径和内容特征自动判断文档类型
- **模板匹配**：从 17 种预设模板中自动选择最合适的内容结构
- **内容清洗**：移除广告、导航栏、Cookie 提示等干扰元素
- **格式转换**：将网页内容重组为规范的 Markdown 格式
- **直接上传**：支持创建笔记并添加到指定知识库

## 支持的模板类型

| 模板文件 | 适用场景 | URL 特征 |
|----------|----------|----------|
| [template-api.md](references/template/template-api.md) | API 文档、SDK 说明 | `/api`、`/docs/api` |
| [template-api-design.md](references/template/template-api-design.md) | API 设计文档 | 设计评审、接口规范 |
| [template-decision.md](references/template/template-decision.md) | 技术决策、架构评审 | `/decision`、`/adr` |
| [template-incident.md](references/template/template-incident.md) | 事故报告、复盘文档 | `/incident`、`/postmortem` |
| [template-knowledge.md](references/template/template-knowledge.md) | 教程、指南、最佳实践 | `/guide`、`/tutorial`、`/docs` |
| [template-meeting.md](references/template/template-meeting.md) | 会议记录、讨论总结 | `/meeting`、`/minutes` |
| [template-onboarding.md](references/template/template-onboarding.md) | 入职指南、欢迎文档 | `/onboarding`、`/welcome` |
| [template-oncall.md](references/template/template-oncall.md) | 值班手册、运维指南 | `/oncall`、`/ops` |
| [template-performance-test.md](references/template/template-performance-test.md) | 性能测试、基准测试 | `/performance`、`/benchmark` |
| [template-prd.md](references/template/template-prd.md) | 产品需求文档 | `/prd`、`/requirement` |
| [template-project.md](references/template/template-project.md) | 项目文档、产品介绍 | `/project` |
| [template-repo.md](references/template/template-repo.md) | GitHub README、项目仓库 | `/readme`、`/readme.md` |
| [template-retro.md](references/template/template-retro.md) | 回顾会议、Sprint 总结 | `/retro`、`/retrospective` |
| [template-rfc.md](references/template/template-rfc.md) | 技术方案、RFC 提案 | `/rfc`、`/proposal` |
| [template-runbook.md](references/template/template-runbook.md) | 运维手册、操作指南 | `/runbook`、`/ops` |
| [template-security-review.md](references/template/template-security-review.md) | 安全评审、漏洞报告 | `/security`、`/vulnerability` |
| [template-skill.md](references/template/template-skill.md) | 技能文档、插件说明 | `/skill`、`/plugin` |

## 项目结构

```
ima-web-to-note/
├── SKILL.md                      # 技能主文件
├── meta.json                     # 技能元数据
├── README.md                     # 本文件
├── scripts/
│   └── get_folders.js            # 获取知识库文件夹列表
└── references/
    ├── templates.md              # 模板说明文档
    └── template/                 # 模板文件目录
        ├── template-api.md
        ├── template-api-design.md
        ├── template-decision.md
        ├── template-incident.md
        ├── template-knowledge.md
        ├── template-meeting.md
        ├── template-onboarding.md
        ├── template-oncall.md
        ├── template-performance-test.md
        ├── template-prd.md
        ├── template-project.md
        ├── template-repo.md
        ├── template-retro.md
        ├── template-rfc.md
        ├── template-runbook.md
        ├── template-security-review.md
        └── template-skill.md
```

## 依赖项

- **Node.js**：运行脚本必需的运行环境
- **ima-skill**：提供 IMA OpenAPI 调用的核心能力

## 凭证配置

与 [ima-skill](../ima-skill) 共用相同凭证，配置方式：

**配置文件（推荐）：**
```bash
mkdir -p ~/.config/ima
echo "your_client_id" > ~/.config/ima/client_id
echo "your_api_key" > ~/.config/ima/api_key
```

**环境变量：**
```bash
export IMA_OPENAPI_CLIENTID="your_client_id"
export IMA_OPENAPI_APIKEY="your_api_key"
```

凭证获取地址：https://ima.qq.com/agent-interface

## 使用方法

在 Trae IDE 中，当用户提供一个 URL 链接希望将其内容整理成笔记时，此技能会自动触发。技能会引导您完成整个转换过程，包括确认保存位置。

### 基础使用示例

**场景 1：转换 API 文档**

```
用户：请帮我把这个链接整理成笔记：https://api.example.com/docs/authentication
```

技能执行流程：

```
1️⃣ 询问保存位置
   ├─ 知识库类型：个人知识库
   ├─ 具体知识库：技术文档库
   ├─ 保存位置：根目录
   └─ 文档名称：使用提取的标题（Authentication API）

2️⃣ 内容抓取
   → 成功获取页面内容

3️⃣ 类型识别
   → 检测到 /docs/api 路径 → API 文档
   → 匹配模板：template-api.md

4️⃣ 内容提取
   → 提取端点列表（GET /auth/token、POST /auth/refresh）
   → 整理请求/响应示例
   → 保留认证方式说明

5️⃣ 笔记生成
   → 生成结构化 Markdown 笔记

6️⃣ 创建笔记
   ✅ 成功创建笔记：Authentication API
   → 已上传到：技术文档库 / 根目录
```

**场景 2：转换项目 README**

```
用户：请帮我把这个链接整理成笔记：https://github.com/example/project/blob/main/README.md
```

技能执行流程：

```
1️⃣ 询问保存位置
   ├─ 知识库类型：共享知识库
   ├─ 具体知识库：团队知识库
   ├─ 保存位置：项目文档 / 前端项目
   └─ 文档名称：自定义（Example Project 介绍）

2️⃣ 内容抓取
   → 成功获取 README 内容

3️⃣ 类型识别
   → 检测到 /readme 特征 → 仓库文档
   → 匹配模板：template-repo.md

4️⃣ 内容提取
   → 提取项目简介和特性
   → 整理安装步骤（npm install → npm run dev）
   → 保留快速开始指南
   → 提取使用示例

5️⃣ 笔记生成
   → 生成结构化 Markdown 笔记

6️⃣ 创建笔记
   ✅ 成功创建笔记：Example Project 介绍
   → 已上传到：团队知识库 / 项目文档 / 前端项目
```

**场景 3：转换技术决策文档**

```
用户：帮我把这个 ADR 保存到笔记：https://docs.example.com/adr/001-database-selection
```

技能执行流程：

```
1️⃣ 询问保存位置
   ├─ 知识库类型：个人知识库
   ├─ 具体知识库：架构知识库
   ├─ 保存位置：ADR 文档夹
   └─ 文档名称：使用提取的标题（ADR-001 数据库选型）

2️⃣ 内容抓取
   → 成功获取 ADR 文档

3️⃣ 类型识别
   → 检测到 /adr/ 路径 → 技术决策
   → 匹配模板：template-decision.md

4️⃣ 内容提取
   → 提取背景和动机
   → 整理候选方案（PostgreSQL vs MongoDB vs Redis）
   → 保留最终决策和理由
   → 提取后果说明

5️⃣ 笔记生成
   → 生成 ADR 结构化笔记

6️⃣ 创建笔记
   ✅ 成功创建笔记：ADR-001 数据库选型
   → 已上传到：架构知识库 / ADR 文档夹
```

### 交互式确认流程

技能会自动询问以下信息以确认保存位置：

**Step 1 - 选择知识库类型**

```
助手：请选择保存到的知识库类型
  ○ 个人知识库 - 保存到您的个人知识库
  ○ 共享知识库 - 保存到共享知识库（可与他人共享）
```

**Step 2 - 选择具体知识库**

```
助手：请选择具体的知识库
  ○ 技术文档库
  ○ 团队知识库
  ○ 个人学习库
  ○ ...
```

**Step 3 - 选择保存位置**

```
助手：保存到根目录还是指定文件夹？
  ○ 根目录
  ○ 选择文件夹 → 显示可用文件夹列表
```

**Step 4 - 确认文档名称**

```
助手：请确认笔记标题
  ○ 使用提取的标题：Authentication API v2 使用指南
  ○ 自定义标题 → 请输入您想要的标题
```

### 完整工作流程图

```
┌─────────────────────────────────────────────────────────┐
│  用户提供 URL                                            │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│  Step 1: 交互式位置确认                                    │
│  ├─ 选择知识库类型（个人/共享）                              │
│  ├─ 选择具体知识库                                         │
│  ├─ 选择保存位置（根目录/文件夹）                            │
│  └─ 确认文档名称                                           │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│  Step 2: 内容处理                                         │
│  ├─ 内容抓取（page-import 工具）                            │
│  ├─ 类型识别（URL + 内容特征）                              │
│  ├─ 模板匹配（17 种预设模板）                                │
│  └─ 内容提取（清洗 + 格式化）                                │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│  Step 3: 笔记创建                                         │
│  ├─ 调用 IMA API 创建笔记                                  │
│  ├─ 上传到指定知识库                                       │
│  └─ 返回创建结果                                           │
└─────────────────────────────────────────────────────────┘
```

### 常见使用场景

| 场景 | 示例 URL | 自动匹配模板 |
|------|----------|-------------|
| API 文档 | `api.example.com/docs/auth` | template-api.md |
| GitHub README | `github.com/user/repo` | template-repo.md |
| 教程指南 | `docs.example.com/guide/start` | template-knowledge.md |
| 技术决策 | `docs.example.com/adr/001` | template-decision.md |
| 会议纪要 | `wiki.example.com/meeting/2024` | template-meeting.md |
| 事故报告 | `postmortems.example.com/incident-123` | template-incident.md |
| 安全评审 | `security.example.com/review/001` | template-security-review.md |
| 性能测试 | `docs.example.com/performance/benchmark` | template-performance-test.md |
| 运维手册 | `ops.example.com/runbook/deploy` | template-runbook.md |
| 入职指南 | `wiki.example.com/onboarding/new-hire` | template-onboarding.md |

## 模板定制

如需修改或添加模板，直接编辑 `references/template/` 目录下的对应文件即可。模板采用 Markdown 格式，支持以下元数据字段：

```yaml
---
title: 模板名称
version: 1.0.0
date: 2026-04-27
author: hany
tags: [markdown, template, documentation]
description: 模板描述
---
```

## 相关项目

- [ima-skill](../ima-skill) - IMA OpenAPI 核心技能，提供笔记和知识库管理能力
- [项目根目录 README](../README.md) - IMA 自动化文档管理完整指南

## 更新记录

| 日期 | 更新内容 |
|------|----------|
| 2026-04-27 | 修复相对路径问题，author 字段更正为 hany |
| 2026-04-27 | 初始版本，包含 17 种文档模板 |
