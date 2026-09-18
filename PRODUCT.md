# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React + TypeScript + shadcn/ui，作为本地可运行项目交付；不使用 Codex Sites，不注册或发布。

## Users

主要用户是需要筛选、比较和采购或租用 GPU 的技术决策者、AI 工程师与研究人员。使用场景包括本地推理、模型训练、工作站配置和云算力成本比较。

## Product Purpose

建立一个可核查的小型 GPU 数据库。覆盖最近四年发布、可用显存不少于 8GB、INT8 Dense 理论算力不低于 RTX 4090 十分之一的离散 GPU 或 AI 加速卡；重点比较 FP16、FP8、INT8，同时保留尽可能完整的精度、并行度、显存、带宽、首发价格和近期租赁价格数据。

## Positioning

把经常被混用的向量、矩阵、稠密、结构化稀疏和累加精度口径显式分开，并让每个数字能追溯到来源和证据等级，而不是只做营销峰值排行榜。

## Operating Context

用户需要快速过滤厂商、产品类型、显存和精度支持，选择数张卡并排比较；需要同时看到硬件能力、原售价、近期租赁均价、价格采样日期和数据缺失情况。

## Capabilities and Constraints

- 本地单页应用，数据随项目文件交付，不依赖登录或远程数据库。
- 支持搜索、筛选、排序、图表比较、表格比较、型号详情和来源跳转。
- 时间窗口为 2022-09-18 至 2026-09-18。
- 可用显存不少于 8GB。
- INT8 Dense 理论峰值门槛为 66.06 TOPS；无可靠 INT8 Dense 数据的型号不自动视为合格。
- 厂商未公布的数据保留为空；推导值必须标为 derived；稀疏值不得冒充 Dense。
- 租赁价格标明平台、采样时间和统计方式，不把现货销售价与云租赁价混在一起。

## Evidence on Hand

- 已有 NVIDIA RTX 4090、RTX 5090、H20，AMD RX 9070 XT、Radeon PRO W7900、Instinct MI355X，Intel Arc B580、Arc Pro B60、Arc Pro B70 的官方或交叉核验数据。
- 现有研究报告位于同级输出目录的 `GPU算力参数调研.md`。
- 尚无统一、完整的跨厂商租赁价格数据；需要在本次研究中补齐并保留缺失值。

## Product Principles

- 口径先于排名。
- 来源与不确定性始终可见。
- 默认展示真实可比的 Dense 峰值。
- 缺失值不猜测，不用零替代。
- 先帮助决策，再展示更多技术细节。

## Accessibility & Inclusion

键盘可操作，图表不能只依靠颜色编码；表格和控件在桌面与移动端保持可读。
