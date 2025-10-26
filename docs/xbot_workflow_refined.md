# xBot 2.0 System Workflow - Refined Swimlane Format

## System Architecture Workflow

```mermaid
graph TD
    subgraph "Data Ingestion Layer"
        In1[多源连接器] --> P1[抽取/解析]
        P1 --> P2[去重指纹/版本]
        P2 --> P3[确定性切片]
        P3 --> P4[Embedding 入库]
        P4 --> P5[索引构建: 向量+BM25]
        P5 --> Pub[发布/回滚]
    end

    subgraph "User Interface Layer"
        U[用户/渠道] --> S0[Traffic Split]
        S0 --> S1[xBot API]
    end

    subgraph "Query Processing Layer"
        S1 --> S2[Hybrid 检索]
        S2 --> S3[重排]
        S3 --> S4[Prompt Orchestrator]
        S4 --> S5[LLM Gateway]
        S5 --> S6[后处理/引用校验]
        S6 --> A[答案返回]
    end

    subgraph "Feedback & Monitoring Layer"
        A --> F[反馈/标注]
        F --> E[Eval Harness 扩充黄金集]
        S1 --> M[Telemetry 指标/日志/Trace]
    end

    %% Cross-layer connections
    Pub -.-> S2
    E -.-> P1
    M -.-> P5
```

## Refined Swimlane Workflow (Following Consulting Service Format)

```mermaid
graph TD
    subgraph "Data Management Team"
        Start1[Start] --> A1[多源连接器接入]
        A1 --> A2[数据抽取与解析]
        A2 --> A3[去重指纹生成]
        A3 --> A4[确定性切片处理]
        A4 --> A5[Embedding 向量化]
        A5 --> A6[索引构建完成]
        A6 --> End1[数据发布]
    end

    subgraph "API Gateway Team"
        Start2[Start] --> B1[用户请求接收]
        B1 --> B2{请求类型判断}
        B2 -->|标准查询| B3[xBot API 处理]
        B2 -->|管理操作| B4[管理接口路由]
        B3 --> B5[流量分发]
        B4 --> B6[权限验证]
    end

    subgraph "Query Processing Team"
        B5 --> C1[Hybrid 检索执行]
        C1 --> C2[结果重排序]
        C2 --> C3[Prompt 编排]
        C3 --> C4[LLM 调用]
        C4 --> C5[后处理与校验]
        C5 --> C6[答案格式化]
        C6 --> End2[响应返回]
    end

    subgraph "Quality Assurance Team"
        C6 --> D1[用户反馈收集]
        D1 --> D2{反馈类型}
        D2 -->|正面反馈| D3[质量指标更新]
        D2 -->|负面反馈| D4[问题分析]
        D4 --> D5[黄金集扩充]
        D5 --> D6[模型优化建议]
        D3 --> End3[质量报告]
        D6 --> End4[改进计划]
    end

    subgraph "Monitoring & Operations Team"
        B3 --> E1[Telemetry 数据收集]
        E1 --> E2[性能指标监控]
        E2 --> E3[日志聚合分析]
        E3 --> E4[异常告警]
        E4 --> E5[运维报告]
        E5 --> End5[系统健康状态]
    end

    %% Cross-team dependencies
    End1 -.-> C1
    D5 -.-> A1
    E2 -.-> A6
    B6 -.-> C1
```

## Key Process Flow Decisions

### Decision Points:
1. **请求类型判断** (B2): 标准查询 vs 管理操作
2. **反馈类型** (D2): 正面反馈 vs 负面反馈
3. **数据质量检查**: 是否需要重新处理数据
4. **性能阈值检查**: 是否需要扩容或优化

### External References:
- **HR Compensation & Classification** → **外部数据源认证**
- **Competitive Bidding Guidelines** → **模型选择策略**
- **Professional Service Agreement** → **服务级别协议**

### Process Steps with Sub-tasks:
- **数据抽取与解析**: 
  - 格式标准化
  - 内容验证
  - 元数据提取
- **Hybrid 检索执行**:
  - 向量检索
  - BM25 文本检索
  - 结果融合
- **Prompt 编排**:
  - 上下文组装
  - 指令优化
  - 参数配置

## Workflow Characteristics:
- **Swimlanes**: 按团队职责划分
- **Start/End Nodes**: 明确的流程起点和终点
- **Decision Points**: 关键业务判断节点
- **Cross-team Dependencies**: 虚线表示跨团队协作
- **External References**: 外部系统或策略引用
- **Sub-processes**: 复杂步骤的详细分解
