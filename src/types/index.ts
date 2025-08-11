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
 * Agent 列表响应结构
 */
export interface AgentsListResponse {
  /** Agent 列表 */
  agents: Agent[];
  /** 总实例数 */
  total_instances: number;
  /** 可用的 Agent 类型 */
  available_types: string[];
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

/**
 * 创建 Agent 的请求参数
 */
export interface CreateAgentRequest {
  /** Agent 名称 */
  name: string;
  /** Agent 描述 */
  description?: string;
  /** Agent 类型 */
  type?: string;
  /** Agent 配置 */
  config?: Record<string, any>;
  /** Agent 元数据 */
  metadata?: Record<string, any>;
}

/**
 * 更新 Agent 的请求参数
 */
export interface UpdateAgentRequest {
  /** Agent 名称 */
  name?: string;
  /** Agent 描述 */
  description?: string;
  /** Agent 类型 */
  type?: string;
  /** Agent 状态 */
  status?: 'active' | 'inactive' | 'pending' | 'error';
  /** Agent 配置 */
  config?: Record<string, any>;
  /** Agent 元数据 */
  metadata?: Record<string, any>;
}

/**
 * 查询 Agent 列表的参数
 */
export interface ListAgentsParams {
  /** 按名称搜索 */
  name?: string;
  /** 按 Agent 类型筛选 */
  agent_type?: string;
  /** 按状态筛选 */
  status?: 'running' | 'stopped' | 'pending' | 'error';
  /** 页码（如果API支持分页） */
  page?: number;
  /** 每页大小（如果API支持分页） */
  pageSize?: number;
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
