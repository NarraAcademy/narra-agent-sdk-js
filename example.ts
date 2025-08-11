/**
 * Narra Agent SDK 使用示例
 */

import { NarraSDK } from './src';

async function main() {
  // 1. 开发环境
  const sdkDev = new NarraSDK({
    env: 'dev'
  });

  // 2. 生产环境（默认）
  const sdkProd = new NarraSDK();

  // 3. 自定义环境
  const sdkCustom = new NarraSDK({
    baseURL: 'https://custom-env.yourcompany.com'
  });

  try {
    console.log('开始测试 Narra Agent SDK...');
    
    // 测试连接
    const isConnected = await sdkDev.ping();
    console.log('连接测试:', isConnected ? '成功' : '失败');

    // 获取 Agent 列表
    console.log('\n获取 Agent 列表:');
    const agentsResponse = await sdkDev.agents.listAgents();
    
    console.log(`找到 ${agentsResponse.total_instances} 个 Agents：`);
    console.log(`可用类型: ${agentsResponse.available_types.join(', ')}`);
    
    // 显示 Agent 列表
    agentsResponse.agents.forEach((agent, index) => {
      console.log(`\n${index + 1}. ${agent.display_name} (${agent.agent_type})`);
      console.log(`   ID: ${agent.id}`);
      console.log(`   状态: ${agent.status}`);
      console.log(`   模型: ${agent.model}`);
      console.log(`   任务: ${agent.completed_tasks}/${agent.total_tasks} 完成`);
    });
    
    // 如果有 Agent，获取第一个的详细信息
    if (agentsResponse.agents.length > 0) {
      const firstAgent = agentsResponse.agents[0];
      
      try {
        console.log(`\n获取 Agent 状态: ${firstAgent.id}`);
        const agentStatus = await sdkDev.agents.getAgentStatus(firstAgent.id);
        console.log('Agent 状态详情:', {
          name: agentStatus.name,
          display_name: agentStatus.display_name,
          status: agentStatus.status,
          agent_type: agentStatus.agent_type,
          model: agentStatus.model,
          version: agentStatus.version,
          created_at: agentStatus.created_at,
          last_activity_at: agentStatus.last_activity_at,
          total_tasks: agentStatus.total_tasks,
          completed_tasks: agentStatus.completed_tasks,
          failed_tasks: agentStatus.failed_tasks
        });
      } catch (error) {
        console.log('获取 Agent 状态失败:', error.message);
      }
    }
    
    // 测试按类型筛选（原始方法）
    console.log('\n测试筛选功能 - 筛选 zai_professional 类型:');
    const filteredAgents = await sdkDev.agents.listAgents({
      agent_type: 'zai_professional'
    });
    console.log(`筛选结果: 找到 ${filteredAgents.agents.length} 个 zai_professional Agent`);
    
    // 测试便利方法 - 按类型获取
    console.log('\n使用便利方法 - 获取 zai_emotional 类型:');
    const emotionalAgents = await sdkDev.agents.getAgentsByType('zai_emotional');
    console.log(`找到 ${emotionalAgents.length} 个 zai_emotional Agent`);
    if (emotionalAgents.length > 0) {
      console.log(`第一个: ${emotionalAgents[0].display_name} (${emotionalAgents[0].status})`);
    }
    
    // 获取所有运行中的 Agent
    console.log('\n获取所有运行中的 Agent:');
    const runningAgents = await sdkDev.agents.getRunningAgents();
    console.log(`运行中的 Agent 数量: ${runningAgents.length}`);
    
    // 获取可用的 Agent 类型
    console.log('\n获取可用的 Agent 类型:');
    const availableTypes = await sdkDev.agents.getAvailableAgentTypes();
    console.log(`可用类型: ${availableTypes.join(', ')}`);
    
    // 测试 Agent 存在性检查
    if (agentsResponse.agents.length > 0) {
      const testId = agentsResponse.agents[0].id;
      console.log(`\n检查 Agent 是否存在: ${testId}`);
      const exists = await sdkDev.agents.agentExists(testId);
      console.log(`Agent 存在: ${exists}`);
    }

    // 创建新 Agent 示例（注释掉避免实际创建）
    /*
    console.log('\n创建新 Agent:');
    const newAgent = await sdkDev.agents.createAgent({
      name: 'Test Agent',
      description: 'SDK 测试创建的 Agent',
      type: 'test'
    });
    console.log('新创建的 Agent ID:', newAgent.id);
    */

  } catch (error) {
    console.error('错误:', error);
  }
}

// 运行示例
if (require.main === module) {
  main().catch(console.error);
}
