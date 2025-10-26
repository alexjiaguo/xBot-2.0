'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatNumber, formatPercentage } from '@/lib/utils'
import {
  ChartBarIcon,
  CircleStackIcon as DatabaseIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const stats = [
  {
    name: '知识库文档数',
    value: 12847,
    change: '+12%',
    changeType: 'positive',
    icon: DatabaseIcon,
  },
  {
    name: '今日对话量',
    value: 3421,
    change: '+8%',
    changeType: 'positive',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: '检索命中率',
    value: '68%',
    change: '+5%',
    changeType: 'positive',
    icon: ChartBarIcon,
  },
  {
    name: '无答案率',
    value: '15%',
    change: '-3%',
    changeType: 'positive',
    icon: ExclamationTriangleIcon,
  },
]

const hitRateData = [
  { name: '周一', value: 65 },
  { name: '周二', value: 67 },
  { name: '周三', value: 70 },
  { name: '周四', value: 68 },
  { name: '周五', value: 72 },
  { name: '周六', value: 69 },
  { name: '周日', value: 68 },
]

const conversationData = [
  { name: '00:00', value: 120 },
  { name: '04:00', value: 80 },
  { name: '08:00', value: 340 },
  { name: '12:00', value: 520 },
  { name: '16:00', value: 480 },
  { name: '20:00', value: 290 },
]

const recentTasks = [
  { id: 1, title: 'FAQ 更新任务', status: 'completed', priority: 'high', time: '2小时前' },
  { id: 2, title: 'Prompt 版本发布', status: 'in-progress', priority: 'medium', time: '4小时前' },
  { id: 3, title: '知识库同步', status: 'pending', priority: 'low', time: '1天前' },
  { id: 4, title: 'Agent 性能评测', status: 'completed', priority: 'high', time: '2天前' },
]

const statusColors = {
  completed: 'success',
  'in-progress': 'warning',
  pending: 'secondary',
} as const

const priorityColors = {
  high: 'destructive',
  medium: 'warning',
  low: 'secondary',
} as const

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">控制台概览</h1>
        <Button>刷新数据</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span>{' '}
                较上周
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>检索命中率趋势</CardTitle>
            <CardDescription>过去7天的检索命中率变化</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hitRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>对话量分布</CardTitle>
            <CardDescription>今日24小时对话量分布</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>最近任务</CardTitle>
          <CardDescription>系统运营相关的最新任务和状态</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {task.status === 'completed' && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
                    {task.status === 'in-progress' && <ClockIcon className="h-5 w-5 text-yellow-500" />}
                    {task.status === 'pending' && <ExclamationTriangleIcon className="h-5 w-5 text-gray-400" />}
                  </div>
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-gray-500">{task.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={priorityColors[task.priority as keyof typeof priorityColors]}>
                    {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                  </Badge>
                  <Badge variant={statusColors[task.status as keyof typeof statusColors]}>
                    {task.status === 'completed' ? '已完成' : 
                     task.status === 'in-progress' ? '进行中' : '待处理'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
