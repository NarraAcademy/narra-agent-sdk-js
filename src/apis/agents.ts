/**
 * Agents API 封装
 */

import { HttpClient } from '../client';
import {
  Agent,
  AgentType,
  ListAgentsParams,
  AgentsListResponse,
  NarraSDKError,
} from '../types';

/**
 * Agents API 类
 */
export class AgentsAPI {
  private readonly basePath = '/api/v1/agents';

  constructor(private client: HttpClient) {}

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
  async getAgentsByType(agentType: AgentType): Promise<Agent[]> {
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
  async getAvailableAgentTypes(): Promise<AgentType[]> {
    const response = await this.listAgents();
    return response.available_types;
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
