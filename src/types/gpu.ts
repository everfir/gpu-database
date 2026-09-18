export type Vendor = 'NVIDIA' | 'AMD' | 'Intel' | 'Huawei' | 'Moore Threads' | 'Qualcomm' | 'Tenstorrent' | 'Other'

export type Segment = '消费级' | '工作站' | '数据中心'

export type EvidenceLevel = '官方' | '官方+交叉核验' | '第三方交叉核验' | '推导'

export type SourceLink = {
  label: string
  url: string
  kind: 'spec' | 'architecture' | 'price' | 'rental'
}

export type RentalQuote = {
  platform: string
  hourlyUsd: number
  observedAt: string
  basis: '按需公开价' | '市场样本' | '均价'
  url: string
}

export type PeakMetric = {
  dense: number | null
  sparse?: number | null
  unit: 'TFLOPS' | 'TOPS'
  note?: string
  provenance?: 'official' | 'derived' | 'cross-checked'
}

export type GpuRecord = {
  id: string
  name: string
  vendor: Vendor
  segment: Segment
  architecture: string
  releaseDate: string
  vramGB: number
  memoryType: string
  bandwidthGBs: number
  busWidth?: number | null
  fp64?: PeakMetric
  fp32?: PeakMetric
  tf32?: PeakMetric
  bf16?: PeakMetric
  fp16?: PeakMetric
  fp8?: PeakMetric
  fp6?: PeakMetric
  fp4?: PeakMetric
  int8?: PeakMetric
  int4?: PeakMetric
  parallelism: string[]
  nativeFormats: string[]
  interconnect?: string | null
  powerW?: number | null
  launchPriceUsd?: number | null
  launchPriceNote?: string
  rentalQuotes: RentalQuote[]
  evidence: EvidenceLevel
  notes: string[]
  sources: SourceLink[]
}

export type MetricKey = 'fp32' | 'fp16' | 'fp8' | 'int8' | 'bandwidthGBs'
