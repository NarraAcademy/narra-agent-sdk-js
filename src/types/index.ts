/**
 * Narra Agent SDK 类型定义
 */

/**
 * 通用 API 响应结构
 */
export interface ApiResponse<T = any> {
  /** 响应数据 */
  data: T;
  /** 响应消息 */
  message?: string;
  /** 响应状态码 */
  code?: number;
  /** 是否成功 */
  success?: boolean;
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  /** 页码，从 1 开始 */
  page?: number;
  /** 每页大小 */
  pageSize?: number;
  /** 排序字段 */
  sortBy?: string;
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc';
}

/**
 * 可用的 Agent 类型
 */
export type AgentType = 
  | 'default'
  | 'bnb_emotional'
  | 'bnb_professional'
  | 'zai_professional'
  | 'zai_emotional';

/**
 * Agent 列表响应结构
 */
export interface AgentsListResponse {
  /** Agent 列表 */
  agents: Agent[];
  /** 总实例数 */
  total_instances: number;
  /** 可用的 Agent 类型 */
  available_types: AgentType[];
  /** 提示信息 */
  hint: string | null;
}

/**
 * 分页响应结构（为未来可能的分页支持保留）
 */
export interface PaginatedResponse<T = any> {
  /** 数据列表 */
  items: T[];
  /** 总数量 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页大小 */
  pageSize: number;
  /** 总页数 */
  totalPages: number;
  /** 是否有下一页 */
  hasNext: boolean;
  /** 是否有上一页 */
  hasPrev: boolean;
}

/**
 * Agent 实体类型
 */
export interface Agent {
  /** Agent ID */
  id: string;
  /** Agent 名称 */
  name: string;
  /** Agent 显示名称 */
  display_name: string;
  /** Agent 类型 */
  agent_type: string;
  /** 使用的模型 */
  model: string;
  /** Agent 状态 */
  status: 'running' | 'stopped' | 'pending' | 'error';
  /** 版本 */
  version: string;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
  /** 最后活动时间 */
  last_activity_at: string;
  /** 启动时间 */
  start_time?: string;
  /** 停止时间 */
  stop_time?: string;
  /** 总任务数 */
  total_tasks: number;
  /** 完成任务数 */
  completed_tasks: number;
  /** 失败任务数 */
  failed_tasks: number;
  /** 总运行时间 */
  total_runtime: number;
  /** Agent 配置 */
  config: Record<string, any>;
  /** 可用工具 */
  tools: any[];
}

// ========================================
// 以下类型定义待后续开发使用
// ========================================

/**
 * 创建 Agent 的请求参数（待实现）
 * TODO: 根据实际 API 文档确认字段
 */
// export interface CreateAgentRequest {
//   name: string;
//   description?: string;
//   agent_type?: string;
//   config?: Record<string, any>;
//   metadata?: Record<string, any>;
// }

/**
 * 更新 Agent 的请求参数（待实现）
 * TODO: 根据实际 API 文档确认字段
 */
// export interface UpdateAgentRequest {
//   name?: string;
//   description?: string;
//   agent_type?: string;
//   status?: 'running' | 'stopped' | 'pending' | 'error';
//   config?: Record<string, any>;
//   metadata?: Record<string, any>;
// }

/**
 * 查询 Agent 列表的参数
 */
export interface ListAgentsParams {
  /** 按名称搜索 */
  name?: string;
  /** 
   * 按 Agent 类型筛选
   * 支持的类型：default, bnb_emotional, bnb_professional, zai_professional, zai_emotional
   * 可以传入具体类型或 null
   */
  agent_type?: AgentType | string | null;
  /** 按状态筛选 */
  status?: 'running' | 'stopped' | 'pending' | 'error';
  /** 页码（如果API支持分页） */
  page?: number;
  /** 每页大小（如果API支持分页） */
  pageSize?: number;
}

/**
 * 聊天消息请求参数
 */
export interface ChatMessageRequest {
  /** 消息内容 */
  message: string;
  /** 会话ID */
  session_id: string;
  /** 上下文信息 */
  context?: Record<string, any>;
}

/**
 * 聊天消息响应
 */
export interface ChatMessageResponse {
  /** 任务ID */
  task_id: string;
  /** 是否成功 */
  success: boolean;
  /** Agent 的回复内容 */
  response: string;
  /** 错误信息 */
  error: string | null;
  /** 元数据 */
  metadata: {
    /** Agent 类型 */
    agent_type: string;
    /** 是否包含有害内容 */
    is_toxic: boolean;
    /** 有害词汇 */
    toxic_words: string[] | null;
    /** 亲密度变化 */
    intimacy_delta: number;
    /** 会话ID */
    session_id: string;
  };
}

/**
 * 聊天历史查询参数
 */
export interface ChatHistoryParams {
  /** 会话ID，默认为 dashboard_session */
  session_id?: string;
  /** 限制返回的消息数量，默认为 50 */
  limit?: number;
  /** 页码，从 1 开始（SDK 层面分页） */
  page?: number;
  /** 每页大小（SDK 层面分页），默认为 20 */
  pageSize?: number;
}

/**
 * 聊天历史响应（原始API响应）
 */
export interface ChatHistoryApiResponse {
  /** 会话ID */
  session_id: string;
  /** Agent ID */
  agent_id: string;
  /** 聊天历史记录 */
  messages: ChatMessage[];
  /** 总消息数 */
  total_messages: number;
  /** 内存类型 */
  memory_type: string;
  /** 是否成功 */
  success: boolean;
}

/**
 * 聊天历史响应（SDK 分页后）
 */
export interface ChatHistoryResponse {
  /** 会话ID */
  session_id: string;
  /** Agent ID */
  agent_id: string;
  /** 当前页的聊天历史记录 */
  messages: ChatMessage[];
  /** 分页信息 */
  pagination: {
    /** 当前页码 */
    page: number;
    /** 每页大小 */
    pageSize: number;
    /** 总消息数 */
    total: number;
    /** 总页数 */
    totalPages: number;
    /** 是否有上一页 */
    hasPrev: boolean;
    /** 是否有下一页 */
    hasNext: boolean;
  };
  /** 内存类型 */
  memory_type: string;
  /** 是否成功 */
  success: boolean;
}

/**
 * 单条聊天消息
 */
export interface ChatMessage {
  /** 发送者角色 */
  role: 'user' | 'assistant' | 'system';
  /** 消息内容 */
  content: string;
  /** 时间戳 */
  timestamp: string | null;
  /** 消息类型 */
  type: 'text' | 'image' | 'file';
}

/**
 * SDK 错误类型
 */
export class NarraSDKError extends Error {
  constructor(
    message: string,
    public code?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'NarraSDKError';
  }
}
