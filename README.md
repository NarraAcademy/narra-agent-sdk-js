# Narra Agent SDK for Node.js / TypeScript

[![NPM Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/NarraAcademy/narra-agent-sdk-js)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-Private-red.svg)](#许可证)

**Narra Agent SDK** 是基于 TypeScript 开发的客户端库，用于访问并集成 **Narra Agent Engine API**。支持自动环境切换（dev / staging / prod），业务方无需关心 API 域名配置。

## 目录

- [安装](#安装)
- [快速开始](#快速开始)
- [API 功能](#api-功能)
- [环境配置](#环境配置)
- [开发指南](#开发指南)
- [项目结构](#项目结构)
- [许可证](#许可证)

## 安装

### 从 Git 仓库安装（当前方式）

```bash
# 安装最新版本
npm install git+ssh://git@github.com:NarraAcademy/narra-agent-sdk-js.git

# 安装指定版本
npm install git+ssh://git@github.com:NarraAcademy/narra-agent-sdk-js.git#v0.1.0

# 安装指定提交
npm install git+ssh://git@github.com:NarraAcademy/narra-agent-sdk-js.git#abc1234
```

### NPM 安装（将来发布后）

```bash
npm install @narra/agent-sdk
```

## 快速开始

### 基本使用

```typescript
import { NarraSDK } from "@narra/agent-sdk";

// 1. 开发环境
const sdkDev = new NarraSDK({
  env: "dev"
});

// 2. 生产环境（默认）
const sdkProd = new NarraSDK();

// 3. 自定义环境
const sdkCustom = new NarraSDK({
  baseURL: "https://custom-env.yourcompany.com"
});
```

### 示例代码

```typescript
async function main() {
  const sdk = new NarraSDK({ env: "dev" });

  // 测试连接
  const isConnected = await sdk.ping();
  console.log('连接状态:', isConnected ? '成功' : '失败');

  // 获取所有 Agents
  const agentsResponse = await sdk.agents.listAgents();
  console.log(`找到 ${agentsResponse.total_instances} 个 Agents`);
  
  // 获取所有可用的 Agent 类型（从API获取）
const allAgentTypes = await sdk.agents.listAgentTypes();
console.log('API支持的类型:', allAgentTypes);

// 获取当前使用的 Agent 类型（从现有Agent中提取）
const availableTypes = await sdk.agents.getAvailableAgentTypes();
console.log('当前使用的类型:', availableTypes);
  
  // 使用便利方法按类型获取
  const professionalAgents = await sdk.agents.getAgentsByType('zai_professional');
  
  // 获取所有运行中的 Agent
  const runningAgents = await sdk.agents.getRunningAgents();
  
  // 获取特定 Agent 的状态
  if (runningAgents.length > 0) {
    const agentStatus = await sdk.agents.getAgentStatus(runningAgents[0].id);
    console.log('Agent 状态:', agentStatus);
    
    // 与 Agent 聊天（获取完整响应）
    const response = await sdk.agents.sendMessage(
      runningAgents[0].id, 
      'Hello, how are you?'
    );
    console.log('Agent 回复:', response.response);
    console.log('亲密度变化:', response.metadata.intimacy_delta);
    
    // 只获取回复文本
    const textReply = await sdk.agents.sendMessageText(
      runningAgents[0].id, 
      'What is your purpose?'
    );
    console.log('简单回复:', textReply);
    
    // 获取聊天历史（分页）
    const history = await sdk.agents.getChatHistory(runningAgents[0].id, {
      session_id: 'dashboard_session',
      page: 1,
      pageSize: 5
    });
    console.log(`聊天历史: 第${history.pagination.page}页，共${history.pagination.totalPages}页`);
    console.log(`当前页 ${history.messages.length} 条，总共 ${history.pagination.total} 条消息`);
  }
}

main().catch(console.error);
```

## API 功能

### ✅ 已实现的功能

#### Agents API

- **`listAgents(params?)`** - 获取 Agent 列表
  - 支持按 `agent_type` 筛选（支持具体类型或 null）
  - 支持按 `status` 筛选
  - 支持按 `name` 搜索

- **`getAgentStatus(id)`** - 获取 Agent 状态详情
- **`getAgent(id)`** - 获取 Agent 状态（`getAgentStatus` 的别名）

#### Agent 类型相关

- **`listAgentTypes()`** - 获取所有可用的 Agent 类型列表（从API获取）
- **`getAvailableAgentTypes()`** - 获取当前使用的 Agent 类型列表（从现有Agent中提取）

#### 便利方法

- **`getAgentsByType(agentType)`** - 根据类型获取 Agent 列表
- **`getRunningAgents()`** - 获取所有运行中的 Agent

#### 聊天功能

- **`chat(agentId, request)`** - 与 Agent 进行对话，返回完整响应
- **`getChatHistory(agentId, params?)`** - 获取 Agent 聊天历史（支持SDK层面分页）
- **`getChatHistoryRaw(agentId, params?)`** - 获取原始聊天历史（无分页）
- **`sendMessage(agentId, message, sessionId?, context?)`** - 发送消息，返回完整响应
- **`sendMessageText(agentId, message, sessionId?, context?)`** - 发送消息，只返回回复文本

#### 工具方法

- **`ping()`** - 测试 SDK 与 API 的连接

#### 响应数据结构

```typescript
interface AgentsListResponse {
  agents: Agent[];           // Agent 列表
  total_instances: number;   // 总实例数
  available_types: string[]; // 可用的 Agent 类型
  hint: string | null;       // 提示信息
}

interface Agent {
  id: string;               // Agent ID
  name: string;             // Agent 名称
  display_name: string;     // 显示名称
  agent_type: string;       // Agent 类型
  model: string;            // 使用的模型
  status: string;           // 状态 (running/stopped/pending/error)
  version: string;          // 版本
  created_at: string;       // 创建时间
  updated_at: string;       // 更新时间
  total_tasks: number;      // 总任务数
  completed_tasks: number;  // 完成任务数
  config: Record<string, any>; // 配置信息
  // ... 更多字段
}

interface ChatMessageResponse {
  task_id: string;          // 任务ID
  success: boolean;         // 是否成功
  response: string;         // Agent 回复内容
  error: string | null;     // 错误信息
  metadata: {
    agent_type: string;     // Agent 类型
    is_toxic: boolean;      // 是否包含有害内容
    toxic_words: string[] | null; // 有害词汇
    intimacy_delta: number; // 亲密度变化
    session_id: string;     // 会话ID
  };
}

interface ChatHistoryResponse {
  session_id: string;       // 会话ID
  agent_id: string;         // Agent ID
  messages: ChatMessage[];  // 当前页的消息列表
  pagination: {             // 分页信息（SDK层面）
    page: number;           // 当前页码
    pageSize: number;       // 每页大小
    total: number;          // 总消息数
    totalPages: number;     // 总页数
    hasPrev: boolean;       // 是否有上一页
    hasNext: boolean;       // 是否有下一页
  };
  memory_type: string;      // 内存类型
  success: boolean;         // 是否成功
}
```

### 🔄 其他功能

- **`agentExists(id)`** - 检查 Agent 是否存在

### 📊 支持的 Agent 类型

SDK 支持以下 Agent 类型（具有完整的 TypeScript 类型安全）：

- `default` - 默认类型
- `bnb_emotional` - BNB 情感型
- `bnb_professional` - BNB 专业型  
- `zai_professional` - ZAI 专业型
- `zai_emotional` - ZAI 情感型

### 💬 聊天功能

SDK 支持与 Agent 进行实时对话：

```typescript
const sdk = new NarraSDK({ env: "dev" });

// 发送消息并获取完整响应
const response = await sdk.agents.sendMessage(
  'agent-id', 
  'Hello, how are you today?'
);
console.log(response.response); // Agent 的回复
console.log(response.metadata.intimacy_delta); // 亲密度变化

// 发送消息并只获取回复文本
const textResponse = await sdk.agents.sendMessageText(
  'agent-id', 
  'Hello, how are you today?'
);
console.log(textResponse); // 直接获得回复文本

// 使用完整的聊天方法
const chatResponse = await sdk.agents.chat('agent-id', {
  message: 'What can you help me with?',
  session_id: 'my-session-123',
  context: { 
    user: 'john',
    previous_topic: 'project planning' 
  }
});
```

#### 📄 聊天历史分页功能

SDK 在客户端层面实现了聊天历史的分页功能，提供更好的性能和用户体验：

```typescript
// 基本分页使用
const history = await sdk.agents.getChatHistory('agent-id', {
  session_id: 'my-session-123',
  page: 1,                    // 第1页（从1开始）
  pageSize: 10                // 每页10条消息
});

console.log('分页信息:', {
  currentPage: history.pagination.page,
  totalPages: history.pagination.totalPages,
  totalMessages: history.pagination.total,
  hasNext: history.pagination.hasNext,
  hasPrev: history.pagination.hasPrev
});

// 翻页示例
async function loadNextPage(currentHistory) {
  if (currentHistory.pagination.hasNext) {
    return await sdk.agents.getChatHistory('agent-id', {
      session_id: 'my-session-123',
      page: currentHistory.pagination.page + 1,
      pageSize: 10
    });
  }
  return null;
}

// 获取原始数据（获取指定会话的全部消息）
const rawHistory = await sdk.agents.getChatHistoryRaw('agent-id', {
  session_id: 'my-session-123'
});
console.log('总消息数:', rawHistory.messages.length);
```

#### 分页优势

- **性能优化**: API现在返回全部历史记录，客户端分页避免一次性渲染大量消息
- **用户体验**: 支持逐页浏览聊天记录，提升大数据量时的浏览体验
- **内存友好**: 只处理当前页数据，减少DOM渲染压力
- **灵活性**: 可根据UI需要调整每页大小（默认20条）

#### API更新说明

- **API简化**: 新版API移除了 `limit` 参数，直接返回指定会话的全部历史
- **完整数据**: 一次请求获得完整聊天历史，SDK层面提供分页展示
- **更好性能**: 减少多次API调用，在客户端进行智能分页

## 环境配置

SDK 内置以下环境映射：

| 环境 | baseURL |
|------|---------|
| `dev` | `https://narra-agent-engine-dev-249369560324.asia-southeast1.run.app` |
| `staging` | `https://narra-agent-engine-staging.xxx.com` |
| `prod` | `https://narra-agent-engine.xxx.com` |

### 自定义环境

```typescript
const sdk = new NarraSDK({
  baseURL: "https://custom-env.yourcompany.com",
  timeout: 30000,  // 请求超时时间（毫秒）
  retries: 3       // 重试次数
});
```

### 环境要求

- **Node.js**: >= 18
- **TypeScript**: >= 5.0

## 开发指南

### 安装依赖

```bash
npm install
```

### 开发命令

```bash
# 构建项目
npm run build

# 开发模式（监听文件变化）
npm run dev

# 运行示例
npm run example

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 修复代码风格
npm run lint:fix

# 运行测试（TODO）
npm test
```

### 配置文件说明

- **`tsconfig.json`** - TypeScript 配置
- **`tsup.config.ts`** - 构建配置（支持 CJS + ESM）
- **`.eslintrc.js`** - ESLint 代码检查配置
- **`example.ts`** - 使用示例和测试文件

## 项目结构

```
narra-agent-sdk-js/
├── src/
│   ├── index.ts          # SDK 主入口
│   ├── client.ts         # HTTP 客户端封装 (Axios)
│   ├── config.ts         # 环境配置映射
│   ├── apis/             # API 模块
│   │   └── agents.ts     # Agents API 封装
│   └── types/            # TypeScript 类型定义
│       └── index.ts
├── dist/                 # 构建输出目录
├── example.ts            # 使用示例
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
├── tsup.config.ts        # 构建配置
└── README.md            # 项目文档
```

### 核心设计

- **模块化设计**: 按业务功能拆分 API 模块
- **类型安全**: 完整的 TypeScript 类型定义
- **环境管理**: 自动环境切换，支持自定义配置
- **错误处理**: 统一的错误处理和重试机制
- **可扩展性**: 易于添加新的 API 模块

## 开发计划

### 短期目标

- [ ] 根据完整 API 文档补充更多接口
  - [ ] 实现 `createAgent(data)` - 创建 Agent
  - [ ] 实现 `updateAgent(id, data)` - 更新 Agent  
  - [ ] 实现 `deleteAgent(id)` - 删除 Agent
  - [ ] 实现 `activateAgent(id)` / `deactivateAgent(id)` - 激活/停用 Agent
- [ ] 添加完整的单元测试覆盖
- [ ] 完善错误处理和日志系统
- [ ] 添加接口文档和使用指南

### 长期目标

- [ ] 自动从 OpenAPI 规范生成接口类型
- [ ] 支持更多 API 模块（Tasks、Models、Jobs 等）
- [ ] 发布至 npm 并提供在线文档
- [ ] 支持浏览器环境使用

## 许可证

当前版本仅供 **Narra Academy** 内部团队使用，禁止外部分发。

## 贡献

如有问题或建议，请在项目 [GitHub Issues](https://github.com/NarraAcademy/narra-agent-sdk-js/issues) 中提出。

---

📚 **文档**: [API 文档](https://narra-agent-engine-dev-249369560324.asia-southeast1.run.app/docs)  
🏠 **主页**: [Narra Academy](https://github.com/NarraAcademy)  
📦 **仓库**: [narra-agent-sdk-js](https://github.com/NarraAcademy/narra-agent-sdk-js)