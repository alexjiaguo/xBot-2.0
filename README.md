# xBot 2.0

基于 PRD 文档构建的 xBot 2.0 企业级 AI 运营平台。

## 技术栈

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Heroicons
- **Charts**: Recharts
- **State Management**: React Query (TanStack Query)

## 功能模块

### 已实现功能

1. **控制台概览** (`/`)
   - 核心指标展示（知识库文档数、对话量、命中率等）
   - 趋势图表（检索命中率、对话量分布）
   - 最近任务列表

2. **知识库管理** (`/knowledge`)
   - 数据源管理（Notion、Confluence、Google Drive、Git）
   - 文档处理状态监控
   - 同步任务管理
   - 切片和 Embedding 配置

3. **对话管理** (`/conversations`)
   - 对话列表和详情查看
   - 用户满意度统计
   - 失败簇分析和修复建议
   - 对话回放功能

4. **Prompt 管理** (`/prompts`)
   - Prompt 模板管理
   - A/B 实验和灰度发布
   - 版本控制和回滚
   - Playground 在线测试

### 已完成功能

5. **Agent 管理** (`/agents`)
   - Agent Registry 和元数据管理
   - 依赖关系可视化
   - SLO 监控和告警配置
   - 工作流管理和执行监控
   - 部署历史和版本管理

6. **评测与监控** (`/evaluation`)
   - 评测运行管理和结果展示
   - 测试数据集管理和质量控制
   - 基准对比和性能分析
   - 实时监控和自动化评测

7. **分析报告** (`/analytics`)
   - 业务概览和核心指标展示
   - 性能分析和渠道对比
   - 用户行为分析和反馈统计
   - 自定义报告生成和导出

8. **权限管理** (`/permissions`)
   - 用户账户和角色管理
   - 细粒度权限配置
   - 审计日志和安全监控
   - 权限继承和访问控制

9. **系统设置** (`/settings`)
   - 基础系统配置和环境管理
   - 第三方集成配置（Notion、Confluence 等）
   - LLM 提供商管理和配额监控
   - 通知设置和安全配置

## 安装和运行

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建生产版本
npm run build

# 运行生产版本
npm start
```

## 项目结构

```
├── app/                    # Next.js App Router 页面
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   ├── page.tsx          # 首页（控制台）
│   ├── knowledge/        # 知识库管理
│   ├── conversations/    # 对话管理
│   ├── prompts/         # Prompt 管理
│   ├── agents/          # Agent 管理
│   ├── evaluation/      # 评测监控
│   ├── analytics/       # 分析报告
│   ├── architecture/    # 系统架构
│   ├── permissions/     # 权限管理
│   └── settings/        # 系统设置
├── components/            # 可复用组件
│   ├── ui/               # 基础 UI 组件
│   └── layout/           # 布局组件
├── docs/                 # 项目文档
│   ├── README.md         # 文档目录说明
│   ├── *.md              # 各类设计和需求文档
│   └── *.doc             # 项目规划文档
├── lib/                  # 工具函数和配置
├── types/               # TypeScript 类型定义
├── servers/             # MCP 服务器集成
│   └── gdrive-write/    # Google Drive 写入服务
├── scripts/             # 辅助脚本
├── archive/             # 历史文件存档
├── next.config.js       # Next.js 配置
├── package.json         # 依赖包配置
├── tailwind.config.js   # Tailwind CSS 配置
└── tsconfig.json        # TypeScript 配置
```

## 设计原则

1. **用户体验优先**: 基于 PRD 中的用户故事设计交互流程
2. **模块化设计**: 每个功能模块独立，便于维护和扩展
3. **响应式布局**: 适配不同屏幕尺寸的设备
4. **性能优化**: 使用 Next.js 的优化特性，确保加载速度
5. **可访问性**: 遵循 WCAG 指南，支持键盘导航和屏幕阅读器

## API 集成

前端设计预留了与后端 API 的集成接口，主要包括：

- `/api/knowledge/*` - 知识库相关 API
- `/api/conversations/*` - 对话管理 API
- `/api/prompts/*` - Prompt 管理 API
- `/api/agents/*` - Agent 管理 API
- `/api/evaluation/*` - 评测监控 API
- `/api/analytics/*` - 分析报告 API

## 部署

应用支持多种部署方式：

1. **Vercel**: 推荐用于快速部署和预览
2. **Docker**: 支持容器化部署
3. **静态导出**: 可导出为静态文件部署到 CDN

## 贡献指南

1. 遵循现有的代码风格和组件结构
2. 新增功能需要包含相应的 TypeScript 类型定义
3. 确保组件的可复用性和可测试性
4. 提交前运行 lint 检查

## License

企业内部项目，版权所有。
