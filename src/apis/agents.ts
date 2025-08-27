/**
 * Agents API 封装
 */

import { HttpClient } from '../client';
import {
  Agent,
  ListAgentsParams,
  AgentsListResponse,
  ChatMessageRequest,
  ChatMessageResponse,
  ChatHistoryParams,
  ChatHistoryResponse,
  ChatHistoryApiResponse,
  NarraSDKError,
} from '../types';

/**
 * Agents API 类
 */
export class AgentsAPI {
  private readonly basePath = '/api/v1/agents';

  constructor(private client: HttpClient) {}

  /**
   * 获取可用的 Agent 类型列表
   * @returns 可用的 Agent 类型数组
   */
  async listAgentTypes(): Promise<string[]> {
    try {
      const url = `${this.basePath}/types`;
      const response = await this.client.get<string[]>(url);
      return response;
    } catch (error: any) {
      throw new NarraSDKError(
        `Failed to list agent types: ${error.message}`,
        error.response?.status,
        error.response?.data
      );
    }
  }

  /**
   * 获取 Agent 列表
   */
  async listAgents(params: ListAgentsParams = {}): Promise<AgentsListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      // 添加筛选参数
      if (params.name) queryParams.append('name', params.name);
      if (params.agent_type) queryParams.append('agent_type', params.agent_type);
      if (params.status) queryParams.append('status', params.status);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

      const url = queryParams.toString() 
        ? `${this.basePath}?${queryParams.toString()}`
        : this.basePath;

      const response = await this.client.get<AgentsListResponse>(url);
      
