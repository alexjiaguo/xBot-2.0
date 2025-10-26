'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/lib/utils'
import {
  PlusIcon,
  DocumentTextIcon,
  BeakerIcon,
  ChartBarIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

const prompts = [
  {
    id: 1,
    name: '客服问答 Prompt',
    description: '用于客服场景的通用问答提示词模板',
    version: 'v2.3',
    environment: 'production',
    status: 'active',
    lastUpdated: '2024-01-15T10:30:00Z',
    usage: 2341,
    successRate: 87,
  },
  {
    id: 2,
    name: '技术支持 Prompt',
    description: '专门用于技术问题解答的提示词',
    version: 'v1.8',
    environment: 'production',
    status: 'active',
    lastUpdated: '2024-01-14T16:20:00Z',
    usage: 1876,
    successRate: 92,
  },
  {
    id: 3,
    name: '销售助手 Prompt',
    description: '用于产品推荐和销售咨询的提示词',
    version: 'v3.1-beta',
    environment: 'staging',
    status: 'testing',
    lastUpdated: '2024-01-15T09:15:00Z',
    usage: 234,
    successRate: 78,
  },
]

const experiments = [
  {
    id: 1,
    name: '客服 Prompt A/B 测试',
    description: '测试新的客服回答策略效果',
    status: 'running',
    trafficSplit: { a: 50, b: 50 },
    metrics: {
      a: { satisfaction: 4.2, hitRate: 85 },
      b: { satisfaction: 4.5, hitRate: 88 },
    },
    startDate: '2024-01-10T00:00:00Z',
    duration: 7,
  },
  {
    id: 2,
    name: '技术支持语气优化',
    description: '测试更友好的技术支持回答语气',
    status: 'completed',
    trafficSplit: { a: 70, b: 30 },
    metrics: {
      a: { satisfaction: 4.1, hitRate: 90 },
      b: { satisfaction: 4.6, hitRate: 89 },
    },
    startDate: '2024-01-05T00:00:00Z',
    duration: 5,
  },
]

const versions = [
  {
    id: 1,
    promptId: 1,
    version: 'v2.3',
    status: 'current',
    createdBy: '张三',
    createdAt: '2024-01-15T10:30:00Z',
    changelog: '优化了对复杂问题的回答逻辑',
  },
  {
    id: 2,
    promptId: 1,
    version: 'v2.2',
    status: 'archived',
    createdBy: '李四',
    createdAt: '2024-01-10T14:20:00Z',
    changelog: '修复了上下文理解问题',
  },
  {
    id: 3,
    promptId: 1,
    version: 'v2.1',
    status: 'archived',
    createdBy: '王五',
    createdAt: '2024-01-08T11:15:00Z',
    changelog: '添加了新的问候语模板',
  },
]

const statusColors = {
  active: 'success',
  testing: 'warning',
  inactive: 'secondary',
  archived: 'secondary',
} as const

const envColors = {
  production: 'success',
  staging: 'warning',
  development: 'secondary',
} as const

const experimentStatusColors = {
  running: 'warning',
  completed: 'success',
  paused: 'secondary',
} as const

export default function PromptsPage() {
  const [selectedTab, setSelectedTab] = useState('templates')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Prompt 管理</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <BeakerIcon className="h-4 w-4 mr-2" />
            创建实验
          </Button>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            新建 Prompt
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="templates">Prompt 模板</TabsTrigger>
          <TabsTrigger value="experiments">A/B 实验</TabsTrigger>
          <TabsTrigger value="versions">版本管理</TabsTrigger>
          <TabsTrigger value="playground">Playground</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {prompts.map((prompt) => (
              <Card key={prompt.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{prompt.name}</CardTitle>
                      <CardDescription>{prompt.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={envColors[prompt.environment as keyof typeof envColors]}>
                        {prompt.environment}
                      </Badge>
                      <Badge variant={statusColors[prompt.status as keyof typeof statusColors]}>
                        {prompt.status === 'active' ? '激活' :
                         prompt.status === 'testing' ? '测试中' : '未激活'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-gray-500">版本</label>
                      <div className="text-sm font-medium">{prompt.version}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">使用次数</label>
                      <div className="text-sm font-medium">{prompt.usage}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">成功率</label>
                      <div className="text-sm font-medium">{prompt.successRate}%</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">最后更新</label>
                      <div className="text-sm font-medium">{formatDate(prompt.lastUpdated)}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">编辑</Button>
                    <Button size="sm" variant="outline">
                      <BeakerIcon className="h-4 w-4 mr-1" />
                      测试
                    </Button>
                    <Button size="sm" variant="outline">
                      <ChartBarIcon className="h-4 w-4 mr-1" />
                      性能
                    </Button>
                    <Button size="sm" variant="outline">
                      <ArrowPathIcon className="h-4 w-4 mr-1" />
                      发布
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="experiments" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {experiments.map((exp) => (
              <Card key={exp.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{exp.name}</CardTitle>
                      <CardDescription>{exp.description}</CardDescription>
                    </div>
                    <Badge variant={experimentStatusColors[exp.status as keyof typeof experimentStatusColors]}>
                      {exp.status === 'running' ? '运行中' :
                       exp.status === 'completed' ? '已完成' : '已暂停'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">流量分配</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${exp.trafficSplit.a}%` }}
                            />
                          </div>
                          <span className="text-xs">A: {exp.trafficSplit.a}%</span>
                          <span className="text-xs">B: {exp.trafficSplit.b}%</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">实验时长</h4>
                        <div className="text-sm">
                          {exp.duration} 天 (开始: {formatDate(exp.startDate)})
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">性能对比</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h5 className="text-sm font-medium text-blue-900">版本 A</h5>
                          <div className="text-sm text-blue-700">
                            满意度: {exp.metrics.a.satisfaction}/5<br/>
                            命中率: {exp.metrics.a.hitRate}%
                          </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h5 className="text-sm font-medium text-green-900">版本 B</h5>
                          <div className="text-sm text-green-700">
                            满意度: {exp.metrics.b.satisfaction}/5<br/>
                            命中率: {exp.metrics.b.hitRate}%
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {exp.status === 'running' && (
                        <>
                          <Button size="sm" variant="outline">暂停实验</Button>
                          <Button size="sm" variant="outline">调整流量</Button>
                        </>
                      )}
                      {exp.status === 'completed' && (
                        <Button size="sm" variant="outline">应用获胜版本</Button>
                      )}
                      <Button size="sm" variant="outline">查看详细报告</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="versions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>版本历史</CardTitle>
              <CardDescription>查看和管理 Prompt 的历史版本</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {versions.map((version) => (
                  <div key={version.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                      <div>
                        <h4 className="font-medium">{version.version}</h4>
                        <p className="text-sm text-gray-500">
                          由 {version.createdBy} 创建 • {formatDate(version.createdAt)}
                        </p>
                        <p className="text-sm text-gray-600">{version.changelog}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={version.status === 'current' ? 'success' : 'secondary'}>
                        {version.status === 'current' ? '当前版本' : '已归档'}
                      </Badge>
                      <Button size="sm" variant="outline">查看</Button>
                      {version.status !== 'current' && (
                        <Button size="sm" variant="outline">
                          <ArrowPathIcon className="h-4 w-4 mr-1" />
                          回滚
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="playground" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Playground</CardTitle>
              <CardDescription>在线测试和调试 Prompt 效果</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">选择 Prompt 模板</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>客服问答 Prompt v2.3</option>
                      <option>技术支持 Prompt v1.8</option>
                      <option>销售助手 Prompt v3.1-beta</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">测试输入</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="输入用户问题进行测试..."
                    />
                  </div>
                  <Button className="w-full">
                    <BeakerIcon className="h-4 w-4 mr-2" />
                    测试 Prompt
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">输出结果</label>
                    <div className="min-h-40 p-3 border border-gray-300 rounded-md bg-gray-50">
                      <p className="text-gray-500 text-center py-8">点击测试按钮查看结果</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">响应时间</label>
                      <div className="text-sm font-medium">-</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Token 使用</label>
                      <div className="text-sm font-medium">-</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
