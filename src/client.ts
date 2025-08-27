/**
 * HTTP 客户端封装 - 基于 Axios
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { SDKConfig, DEFAULT_CONFIG, resolveBaseURL } from './config';

export interface RequestOptions extends AxiosRequestConfig {
  retries?: number;
}

/**
 * HTTP 客户端类
 */
export class HttpClient {
  private axiosInstance: AxiosInstance;
  private config: Required<SDKConfig>;

  constructor(config: SDKConfig = {}) {
    this.config = {
      env: config.env || DEFAULT_CONFIG.environment,
      baseURL: resolveBaseURL(config),
      timeout: config.timeout || DEFAULT_CONFIG.timeout,
      retries: config.retries || DEFAULT_CONFIG.retries,
      apiKey: config.apiKey || DEFAULT_CONFIG.apiKey,
    };

    this.axiosInstance = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * 设置请求和响应拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.config.apiKey) {
          config.headers.Authorization = `Bearer ${this.config.apiKey}`;
        }
        console.log(`[Narra SDK] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[Narra SDK] Request error:', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`[Narra SDK] ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('[Narra SDK] Response error:', error.response?.status, error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * GET 请求
   */
  async get<T = any>(url: string, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>('GET', url, undefined, options);
    return response.data;
  }

  /**
   * POST 请求
   */
  async post<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>('POST', url, data, options);
    return response.data;
  }

  /**
   * PUT 请求
   */
  async put<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>('PUT', url, data, options);
    return response.data;
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(url: string, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>('DELETE', url, undefined, options);
    return response.data;
  }

  /**
   * 通用请求方法，支持重试机制
   */
  private async request<T = any>(
    method: string,
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<AxiosResponse<T>> {
    const retries = options?.retries ?? this.config.retries;
    let lastError: any;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this.axiosInstance.request<T>({
          method,
          url,
          data,
          ...options,
        });
        return response;
      } catch (error) {
        lastError = error;
        
        // 最后一次尝试或者不是网络错误，直接抛出
        if (attempt === retries || !this.isRetryableError(error)) {
          break;
        }

        // 等待后重试（指数退避）
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`[Narra SDK] Retrying in ${delay}ms... (attempt ${attempt + 1}/${retries})`);
        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  /**
   * 判断错误是否可以重试
   */
  private isRetryableError(error: any): boolean {
    if (!error.response) {
      // 网络错误，可以重试
      return true;
    }

    const status = error.response.status;
    // 5xx 服务器错误和 408 请求超时可以重试
    return status >= 500 || status === 408;
  }

  /**
   * 延迟函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 获取当前配置
   */
  getConfig(): Required<SDKConfig> {
    return { ...this.config };
  }
}
