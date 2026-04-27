# 模板参考指南

本文档说明 ima-web-to-note 技能如何匹配合适的模板。

## 模板匹配规则

### 自动匹配（基于 URL）

| URL 模式 | 模板 | 说明 |
|----------|------|------|
| `/api` | template-api.md | API 相关文档 |
| `/docs/api` | template-api.md | API 文档目录 |
| `/readme` | template-repo.md | README 文件 |
| `/getting-started` | template-project.md | 快速入门 |
| `/guide` | template-knowledge.md | 指南类文档 |
| `/tutorial` | template-knowledge.md | 教程文档 |
| `/decision` | template-decision.md | 技术决策 |
| `/adr` | template-decision.md | ADR 文档 |
| `/meeting` | template-meeting.md | 会议相关 |
| `/minutes` | template-meeting.md | 会议纪要 |
| `/incident` | template-incident.md | 事故报告 |
| `/postmortem` | template-incident.md | 复盘文档 |
| `/rfc` | template-rfc.md | RFC 文档 |
| `/proposal` | template-rfc.md | 技术提案 |
| `/security` | template-security-review.md | 安全相关 |
| `/vulnerability` | template-security-review.md | 漏洞报告 |
| `/performance` | template-performance-test.md | 性能测试 |
| `/benchmark` | template-performance-test.md | 性能基准 |
| `/runbook` | template-runbook.md | 运维手册 |
| `/ops` | template-runbook.md | 运维文档 |
| `/onboarding` | template-onboarding.md | 入职指南 |
| `/welcome` | template-onboarding.md | 欢迎文档 |
| `/prd` | template-prd.md | 产品需求 |
| `/requirement` | template-prd.md | 需求文档 |
| `/retro` | template-retro.md | 回顾会议 |
| `/retrospective` | template-retro.md | Sprint 回顾 |
| `/skill` | template-skill.md | 技能文档 |
| `/plugin` | template-skill.md | 插件文档 |

### 内容特征匹配（备选）

当 URL 无法明确匹配时，分析页面内容特征：

| 内容特征 | 模板 | 判断依据 |
|----------|------|----------|
| 包含端点列表、HTTP方法 | template-api.md | 存在 REST API 结构 |
| 包含安装命令、依赖说明 | template-repo.md | 存在项目结构 |
| 包含概念定义、术语解释 | template-knowledge.md | 偏理论说明 |
| 包含 Pros/Cons、决策选项 | template-decision.md | 存在权衡分析 |
| 包含参会人员、议题列表 | template-meeting.md | 存在会议结构 |
| 包含 Timeline、Root Cause | template-incident.md | 存在事故分析结构 |
| 包含 Abstract、Motivation | template-rfc.md | 存在提案结构 |
| 包含 CVSS、威胁列表 | template-security-review.md | 存在安全评估 |
| 包含 TPS、RT、并发 | template-performance-test.md | 存在性能指标 |
| 包含 Checkpoint、重启命令 | template-runbook.md | 存在运维步骤 |
| 包含 导师、欢迎语 | template-onboarding.md | 存在入职指引 |
| 包含 用户故事、功能列表 | template-prd.md | 存在需求结构 |
| 包含 Keep/Problem/Try | template-retro.md | 存在回顾结构 |

### 默认模板

当以上规则都无法匹配时，使用 `template-knowledge.md` 作为默认模板。

## 模板内容提取要点

### template-api.md
- 端点列表（方法、路径、描述）
- 请求参数表格
- 响应格式示例
- 认证方式说明
- 错误码列表

### template-knowledge.md
- 核心概念定义
- 关键术语表
- 操作步骤
- 最佳实践
- 常见问题

### template-project.md
- 项目简介
- 技术栈
- 安装部署
- 使用示例
- 架构图

### template-decision.md
- 背景和问题
- 考虑的选项
- 决策结果
-  Consequences（后果）

## 模板维护

添加新模板时需要：
1. 在 `references/template/` 目录创建新模板文件
2. 在 `SKILL.md` 更新匹配规则表
3. 在 `meta.json` 更新 supported_content_types
4. 同步更新本参考文档
