'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/lib/utils'
import {
  CogIcon,
  ServerIcon,
  ShieldCheckIcon,
  BellIcon,
  CloudIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import { CircleStackIcon as DatabaseIcon } from '@heroicons/react/24/outline'

const systemConfig = {
  general: {
    systemName: 'xBot 2.0 AI 运营平台',
    version: 'v2.1.3',
    environment: 'production',
    timezone: 'Asia/Shanghai',
    language: 'zh-CN',
    maxConcurrentUsers: 1000,
    sessionTimeout: 30,
  },
  api: {
    baseUrl: 'https://api.xbot.company.com',
    version: 'v2',
    rateLimit: 1000,
    timeout: 30,
    retryAttempts: 3,
  },
  storage: {
    primaryDatabase: 'PostgreSQL 14.2',
    vectorDatabase: 'Qdrant 1.7.0',
    cacheSystem: 'Redis 7.0',
    fileStorage: 'AWS S3',
    backupFrequency: 'daily',
    retentionPeriod: 90,
  },
}

const integrations = [
  {
    id: 1,
    name: 'Notion',
    description: '知识库同步和内容管理',
    status: 'connected',
    lastSync: '2024-01-15T10:30:00Z',
    config: {
      apiKey: '••••••••••••1234',
      workspaceId: 'workspace-123',
      syncInterval: '6 hours',
    },
  },
  {
    id: 2,
    name: 'Confluence',
    description: '企业文档和知识管理',
    status: 'connected',
    lastSync: '2024-01-15T09:15:00Z',
    config: {
      serverUrl: 'https://company.atlassian.net',
      username: 'api-user',
      token: '••••••••••••5678',
    },
  },
  {
    id: 3,
    name: 'Slack',
    description: '团队协作和通知推送',
    status: 'disconnected',
    lastSync: null,
    config: {
      botToken: '',
      channelId: '',
      webhookUrl: '',
    },
  },
  {
    id: 4,
    name: 'WeChat Work',
    description: '企业微信集成',
    status: 'error',
    lastSync: '2024-01-14T16:20:00Z',
    config: {
      corpId: 'wx••••••••••••1234',
      agentId: '1000001',
      secret: '••••••••••••abcd',
    },
  },
]

const llmProviders = [
  {
    id: 1,
    name: 'OpenAI',
    models: ['gpt-4', 'gpt-3.5-turbo'],
    status: 'active',
    usage: 85.2,
    quota: 100000,
    cost: 1234.56,
    config: {
      apiKey: '••••••••••••sk-1234',
      baseUrl: 'https://api.openai.com/v1',
      organization: 'org-••••••••••••',
    },
  },
  {
    id: 2,
    name: 'Anthropic Claude',
    models: ['claude-3-opus', 'claude-3-sonnet'],
    status: 'active',
    usage: 62.8,
    quota: 50000,
    cost: 892.34,
    config: {
      apiKey: '••••••••••••ant-1234',
      baseUrl: 'https://api.anthropic.com',
    },
  },
  {
    id: 3,
    name: '阿里云千问',
    models: ['qwen-turbo', 'qwen-plus'],
    status: 'inactive',
    usage: 0,
    quota: 30000,
    cost: 0,
    config: {
      apiKey: '••••••••••••ali-1234',
      endpoint: 'https://dashscope.aliyuncs.com/api/v1',
    },
  },
]

const notifications = [
  {
    id: 1,
    type: 'system',
    title: '系统维护通知',
    enabled: true,
    channels: ['email', 'slack'],
    conditions: {
      maintenanceWindow: true,
      criticalUpdates: true,
    },
  },
  {
    id: 2,
    type: 'performance',
    title: '性能告警',
    enabled: true,
    channels: ['email', 'sms', 'slack'],
    conditions: {
      responseTimeThreshold: 5000,
      errorRateThreshold: 5,
      availabilityThreshold: 99,
    },
  },
  {
    id: 3,
    type: 'security',
    title: '安全事件',
    enabled: true,
    channels: ['email', 'sms'],
    conditions: {
      failedLoginAttempts: 5,
      unauthorizedAccess: true,
      dataBreachAlert: true,
    },
  },
  {
    id: 4,
    type: 'business',
    title: '业务指标',
    enabled: false,
    channels: ['email'],
    conditions: {
      dailySummary: true,
      weeklyReport: true,
      monthlyReport: true,
    },
  },
]

const securitySettings = {
  authentication: {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expirationDays: 90,
    },
    mfaEnabled: true,
    ssoEnabled: true,
    sessionTimeout: 30,
  },
  encryption: {
    dataAtRest: 'AES-256',
    dataInTransit: 'TLS 1.3',
    keyRotationPeriod: 90,
  },
  audit: {
    logRetention: 365,
    realTimeMonitoring: true,
    alertOnSuspiciousActivity: true,
  },
}

