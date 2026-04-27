---
name: ima-web-to-note
description: |
  将网页内容转换为 IMA 笔记的技能。
  当用户提供一个 URL 链接，希望将其内容整理成笔记并保存到 IMA 时使用此技能。
  自动识别内容类型，匹配合适的模板（API文档、知识库、项目文档、会议纪要等），
  生成结构化的 Markdown 笔记并上传到 IMA 平台。
  保存位置支持个人知识库和共享知识库，可选择根目录或指定文件夹。
homepage: https://ima.qq.com
metadata:
  openclaw:
    emoji: 📄
    requires:
      env:
        - IMA_OPENAPI_CLIENTID
        - IMA_OPENAPI_APIKEY
    primaryEnv: IMA_OPENAPI_CLIENTID
  skill_type: content_processing
  input_type: url
  output_type: ima_note
---

# ima-web-to-note

将网页内容智能转换为 IMA 笔记的技能。支持自动识别内容类型、匹配合适模板、生成结构化笔记。

## ⛔ MANDATORY RULES

1. **UTF-8 编码**：写入 IMA 笔记前，所有字符串字段必须验证为合法 UTF-8
2. **模板匹配**：根据 URL 或内容特征自动识别并匹配合适的模板
3. **内容清洗**：移除广告、导航栏、Cookie 提示等无关内容
4. **结构化整理**：按照模板格式重组内容，保持逻辑清晰
5. **位置确认**：必须先询问用户保存位置（知识库类型、目录），不得自行假设

## 完整工作流程

### Step 0: 位置确认（必须自动执行）

**当用户调用此技能时，必须自动使用 `AskUserQuestion` 工具逐步询问用户保存位置。不得跳过此步骤或自行假设保存位置。**

交互流程如下：

```javascript
// 问题1：选择知识库类型
AskUserQuestion({
    question: "您希望将笔记保存到哪个知识库？",
    header: "知识库类型",
    options: [
        { label: "个人知识库", description: "保存到您的个人知识库" },
        { label: "共享知识库", description: "保存到共享知识库（可与他人共享）" }
    ],
    multiSelect: false
})

// 问题2：选择知识库
AskUserQuestion({
    question: "请选择具体的知识库：",
    header: "选择知识库",
    options: [...]  // 从 get_addable_knowledge_base_list 或 search_knowledge_base 获取
})

// 问题3：选择保存位置
AskUserQuestion({
    question: "保存到根目录还是指定文件夹？",
    header: "保存位置",
    options: [
        { label: "根目录", description: "保存到知识库根目录" },
        { label: "选择文件夹", description: "保存到指定文件夹" }
    ],
    multiSelect: false
})

// 问题4：选择文件夹（如果选择了"选择文件夹"）
AskUserQuestion({
    question: "请选择目标文件夹：",
    header: "选择文件夹",
    options: [...]  // 从 get_knowledge_list 获取文件夹列表
})

// 问题5：确认文档名称
AskUserQuestion({
    question: "请确认或修改笔记标题：",
    header: "文档名称",
    options: [
        { label: "使用提取的标题", description: "自动提取的标题" },
        { label: "自定义标题", description: "您来指定标题" }
    ]
})
```

### Step 1: 内容抓取

**目标**：获取完整的网页内容，包括主文档和相关子文档。

**抓取策略**：

1. **普通网页**：使用 `page-import` 工具或 `WebFetch` 抓取目标 URL 的全部内容
2. **GitHub 仓库**（`github.com/*`）：
   - **必须**先抓取主 README（`https://github.com/{owner}/{repo}`）
   - **必须**识别并抓取子目录中的文档：
     - `docs/` 目录下的所有 `.md` 文件
     - `skills/` 目录下的所有 `SKILL.md` 文件
     - `.github/` 目录下的文档（如 `CONTRIBUTING.md`、`SECURITY.md`）
     - `wiki/` 页面（如果存在）
   - 使用 `Invoke-WebRequest -Uri "https://raw.githubusercontent.com/{owner}/{repo}/main/{path}" -UseBasicParsing` 抓取原始 Markdown
   - 或使用 `WebSearch` 搜索 `site:github.com/{owner}/{repo} {关键词}` 获取内容摘要
3. **内容分页**：如果内容过长，分段抓取并合并
4. **失败重试**：如果主要方式失败，尝试备用方法（如 WebSearch → WebFetch → 手动输入）

**内容预处理**：
- 移除 GitHub 导航栏、侧边栏、README 渲染框架
- 提取纯 Markdown 内容，保留代码块、表格、列表
- 记录原始 URL 作为引用来源

### Step 2: 内容类型识别

根据 URL 和内容特征自动识别内容类型：

