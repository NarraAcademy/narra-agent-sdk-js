/**
 * Narra Agent SDK for Node.js / TypeScript
 * 
 * @description 基于 TypeScript 开发的客户端库，用于访问并集成 Narra Agent Engine API
 * @version 0.1.0
 */

import { HttpClient } from './client';
import { SDKConfig } from './config';
import { AgentsAPI } from './apis/agents';

// 导出所有类型
export * from './types';
export * from './config';

/**
 * Narra SDK 主类
 */
export class NarraSDK {
  private readonly httpClient: HttpClient;
  
  /** Agents API */
  public readonly agents: AgentsAPI;

  constructor(config: SDKConfig = {}) {
    // 初始化 HTTP 客户端
    this.httpClient = new HttpClient(config);

    // 初始化 API 模块
    this.agents = new AgentsAPI(this.httpClient);
  }

  /**
   * 获取当前 SDK 配置
   */
  getConfig(): Required<SDKConfig> {
    return this.httpClient.getConfig();
  }

  /**
   * 获取当前 SDK 版本
   */
  getVersion(): string {
    return '0.3.0';
  }

  /**
   * 测试连接
   */
  async ping(): Promise<boolean> {
    try {
      // 尝试获取 agents 列表来测试连接
      await this.agents.listAgents({ page: 1, pageSize: 1 });
      return true;
    } catch (error) {
      console.error('[Narra SDK] Connection test failed:', error);
      return false;
    }
  }
}

// 默认导出
export default NarraSDK;
