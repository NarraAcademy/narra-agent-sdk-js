/**
 * Agents API 封装
 */

import { HttpClient } from '../client';
import {
  Agent,
  CreateAgentRequest,
  UpdateAgentRequest,
  ListAgentsParams,
  AgentsListResponse,
  ApiResponse,
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

  /**
   * 创建新的 Agent
   */
  async createAgent(data: CreateAgentRequest): Promise<Agent> {
    if (!data.name) {
      throw new NarraSDKError('Agent name is required');
    }

    try {
      const response = await this.client.post<ApiResponse<Agent>>(this.basePath, data);
      return response.data || response;
    } catch (error: any) {
      throw new NarraSDKError(
        `Failed to create agent: ${error.message}`,
        error.response?.status,
        error.response?.data
      );
    }
  }

  /**
   * 更新 Agent
   */
  async updateAgent(id: string, data: UpdateAgentRequest): Promise<Agent> {
    if (!id) {
      throw new NarraSDKError('Agent ID is required');
    }

    try {
      const response = await this.client.put<ApiResponse<Agent>>(`${this.basePath}/${id}`, data);
      return response.data || response;
    } catch (error: any) {
      throw new NarraSDKError(
        `Failed to update agent ${id}: ${error.message}`,
        error.response?.status,
        error.response?.data
      );
    }
  }

  /**
   * 删除 Agent
   */
  async deleteAgent(id: string): Promise<void> {
    if (!id) {
      throw new NarraSDKError('Agent ID is required');
    }

    try {
      await this.client.delete(`${this.basePath}/${id}`);
    } catch (error: any) {
      throw new NarraSDKError(
        `Failed to delete agent ${id}: ${error.message}`,
        error.response?.status,
        error.response?.data
      );
    }
  }

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
   * 批量删除 Agents
   */
  async deleteAgents(ids: string[]): Promise<void> {
    if (!ids.length) {
      throw new NarraSDKError('At least one agent ID is required');
    }

    try {
      await this.client.delete(this.basePath, {
        data: { ids }
      });
    } catch (error: any) {
      throw new NarraSDKError(
        `Failed to delete agents: ${error.message}`,
        error.response?.status,
        error.response?.data
      );
    }
  }

  /**
   * 激活 Agent
   */
  async activateAgent(id: string): Promise<Agent> {
    return this.updateAgent(id, { status: 'active' });
  }

  /**
   * 停用 Agent
   */
  async deactivateAgent(id: string): Promise<Agent> {
    return this.updateAgent(id, { status: 'inactive' });
  }
}