const statusColors = {
  connected: 'success',
  disconnected: 'secondary',
  error: 'destructive',
  active: 'success',
  inactive: 'secondary',
} as const

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState('general')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">系统设置</h1>
        <div className="flex space-x-2">
          <Button variant="outline">导出配置</Button>
          <Button>保存设置</Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="general">基础设置</TabsTrigger>
          <TabsTrigger value="integrations">集成配置</TabsTrigger>
          <TabsTrigger value="llm">LLM 配置</TabsTrigger>
          <TabsTrigger value="notifications">通知设置</TabsTrigger>
          <TabsTrigger value="security">安全配置</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>系统信息</CardTitle>
                <CardDescription>基本系统配置和环境信息</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">系统名称</label>
                      <input 
                        type="text" 
                        value={systemConfig.general.systemName}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">版本</label>
                      <input 
                        type="text" 
                        value={systemConfig.general.version}
                        disabled
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">环境</label>
                      <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="production">生产环境</option>
                        <option value="staging">预发布环境</option>
                        <option value="development">开发环境</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">时区</label>
                      <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="Asia/Shanghai">Asia/Shanghai</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>性能配置</CardTitle>
                <CardDescription>系统性能和资源限制配置</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">最大并发用户数</label>
                    <input 
                      type="number" 
                      value={systemConfig.general.maxConcurrentUsers}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">会话超时时间 (分钟)</label>
                    <input 
                      type="number" 
                      value={systemConfig.general.sessionTimeout}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">API 速率限制 (请求/分钟)</label>
                    <input 
                      type="number" 
                      value={systemConfig.api.rateLimit}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>存储配置</CardTitle>
              <CardDescription>数据库和存储系统配置信息</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <DatabaseIcon className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">主数据库</span>
                  </div>
                  <div className="text-sm text-gray-600">{systemConfig.storage.primaryDatabase}</div>
                  <Badge variant="success" className="mt-2">正常</Badge>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <ServerIcon className="h-5 w-5 text-green-500" />
                    <span className="font-medium">向量数据库</span>
                  </div>
                  <div className="text-sm text-gray-600">{systemConfig.storage.vectorDatabase}</div>
                  <Badge variant="success" className="mt-2">正常</Badge>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CloudIcon className="h-5 w-5 text-purple-500" />
                    <span className="font-medium">文件存储</span>
                  </div>
                  <div className="text-sm text-gray-600">{systemConfig.storage.fileStorage}</div>
                  <Badge variant="success" className="mt-2">正常</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <CardDescription>{integration.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={statusColors[integration.status as keyof typeof statusColors]}>
                        {integration.status === 'connected' ? '已连接' :
                         integration.status === 'disconnected' ? '未连接' : '错误'}
                      </Badge>
                      {integration.status === 'connected' && integration.lastSync && (
                        <span className="text-xs text-gray-500">
                          最后同步: {formatDate(integration.lastSync)}
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {Object.entries(integration.config).map(([key, value]) => (
                        <div key={key}>
                          <label className="text-sm font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </label>
                          <input 
                            type={key.toLowerCase().includes('token') || key.toLowerCase().includes('key') || key.toLowerCase().includes('secret') ? 'password' : 'text'}
                            value={value}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <LinkIcon className="h-4 w-4 mr-1" />
                        测试连接
                      </Button>
                      {integration.status === 'connected' ? (
                        <Button size="sm" variant="outline">断开连接</Button>
                      ) : (
                        <Button size="sm">连接</Button>
                      )}
                      <Button size="sm" variant="outline">配置</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="llm" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {llmProviders.map((provider) => (
              <Card key={provider.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                      <CardDescription>
                        模型: {provider.models.join(', ')}
                      </CardDescription>
                    </div>
                    <Badge variant={statusColors[provider.status as keyof typeof statusColors]}>
                      {provider.status === 'active' ? '活跃' : '未激活'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 使用统计 */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-900">{provider.usage}%</div>
                        <div className="text-sm text-blue-600">使用率</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-900">{provider.quota.toLocaleString()}</div>
                        <div className="text-sm text-green-600">配额</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-900">¥{provider.cost}</div>
                        <div className="text-sm text-purple-600">本月费用</div>
                      </div>
                    </div>

                    {/* 使用率进度条 */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>配额使用情况</span>
                        <span>{provider.usage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            provider.usage > 90 ? 'bg-red-600' :
                            provider.usage > 70 ? 'bg-yellow-600' : 'bg-green-600'
                          }`}
                          style={{ width: `${provider.usage}%` }}
                        />
                      </div>
                    </div>

                    {/* 配置信息 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {Object.entries(provider.config).map(([key, value]) => (
                        <div key={key}>
                          <label className="text-sm font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </label>
                          <input 
                            type={key.toLowerCase().includes('key') ? 'password' : 'text'}
                            value={value}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">测试连接</Button>
                      <Button size="sm" variant="outline">查看使用详情</Button>
                      {provider.status === 'active' ? (
                        <Button size="sm" variant="outline">暂停使用</Button>
                      ) : (
                        <Button size="sm">启用</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>LLM 网关配置</CardTitle>
              <CardDescription>配置 LLM 请求路由和负载均衡</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">默认模型</label>
                    <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>gpt-4</option>
                      <option>claude-3-opus</option>
                      <option>qwen-turbo</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">负载均衡策略</label>
                    <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>轮询</option>
                      <option>加权轮询</option>
                      <option>最少连接</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {notifications.map((notification) => (
              <Card key={notification.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{notification.title}</CardTitle>
                      <CardDescription>
                        {notification.type === 'system' ? '系统相关通知' :
                         notification.type === 'performance' ? '性能监控通知' :
                         notification.type === 'security' ? '安全事件通知' : '业务指标通知'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={notification.enabled ? 'success' : 'secondary'}>
                        {notification.enabled ? '启用' : '禁用'}
                      </Badge>
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={notification.enabled}
                          className="rounded"
                        />
                      </label>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">通知渠道</h4>
                      <div className="flex flex-wrap gap-2">
                        {notification.channels.map((channel) => (
                          <Badge key={channel} variant="outline">
                            {channel === 'email' ? '邮件' :
                             channel === 'sms' ? '短信' :
                             channel === 'slack' ? 'Slack' : channel}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">触发条件</h4>
                      <div className="space-y-2">
                        {Object.entries(notification.conditions).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between text-sm">
                            <span className="capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </span>
                            <span className="font-medium">
                              {typeof value === 'boolean' ? (value ? '启用' : '禁用') : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">编辑条件</Button>
                      <Button size="sm" variant="outline">测试通知</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>身份认证</CardTitle>
                <CardDescription>用户身份验证和访问控制配置</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">密码策略</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>最小长度</span>
                        <span>{securitySettings.authentication.passwordPolicy.minLength} 位</span>
                      </div>
                      <div className="flex justify-between">
                        <span>包含大写字母</span>
                        <Badge variant={securitySettings.authentication.passwordPolicy.requireUppercase ? 'success' : 'secondary'}>
                          {securitySettings.authentication.passwordPolicy.requireUppercase ? '是' : '否'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>包含数字</span>
                        <Badge variant={securitySettings.authentication.passwordPolicy.requireNumbers ? 'success' : 'secondary'}>
                          {securitySettings.authentication.passwordPolicy.requireNumbers ? '是' : '否'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>密码有效期</span>
                        <span>{securitySettings.authentication.passwordPolicy.expirationDays} 天</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">多因子认证 (MFA)</span>
                      <Badge variant={securitySettings.authentication.mfaEnabled ? 'success' : 'secondary'}>
                        {securitySettings.authentication.mfaEnabled ? '启用' : '禁用'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">单点登录 (SSO)</span>
                      <Badge variant={securitySettings.authentication.ssoEnabled ? 'success' : 'secondary'}>
                        {securitySettings.authentication.ssoEnabled ? '启用' : '禁用'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>数据加密</CardTitle>
                <CardDescription>数据加密和密钥管理配置</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">静态数据加密</span>
                      <Badge variant="success">{securitySettings.encryption.dataAtRest}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">传输加密</span>
                      <Badge variant="success">{securitySettings.encryption.dataInTransit}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">密钥轮换周期</span>
                      <span className="text-sm">{securitySettings.encryption.keyRotationPeriod} 天</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">证书状态</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">SSL 证书</span>
                        <div className="flex items-center space-x-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          <span className="text-sm">有效期至 2024-12-31</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>安全监控</CardTitle>
              <CardDescription>安全事件监控和审计配置</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                    <span className="font-medium">审计日志</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    保留期: {securitySettings.audit.logRetention} 天
                  </div>
                  <Badge variant="success">启用</Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BellIcon className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">实时监控</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    监控异常行为和安全事件
                  </div>
                  <Badge variant={securitySettings.audit.realTimeMonitoring ? 'success' : 'secondary'}>
                    {securitySettings.audit.realTimeMonitoring ? '启用' : '禁用'}
                  </Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">异常告警</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    可疑活动自动告警
                  </div>
                  <Badge variant={securitySettings.audit.alertOnSuspiciousActivity ? 'success' : 'secondary'}>
                    {securitySettings.audit.alertOnSuspiciousActivity ? '启用' : '禁用'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
