# 更新日志

所有重要变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [0.3.1] - 2025-08-08

### 🔄 API 适配更新

- **适配新版聊天历史API**: 移除了 `limit` 参数，API现在返回指定会话的全部历史记录
- **简化参数**: `getChatHistoryRaw()` 不再需要 `limit` 参数，只需 `session_id`
- **优化性能**: 一次API调用获取完整数据，客户端分页更加高效和准确

### 改进

- 📚 更新文档说明新API行为和分页优势
- 🧪 更新示例代码适配新API
- 🔧 向后兼容：现有代码自动适配新API，无需修改

## [0.3.0] - 2025-08-08

### 🚀 重大功能新增

- **📄 SDK层面分页功能**: 为聊天历史实现了客户端分页
  - `getChatHistory()` - 支持 `page` 和 `pageSize` 参数，在SDK层面进行分页
  - `getChatHistoryRaw()` - 获取原始API响应，无分页处理
  - 完整的分页信息：`pagination.page`、`pagination.totalPages`、`pagination.hasNext` 等

### 新增类型

- ✨ `ChatHistoryApiResponse` - 原始API响应类型
- 🔧 增强 `ChatHistoryResponse` - 包含完整的分页信息
- 📊 `ChatHistoryParams` - 支持分页参数

### 分页优势

- **性能优化**: 客户端分页避免重复请求和数据拼接
- **用户体验**: 支持逐页浏览大量聊天记录，即时响应无需等待
- **内存友好**: 只处理当前页数据，优化大数据量时的渲染性能
- **灵活性**: 可根据需要自定义每页大小（默认20条），支持动态调整

### 改进

- 📚 大幅更新文档，添加详细的分页使用指南
- 🧪 更新示例代码，演示分页功能的完整用法
- 🔧 向后兼容：现有代码无需修改，分页为可选功能

## [0.2.1] - 2025-08-08

### 🔧 类型定义优化

- **完善聊天API响应类型**: 根据实际API响应调整了类型定义
  - `ChatMessageResponse` - 更新为实际的响应结构，包含 `task_id`、`success`、`metadata` 等
  - `ChatHistoryResponse` - 更新为实际的历史响应结构
  - `ChatMessage` - 调整字段名称匹配实际API (使用 `content` 而非 `message`)

### 新增方法

- ✨ `sendMessageText()` - 发送消息并只返回回复文本的便利方法

### 改进

- 📚 更新 README 文档，添加完整的响应数据结构说明
- 🧪 优化示例代码，展示实际的API响应和数据处理
- 🔧 增强类型安全，所有聊天方法现在返回正确的类型

## [0.2.0] - 2025-08-08

### 🚀 重大功能新增

- **💬 聊天功能**: 支持与 Agent 进行实时对话
  - `chat(agentId, request)` - 与 Agent 进行对话
  - `getChatHistory(agentId, params?)` - 获取聊天历史记录
  - `sendMessage(agentId, message, sessionId?, context?)` - 发送简单消息的便利方法

### 新增功能

- 🎯 完整的聊天类型定义：
  - `ChatMessageRequest` - 聊天消息请求
  - `ChatMessageResponse` - 聊天消息响应  
  - `ChatHistoryParams` - 聊天历史查询参数
  - `ChatHistoryResponse` - 聊天历史响应
  - `ChatMessage` - 单条聊天消息

### 改进

- 📚 大幅更新 README 文档，添加聊天功能使用指南
- 🧪 更新示例代码，展示完整的聊天功能使用
- 🔧 优化 API 错误处理和参数验证

### API 端点

- `POST /api/v1/agents/{agent_id}/chat` - 与 Agent 对话
- `GET /api/v1/agents/{agent_id}/chat/history` - 获取聊天历史

## [0.1.2] - 2025-08-08

### 新增

- 🎯 添加了 `AgentType` 类型定义，提供完整的类型安全支持
- ✨ 新增便利方法：
  - `getAgentsByType(agentType)` - 根据类型获取 Agent 列表
  - `getRunningAgents()` - 获取所有运行中的 Agent
  - `getAvailableAgentTypes()` - 获取可用的 Agent 类型列表

### 改进

- 🔧 优化了 `agent_type` 参数的类型定义，支持 `AgentType | string | null`
- 📚 完善了 README 文档，添加了支持的 Agent 类型说明
- 🧪 更新了示例代码，展示新的便利方法使用

### 类型安全

- 支持的 Agent 类型：`default`, `bnb_emotional`, `bnb_professional`, `zai_professional`, `zai_emotional`

## [0.1.1] - 2025-08-08

### 修复

- 修正了 `getAgent(id)` API 端点，从 `/api/v1/agents/{id}` 更改为 `/api/v1/agents/{id}/status`
- 添加了 `getAgentStatus(id)` 方法作为获取 Agent 状态的主要接口

### 变更

- 暂时移除了 `createAgent`、`updateAgent`、`deleteAgent` 等写操作方法
- 将这些方法标记为待后续开发功能
- 清理了相关的类型定义，减少了代码复杂度

### 改进

- 更新了项目 README 结构，增加了详细的功能说明
- 添加了开发计划部分，明确了短期和长期目标
- 优化了文档的可读性和组织结构

## [0.1.0] - 2025-08-08

### 新增

- 🎉 初始版本发布
- 实现了基础的 SDK 架构
- 支持多环境配置（dev/staging/prod）
- 实现了 Agents API 的列表功能
- 添加了完整的 TypeScript 类型定义
- 支持连接测试和错误处理
- 提供了完整的使用示例

### 功能

- **环境管理**: 自动环境切换，支持自定义 baseURL
- **Agents API**: 
  - `listAgents()` - 获取 Agent 列表
  - `getAgentStatus()` - 获取 Agent 状态
  - 支持按类型、状态筛选
- **HTTP 客户端**: 基于 Axios，包含重试机制
- **类型安全**: 完整的 TypeScript 支持
