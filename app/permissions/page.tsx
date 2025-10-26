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
  ShieldCheckIcon,
  KeyIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

const users = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@company.com',
    role: 'admin',
    department: '技术部',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
    permissions: ['knowledge:read', 'knowledge:write', 'conversation:read', 'prompt:write', 'agent:admin'],
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@company.com',
    role: 'operator',
    department: '客服部',
    status: 'active',
    lastLogin: '2024-01-15T09:15:00Z',
    permissions: ['knowledge:read', 'conversation:read', 'conversation:write', 'prompt:read'],
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@company.com',
    role: 'viewer',
    department: '产品部',
    status: 'inactive',
    lastLogin: '2024-01-12T16:20:00Z',
    permissions: ['knowledge:read', 'conversation:read', 'analytics:read'],
  },
  {
    id: 4,
    name: '赵六',
    email: 'zhaoliu@company.com',
    role: 'analyst',
    department: '数据部',
    status: 'active',
    lastLogin: '2024-01-15T08:45:00Z',
    permissions: ['analytics:read', 'analytics:write', 'evaluation:read', 'conversation:read'],
  },
]

const roles = [
  {
    id: 1,
    name: 'admin',
    displayName: '系统管理员',
    description: '拥有所有权限，可以管理用户和系统配置',
    userCount: 2,
    permissions: [
      'knowledge:admin', 'conversation:admin', 'prompt:admin', 
      'agent:admin', 'evaluation:admin', 'analytics:admin', 'user:admin'
    ],
    color: 'destructive',
  },
  {
    id: 2,
    name: 'operator',
    displayName: '运营人员',
    description: '可以管理知识库、对话和Prompt，但无法修改系统设置',
    userCount: 5,
    permissions: [
      'knowledge:read', 'knowledge:write', 'conversation:read', 'conversation:write',
      'prompt:read', 'prompt:write', 'analytics:read'
    ],
    color: 'warning',
  },
  {
    id: 3,
    name: 'analyst',
    displayName: '数据分析师',
    description: '专注于数据分析和评测，可查看所有报告和指标',
    userCount: 3,
    permissions: [
      'analytics:read', 'analytics:write', 'evaluation:read', 'evaluation:write',
      'conversation:read', 'knowledge:read'
    ],
    color: 'secondary',
  },
  {
    id: 4,
    name: 'viewer',
    displayName: '只读用户',
    description: '只能查看基本信息，无法进行任何修改操作',
    userCount: 8,
    permissions: ['knowledge:read', 'conversation:read', 'analytics:read'],
    color: 'outline',
  },
]

const permissions = [
  {
    module: '知识库管理',
    permissions: [
      { key: 'knowledge:read', name: '查看知识库', description: '查看知识库内容和统计信息' },
      { key: 'knowledge:write', name: '编辑知识库', description: '添加、修改、删除知识库内容' },
      { key: 'knowledge:admin', name: '管理知识库', description: '配置数据源、同步设置等高级功能' },
    ]
  },
  {
    module: '对话管理',
    permissions: [
      { key: 'conversation:read', name: '查看对话', description: '查看对话记录和统计信息' },
      { key: 'conversation:write', name: '管理对话', description: '标注对话、添加反馈等操作' },
      { key: 'conversation:admin', name: '高级管理', description: '配置对话规则、导出数据等' },
    ]
  },
  {
    module: 'Prompt管理',
    permissions: [
      { key: 'prompt:read', name: '查看Prompt', description: '查看Prompt模板和版本信息' },
      { key: 'prompt:write', name: '编辑Prompt', description: '创建、修改Prompt模板' },
      { key: 'prompt:admin', name: '高级管理', description: 'A/B测试、版本发布等高级功能' },
    ]
  },
  {
    module: 'Agent管理',
    permissions: [
      { key: 'agent:read', name: '查看Agent', description: '查看Agent信息和性能指标' },
      { key: 'agent:write', name: '管理Agent', description: '配置Agent参数和工作流' },
      { key: 'agent:admin', name: '高级管理', description: 'Agent部署、监控配置等' },
    ]
  },
  {
    module: '评测监控',
    permissions: [
      { key: 'evaluation:read', name: '查看评测', description: '查看评测结果和监控指标' },
      { key: 'evaluation:write', name: '执行评测', description: '创建和运行评测任务' },
      { key: 'evaluation:admin', name: '高级管理', description: '配置评测规则、告警设置等' },
    ]
  },
  {
    module: '分析报告',
    permissions: [
      { key: 'analytics:read', name: '查看报告', description: '查看分析报告和业务指标' },
      { key: 'analytics:write', name: '生成报告', description: '创建自定义报告和导出数据' },
      { key: 'analytics:admin', name: '高级管理', description: '配置报告模板、数据源等' },
    ]
  },
  {
    module: '用户管理',
    permissions: [
      { key: 'user:read', name: '查看用户', description: '查看用户列表和基本信息' },
      { key: 'user:write', name: '管理用户', description: '添加、修改、禁用用户账户' },
      { key: 'user:admin', name: '权限管理', description: '分配角色、配置权限等' },
    ]
  },
]