| URL 特征 | 内容类型 | 推荐模板 | 识别说明 |
|----------|----------|----------|----------|
| `github.com/{owner}/{repo}` | 项目文档 | template-repo.md | GitHub 仓库首页，包含 README 内容 |
| `github.com/{owner}/{repo}/blob/main/skills/` | 技能文档 | template-skill.md | 技能说明文档，包含工作流程和规则 |
| `github.com/{owner}/{repo}/blob/main/docs/` | 知识文档 | template-knowledge.md | 教程、指南、最佳实践 |
| `github.com/*/api` | API 文档 | template-api.md | API 接口说明文档 |
| 包含 `/docs/`、`/guide/`、`/tutorial/` | 知识文档 | template-knowledge.md | 教程、指南、最佳实践 |
| 包含 `/decision/`、`/adr/` | 技术决策 | template-decision.md | 架构决策记录、设计评审 |
| 包含 `/meeting/`、`/meeting-notes/` | 会议纪要 | template-meeting.md | 会议记录、讨论总结 |
| 包含 `/incident/`、`/postmortem/` | 事故报告 | template-incident.md | 故障分析、事后总结 |
| 包含 `/rfc/`、`/proposal/` | 技术方案 | template-rfc.md | 技术提案、方案设计 |
| 包含 `/security/`、`/vulnerability/` | 安全评审 | template-security-review.md | 安全评估、漏洞分析 |
| 包含 `/performance/`、`/benchmark/` | 性能测试 | template-performance-test.md | 性能报告、基准测试 |
| 包含 `/runbook/`、`/playbook/` | 运维手册 | template-runbook.md | 操作手册、应急流程 |
| 包含 `/onboarding/`、`/getting-started/` | 入职指南 | template-onboarding.md | 新人引导、环境搭建 |
| 包含 `/prd/`、`/product-requirements/` | 产品需求 | template-prd.md | 产品需求文档 |
| 包含 `/retro/`、`/retrospective/` | 回顾会议 | template-retro.md | 迭代回顾、总结反思 |
| 默认匹配失败 | 通用文档 | template-knowledge.md | 无法识别时的降级选择 |

**内容特征识别**（当 URL 特征不明显时）：
- 包含端点定义（`GET /api/v1/users`、参数表格） → API 文档
- 包含"决策"、"选择了"、"后果" → 技术决策
- 包含"参会人员"、"结论"、"行动项" → 会议纪要
- 包含"安装"、"使用"、"配置" → 项目文档
- 包含"概念"、"教程"、"步骤" → 知识文档

### Step 3: 内容提取规则

**必须保留的内容**：
- **标题层级**：保留完整的 H1-H6 标题结构，维持文档层级关系
- **核心概念和定义**：关键术语、名词解释、概念说明
- **重要代码示例**：完整保留代码块，包括语言标识符
- **关键步骤和流程**：操作指南、安装步骤、配置方法
- **表格和列表**：参数表、对比表、配置项列表
- **结论和建议**：最终决策、最佳实践、注意事项
- **引用和链接**：重要参考链接、相关资料、引用来源
- **元数据**：作者、日期、版本、许可证（如果存在）

**必须移除的内容**：
- **导航元素**：顶部导航栏、侧边栏、面包屑、目录索引
- **广告和推广**：赞助链接、推广横幅、推荐产品
- **干扰元素**：Cookie 同意提示、隐私政策浮窗、订阅弹窗
- **交互组件**：分享按钮、评论区域、点赞/反对按钮
- **页脚信息**：版权信息、备案号、友情链接、站点地图
- **冗余内容**：重复的摘要、自动生成的"回到顶部"链接
- **GitHub 特定元素**：PR/Issue 列表、贡献者头像、语言统计条

**内容重组原则**：
- 按照模板结构重新组织内容，而非简单复制粘贴
- 合并重复内容，消除冗余
- 补充必要的上下文说明
- 保持原文的语义和准确性

### Step 4: 模板填充

从 `references/template/` 目录读取对应模板，按照模板格式填充内容：

```javascript
const fs = require('fs');
const templatePath = 'references/template/{对应模板}.md';
const template = fs.readFileSync(templatePath, 'utf8');
// 替换模板中的占位符为实际内容
```

**填充要求**：
- 保留模板的完整结构（目录导航、各章节标题）
- 用实际内容替换占位符（项目简介、安装步骤、使用说明等）
- 如果某些章节无对应内容，保留章节标题并标注"暂无相关内容"
- 确保填充后的笔记逻辑连贯、层次清晰

### Step 5: 笔记创建与上传

