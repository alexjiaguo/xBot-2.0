'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate, formatPercentage } from '@/lib/utils'
import {
  PlusIcon,
  BeakerIcon,
  ChartBarIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

const evaluationRuns = [
  {
    id: 1,
    name: 'Q1 季度评测',
    description: '季度例行评测，包含所有核心指标',
    status: 'completed',
    dataset: '黄金测试集 v2.1',
    startTime: '2024-01-15T09:00:00Z',
    endTime: '2024-01-15T11:30:00Z',
    totalQuestions: 500,
    processedQuestions: 500,
    metrics: {
      hitAt5: 78.4,
      hitAt10: 85.2,
      mrr: 0.712,
      ndcg: 0.689,
      factuality: 82.6,
      citationCoverage: 76.8,
    },
  },
  {
    id: 2,
    name: 'Prompt 优化评测',
    description: '测试新 Prompt 模板的效果',
    status: 'running',
    dataset: '客服问答测试集',
    startTime: '2024-01-15T14:00:00Z',
    endTime: null,
    totalQuestions: 200,
    processedQuestions: 156,
    metrics: {
      hitAt5: 82.1,
      hitAt10: 88.5,
      mrr: 0.745,
      ndcg: 0.721,
      factuality: 85.2,
      citationCoverage: 79.3,
    },
  },
  {
    id: 3,
    name: 'Embedding 模型对比',
    description: '对比不同 Embedding 模型的检索效果',
    status: 'failed',
    dataset: '技术文档测试集',
    startTime: '2024-01-14T16:00:00Z',
    endTime: '2024-01-14T16:45:00Z',
    totalQuestions: 300,
    processedQuestions: 123,
    metrics: null,
  },
]

const datasets = [
  {
    id: 1,
    name: '黄金测试集 v2.1',
    description: '从历史对话中精选的高质量测试数据',
    size: 500,
    categories: ['客服问答', '技术支持', '产品咨询'],
    lastUpdated: '2024-01-10T10:00:00Z',
    quality: 95.2,
  },
  {
    id: 2,
    name: '客服问答测试集',
    description: '专门用于客服场景的评测数据',
    size: 200,
    categories: ['订单查询', '退换货', '账户问题'],
    lastUpdated: '2024-01-12T14:30:00Z',
    quality: 92.8,
  },
  {
    id: 3,
    name: '技术文档测试集',
    description: '技术文档相关的问答数据',
    size: 300,
    categories: ['API文档', '故障排查', '配置指南'],
    lastUpdated: '2024-01-08T09:15:00Z',
    quality: 89.6,
  },
]

const benchmarkData = [
  { model: 'Current Model', hitAt5: 78.4, hitAt10: 85.2, mrr: 71.2, factuality: 82.6 },
  { model: 'Baseline v1', hitAt5: 72.1, hitAt10: 79.8, mrr: 65.4, factuality: 78.9 },
  { model: 'Competitor A', hitAt5: 75.6, hitAt10: 82.3, mrr: 68.7, factuality: 80.2 },
  { model: 'Competitor B', hitAt5: 76.9, hitAt10: 83.1, mrr: 70.1, factuality: 81.4 },
]

const trendData = [
  { date: '2024-01-01', hitAt5: 72.1, factuality: 78.9 },
  { date: '2024-01-05', hitAt5: 74.3, factuality: 80.1 },
  { date: '2024-01-10', hitAt5: 76.8, factuality: 81.5 },
  { date: '2024-01-15', hitAt5: 78.4, factuality: 82.6 },
]

const radarData = [
  { subject: 'Hit@5', A: 78.4, B: 75.6, fullMark: 100 },
  { subject: 'Hit@10', A: 85.2, B: 82.3, fullMark: 100 },
  { subject: 'MRR', A: 71.2, B: 68.7, fullMark: 100 },
  { subject: 'Factuality', A: 82.6, B: 80.2, fullMark: 100 },
  { subject: 'Citation', A: 76.8, B: 73.1, fullMark: 100 },
]

const statusColors = {
  completed: 'success',
  running: 'warning',
  failed: 'destructive',
  pending: 'secondary',
} as const

export default function EvaluationPage() {
  const [selectedTab, setSelectedTab] = useState('runs')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">评测与监控</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <ChartBarIcon className="h-4 w-4 mr-2" />
            生成报告
          </Button>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            创建评测
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="runs">评测运行</TabsTrigger>
          <TabsTrigger value="datasets">测试数据集</TabsTrigger>
          <TabsTrigger value="benchmarks">基准对比</TabsTrigger>
          <TabsTrigger value="monitoring">实时监控</TabsTrigger>
        </TabsList>

        <TabsContent value="runs" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {evaluationRuns.map((run) => (
              <Card key={run.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{run.name}</CardTitle>
                      <CardDescription>{run.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={statusColors[run.status as keyof typeof statusColors]}>
                        {run.status === 'completed' ? '已完成' :
                         run.status === 'running' ? '运行中' :
                         run.status === 'failed' ? '失败' : '待执行'}
                      </Badge>
                      {run.status === 'running' && (
                        <Button size="sm" variant="outline">
                          <PauseIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 基本信息 */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs text-gray-500">测试数据集</label>
                        <div className="text-sm font-medium">{run.dataset}</div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">开始时间</label>
                        <div className="text-sm font-medium">{formatDate(run.startTime)}</div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">进度</label>
                        <div className="text-sm font-medium">
                          {run.processedQuestions}/{run.totalQuestions}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">完成度</label>
                        <div className="text-sm font-medium">
                          {Math.round((run.processedQuestions / run.totalQuestions) * 100)}%
                        </div>
                      </div>
                    </div>

                    {/* 进度条 */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          run.status === 'completed' ? 'bg-green-600' :
                          run.status === 'running' ? 'bg-blue-600' :
                          run.status === 'failed' ? 'bg-red-600' : 'bg-gray-400'
                        }`}
                        style={{ width: `${(run.processedQuestions / run.totalQuestions) * 100}%` }}
                      />
                    </div>

                    {/* 评测指标 */}
                    {run.metrics && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">评测指标</h4>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="text-xs text-blue-600">Hit@5</div>
                            <div className="text-lg font-bold text-blue-900">{run.metrics.hitAt5}%</div>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="text-xs text-green-600">Hit@10</div>
                            <div className="text-lg font-bold text-green-900">{run.metrics.hitAt10}%</div>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <div className="text-xs text-purple-600">MRR</div>
                            <div className="text-lg font-bold text-purple-900">{run.metrics.mrr}</div>
                          </div>
                          <div className="p-3 bg-orange-50 rounded-lg">
                            <div className="text-xs text-orange-600">nDCG</div>
                            <div className="text-lg font-bold text-orange-900">{run.metrics.ndcg}</div>
                          </div>
                          <div className="p-3 bg-red-50 rounded-lg">
                            <div className="text-xs text-red-600">事实性</div>
                            <div className="text-lg font-bold text-red-900">{run.metrics.factuality}%</div>
                          </div>
                          <div className="p-3 bg-indigo-50 rounded-lg">
                            <div className="text-xs text-indigo-600">引用覆盖</div>
                            <div className="text-lg font-bold text-indigo-900">{run.metrics.citationCoverage}%</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">查看详情</Button>
                      <Button size="sm" variant="outline">下载报告</Button>
                      {run.status === 'failed' && (
                        <Button size="sm" variant="outline">
                          <PlayIcon className="h-4 w-4 mr-1" />
                          重新运行
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="datasets" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {datasets.map((dataset) => (
              <Card key={dataset.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{dataset.name}</CardTitle>
                    <Badge variant="outline">{dataset.size} 条</Badge>
                  </div>
                  <CardDescription>{dataset.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500">数据类别</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {dataset.categories.map((category, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500">数据质量</label>
                        <div className="text-sm font-medium">{dataset.quality}%</div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">最后更新</label>
                        <div className="text-sm font-medium">{formatDate(dataset.lastUpdated)}</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <DocumentTextIcon className="h-4 w-4 mr-1" />
                        查看样本
                      </Button>
                      <Button size="sm" variant="outline">
                        <BeakerIcon className="h-4 w-4 mr-1" />
                        运行评测
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>数据集管理</CardTitle>
              <CardDescription>管理评测数据集，支持数据导入和质量检查</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  上传数据集
                </Button>
                <Button variant="outline">从对话生成</Button>
                <Button variant="outline">质量检查</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>模型性能对比</CardTitle>
                <CardDescription>当前模型与基准模型的性能对比</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={benchmarkData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="model" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hitAt5" fill="#3b82f6" name="Hit@5" />
                    <Bar dataKey="factuality" fill="#10b981" name="事实性" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>综合能力雷达图</CardTitle>
                <CardDescription>多维度能力对比分析</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Radar name="当前模型" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Radar name="对比模型" dataKey="B" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>性能趋势</CardTitle>
              <CardDescription>过去30天的模型性能变化趋势</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="hitAt5" stroke="#3b82f6" strokeWidth={2} name="Hit@5" />
                  <Line type="monotone" dataKey="factuality" stroke="#10b981" strokeWidth={2} name="事实性" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>实时指标</CardTitle>
                <CardDescription>当前系统的实时性能指标</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Hit@5 率</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold">78.4%</span>
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">响应时间</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold">1.8s</span>
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">无答案率</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold">15.2%</span>
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>系统健康</CardTitle>
                <CardDescription>各组件运行状态</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">知识库服务</span>
                    <Badge variant="success">正常</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">检索服务</span>
                    <Badge variant="success">正常</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">LLM 网关</span>
                    <Badge variant="warning">延迟</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">向量数据库</span>
                    <Badge variant="success">正常</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>告警中心</CardTitle>
                <CardDescription>最近的系统告警</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border-l-4 border-yellow-400 bg-yellow-50">
                    <div className="flex items-center space-x-2">
                      <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">响应时间异常</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      P95 响应时间超过 3s 阈值
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-red-400 bg-red-50">
                    <div className="flex items-center space-x-2">
                      <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">命中率下降</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Hit@5 率低于 80% 阈值
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>自动化评测</CardTitle>
              <CardDescription>配置定期自动评测任务</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">每日基准测试</h4>
                    <p className="text-sm text-gray-500">每天凌晨 2:00 自动运行基准评测</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="success">启用</Badge>
                    <Button size="sm" variant="outline">配置</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">周度全量评测</h4>
                    <p className="text-sm text-gray-500">每周日运行完整的评测套件</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="success">启用</Badge>
                    <Button size="sm" variant="outline">配置</Button>
                  </div>
                </div>

                <Button className="w-full">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  添加自动化任务
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
