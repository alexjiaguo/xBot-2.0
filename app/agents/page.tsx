'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/lib/utils'
import {
  PlusIcon,
  UserGroupIcon,
  CogIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'

const agents = [
  {
    id: 1,
    name: '客服助手 Agent',
    description: '处理客服相关问题，支持多轮对话',
    version: 'v2.1',
    status: 'active',
    environment: 'production',
    lastDeployed: '2024-01-15T10:30:00Z',
    requestCount: 12847,
    successRate: 94.2,
    avgResponseTime: 1.8,
    dependencies: {
      knowledgeBases: ['客服FAQ', '产品文档'],
      prompts: ['客服问答 Prompt v2.3'],
      tools: ['订单查询', '用户验证'],
    },
    slo: {
      successRate: 95,
      responseTime: 2.0,
      availability: 99.9,
    },
  },
  {
    id: 2,
    name: '技术支持 Agent',
    description: '专门处理技术问题和故障排查',
    version: 'v1.5',
    status: 'active',
    environment: 'production',
    lastDeployed: '2024-01-14T16:20:00Z',
    requestCount: 8934,
    successRate: 91.8,
    avgResponseTime: 2.3,
    dependencies: {
      knowledgeBases: ['技术文档', 'API文档'],
      prompts: ['技术支持 Prompt v1.8'],
      tools: ['日志查询', '系统状态检查'],
    },
    slo: {
      successRate: 90,
      responseTime: 3.0,
      availability: 99.5,
    },
  },
  {
    id: 3,
    name: '销售助手 Agent',
    description: '协助销售团队进行产品推荐和咨询',
    version: 'v3.0-beta',
    status: 'testing',
    environment: 'staging',
    lastDeployed: '2024-01-15T09:15:00Z',
    requestCount: 456,
    successRate: 87.5,
    avgResponseTime: 2.1,
    dependencies: {
      knowledgeBases: ['产品目录', '价格信息'],
      prompts: ['销售助手 Prompt v3.1-beta'],
      tools: ['CRM集成', '报价生成'],
    },
    slo: {
      successRate: 85,
      responseTime: 2.5,
      availability: 99.0,
    },
  },
]

const workflows = [
  {
    id: 1,
    name: '客服问题处理流程',
    description: '标准的客服问题处理工作流',
    agentId: 1,
    steps: [
      { id: 1, name: '问题分类', type: 'classifier', status: 'active' },
      { id: 2, name: '知识检索', type: 'retrieval', status: 'active' },
      { id: 3, name: '答案生成', type: 'generation', status: 'active' },
      { id: 4, name: '质量检查', type: 'validation', status: 'active' },
      { id: 5, name: '反馈收集', type: 'feedback', status: 'active' },
    ],
    executionCount: 2341,
    successRate: 92.5,
    avgExecutionTime: 3.2,
  },
  {
    id: 2,
    name: '技术问题诊断流程',
    description: '自动化技术问题诊断和解决方案推荐',
    agentId: 2,
    steps: [
      { id: 1, name: '症状分析', type: 'analyzer', status: 'active' },
      { id: 2, name: '日志检索', type: 'log_search', status: 'active' },
      { id: 3, name: '解决方案匹配', type: 'solution_match', status: 'active' },
      { id: 4, name: '执行建议', type: 'recommendation', status: 'active' },
    ],
    executionCount: 1876,
    successRate: 89.3,
    avgExecutionTime: 4.1,
  },
]

const monitoring = [
  {
    id: 1,
    agentId: 1,
    metric: 'success_rate',
    current: 94.2,
    target: 95.0,
    status: 'warning',
    trend: 'down',
  },
  {
    id: 2,
    agentId: 1,
    metric: 'response_time',
    current: 1.8,
    target: 2.0,
    status: 'healthy',
    trend: 'stable',
  },
  {
    id: 3,
    agentId: 2,
    metric: 'success_rate',
    current: 91.8,
    target: 90.0,
    status: 'healthy',
    trend: 'up',
  },
]

const statusColors = {
  active: 'success',
  testing: 'warning',
  inactive: 'secondary',
  error: 'destructive',
} as const

const envColors = {
  production: 'success',
  staging: 'warning',
  development: 'secondary',
} as const

const metricStatusColors = {
  healthy: 'success',
  warning: 'warning',
  critical: 'destructive',
} as const

export default function AgentsPage() {
  const [selectedTab, setSelectedTab] = useState('registry')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Agent 管理</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <ChartBarIcon className="h-4 w-4 mr-2" />
            性能报告
          </Button>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            创建 Agent
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="registry">Agent Registry</TabsTrigger>
          <TabsTrigger value="workflows">工作流管理</TabsTrigger>
          <TabsTrigger value="monitoring">性能监控</TabsTrigger>
          <TabsTrigger value="deployment">部署管理</TabsTrigger>
        </TabsList>

        <TabsContent value="registry" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <CardDescription>{agent.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={envColors[agent.environment as keyof typeof envColors]}>
                        {agent.environment}
                      </Badge>
                      <Badge variant={statusColors[agent.status as keyof typeof statusColors]}>
                        {agent.status === 'active' ? '运行中' :
                         agent.status === 'testing' ? '测试中' : '未激活'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 基本信息 */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs text-gray-500">版本</label>
                        <div className="text-sm font-medium">{agent.version}</div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">请求次数</label>
                        <div className="text-sm font-medium">{agent.requestCount}</div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">成功率</label>
                        <div className="text-sm font-medium">{agent.successRate}%</div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">平均响应时间</label>
                        <div className="text-sm font-medium">{agent.avgResponseTime}s</div>
                      </div>
                    </div>

                    {/* SLO 指标 */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">SLO 目标</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-2 bg-gray-50 rounded">
                          <div className="text-xs text-gray-500">成功率目标</div>
                          <div className="text-sm font-medium">{agent.slo.successRate}%</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <div className="text-xs text-gray-500">响应时间目标</div>
                          <div className="text-sm font-medium">{agent.slo.responseTime}s</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <div className="text-xs text-gray-500">可用性目标</div>
                          <div className="text-sm font-medium">{agent.slo.availability}%</div>
                        </div>
                      </div>
                    </div>

                    {/* 依赖关系 */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">依赖关系</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-gray-500">知识库: </span>
                          {agent.dependencies.knowledgeBases.map((kb, index) => (
                            <Badge key={index} variant="outline" className="text-xs mr-1">
                              {kb}
                            </Badge>
                          ))}
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Prompt: </span>
                          {agent.dependencies.prompts.map((prompt, index) => (
                            <Badge key={index} variant="outline" className="text-xs mr-1">
                              {prompt}
                            </Badge>
                          ))}
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">工具: </span>
                          {agent.dependencies.tools.map((tool, index) => (
                            <Badge key={index} variant="outline" className="text-xs mr-1">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <CogIcon className="h-4 w-4 mr-1" />
                        配置
                      </Button>
                      <Button size="sm" variant="outline">
                        <ChartBarIcon className="h-4 w-4 mr-1" />
                        监控
                      </Button>
                      <Button size="sm" variant="outline">
                        <WrenchScrewdriverIcon className="h-4 w-4 mr-1" />
                        测试
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      <CardDescription>{workflow.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{workflow.successRate}% 成功率</div>
                      <div className="text-xs text-gray-500">{workflow.executionCount} 次执行</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-3">工作流步骤</h4>
                      <div className="flex items-center space-x-2 overflow-x-auto">
                        {workflow.steps.map((step, index) => (
                          <div key={step.id} className="flex items-center space-x-2">
                            <div className="flex flex-col items-center min-w-24">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                step.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                              }`}>
                                {step.status === 'active' ? <CheckCircleIcon className="h-5 w-5" /> : <ClockIcon className="h-5 w-5" />}
                              </div>
                              <div className="text-xs text-center mt-1">{step.name}</div>
                            </div>
                            {index < workflow.steps.length - 1 && (
                              <div className="w-8 h-px bg-gray-300 flex-shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-gray-500">执行次数</label>
                        <div className="text-sm font-medium">{workflow.executionCount}</div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">成功率</label>
                        <div className="text-sm font-medium">{workflow.successRate}%</div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">平均执行时间</label>
                        <div className="text-sm font-medium">{workflow.avgExecutionTime}s</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">编辑工作流</Button>
                      <Button size="sm" variant="outline">执行记录</Button>
                      <Button size="sm" variant="outline">性能分析</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>SLO 监控</CardTitle>
                <CardDescription>实时监控 Agent 的 SLO 指标达成情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monitoring.map((metric) => {
                    const agent = agents.find(a => a.id === metric.agentId)
                    return (
                      <div key={metric.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{agent?.name}</h4>
                          <p className="text-sm text-gray-500">
                            {metric.metric === 'success_rate' ? '成功率' : '响应时间'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold">
                              {metric.current}{metric.metric === 'success_rate' ? '%' : 's'}
                            </span>
                            <Badge variant={metricStatusColors[metric.status as keyof typeof metricStatusColors]}>
                              {metric.status === 'healthy' ? '正常' :
                               metric.status === 'warning' ? '警告' : '严重'}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">
                            目标: {metric.target}{metric.metric === 'success_rate' ? '%' : 's'}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>告警配置</CardTitle>
                <CardDescription>配置 Agent 性能告警规则</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">成功率低于阈值</h4>
                      <Badge variant="warning">启用</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      当成功率低于 90% 时触发告警
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">编辑</Button>
                      <Button size="sm" variant="outline">禁用</Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">响应时间过长</h4>
                      <Badge variant="warning">启用</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      当 P95 响应时间超过 5s 时触发告警
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">编辑</Button>
                      <Button size="sm" variant="outline">禁用</Button>
                    </div>
                  </div>

                  <Button className="w-full">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    添加告警规则
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>部署历史</CardTitle>
              <CardDescription>查看 Agent 的部署记录和版本管理</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agents.map((agent) => (
                  <div key={agent.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{agent.name} {agent.version}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant={envColors[agent.environment as keyof typeof envColors]}>
                          {agent.environment}
                        </Badge>
                        <Badge variant={statusColors[agent.status as keyof typeof statusColors]}>
                          {agent.status === 'active' ? '运行中' :
                           agent.status === 'testing' ? '测试中' : '未激活'}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      部署时间: {formatDate(agent.lastDeployed)}
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">查看详情</Button>
                      <Button size="sm" variant="outline">回滚版本</Button>
                      {agent.environment === 'staging' && (
                        <Button size="sm" variant="outline">发布到生产</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