```javascript
const { searchKnowledgeBases, getFolders } = require('../../ima-skill/scripts/knowledge_base.js');
const { createNote } = require('../../ima-skill/scripts/notes.js');

// 1. 获取知识库信息
const kbData = await searchKnowledgeBases();
const kbId = kbData.data.info_list[0].kb_id;

// 2. 获取文件夹列表（如需要）
const folders = await getFolders(kbId);
// folders 格式: [{ media_id: "folder_xxx", title: "文件夹名" }, ...]

// 3. 创建笔记
const noteId = await createNote(noteContent);
// 注意: 笔记标题由 content 第一行的 # 标题决定

// 4. 添加到知识库
const { addNoteToKnowledgeBase } = require('../../ima-skill/scripts/knowledge_base.js');
await addNoteToKnowledgeBase(noteId, noteTitle, kbId, folderId);
// folderId 省略则为根目录
```

**上传前验证**：
- 确认笔记内容不为空
- 确认包含至少一个 H1 标题
- 确认内容长度 > 100 字符
- 确认无乱码或编码错误

## 位置确认详细流程

### 获取知识库列表

```javascript
// 个人知识库
await imaApi('openapi/wiki/v1/search_knowledge_base', {
    query: "",
    cursor: "",
    limit: 20
});

// 共享知识库
await imaApi('openapi/wiki/v1/search_knowledge_base', {
    query: "",
    cursor: "",
    limit: 20,
    base_type: 1  // 1 = 共享知识库
});
```

### 获取文件夹列表

```javascript
const { getFolders } = require('../../ima-skill/scripts/knowledge_base.js');
const folders = await getFolders(kbId);
// folders 格式: [{ media_id: "folder_xxx", title: "文件夹名" }, ...]
```

## 内容类型处理

### API 文档

**适用场景**：技术文档、SDK说明、接口文档

**处理要点**：
- **提取端点列表**：整理所有 API 端点（请求方法、路径、描述）
- **整理参数表格**：参数名、类型、必填、默认值、说明
- **保留请求/响应示例**：完整保留 JSON 格式的示例数据
- **提取错误码说明**：错误码、错误信息、触发条件
- **整理认证方式**：Token、OAuth、API Key 等认证流程说明
- **补充使用流程**：按照"认证 → 调用 → 处理响应"的逻辑组织

### 项目文档

**适用场景**：GitHub README、项目介绍、代码库说明

**处理要点**：
- **提取项目简介**：项目是什么、解决什么问题、核心特性
- **整理安装步骤**：环境要求、依赖安装、配置方法、启动命令
- **保留快速开始指南**：最小可运行的完整示例
- **提取使用示例**：代码片段、配置文件、调用示例
- **整理目录结构**：主要文件夹和文件的用途说明
- **补充命令速查**：常用命令的用途和参数说明

### 知识文档

**适用场景**：教程、指南、最佳实践、技术文章

**处理要点**：
- **提取核心概念**：关键术语、理论基础、设计原则
- **整理操作步骤**：按顺序列出每一步的具体操作
- **保留注意事项**：常见问题、避坑指南、兼容性说明
- **提取术语解释**：专业名词的定义和通俗解释
- **补充示例代码**：保留所有代码示例和预期输出
- **整理对比表格**：不同方案的优缺点对比

### 技术决策 (ADR)

**适用场景**：架构决策、设计评审、方案选择

**处理要点**：
- **提取背景和动机**：为什么要做这个决策、面临什么约束
- **整理决策选项**：列出所有被考虑的方案
- **保留评估过程**：每个方案的优缺点、风险、成本
- **提取最终决策**：选择了什么方案、为什么
- **补充后果说明**：决策带来的正面和负面影响
- **记录相关方**：谁参与了决策、谁负责执行

### 会议纪要

**适用场景**：会议记录、讨论总结、决策备忘

**处理要点**：
- **提取参会信息**：参会人员、会议时间、会议主题
- **整理议题列表**：按顺序记录每个议题
- **保留讨论要点**：各方观点、争议焦点、共识结论
- **提取行动项**：谁、做什么、截止时间
- **补充决策事项**：会议上做出的决定和理由
- **整理待办事项**：下次会议需要跟进的内容

## 错误处理

| 错误场景 | 处理方式 | 用户提示 |
|----------|----------|----------|
| URL 无法访问 | 尝试备用方法（WebSearch → 手动输入） | "无法访问该链接，请检查 URL 是否正确" |
| 内容提取失败 | 使用 WebSearch 获取摘要，或请求用户手动复制 | "内容提取不完整，请手动粘贴内容" |
| 模板匹配失败 | 使用 template-knowledge.md 作为默认模板 | "已使用通用模板整理内容" |
| 笔记创建失败 | 检查 IMA 凭证配置，参考 ima-skill/SKILL.md | "笔记创建失败，请检查配置" |
| 知识库不存在 | 提示用户检查知识库名称或权限 | "未找到指定知识库，请确认名称或权限" |
| GitHub API 限流 | 使用 raw.githubusercontent.com 直接获取 | "使用备用方式获取内容" |
| 内容过长 | 分段抓取并合并，或只提取核心章节 | "内容较长，已提取主要部分" |
| 多语言内容 | 优先提取中文内容，如无则保留原文 | "已提取英文内容，如需翻译请告知" |

