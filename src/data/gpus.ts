import type { GpuRecord, PeakMetric } from '@/types/gpu'
import intelOtherResearch from './intel-other.json'
import amdResearch from './amd.json'
import nvidiaResearch from './nvidia.json'

export const CUTOFF_DATE = '2022-09-18'
export const DATA_AS_OF = '2026-09-18'
export const INT8_THRESHOLD = 66.06

const BASE_GPU_DATA: GpuRecord[] = [
  {
    id: 'nvidia-rtx-4090', name: 'GeForce RTX 4090', vendor: 'NVIDIA', segment: '消费级', architecture: 'Ada Lovelace', releaseDate: '2022-10-12',
    vramGB: 24, memoryType: 'GDDR6X', bandwidthGBs: 1008, busWidth: 384,
    fp64: { dense: 1.29, unit: 'TFLOPS', provenance: 'official', note: 'FP32 的 1/64' },
    fp32: { dense: 82.6, unit: 'TFLOPS', provenance: 'official' },
    tf32: { dense: 82.6, sparse: 165.2, unit: 'TFLOPS', provenance: 'official' },
    bf16: { dense: 165.2, sparse: 330.4, unit: 'TFLOPS', provenance: 'official', note: 'Tensor，FP32 累加' },
    fp16: { dense: 330.3, sparse: 660.6, unit: 'TFLOPS', provenance: 'official', note: 'Tensor，FP16 累加' },
    fp8: { dense: 660.6, sparse: 1321.2, unit: 'TFLOPS', provenance: 'official', note: 'Tensor，FP16 累加' },
    int8: { dense: 660.6, sparse: 1321.2, unit: 'TOPS', provenance: 'official' },
    int4: { dense: 1321.2, sparse: 2642.4, unit: 'TOPS', provenance: 'official' },
    parallelism: ['128 SM', '16,384 CUDA', '512 Tensor Core', '128 RT Core'], nativeFormats: ['FP64', 'FP32', 'TF32', 'BF16', 'FP16', 'FP8', 'INT8', 'INT4'],
    interconnect: 'PCIe 4.0 x16', powerW: 450, launchPriceUsd: 1599, launchPriceNote: 'Founders Edition MSRP', rentalQuotes: [], evidence: '官方', notes: [],
    sources: [
      { label: 'NVIDIA Ada 架构白皮书', url: 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/nvidia-ada-gpu-architecture.pdf', kind: 'architecture' },
      { label: 'NVIDIA RTX 4090 产品页', url: 'https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/', kind: 'spec' },
    ],
  },
  {
    id: 'nvidia-rtx-5090', name: 'GeForce RTX 5090', vendor: 'NVIDIA', segment: '消费级', architecture: 'RTX Blackwell', releaseDate: '2025-01-30',
    vramGB: 32, memoryType: 'GDDR7', bandwidthGBs: 1792, busWidth: 512,
    fp64: { dense: 1.64, unit: 'TFLOPS', provenance: 'official', note: 'FP32 的 1/64' }, fp32: { dense: 104.8, unit: 'TFLOPS', provenance: 'official' },
    tf32: { dense: 104.8, sparse: 209.5, unit: 'TFLOPS', provenance: 'official' }, bf16: { dense: 209.5, sparse: 419, unit: 'TFLOPS', provenance: 'official', note: 'FP32 累加' },
    fp16: { dense: 419, sparse: 838, unit: 'TFLOPS', provenance: 'official', note: 'FP16 累加' }, fp8: { dense: 838, sparse: 1676, unit: 'TFLOPS', provenance: 'official', note: 'FP16 累加' },
    fp6: { dense: null, unit: 'TFLOPS', provenance: 'official', note: '原生支持，未公布型号峰值' }, fp4: { dense: 1676, sparse: 3352, unit: 'TFLOPS', provenance: 'official', note: 'FP32 累加' },
    int8: { dense: 838, sparse: 1676, unit: 'TOPS', provenance: 'official' }, parallelism: ['170 SM', '21,760 CUDA', '680 Tensor Core', '170 RT Core'],
    nativeFormats: ['FP64', 'FP32', 'TF32', 'BF16', 'FP16', 'FP8', 'FP6', 'FP4', 'INT8'], interconnect: 'PCIe 5.0 x16', powerW: 575,
    launchPriceUsd: 1999, launchPriceNote: 'Founders Edition MSRP', rentalQuotes: [], evidence: '官方', notes: [],
    sources: [
      { label: 'NVIDIA RTX Blackwell 架构白皮书', url: 'https://images.nvidia.com/aem-dam/Solutions/geforce/blackwell/nvidia-rtx-blackwell-gpu-architecture.pdf', kind: 'architecture' },
      { label: 'NVIDIA RTX 5090 产品页', url: 'https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5090/', kind: 'spec' },
    ],
  },
  {
    id: 'nvidia-h20-96', name: 'H20 SXM 96GB', vendor: 'NVIDIA', segment: '数据中心', architecture: 'Hopper', releaseDate: '2024-01-01',
    vramGB: 96, memoryType: 'HBM3', bandwidthGBs: 4000, busWidth: null, fp64: { dense: 1, unit: 'TFLOPS', provenance: 'cross-checked' },
    fp32: { dense: 44, unit: 'TFLOPS', provenance: 'cross-checked' }, tf32: { dense: 74, unit: 'TFLOPS', provenance: 'cross-checked' },
    bf16: { dense: 148, unit: 'TFLOPS', provenance: 'cross-checked' }, fp16: { dense: 148, unit: 'TFLOPS', provenance: 'cross-checked' },
    fp8: { dense: 296, unit: 'TFLOPS', provenance: 'cross-checked' }, int8: { dense: 296, unit: 'TOPS', provenance: 'cross-checked' },
    parallelism: ['最多 7 MIG', '公开核心数存在冲突'], nativeFormats: ['FP64', 'FP32', 'TF32', 'BF16', 'FP16', 'FP8', 'INT8'], interconnect: 'SXM / NVLink', powerW: 400,
    launchPriceUsd: null, rentalQuotes: [], evidence: '第三方交叉核验', notes: ['原始 NVIDIA H20 公开产品页不可用；采购应核对具体 P/N。'],
    sources: [
      { label: 'H20 规格表公开转载', url: 'https://www.an-link.com/Se_d_gci_47_id_13.html', kind: 'spec' },
      { label: 'Flopper H20 规格交叉核验', url: 'https://flopper.io/gpu/nvidia-h20-96gb/spec-sheet', kind: 'spec' },
    ],
  },
  {
    id: 'amd-rx-9070-xt', name: 'Radeon RX 9070 XT', vendor: 'AMD', segment: '消费级', architecture: 'RDNA 4', releaseDate: '2025-03-06',
    vramGB: 16, memoryType: 'GDDR6', bandwidthGBs: 640, busWidth: 256, fp32: { dense: 48.7, unit: 'TFLOPS', provenance: 'official' },
    fp16: { dense: 195, sparse: 389, unit: 'TFLOPS', provenance: 'official', note: 'Matrix' }, fp8: { dense: 389, sparse: 779, unit: 'TFLOPS', provenance: 'official' },
    int8: { dense: 389, sparse: 779, unit: 'TOPS', provenance: 'official' }, int4: { dense: 779, sparse: 1557, unit: 'TOPS', provenance: 'official' },
    parallelism: ['64 CU', '4,096 Stream Processor', '128 AI Accelerator', '64 RT Accelerator'], nativeFormats: ['FP32', 'FP16', 'FP8', 'INT8', 'INT4'],
    interconnect: 'PCIe 5.0 x16', powerW: 304, launchPriceUsd: 599, launchPriceNote: '建议零售价', rentalQuotes: [], evidence: '官方', notes: [],
    sources: [{ label: 'AMD RX 9070 XT 官方规格', url: 'https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070xt.html', kind: 'spec' }],
  },
  {
    id: 'amd-radeon-pro-w7900', name: 'Radeon PRO W7900', vendor: 'AMD', segment: '工作站', architecture: 'RDNA 3', releaseDate: '2023-04-13',
    vramGB: 48, memoryType: 'GDDR6 ECC', bandwidthGBs: 864, busWidth: 384, fp32: { dense: 61.3, unit: 'TFLOPS', provenance: 'official' },
    fp16: { dense: 123, unit: 'TFLOPS', provenance: 'official', note: 'Matrix' }, int8: { dense: 123, unit: 'TOPS', provenance: 'official' }, int4: { dense: 245, unit: 'TOPS', provenance: 'official' },
    parallelism: ['96 CU', '6,144 Stream Processor', '192 AI Accelerator', '96 RT Accelerator'], nativeFormats: ['FP32', 'FP16', 'INT8', 'INT4'],
    interconnect: 'PCIe 4.0 x16', powerW: 295, launchPriceUsd: 3999, launchPriceNote: '发布 MSRP', rentalQuotes: [], evidence: '官方', notes: [],
    sources: [{ label: 'AMD W7900 官方规格', url: 'https://www.amd.com/en/products/graphics/workstations/radeon-pro/w7900.html', kind: 'spec' }],
  },
  {
    id: 'amd-instinct-mi355x', name: 'Instinct MI355X', vendor: 'AMD', segment: '数据中心', architecture: 'CDNA 4', releaseDate: '2025-06-12',
    vramGB: 288, memoryType: 'HBM3E', bandwidthGBs: 8000, busWidth: 8192, fp64: { dense: 78.6, unit: 'TFLOPS', provenance: 'official' }, fp32: { dense: 157.3, unit: 'TFLOPS', provenance: 'official' },
    bf16: { dense: 2516.6, sparse: 5033.2, unit: 'TFLOPS', provenance: 'official' }, fp16: { dense: 2516.6, sparse: 5033.2, unit: 'TFLOPS', provenance: 'official', note: 'Matrix' },
    fp8: { dense: 5033.2, sparse: 10066.4, unit: 'TFLOPS', provenance: 'official', note: 'OCP-FP8' }, fp6: { dense: 10066.3, unit: 'TFLOPS', provenance: 'official', note: 'MXFP6' },
    fp4: { dense: 10066.3, unit: 'TFLOPS', provenance: 'official', note: 'MXFP4' }, int8: { dense: 5033.2, sparse: 10066.4, unit: 'TOPS', provenance: 'official' },
    parallelism: ['8 XCD', '256 CU', '16,384 Stream Processor', '1,024 Matrix Core'], nativeFormats: ['FP64', 'FP32', 'BF16', 'FP16', 'OCP-FP8', 'MXFP8', 'MXFP6', 'MXFP4', 'INT8'],
    interconnect: '7×153.6 GB/s Infinity Fabric', powerW: 1400, launchPriceUsd: null, rentalQuotes: [], evidence: '官方', notes: [],
    sources: [{ label: 'AMD MI355X 官方数据表', url: 'https://www.amd.com/content/dam/amd/en/documents/instinct-tech-docs/product-briefs/amd-instinct-mi355x-gpu-brochure.pdf', kind: 'spec' }],
  },
  {
    id: 'intel-arc-b580', name: 'Arc B580', vendor: 'Intel', segment: '消费级', architecture: 'Xe2', releaseDate: '2024-12-13',
    vramGB: 12, memoryType: 'GDDR6', bandwidthGBs: 456, busWidth: 192, fp32: { dense: 13.67, unit: 'TFLOPS', provenance: 'derived' }, int8: { dense: 233, unit: 'TOPS', provenance: 'official' },
    parallelism: ['20 Xe-core', '160 Vector Engine', '160 XMX', '20 RT Unit'], nativeFormats: ['FP32', 'FP16', 'BF16', 'INT8', 'INT4', 'INT2'],
    interconnect: 'PCIe 4.0 x8', powerW: 190, launchPriceUsd: 249, launchPriceNote: 'Intel RCP', rentalQuotes: [], evidence: '官方+交叉核验', notes: ['FP32 为按 Xe2 吞吐与时钟推导。'],
    sources: [{ label: 'Intel Arc B580 ARK', url: 'https://www.intel.com/content/www/us/en/products/sku/241598/intel-arc-b580-graphics/specifications.html', kind: 'spec' }],
  },
  {
    id: 'intel-arc-pro-b70', name: 'Arc Pro B70', vendor: 'Intel', segment: '工作站', architecture: 'Xe2-HPG', releaseDate: '2026-01-01',
    vramGB: 32, memoryType: 'GDDR6 ECC', bandwidthGBs: 608, busWidth: 256, fp32: { dense: 22.94, unit: 'TFLOPS', provenance: 'official' }, int8: { dense: 367, unit: 'TOPS', provenance: 'official' },
    parallelism: ['32 Xe-core', '256 Vector Engine', '256 XMX', '32 RT Unit'], nativeFormats: ['FP32', 'FP16', 'BF16', 'INT8', 'INT4', 'INT2'],
    interconnect: 'PCIe 5.0 x16', powerW: 230, launchPriceUsd: null, rentalQuotes: [], evidence: '官方', notes: [],
    sources: [{ label: 'Intel Arc Pro B70 ARK', url: 'https://www.intel.com/content/www/us/en/products/sku/245797/intel-arc-pro-b70-graphics/specifications.html', kind: 'spec' }],
  },
  {
    id: 'intel-arc-pro-b60', name: 'Arc Pro B60', vendor: 'Intel', segment: '工作站', architecture: 'Xe2-HPG', releaseDate: '2025-06-01',
    vramGB: 24, memoryType: 'GDDR6', bandwidthGBs: 456, busWidth: 192, fp32: { dense: 12.28, unit: 'TFLOPS', provenance: 'official' }, int8: { dense: 197, unit: 'TOPS', provenance: 'official' },
    parallelism: ['20 Xe-core', '160 Vector Engine', '160 XMX', '20 RT Unit'], nativeFormats: ['FP32', 'FP16', 'BF16', 'INT8', 'INT4', 'INT2'],
    interconnect: 'PCIe 5.0 x8', powerW: 200, launchPriceUsd: null, rentalQuotes: [], evidence: '官方', notes: [],
    sources: [{ label: 'Intel Arc Pro B60 ARK', url: 'https://www.intel.com/content/www/us/en/products/sku/243916/intel-arc-pro-b60-graphics/specifications.html', kind: 'spec' }],
  },
]

type RawMetric = { dense: number | null; sparse?: number | null; unit: 'TFLOPS' | 'TOPS'; provenance?: string }
type RawRecord = {
  id: string; name: string; vendor: string; segment: string; architecture: string; releaseDate: string
  vramGB: number; memoryType: string; bandwidthGBs: number; busWidth?: number | null
  compute: Record<string, RawMetric | null>; parallelism: Record<string, number | string | undefined>
  interconnect?: string | null; powerW?: number | null
  msrp: { usd?: number | null; note?: string }; rental: { hourlyUSD?: number | null; date?: string; platform?: string | null; note?: string }
  nativeFormats: string[]; notes?: string | null; sources: string[]; confidence: string
}

function normalizeMetric(metric: RawMetric | null | undefined): PeakMetric | undefined {
  if (!metric) return undefined
  const provenance: PeakMetric['provenance'] = metric.provenance?.startsWith('official') ? 'official' : metric.provenance?.startsWith('derived') ? 'derived' : 'cross-checked'
  return { dense: metric.dense, sparse: metric.sparse, unit: metric.unit, provenance, note: metric.provenance }
}

function normalizeResearchRecord(raw: RawRecord): GpuRecord {
  const segment = raw.segment === 'consumer' ? '消费级' : raw.segment === 'professional' ? '工作站' : '数据中心'
  const vendor = ['NVIDIA', 'AMD', 'Intel', 'Huawei', 'Moore Threads', 'Qualcomm', 'Tenstorrent'].includes(raw.vendor) ? raw.vendor as GpuRecord['vendor'] : 'Other'
  const rentalQuotes = raw.rental.hourlyUSD != null && raw.rental.platform ? [{
    platform: raw.rental.platform, hourlyUsd: raw.rental.hourlyUSD, observedAt: raw.rental.date ?? DATA_AS_OF,
    basis: '按需公开价' as const, url: raw.sources.find((url) => /pricing|cloud|rent/i.test(url)) ?? raw.sources[0],
  }] : []
  const parallelism = Object.entries(raw.parallelism).filter((entry): entry is [string, number | string] => entry[1] != null).map(([key, value]) => `${value} ${key.replace(/([A-Z])/g, ' $1').trim()}`)
  return {
    id: raw.id, name: raw.name, vendor, segment, architecture: raw.architecture, releaseDate: raw.releaseDate,
    vramGB: raw.vramGB, memoryType: raw.memoryType, bandwidthGBs: raw.bandwidthGBs, busWidth: raw.busWidth,
    fp64: normalizeMetric(raw.compute.fp64), fp32: normalizeMetric(raw.compute.fp32), tf32: normalizeMetric(raw.compute.tf32),
    bf16: normalizeMetric(raw.compute.bf16), fp16: normalizeMetric(raw.compute.fp16), fp8: normalizeMetric(raw.compute.fp8),
    fp6: normalizeMetric(raw.compute.fp6), fp4: normalizeMetric(raw.compute.fp4), int8: normalizeMetric(raw.compute.int8), int4: normalizeMetric(raw.compute.int4),
    parallelism, nativeFormats: raw.nativeFormats, interconnect: raw.interconnect, powerW: raw.powerW,
    launchPriceUsd: raw.msrp.usd, launchPriceNote: raw.msrp.note, rentalQuotes,
    evidence: raw.confidence === 'high' ? '官方+交叉核验' : '推导',
    notes: [raw.notes, raw.rental.note].filter((note): note is string => Boolean(note)),
    sources: raw.sources.map((url, index) => ({ label: `${raw.name} 来源 ${index + 1}`, url, kind: 'spec' as const })),
  }
}

type RawAmdRecord = {
  name: string; vendor: 'AMD'; segment: string; architecture: string; releaseDate?: string
  vramGB: number; memoryType: string; bandwidthGBs: number; busWidth?: number | null
  fp64?: { dense?: number; vectorDense?: number; matrixDense?: number } | null
  fp32?: { dense?: number; vectorDense?: number; matrixDense?: number } | null
  tf32Dense?: number | null; tf32Sparse?: number | null; bf16Dense?: number | null; bf16Sparse?: number | null
  fp16Dense?: { value: number } | null; fp16Sparse?: number | null; fp8Dense?: { value: number } | null; fp8Sparse?: number | null
  fp6?: { dense: number; sparse?: number | null; format?: string } | null; fp4?: { dense: number; sparse?: number | null; format?: string } | null
  int8Dense?: { value: number } | null; int8Sparse?: number | null; int4?: { dense: number; sparse?: number | null } | null
  cu?: number | null; streamProcessors?: number | null; aiAccelerators?: number | null; matrixCores?: number | null; rtAccelerators?: number | null
  interconnect?: string | null; tbpW?: number | null; msrp?: { amount: number; currency: string; kind?: string; date?: string } | null
  rentalHourlyUSD?: { value: number; date: string; platform: string; method: string; confidence: string; derived?: boolean } | null
  nativeFormats: string[]; notes?: string | null; sourceUrls: string[]; confidence: string
}

function peak(value: number | null | undefined, unit: 'TFLOPS' | 'TOPS', sparse?: number | null, note?: string, provenance: PeakMetric['provenance'] = 'official'): PeakMetric | undefined {
  return value == null ? undefined : { dense: value, sparse, unit, provenance, note }
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function normalizeAmdRecord(raw: RawAmdRecord): GpuRecord {
  const segment = raw.segment.includes('consumer') ? '消费级' : raw.segment.includes('professional') ? '工作站' : '数据中心'
  const fp64Value = raw.fp64?.matrixDense ?? raw.fp64?.vectorDense ?? raw.fp64?.dense
  const fp32Value = raw.fp32?.matrixDense ?? raw.fp32?.vectorDense ?? raw.fp32?.dense
  const parallelism = [raw.cu && `${raw.cu} CU`, raw.streamProcessors && `${raw.streamProcessors} Stream Processor`, raw.aiAccelerators && `${raw.aiAccelerators} AI Accelerator`, raw.matrixCores && `${raw.matrixCores} Matrix Core`, raw.rtAccelerators && `${raw.rtAccelerators} RT Accelerator`].filter((item): item is string => Boolean(item))
  const rentalQuotes = raw.rentalHourlyUSD ? [{ platform: raw.rentalHourlyUSD.platform, hourlyUsd: raw.rentalHourlyUSD.value, observedAt: raw.rentalHourlyUSD.date, basis: (raw.rentalHourlyUSD.derived ? '均价' : '市场样本') as '均价' | '市场样本', url: raw.sourceUrls.find((url) => /price|cloud|savrn|deploy|spheron|compute/i.test(url)) ?? raw.sourceUrls[0] }] : []
  return {
    id: `amd-${slug(raw.name.replace(/^AMD\s+/i, ''))}`, name: raw.name.replace(/^AMD\s+/i, ''), vendor: 'AMD', segment, architecture: raw.architecture,
    releaseDate: raw.releaseDate || '发布日期待官方确认', vramGB: raw.vramGB, memoryType: raw.memoryType, bandwidthGBs: raw.bandwidthGBs, busWidth: raw.busWidth,
    fp64: peak(fp64Value, 'TFLOPS'), fp32: peak(fp32Value, 'TFLOPS'), tf32: peak(raw.tf32Dense, 'TFLOPS', raw.tf32Sparse), bf16: peak(raw.bf16Dense, 'TFLOPS', raw.bf16Sparse),
    fp16: peak(raw.fp16Dense?.value, 'TFLOPS', raw.fp16Sparse), fp8: peak(raw.fp8Dense?.value, 'TFLOPS', raw.fp8Sparse), fp6: peak(raw.fp6?.dense, 'TFLOPS', raw.fp6?.sparse, raw.fp6?.format), fp4: peak(raw.fp4?.dense, 'TFLOPS', raw.fp4?.sparse, raw.fp4?.format),
    int8: peak(raw.int8Dense?.value, 'TOPS', raw.int8Sparse), int4: peak(raw.int4?.dense, 'TOPS', raw.int4?.sparse), parallelism, nativeFormats: raw.nativeFormats,
    interconnect: raw.interconnect, powerW: raw.tbpW, launchPriceUsd: raw.msrp?.currency === 'USD' ? raw.msrp.amount : null,
    launchPriceNote: raw.msrp ? `${raw.msrp.kind ?? '发布价格'}${raw.msrp.currency !== 'USD' ? ` · ${raw.msrp.amount} ${raw.msrp.currency}` : ''}${raw.msrp.date ? ` · 证据日期 ${raw.msrp.date}` : ''}` : undefined,
    rentalQuotes, evidence: raw.confidence === 'high' ? '官方+交叉核验' : '第三方交叉核验', notes: [raw.notes, raw.rentalHourlyUSD ? `租价口径：${raw.rentalHourlyUSD.method}（${raw.rentalHourlyUSD.confidence}）` : null].filter((note): note is string => Boolean(note)),
    sources: raw.sourceUrls.map((url, index) => ({ label: `${raw.name} 来源 ${index + 1}`, url, kind: /price|cloud|savrn|deploy|spheron|compute/i.test(url) ? 'rental' : 'spec' })),
  }
}

type ValueMetric = number | { value?: number; dense?: number; sparse?: number | null; accumulate?: string; fp32Accumulate?: number } | null
type RawNvidiaRecord = {
  name: string; vendor: 'NVIDIA'; segment: string; architecture: string; releaseDate: string
  vramGB: number; memoryType: string; bandwidthGBs: number; busWidth?: number | null
  fp64?: number | null; fp32?: number | null; tf32Dense?: number | null; tf32Sparse?: number | null; bf16Dense?: number | null; bf16Sparse?: number | null
  fp16Dense?: ValueMetric; fp16Sparse?: ValueMetric; fp8Dense?: ValueMetric; fp8Sparse?: ValueMetric; fp6?: ValueMetric; fp4?: ValueMetric
  int8Dense?: number | null; int8Sparse?: number | null; int4?: { dense: number; sparse?: number | null } | null
  computeUnitsSM?: number | null; shaderCUDA?: number | null; matrixTensorCores?: number | null; rtCores?: number | null
  interconnect?: string | null; tdpTbp?: number | null; msrp?: { amount: number; currency: string; date?: string } | null
  rentalHourlyUSD?: number | null; rentalSamples?: { platform: string; price: number }[]
  nativeFormats: string[]; notes?: string | null; sources: string[]; confidence: string; status?: string
}

function valueOf(metric: ValueMetric | undefined) {
  return typeof metric === 'number' ? metric : metric?.value ?? metric?.dense ?? null
}

function sparseOf(metric: ValueMetric | undefined) {
  return typeof metric === 'object' && metric ? metric.sparse : null
}

function normalizeNvidiaRecord(raw: RawNvidiaRecord): GpuRecord {
  const cleanName = raw.name.replace(/^NVIDIA\s+/i, '')
  const idName = cleanName.replace(/^GeForce\s+/i, '')
  const segment = raw.segment === 'consumer' ? '消费级' : raw.segment.includes('workstation') || raw.segment.includes('professional') ? '工作站' : '数据中心'
  const parallelism = [raw.computeUnitsSM && `${raw.computeUnitsSM} SM`, raw.shaderCUDA && `${raw.shaderCUDA.toLocaleString('en-US')} CUDA`, raw.matrixTensorCores && `${raw.matrixTensorCores} Tensor Core`, raw.rtCores && `${raw.rtCores} RT Core`].filter((item): item is string => Boolean(item))
  const rentalUrl = raw.sources.find((url) => /runpod|lambda|hyperstack|spheron|cloudrift|inferencebench|pricing/i.test(url)) ?? raw.sources[0]
  const rentalQuotes = (raw.rentalSamples ?? []).map((sample) => ({ platform: sample.platform, hourlyUsd: sample.price, observedAt: DATA_AS_OF, basis: '市场样本' as const, url: rentalUrl }))
  const metricProvenance: PeakMetric['provenance'] = raw.status === 'derived' ? 'derived' : raw.status === 'official' ? 'official' : 'cross-checked'
  return {
    id: `nvidia-${slug(idName)}`, name: cleanName, vendor: 'NVIDIA', segment, architecture: raw.architecture, releaseDate: raw.releaseDate,
    vramGB: raw.vramGB, memoryType: raw.memoryType, bandwidthGBs: raw.bandwidthGBs, busWidth: raw.busWidth,
    fp64: peak(raw.fp64, 'TFLOPS', null, undefined, metricProvenance), fp32: peak(raw.fp32, 'TFLOPS', null, undefined, metricProvenance), tf32: peak(raw.tf32Dense, 'TFLOPS', raw.tf32Sparse, undefined, metricProvenance), bf16: peak(raw.bf16Dense, 'TFLOPS', raw.bf16Sparse, undefined, metricProvenance),
    fp16: peak(valueOf(raw.fp16Dense), 'TFLOPS', valueOf(raw.fp16Sparse), typeof raw.fp16Dense === 'object' && raw.fp16Dense ? `累加 ${raw.fp16Dense.accumulate ?? '未注明'}` : undefined, metricProvenance),
    fp8: peak(valueOf(raw.fp8Dense), 'TFLOPS', valueOf(raw.fp8Sparse), undefined, metricProvenance), fp6: peak(valueOf(raw.fp6), 'TFLOPS', sparseOf(raw.fp6), undefined, metricProvenance), fp4: peak(valueOf(raw.fp4), 'TFLOPS', sparseOf(raw.fp4), undefined, metricProvenance),
    int8: peak(raw.int8Dense, 'TOPS', raw.int8Sparse, undefined, metricProvenance), int4: peak(raw.int4?.dense, 'TOPS', raw.int4?.sparse, undefined, metricProvenance), parallelism, nativeFormats: raw.nativeFormats,
    interconnect: raw.interconnect, powerW: raw.tdpTbp, launchPriceUsd: raw.msrp?.currency === 'USD' ? raw.msrp.amount : null, launchPriceNote: raw.msrp ? `首发价${raw.msrp.date ? ` · ${raw.msrp.date}` : ''}` : undefined,
    rentalQuotes, evidence: raw.status === 'derived' ? '推导' : raw.confidence === 'high' && raw.status === 'official' ? '官方' : raw.confidence === 'high' ? '官方+交叉核验' : '第三方交叉核验',
    notes: [raw.notes].filter((note): note is string => Boolean(note)),
    sources: raw.sources.map((url, index) => ({ label: `${cleanName} 来源 ${index + 1}`, url, kind: /runpod|lambda|hyperstack|spheron|cloudrift|inferencebench|pricing/i.test(url) ? 'rental' : 'spec' })),
  }
}

export const GPU_DATA: GpuRecord[] = [
  ...BASE_GPU_DATA.filter((gpu) => !['NVIDIA', 'AMD', 'Intel'].includes(gpu.vendor)),
  ...((nvidiaResearch.gpus as unknown) as RawNvidiaRecord[]).map(normalizeNvidiaRecord),
  ...((amdResearch.candidates as unknown) as RawAmdRecord[]).map(normalizeAmdRecord),
  ...((intelOtherResearch.included as unknown) as RawRecord[]).map(normalizeResearchRecord),
].filter((gpu) => gpu.releaseDate !== '发布日期待官方确认' && gpu.vramGB >= 8 && (gpu.int8?.dense ?? 0) >= INT8_THRESHOLD)
