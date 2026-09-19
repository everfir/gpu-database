# GPU Index

本地 Vite + React + TypeScript + shadcn/ui GPU 规格与价格数据库。

## 运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

## 数据口径

- 时间截点：2026-09-18；目标发布窗口：2022-09-18 至 2026-09-18。
- 显存至少 8GB。
- dense INT8 峰值至少 66.06 TOPS，即 RTX 4090 dense INT8 660.6 TOPS 的十分之一。
- 稀疏值不冒充稠密值；厂商未公布的数据保持为空。
- 推导值在详情中保留 provenance/说明。
- 租价为近期公开按需样本的简单均值；单点报价会明确标注，不把整机包月或“询价”换算成伪精确单卡价。
- 原始调研数据保存在 `src/data/*.json`，页面统一适配为 `GpuRecord`。

## 已覆盖

NVIDIA、AMD、Intel、Huawei、Moore Threads、Qualcomm、Tenstorrent，共 96 个同时具备可核验发布日期、显存与 INT8 峰值的 SKU、板型或加速器配置。原始 JSON 仍保留发布日期待确认或证据不足的候选，不混入默认榜单。

## 主要交互

- 型号/架构搜索，厂商、类型、最低显存筛选。
- FP16、FP8、INT8、FP32 与显存带宽的双对数散点比较。
- 最多 5 张卡并排比较。
- 完整表格及带精度口径、并行度、价格、租价样本和外部来源的详情抽屉。