## 使用示例

### 示例 1：转换知识文章

```
用户：帮我把这个链接整理成笔记：https://example.com/guide/best-practices

处理：
1. 询问保存位置：
   - 选择知识库类型：个人/共享
   - 选择具体知识库
   - 选择保存位置：根目录/文件夹
   - 确认文档名称

2. 抓取内容 → example.com 指南文档（使用 WebFetch）
3. 识别类型 → 知识文档 → template-knowledge.md
4. 提取核心概念、操作步骤、注意事项
5. 生成结构化笔记
6. 创建笔记并上传到指定位置
```

### 示例 2：转换 GitHub 项目

```
用户：帮我把这个 GitHub 项目整理成笔记：https://github.com/obra/superpowers

处理：
1. 询问保存位置（同上）

2. 抓取内容：
   - 主 README: https://github.com/obra/superpowers
   - 子文档: skills/systematic-debugging/SKILL.md
   - 子文档: skills/test-driven-development/SKILL.md
   - 子文档: skills/brainstorming/SKILL.md
   （使用 raw.githubusercontent.com 获取原始 Markdown）

3. 识别类型 → 项目文档 → template-repo.md
4. 提取内容：
   - 项目简介：AI 代码代理开发方法论
   - 安装指南：各平台安装命令
   - 核心工作流：7 步标准流程
   - 技能库：完整技能列表及详细说明
   - 哲学理念：TDD、YAGNI、DRY 等核心原则

5. 生成结构化笔记（包含完整的技能使用说明）
6. 创建笔记并上传到指定位置
```

### 示例 3：转换 API 文档

```
用户：帮我把这个 API 文档整理成笔记：https://example.com/api/v2/docs

处理：
1. 询问保存位置（同上）

2. 抓取内容 → API 文档（使用 WebFetch）
3. 识别类型 → API 文档 → template-api.md
4. 提取内容：
   - 认证方式：API Key / OAuth 2.0
   - 端点列表：GET /users、POST /users、DELETE /users/{id}
   - 参数表格：每个端点的请求参数、响应字段
   - 示例代码：curl 命令、响应 JSON
   - 错误码：400、401、404、500 的说明

5. 生成结构化笔记
6. 创建笔记并上传到指定位置
```

## Credential Check

与 ima-skill 共用相同凭证，读取环境变量或 `~/.config/ima/` 目录下的配置文件：

```bash
# 检查凭证是否存在
if ! test -f ~/.config/ima/client_id || ! test -f ~/.config/ima/api_key; then
    echo "⚠️ 缺少 IMA 凭证"
    echo "请先配置：https://ima.qq.com/agent-interface"
fi
```

## 模板文件参考

所有可用模板位于 `references/template/` 目录：

| 模板文件 | 适用场景 | 内容特征 |
|----------|----------|----------|
| template-api.md | API 文档 | 端点定义、参数表格、请求/响应示例 |
| template-api-design.md | API 设计文档 | 设计原则、版本规划、接口规范 |
| template-knowledge.md | 知识文档 | 概念解释、操作步骤、最佳实践 |
| template-project.md | 项目文档 | 项目介绍、架构说明、部署指南 |
| template-repo.md | 仓库文档 | README 转换、目录结构、开发指南 |
| template-decision.md | 技术决策 | 背景分析、方案对比、最终决策 |
| template-meeting.md | 会议纪要 | 参会信息、议题列表、行动项 |
| template-incident.md | 事故报告 | 时间线、根因分析、改进措施 |
| template-rfc.md | 技术方案 | 问题陈述、方案设计、实施计划 |
| template-security-review.md | 安全评审 | 威胁模型、漏洞评估、修复建议 |
| template-performance-test.md | 性能测试 | 测试环境、基准数据、优化建议 |
| template-runbook.md | 运维手册 | 操作流程、应急处理、故障排查 |
| template-onboarding.md | 入职指南 | 环境搭建、权限申请、学习路径 |
| template-oncall.md | 值班手册 | 监控指标、告警处理、升级流程 |
| template-prd.md | 产品需求 | 用户故事、功能规格、验收标准 |
| template-retro.md | 回顾会议 | 做得好的、待改进的、行动计划 |
| template-skill.md | 技能文档 | 触发条件、工作流程、验证方法 |
