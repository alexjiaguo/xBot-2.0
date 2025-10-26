'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/lib/utils'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

const knowledgeSources = [
  {
    id: 1,
    name: 'FAQ 知识库',
    type: 'faq',
    status: 'active',
    documents: 2341,
    lastSync: '2024-01-15T10:30:00Z',
    syncStatus: 'success',
  },
  {
    id: 2,
    name: '产品资料库',
    type: 'product',
    status: 'active',
    documents: 1876,
    lastSync: '2024-01-15T09:15:00Z',
    syncStatus: 'success',
  },
  {
    id: 3,
    name: '邮件政策库',
    type: 'email',
    status: 'syncing',
    documents: 934,
    lastSync: '2024-01-15T11:00:00Z',
    syncStatus: 'syncing',
  },
  {
    id: 4,
    name: 'Sharepoint 文档',
    type: 'sharepoint',
    status: 'active',
    documents: 1456,
    lastSync: '2024-01-15T08:45:00Z',
    syncStatus: 'success',
  },
  {
    id: 5,
    name: 'Wire 知识库',
    type: 'wire',
    status: 'error',
    documents: 456,
    lastSync: '2024-01-14T16:20:00Z',
    syncStatus: 'error',
  },
]

const recentDocuments = [
  {
    id: 1,
    title: '常见问题解答 - 产品功能',
    source: 'FAQ',
    chunks: 24,
    status: 'processed',
    createdAt: '2024-01-15T08:30:00Z',
  },
  {
    id: 2,
    title: '产品规格说明书 v2.1',
    source: '产品资料库',
    chunks: 18,
    status: 'processing',
    createdAt: '2024-01-15T07:45:00Z',
  },
  {
    id: 3,
    title: '邮件政策与规范',
    source: '邮件政策库',
    chunks: 12,
    status: 'failed',
    createdAt: '2024-01-15T06:20:00Z',
  },
  {
    id: 4,
    title: 'Sharepoint 技术文档',
    source: 'Sharepoint',
    chunks: 15,
    status: 'processed',
    createdAt: '2024-01-14T18:10:00Z',
  },
  {
    id: 5,
    title: 'Wire 知识库文档',
    source: 'Wire',
    chunks: 12,
    status: 'failed',
    createdAt: '2024-01-14T16:20:00Z',
  },
]

const syncTasks = [
  {
    id: 1,
    source: 'FAQ',
    type: 'incremental',
    status: 'completed',
    processed: 45,
    total: 45,
    startTime: '2024-01-15T10:00:00Z',
    endTime: '2024-01-15T10:15:00Z',
  },
  {
    id: 2,
    source: '产品资料库',
    type: 'full',
    status: 'running',
    processed: 234,
    total: 456,
    startTime: '2024-01-15T09:30:00Z',
    endTime: null,
  },
  {
    id: 3,
    source: '邮件政策库',
    type: 'incremental',
    status: 'completed',
    processed: 78,
    total: 78,
    startTime: '2024-01-15T08:45:00Z',
    endTime: '2024-01-15T09:00:00Z',
  },
  {
    id: 4,
    source: 'Sharepoint',
    type: 'full',
    status: 'completed',
    processed: 156,
    total: 156,
    startTime: '2024-01-15T08:00:00Z',
    endTime: '2024-01-15T08:30:00Z',
  },
  {
    id: 5,
    source: 'Wire',
    type: 'incremental',
    status: 'failed',
    processed: 12,
    total: 45,
    startTime: '2024-01-14T16:00:00Z',
    endTime: null,
  },
]

const statusColors = {
  active: 'success',
  syncing: 'warning',
  error: 'destructive',
  inactive: 'secondary',
} as const

const syncStatusColors = {
  success: 'success',
  syncing: 'warning',
  error: 'destructive',
} as const

const docStatusColors = {
  processed: 'success',
  processing: 'warning',
  failed: 'destructive',
} as const

export default function KnowledgePage() {
  const [selectedTab, setSelectedTab] = useState('sources')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">知识库管理</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
            搜索文档
          </Button>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            添加数据源
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="sources">数据源</TabsTrigger>
          <TabsTrigger value="documents">文档管理</TabsTrigger>
          <TabsTrigger value="sync">同步任务</TabsTrigger>
          <TabsTrigger value="settings">设置</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {knowledgeSources.map((source) => (
              <Card key={source.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{source.name}</CardTitle>
                    <Badge variant={statusColors[source.status as keyof typeof statusColors]}>
                      {source.status === 'active' ? '正常' :
                       source.status === 'syncing' ? '同步中' :
                       source.status === 'error' ? '错误' : '未激活'}
                    </Badge>
                  </div>
                  <CardDescription>
                    {source.type === 'faq' ? 'FAQ 问答库' :
                     source.type === 'product' ? '产品资料库' :
                     source.type === 'email' ? '邮件政策库' :
                     source.type === 'sharepoint' ? 'Sharepoint 文档库' :
                     'Wire 知识库'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">文档数量:</span>
                      <span className="font-medium">{source.documents}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">最后同步:</span>
                      <span className="font-medium">{formatDate(source.lastSync)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">同步状态:</span>
                      <Badge variant={syncStatusColors[source.syncStatus as keyof typeof syncStatusColors]} className="text-xs">
                        {source.syncStatus === 'success' ? '成功' :
                         source.syncStatus === 'syncing' ? '同步中' : '失败'}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm" variant="outline">配置</Button>
                    <Button size="sm" variant="outline">
                      <CloudArrowUpIcon className="h-4 w-4 mr-1" />
                      同步
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>最近处理的文档</CardTitle>
              <CardDescription>显示最近上传和处理的知识文档</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <DocumentIcon className="h-8 w-8 text-gray-400" />
                      <div>
                        <h4 className="font-medium">{doc.title}</h4>
                        <p className="text-sm text-gray-500">
                          来源: {doc.source} • {doc.chunks} 个切片 • {formatDate(doc.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={docStatusColors[doc.status as keyof typeof docStatusColors]}>
                        {doc.status === 'processed' ? '已处理' :
                         doc.status === 'processing' ? '处理中' : '失败'}
                      </Badge>
                      <Button size="sm" variant="outline">查看</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>同步任务</CardTitle>
              <CardDescription>监控知识库同步任务的执行状态</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syncTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {task.status === 'completed' && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
                        {task.status === 'running' && <ClockIcon className="h-5 w-5 text-yellow-500" />}
                        {task.status === 'failed' && <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />}
                      </div>
                      <div>
                        <h4 className="font-medium">{task.source} - {task.type === 'full' ? '全量同步' : '增量同步'}</h4>
                        <p className="text-sm text-gray-500">
                          {task.processed}/{task.total} 已处理 • 开始时间: {formatDate(task.startTime)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(task.processed / task.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500">
                        {Math.round((task.processed / task.total) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>知识库设置</CardTitle>
              <CardDescription>配置知识库的处理和同步参数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">切片设置</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">目标 Token 数</label>
                      <div className="text-sm font-medium">800</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">重叠 Token 数</label>
                      <div className="text-sm font-medium">100</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Embedding 模型</h4>
                  <div className="text-sm">bge-m3-cn</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">同步频率</h4>
                  <div className="text-sm">每6小时检查一次增量更新</div>
                </div>
                <Button>保存设置</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
