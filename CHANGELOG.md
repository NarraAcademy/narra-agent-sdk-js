# 更新日志

所有重要变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

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
