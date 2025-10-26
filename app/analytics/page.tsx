'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate, formatNumber, formatPercentage } from '@/lib/utils'
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { ArrowTrendingUpIcon as TrendingUpIcon, ArrowTrendingDownIcon as TrendingDownIcon } from '@heroicons/react/24/outline'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts'

const businessMetrics = [
  {
    name: '总对话量',
    value: 45672,
    change: '+12.5%',
    changeType: 'positive',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: '活跃用户数',
    value: 8934,
    change: '+8.2%',
    changeType: 'positive',
    icon: UserGroupIcon,
  },
  {
    name: '平均解决时间',
    value: '2.3分钟',
    change: '-15.3%',
    changeType: 'positive',
    icon: ClockIcon,
  },
  {
    name: '用户满意度',
    value: '4.2/5',
    change: '+0.3',
    changeType: 'positive',
    icon: TrendingUpIcon,
  },
]

const conversationTrendData = [
  { date: '01-01', conversations: 1200, resolved: 1080, escalated: 120 },
  { date: '01-02', conversations: 1350, resolved: 1215, escalated: 135 },
  { date: '01-03', conversations: 1100, resolved: 1000, escalated: 100 },
  { date: '01-04', conversations: 1400, resolved: 1260, escalated: 140 },
  { date: '01-05', conversations: 1600, resolved: 1440, escalated: 160 },
  { date: '01-06', conversations: 1800, resolved: 1620, escalated: 180 },
  { date: '01-07', conversations: 2000, resolved: 1800, escalated: 200 },
]

const categoryDistribution = [
  { name: '产品咨询', value: 35, count: 15988 },
  { name: '技术支持', value: 28, count: 12788 },
  { name: '订单问题', value: 20, count: 9134 },
  { name: '账户问题', value: 12, count: 5481 },
  { name: '其他', value: 5, count: 2281 },
]

const satisfactionTrendData = [
  { date: '01-01', satisfaction: 4.1, responseTime: 2.8 },
  { date: '01-02', satisfaction: 4.0, responseTime: 2.9 },
  { date: '01-03', satisfaction: 4.2, responseTime: 2.6 },
  { date: '01-04', satisfaction: 4.1, responseTime: 2.7 },
  { date: '01-05', satisfaction: 4.3, responseTime: 2.4 },
  { date: '01-06', satisfaction: 4.2, responseTime: 2.5 },
  { date: '01-07', satisfaction: 4.4, responseTime: 2.2 },
]

const channelPerformance = [
  { channel: '网页端', conversations: 18234, satisfaction: 4.3, resolution: 92.1 },
  { channel: '移动应用', conversations: 15672, satisfaction: 4.2, resolution: 89.5 },
  { channel: '微信小程序', conversations: 8934, satisfaction: 4.0, resolution: 87.3 },
  { channel: 'API接入', conversations: 2832, satisfaction: 4.1, resolution: 90.8 },
]

