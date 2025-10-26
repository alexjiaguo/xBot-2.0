'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/lib/utils'
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  TagIcon,
} from '@heroicons/react/24/outline'

const conversations = [
  {
    id: 1,
    userId: 'user_12345',
    channel: 'web',
    startTime: '2024-01-15T10:30:00Z',
    endTime: '2024-01-15T10:35:00Z',
    messages: 8,
    status: 'completed',
    satisfaction: 4,
    tags: ['产品咨询', '价格'],
    hasIssue: false,
  },
  {
    id: 2,
    userId: 'user_67890',
    channel: 'app',
    startTime: '2024-01-15T10:25:00Z',
    endTime: '2024-01-15T10:32:00Z',
    messages: 12,
    status: 'escalated',
    satisfaction: 2,
    tags: ['技术问题', '无答案'],
    hasIssue: true,
  },
  {
    id: 3,
    userId: 'user_54321',
    channel: 'wechat',
    startTime: '2024-01-15T10:20:00Z',
    endTime: '2024-01-15T10:28:00Z',
    messages: 6,
    status: 'completed',
    satisfaction: 5,
    tags: ['使用指南'],
    hasIssue: false,
  },
]

const failureClusters = [
  {
    id: 1,
    pattern: '无法找到相关文档',
    count: 45,
    examples: ['如何重置密码', '账户被锁定怎么办', '忘记用户名'],
    category: '知识缺失',
    priority: 'high',
  },
  {
    id: 2,
    pattern: '答案不准确',
    count: 23,
    examples: ['价格信息过期', '功能描述错误', '联系方式错误'],
    category: '内容质量',
    priority: 'medium',
  },
  {
    id: 3,
    pattern: '理解错误',
    count: 18,
    examples: ['意图识别失败', '上下文理解错误', '多轮对话断裂'],
    category: '模型能力',
    priority: 'medium',
  },
]

const feedbackStats = [
  { rating: 5, count: 234, percentage: 45 },
  { rating: 4, count: 156, percentage: 30 },
  { rating: 3, count: 78, percentage: 15 },
  { rating: 2, count: 34, percentage: 7 },
  { rating: 1, count: 15, percentage: 3 },
]

const statusColors = {
  completed: 'success',
  escalated: 'destructive',
  ongoing: 'warning',
} as const

const priorityColors = {
  high: 'destructive',
  medium: 'warning',
  low: 'secondary',
} as const

export default function ConversationsPage() {
  const [selectedTab, setSelectedTab] = useState('list')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">对话管理</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
            搜索对话
          </Button>
          <Button variant="outline">导出数据</Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="list">对话列表</TabsTrigger>
          <TabsTrigger value="feedback">用户反馈</TabsTrigger>
          <TabsTrigger value="failures">失败分析</TabsTrigger>
          <TabsTrigger value="replay">对话回放</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>最近对话</CardTitle>
              <CardDescription>显示最新的用户对话记录和状态</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversations.map((conv) => (
                  <div key={conv.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <ChatBubbleLeftRightIcon className="h-8 w-8 text-gray-400" />
                      <div>
                        <h4 className="font-medium">对话 #{conv.id}</h4>
                        <p className="text-sm text-gray-500">
                          用户: {conv.userId} • 渠道: {conv.channel} • {conv.messages} 条消息
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(conv.startTime)} - {formatDate(conv.endTime)}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {conv.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <TagIcon className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < conv.satisfaction ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">满意度: {conv.satisfaction}/5</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {conv.hasIssue && <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />}
                        <Badge variant={statusColors[conv.status as keyof typeof statusColors]}>
                          {conv.status === 'completed' ? '已完成' :
                           conv.status === 'escalated' ? '已升级' : '进行中'}
                        </Badge>
                        <Button size="sm" variant="outline">查看详情</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>满意度分布</CardTitle>
                <CardDescription>用户对对话质量的评分分布</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedbackStats.map((stat) => (
                    <div key={stat.rating} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{stat.rating} 星</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-xs ${
                                i < stat.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${stat.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 w-8">{stat.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>反馈趋势</CardTitle>
                <CardDescription>过去30天的用户满意度变化</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40 text-gray-500">
                  <p>满意度趋势图 (需要图表组件)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="failures" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>失败簇分析</CardTitle>
              <CardDescription>自动识别的对话失败模式和建议修复方案</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {failureClusters.map((cluster) => (
                  <div key={cluster.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{cluster.pattern}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant={priorityColors[cluster.priority as keyof typeof priorityColors]}>
                          {cluster.priority === 'high' ? '高优先级' :
                           cluster.priority === 'medium' ? '中优先级' : '低优先级'}
                        </Badge>
                        <span className="text-sm text-gray-500">{cluster.count} 次出现</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">分类: {cluster.category}</p>
                      <p className="text-sm text-gray-600">典型示例:</p>
                      <ul className="list-disc list-inside text-sm text-gray-500 ml-2">
                        {cluster.examples.map((example, index) => (
                          <li key={index}>{example}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">生成修复任务</Button>
                      <Button size="sm" variant="outline">查看详细对话</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="replay" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>对话回放</CardTitle>
              <CardDescription>回放和分析具体的对话过程，支持按 trace ID 搜索</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="输入 Trace ID 或对话 ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button>搜索</Button>
                </div>
                <div className="text-center py-12 text-gray-500">
                  <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>输入 Trace ID 开始回放对话</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