      return response;
    } catch (error: any) {
      throw new NarraSDKError(
        `Failed to list agents: ${error.message}`,
        error.response?.status,
        error.response?.data
      );
    }
  }

  /**
   * 根据 ID 获取 Agent 状态
   */
  async getAgentStatus(id: string): Promise<Agent> {
    if (!id) {
      throw new NarraSDKError('Agent ID is required');
    }

    try {
      const response = await this.client.get<Agent>(`${this.basePath}/${id}/status`);
      return response;
    } catch (error: any) {
      throw new NarraSDKError(
        `Failed to get agent status ${id}: ${error.message}`,
        error.response?.status,
        error.response?.data
      );
    }
  }

  /**
   * 根据 ID 获取单个 Agent（别名方法，保持向后兼容）
   */
  async getAgent(id: string): Promise<Agent> {
    return this.getAgentStatus(id);
  }

  // ========================================
  // 以下方法待后续开发，暂时注释
  // ========================================

  /**
   * 创建新的 Agent（待实现）
   * TODO: 需要确认 API 端点和参数格式
   */
  // async createAgent(data: CreateAgentRequest): Promise<Agent> {
  //   throw new NarraSDKError('createAgent method is not implemented yet');
  // }

  /**
   * 更新 Agent（待实现）
   * TODO: 需要确认 API 端点和参数格式
   */
  // async updateAgent(id: string, data: UpdateAgentRequest): Promise<Agent> {
  //   throw new NarraSDKError('updateAgent method is not implemented yet');
  // }

  /**
   * 删除 Agent（待实现）
   * TODO: 需要确认 API 端点
   */
  // async deleteAgent(id: string): Promise<void> {
  //   throw new NarraSDKError('deleteAgent method is not implemented yet');
  // }

  /**
   * 检查 Agent 是否存在
   */
  async agentExists(id: string): Promise<boolean> {
    try {
      await this.getAgentStatus(id);
      return true;
    } catch (error: any) {
      if (error.code === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * 根据类型获取 Agent 列表的便利方法
   */
  async getAgentsByType(agentType: string): Promise<Agent[]> {
    const response = await this.listAgents({ agent_type: agentType });
    return response.agents;
  }

  /**
   * 获取运行中的 Agent 列表
   */
  async getRunningAgents(): Promise<Agent[]> {
    const response = await this.listAgents({ status: 'running' });
    return response.agents;
  }

  /**
   * 获取可用的 Agent 类型列表
   */
  async getAvailableAgentTypes(): Promise<string[]> {
    const response = await this.listAgents();
    return response.available_types;
  }

  // ========================================
  // 聊天相关功能
  // ========================================

  /**
   * 与 Agent 聊天
   * @param agentId Agent ID
   * @param request 聊天请求参数
   * @returns 聊天响应
   */
  async chat(agentId: string, request: ChatMessageRequest): Promise<ChatMessageResponse> {
    if (!agentId) {
      throw new NarraSDKError('Agent ID is required');
    }
    if (!request.message) {
      throw new NarraSDKError('Message is required');
    }
    if (!request.session_id) {
      throw new NarraSDKError('Session ID is required');
    }

    try {
      const response = await this.client.post<ChatMessageResponse>(
        `${this.basePath}/${agentId}/chat`, 
        request
      );
      return response;
    } catch (error: any) {
      throw new NarraSDKError(
        `Failed to chat with agent ${agentId}: ${error.message}`,
        error.response?.status,
        error.response?.data
      );
    }
  }

  /**
   * 获取 Agent 聊天历史（带 SDK 层面分页）
   * @param agentId Agent ID
   * @param params 查询参数
   * @returns 分页后的聊天历史
   */
  async getChatHistory(
    agentId: string, 
    params: ChatHistoryParams = {}
  ): Promise<ChatHistoryResponse> {
    if (!agentId) {
      throw new NarraSDKError('Agent ID is required');
    }

    try {
      // 获取原始数据（API现在返回全部历史记录）
      const apiResponse = await this.getChatHistoryRaw(agentId, {
        session_id: params.session_id
      });

      // SDK 层面分页参数
      const page = params.page || 1;
      const pageSize = params.pageSize || 20;
      const total = apiResponse.messages.length;
      const totalPages = Math.ceil(total / pageSize);

      // 计算分页索引
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, total);

      // 分页切片
      const paginatedMessages = apiResponse.messages.slice(startIndex, endIndex);

      // 构建分页响应
      return {
        session_id: apiResponse.session_id,
        agent_id: apiResponse.agent_id,
        messages: paginatedMessages,
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages
        },
        memory_type: apiResponse.memory_type,
        success: apiResponse.success
      };
    } catch (error: any) {
      throw new NarraSDKError(
        `Failed to get chat history for agent ${agentId}: ${error.message}`,
        error.response?.status,
        error.response?.data
      );
    }
  }

  /**
   * 获取 Agent 聊天历史（原始 API 响应，无分页处理）
   * API 现在返回指定会话的全部历史记录
   * @param agentId Agent ID
   * @param params 查询参数
   * @returns 原始聊天历史数据
   */
  async getChatHistoryRaw(
    agentId: string, 
    params: Omit<ChatHistoryParams, 'page' | 'pageSize'> = {}
  ): Promise<ChatHistoryApiResponse> {
    if (!agentId) {
      throw new NarraSDKError('Agent ID is required');
    }
    if (!params.session_id) {
      throw new NarraSDKError('Session ID is required');
    }

    try {
      const queryParams = new URLSearchParams();
      
      // 设置默认值
      const sessionId = params.session_id;
      queryParams.append('session_id', sessionId);

      const url = `${this.basePath}/${agentId}/chat/history?${queryParams.toString()}`;
      const response = await this.client.get<ChatHistoryApiResponse>(url);
      
      return response;
    } catch (error: any) {
      throw new NarraSDKError(
        `Failed to get raw chat history for agent ${agentId}: ${error.message}`,
        error.response?.status,
        error.response?.data
      );
    }
  }

  /**
   * 批量删除 Agents（待实现）
   * TODO: 需要确认 API 端点
   */
  // async deleteAgents(ids: string[]): Promise<void> {
  //   throw new NarraSDKError('deleteAgents method is not implemented yet');
  // }

  /**
   * 激活 Agent（待实现）
   * TODO: 需要确认 API 端点
   */
  // async activateAgent(id: string): Promise<Agent> {
  //   throw new NarraSDKError('activateAgent method is not implemented yet');
  // }

  /**
   * 停用 Agent（待实现）
   * TODO: 需要确认 API 端点
   */
  // async deactivateAgent(id: string): Promise<Agent> {
  //   throw new NarraSDKError('deactivateAgent method is not implemented yet');
  // }
}
