# IMA 文件管理

IMA 生成的文件统一存放在 `.ima_files` 目录中。

## 目录结构

```
├── .ima_files/               # IMA 生成的文件统一存放目录
│   ├── fastapi_tutorial.md   # FastAPI 教程文档
│   ├── django_tutorial.md    # Django 教程文档
│   └── markitdown_doc.md     # MarkItDown 项目文档
```

## 文件命名规范

| 内容类型 | 命名格式 | 示例 |
|----------|----------|------|
| 教程文档 | `{主题}_tutorial.md` | `fastapi_tutorial.md` |
| API 文档 | `{服务名}_api.md` | `ima_openapi_api.md` |
| 项目文档 | `{项目名}_doc.md` | `markitdown_doc.md` |
| 笔记 | `note_{日期}_{主题}.md` | `note_2026-04-27_meeting.md` |
