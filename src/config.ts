/**
 * SDK 配置文件 - 环境映射和默认配置
 */
import 'dotenv/config';

export type Environment = 'dev' | 'staging' | 'prod';

/**
 * 环境到 API 基础 URL 的映射
 */
export const ENV_BASE_URLS: Record<Environment, string> = {
  dev: 'https://narra-agent-engine-dev-249369560324.asia-southeast1.run.app',
  staging: 'https://narra-agent-engine-dev-249369560324.asia-southeast1.run.app',
  prod: 'https://narra-agent-engine-prod-249369560324.asia-southeast1.run.app',
};

/**
 * 默认配置
 */
export const DEFAULT_CONFIG = {
  environment: 'prod' as Environment,
  timeout: 30000, // 30 seconds
  retries: 3,
  apiKey: process.env.NARRA_AGENT_API_KEY || undefined,
} as const;

/**
 * SDK 配置接口
 */
export interface SDKConfig {
  /** 环境设置，默认为 prod */
  env?: Environment;
  /** 自定义 API 基础 URL，优先级高于 env */
  baseURL?: string;
  /** 请求超时时间（毫秒），默认 30000 */
  timeout?: number;
  /** 重试次数，默认 3 */
  retries?: number;
  /** API 密钥，优先从环境变量 NARRA_AGENT_API_KEY 读取 */
  apiKey?: string;
}

/**
 * 解析配置，返回最终的基础 URL
 */
export function resolveBaseURL(config: SDKConfig): string {
  if (config.baseURL) {
    return config.baseURL;
  }
  
  const env = config.env || DEFAULT_CONFIG.environment;
  return ENV_BASE_URLS[env];
}