const auditLogs = [
  {
    id: 1,
    user: '张三',
    action: '创建用户',
    target: '李四 (lisi@company.com)',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'success',
    ip: '192.168.1.100',
  },
  {
    id: 2,
    user: '李四',
    action: '修改Prompt',
    target: '客服问答 Prompt v2.3',
    timestamp: '2024-01-15T09:15:00Z',
    status: 'success',
    ip: '192.168.1.101',
  },
  {
    id: 3,
    user: '王五',
    action: '尝试删除知识库',
    target: '产品文档库',
    timestamp: '2024-01-15T08:45:00Z',
    status: 'failed',
    ip: '192.168.1.102',
  },
]

const roleColors = {
  admin: 'destructive',
  operator: 'warning',
  analyst: 'secondary',
  viewer: 'outline',
} as const

const statusColors = {
  active: 'success',
  inactive: 'secondary',
  suspended: 'destructive',
} as const

const actionStatusColors = {
  success: 'success',
  failed: 'destructive',
  warning: 'warning',
} as const

export default function PermissionsPage() {
  const [selectedTab, setSelectedTab] = useState('users')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">权限管理</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <KeyIcon className="h-4 w-4 mr-2" />
            导出权限
          </Button>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            添加用户
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="users">用户管理</TabsTrigger>
          <TabsTrigger value="roles">角色管理</TabsTrigger>
          <TabsTrigger value="permissions">权限配置</TabsTrigger>
          <TabsTrigger value="audit">审计日志</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>用户列表</CardTitle>
              <CardDescription>管理系统用户账户和权限分配</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">
                          {user.department} • 最后登录: {formatDate(user.lastLogin)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge variant={roleColors[user.role as keyof typeof roleColors]}>
                          {user.role === 'admin' ? '管理员' :
                           user.role === 'operator' ? '运营人员' :
                           user.role === 'analyst' ? '分析师' : '只读用户'}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {user.permissions.length} 项权限
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={statusColors[user.status as keyof typeof statusColors]}>
                          {user.status === 'active' ? '活跃' :
                           user.status === 'inactive' ? '未激活' : '已停用'}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{role.displayName}</CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
                    <Badge variant={role.color as "default" | "warning" | "success" | "secondary" | "destructive" | "outline"}>
                      {role.userCount} 用户
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">包含权限</h4>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((permission, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {permission.split(':')[0]}:{permission.split(':')[1]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <PencilIcon className="h-4 w-4 mr-1" />
                        编辑
                      </Button>
                      <Button size="sm" variant="outline">
                        <UserGroupIcon className="h-4 w-4 mr-1" />
                        用户
                      </Button>
                      {role.name !== 'admin' && (
                        <Button size="sm" variant="outline">
                          <TrashIcon className="h-4 w-4 mr-1" />
                          删除
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>创建新角色</CardTitle>
              <CardDescription>根据业务需求创建自定义角色</CardDescription>
            </CardHeader>
            <CardContent>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                创建角色
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <div className="space-y-6">
            {permissions.map((module) => (
              <Card key={module.module}>
                <CardHeader>
                  <CardTitle className="text-lg">{module.module}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {module.permissions.map((permission) => (
                      <div key={permission.key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{permission.name}</h4>
                          <p className="text-sm text-gray-500">{permission.description}</p>
                          <p className="text-xs text-gray-400">权限标识: {permission.key}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {permission.key.split(':')[1]}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>审计日志</CardTitle>
              <CardDescription>记录所有用户操作和权限变更</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {log.status === 'success' && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
                        {log.status === 'failed' && <XCircleIcon className="h-5 w-5 text-red-500" />}
                        {log.status === 'warning' && <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />}
                      </div>
                      <div>
                        <h4 className="font-medium">{log.user} - {log.action}</h4>
                        <p className="text-sm text-gray-500">目标: {log.target}</p>
                        <p className="text-xs text-gray-400">
                          {formatDate(log.timestamp)} • IP: {log.ip}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={actionStatusColors[log.status as keyof typeof actionStatusColors]}>
                        {log.status === 'success' ? '成功' :
                         log.status === 'failed' ? '失败' : '警告'}
                      </Badge>
                      <Button size="sm" variant="outline">详情</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>审计配置</CardTitle>
              <CardDescription>配置审计日志的记录规则和保留策略</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">用户登录日志</h4>
                    <p className="text-sm text-gray-500">记录所有用户登录和登出操作</p>
                  </div>
                  <Badge variant="success">启用</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">权限变更日志</h4>
                    <p className="text-sm text-gray-500">记录角色和权限的所有变更操作</p>
                  </div>
                  <Badge variant="success">启用</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">数据操作日志</h4>
                    <p className="text-sm text-gray-500">记录知识库、Prompt等重要数据的修改</p>
                  </div>
                  <Badge variant="success">启用</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">系统配置日志</h4>
                    <p className="text-sm text-gray-500">记录系统设置和配置的变更</p>
                  </div>
                  <Badge variant="warning">部分启用</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
