# IMA Skill 本地工作流配置

本文档说明如何在当前项目中使用 IMA skills 并自动将生成的文件保存到 `.ima_files/` 目录。

## 目录结构

```
项目根目录/
├── .ima_files/              # IMA 生成的文件统一存放目录
├── .gitignore               # 已配置忽略 .ima_files/
└── IMA_WORKFLOW.md          # 本文件
```

## 使用指南

### 1. 创建笔记并保存到本地

当使用 `ima-skill` 创建笔记时，应同时将内容保存到 `.ima_files/` 目录：

**PowerShell 示例:**

```powershell
# 1. 准备笔记内容
$title = "FastAPI 完整教程"
$content = @"
# FastAPI 完整教程

## 简介
FastAPI 是一个现代、快速（高性能）的 Web 框架...
"@

# 2. 确保 .ima_files 目录存在
if (!(Test-Path ".ima_files")) {
    New-Item -ItemType Directory -Path ".ima_files" | Out-Null
}

# 3. 保存到本地文件（UTF-8 编码）
$fileName = "fastapi_tutorial.md"
$content | Out-File -FilePath ".ima_files\$fileName" -Encoding utf8

# 4. 上传到 IMA
$body = @{
    title = $title
    content = $content
    content_format = 1
} | ConvertTo-Json -Depth 10

$utf8Bytes = [System.Text.Encoding]::UTF8.GetBytes($body)
$response = Invoke-RestMethod `
    -Uri "https://ima.qq.com/openapi/note/v1/import_doc" `
    -Method Post -Body $utf8Bytes `
    -ContentType "application/json; charset=utf-8" `
    -Headers $headers

# 5. 验证上传结果
if ($response.code -eq 0) {
    Write-Host "✅ 笔记创建成功: $($response.data.note_id)"
    Write-Host "📁 本地文件已保存: .ima_files\$fileName"
} else {
    Write-Host "❌ 笔记创建失败: $($response.msg)"
}
```

### 2. 使用 ima-web-to-note 技能

当使用 `ima-web-to-note` 技能时，生成的笔记内容也应保存到 `.ima_files/` 目录：

**工作流程:**

1. 抓取网页内容
2. 根据内容类型选择合适的模板
3. 生成结构化的 Markdown 内容
4. 保存到 `.ima_files/` 目录
5. 上传到 IMA 笔记

**PowerShell 示例:**

```powershell
# 1. 确保 .ima_files 目录存在
if (!(Test-Path ".ima_files")) {
    New-Item -ItemType Directory -Path ".ima_files" | Out-Null
}

# 2. 生成笔记内容后，保存到本地
$fileName = "django_tutorial.md"
$content | Out-File -FilePath ".ima_files\$fileName" -Encoding utf8

# 3. 上传到 IMA
$body = @{
    title = "Django 基础与进阶教程"
    content = $content
    content_format = 1
} | ConvertTo-Json -Depth 10

$utf8Bytes = [System.Text.Encoding]::UTF8.GetBytes($body)
$response = Invoke-RestMethod `
    -Uri "https://ima.qq.com/openapi/note/v1/import_doc" `
    -Method Post -Body $utf8Bytes `
    -ContentType "application/json; charset=utf-8" `
    -Headers $headers
```

### 3. 文件命名规范

保存到 `.ima_files/` 的文件应遵循以下命名规范：

| 内容类型 | 命名格式 | 示例 |
|----------|----------|------|
| 教程文档 | `{主题}_tutorial.md` | `fastapi_tutorial.md` |
| API 文档 | `{服务名}_api.md` | `ima_openapi_api.md` |
| 项目文档 | `{项目名}_doc.md` | `markitdown_doc.md` |
| 笔记 | `note_{日期}_{主题}.md` | `note_2026-04-27_meeting.md` |

### 4. Git 版本控制

`.gitignore` 已配置忽略 `.ima_files/` 目录，因此：

- ✅ 本地文件不会提交到 Git
- ✅ 适合存放临时草稿、笔记备份
- ✅ 避免仓库膨胀

如果需要版本控制某些重要文档，可手动添加到 Git：

```bash
git add .ima_files/important_doc.md -f
```

## 环境变量配置

### Windows PowerShell (临时)

```powershell
$env:IMA_OPENAPI_CLIENTID = "your_client_id"
$env:IMA_OPENAPI_APIKEY = "your_api_key"
```

### Windows PowerShell (持久化)

```powershell
# 添加到 PowerShell profile
$profilePath = $PROFILE
if (!(Test-Path $profilePath)) {
    New-Item -ItemType File -Path $profilePath -Force | Out-Null
}

$envContent = @"
# IMA OpenAPI Credentials
`$env:IMA_OPENAPI_CLIENTID = 'your_client_id'
`$env:IMA_OPENAPI_APIKEY = 'your_api_key'
"@

Add-Content -Path $profilePath -Value $envContent
```

## 凭证检查

在每次 API 调用前，检查凭证是否配置：

```powershell
if (!$env:IMA_OPENAPI_CLIENTID -or !$env:IMA_OPENAPI_APIKEY) {
    Write-Host "⚠️ 未配置 IMA 凭证"
    Write-Host "请设置环境变量:"
    Write-Host "  IMA_OPENAPI_CLIENTID"
    Write-Host "  IMA_OPENAPI_APIKEY"
    exit 1
} else {
    Write-Host "✅ IMA 凭证已配置"
}
```

## 错误处理

所有 API 调用后必须检查响应：

```powershell
$response = Invoke-RestMethod ...

if ($response.code -ne 0) {
    Write-Host "❌ API 调用失败: $($response.msg)"
    # 根据错误码处理
    switch ($response.code) {
        200002 { Write-Host "凭证为空，请检查环境变量" }
        20004  { Write-Host "API Key 鉴权失败，请检查凭证是否正确" }
        110001 { Write-Host "参数非法，请检查请求参数" }
        default { Write-Host "未知错误: $($response.msg)" }
    }
    exit 1
}
```

## 最佳实践

1. **始终使用 UTF-8 编码** - 避免中文乱码问题
2. **先保存本地，再上传 IMA** - 确保内容不丢失
3. **检查 API 响应** - 每次调用后验证 `code` 字段
4. **合理命名文件** - 便于后续查找和管理
5. **利用 .gitignore** - 避免提交临时文件到版本控制