const timeDistribution = [
  { hour: '00:00', count: 156 },
  { hour: '02:00', count: 89 },
  { hour: '04:00', count: 67 },
  { hour: '06:00', count: 234 },
  { hour: '08:00', count: 456 },
  { hour: '10:00', count: 678 },
  { hour: '12:00', count: 789 },
  { hour: '14:00', count: 567 },
  { hour: '16:00', count: 543 },
  { hour: '18:00', count: 432 },
  { hour: '20:00', count: 345 },
  { hour: '22:00', count: 234 },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const reports = [
  {
    id: 1,
    name: 'Q1 季度业务报告',
    description: '第一季度完整的业务分析报告',
    type: 'quarterly',
    status: 'completed',
    generatedAt: '2024-01-15T10:00:00Z',
    size: '2.3MB',
  },
  {
    id: 2,
    name: '用户满意度专项分析',
    description: '深度分析用户满意度变化趋势和影响因素',
    type: 'custom',
    status: 'completed',
    generatedAt: '2024-01-12T14:30:00Z',
    size: '1.8MB',
  },
  {
    id: 3,
    name: '12月月度运营报告',
    description: '12月份的运营数据汇总和分析',
    type: 'monthly',
    status: 'completed',
    generatedAt: '2024-01-01T09:00:00Z',
    size: '1.5MB',
  },
]

export default function AnalyticsPage() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [dateRange, setDateRange] = useState('7d')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">分析报告</h1>
        <div className="flex space-x-2">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1d">最近1天</option>
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
          </select>
          <Button variant="outline">
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            导出报告
          </Button>
          <Button>
            <ChartBarIcon className="h-4 w-4 mr-2" />
            生成报告
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">业务概览</TabsTrigger>
          <TabsTrigger value="performance">性能分析</TabsTrigger>
          <TabsTrigger value="user">用户行为</TabsTrigger>
          <TabsTrigger value="reports">报告管理</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* 核心指标卡片 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {businessMetrics.map((metric) => (
              <Card key={metric.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {metric.name}
                  </CardTitle>
                  <metric.icon className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    {metric.changeType === 'positive' ? (
                      <TrendingUpIcon className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDownIcon className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                      {metric.change}
                    </span>
                    {' '}较上期
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 对话趋势图 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>对话量趋势</CardTitle>
                <CardDescription>过去7天的对话量变化趋势</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={conversationTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="conversations" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="resolved" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>问题分类分布</CardTitle>
                <CardDescription>不同类型问题的占比情况</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* 满意度和响应时间趋势 */}
          <Card>
            <CardHeader>
              <CardTitle>满意度与响应时间趋势</CardTitle>
              <CardDescription>用户满意度和平均响应时间的关联分析</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={satisfactionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="satisfaction" stroke="#3b82f6" strokeWidth={2} name="满意度" />
                  <Line yAxisId="right" type="monotone" dataKey="responseTime" stroke="#ef4444" strokeWidth={2} name="响应时间(分钟)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* 渠道性能对比 */}
          <Card>
            <CardHeader>
              <CardTitle>渠道性能对比</CardTitle>
              <CardDescription>不同接入渠道的表现对比分析</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channelPerformance.map((channel, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full bg-${COLORS[index % COLORS.length]}`} />
                      <div>
                        <h4 className="font-medium">{channel.channel}</h4>
                        <p className="text-sm text-gray-500">{formatNumber(channel.conversations)} 次对话</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 text-right">
                      <div>
                        <div className="text-sm font-medium">{channel.satisfaction}/5</div>
                        <div className="text-xs text-gray-500">满意度</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{channel.resolution}%</div>
                        <div className="text-xs text-gray-500">解决率</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 时间分布热力图 */}
          <Card>
            <CardHeader>
              <CardTitle>对话时间分布</CardTitle>
              <CardDescription>24小时内对话量的分布情况</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>用户活跃度</CardTitle>
                <CardDescription>用户使用频次和活跃时间分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-900">2,341</div>
                      <div className="text-sm text-blue-600">新用户</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-900">6,593</div>
                      <div className="text-sm text-green-600">回访用户</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-900">3.2</div>
                      <div className="text-sm text-purple-600">平均会话数</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>用户反馈分析</CardTitle>
                <CardDescription>用户反馈情感分析和分类统计</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">正面反馈</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '72%' }} />
                      </div>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">中性反馈</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '18%' }} />
                      </div>
                      <span className="text-sm font-medium">18%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">负面反馈</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: '10%' }} />
                      </div>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>用户行为路径</CardTitle>
              <CardDescription>分析用户在对话中的典型行为模式</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">典型成功路径</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-blue-100 rounded">问题描述</span>
                    <span>→</span>
                    <span className="px-2 py-1 bg-green-100 rounded">信息确认</span>
                    <span>→</span>
                    <span className="px-2 py-1 bg-purple-100 rounded">解决方案</span>
                    <span>→</span>
                    <span className="px-2 py-1 bg-yellow-100 rounded">满意确认</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">转化率: 87.3% | 平均时长: 2.1分钟</div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">常见失败路径</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-blue-100 rounded">问题描述</span>
                    <span>→</span>
                    <span className="px-2 py-1 bg-red-100 rounded">理解失败</span>
                    <span>→</span>
                    <span className="px-2 py-1 bg-orange-100 rounded">人工转接</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">发生率: 12.7% | 平均时长: 4.8分钟</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>报告列表</CardTitle>
              <CardDescription>查看和管理已生成的分析报告</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <DocumentArrowDownIcon className="h-8 w-8 text-gray-400" />
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-gray-500">{report.description}</p>
                        <p className="text-xs text-gray-400">
                          生成时间: {formatDate(report.generatedAt)} • 大小: {report.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={report.type === 'quarterly' ? 'success' : 
                                   report.type === 'monthly' ? 'warning' : 'secondary'}>
                        {report.type === 'quarterly' ? '季度报告' :
                         report.type === 'monthly' ? '月度报告' : '专项报告'}
                      </Badge>
                      <Button size="sm" variant="outline">下载</Button>
                      <Button size="sm" variant="outline">分享</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>自定义报告</CardTitle>
              <CardDescription>创建个性化的分析报告</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">报告类型</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>业务概览报告</option>
                      <option>性能分析报告</option>
                      <option>用户行为报告</option>
                      <option>自定义报告</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">时间范围</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>最近7天</option>
                      <option>最近30天</option>
                      <option>最近90天</option>
                      <option>自定义时间</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">包含指标</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['对话量', '满意度', '解决率', '响应时间', '用户活跃度', '渠道分析'].map((metric) => (
                      <label key={metric} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">{metric}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button className="w-full">
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  生成报告
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
