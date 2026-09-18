import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  Database,
  Gauge,
  Info,
  MemoryStick,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GPU_DATA, DATA_AS_OF, INT8_THRESHOLD } from '@/data/gpus'
import type { GpuRecord, MetricKey, Segment, Vendor } from '@/types/gpu'
import './App.css'

const METRICS: { key: MetricKey; label: string; unit: string }[] = [
  { key: 'fp16', label: 'FP16', unit: 'TFLOPS' },
  { key: 'fp8', label: 'FP8', unit: 'TFLOPS' },
  { key: 'int8', label: 'INT8', unit: 'TOPS' },
  { key: 'fp32', label: 'FP32', unit: 'TFLOPS' },
]

const VENDORS: Array<Vendor | '全部'> = ['全部', 'NVIDIA', 'AMD', 'Intel', 'Huawei', 'Moore Threads', 'Qualcomm', 'Tenstorrent', 'Other']
const SEGMENTS: Array<Segment | '全部'> = ['全部', '消费级', '工作站', '数据中心']
const FORMATS = ['全部', 'FP16', 'BF16', 'FP8', 'FP6', 'FP4', 'INT8', 'INT4'] as const

const vendorColor: Record<string, string> = {
  NVIDIA: '#2f7d54', AMD: '#d45235', Intel: '#2e6f95', Huawei: '#a33c48', 'Moore Threads': '#7b5ca5', Qualcomm: '#8b6351', Tenstorrent: '#53627a', Other: '#666c67',
}

function metricValue(gpu: GpuRecord, key: MetricKey) {
  if (key === 'bandwidthGBs') return gpu.bandwidthGBs
  return gpu[key]?.dense ?? null
}

function formatNumber(value: number | null | undefined, digits = 0) {
  if (value == null) return '—'
  return new Intl.NumberFormat('zh-CN', { maximumFractionDigits: digits }).format(value)
}

function money(value: number | null | undefined) {
  if (value == null) return '未公开'
  return `$${new Intl.NumberFormat('en-US').format(value)}`
}

function averageRental(gpu: GpuRecord) {
  if (!gpu.rentalQuotes.length) return null
  return gpu.rentalQuotes.reduce((sum, quote) => sum + quote.hourlyUsd, 0) / gpu.rentalQuotes.length
}

function App() {
  const [query, setQuery] = useState('')
  const [vendor, setVendor] = useState<Vendor | '全部'>('全部')
  const [segment, setSegment] = useState<Segment | '全部'>('全部')
  const [minVram, setMinVram] = useState(8)
  const [nativeFormat, setNativeFormat] = useState<(typeof FORMATS)[number]>('全部')
  const [sortBy, setSortBy] = useState<'int8' | 'fp16' | 'bandwidth' | 'vram' | 'rental'>('int8')
  const [metric, setMetric] = useState<MetricKey>('int8')
  const [activeTab, setActiveTab] = useState('chart')
  const [compareIds, setCompareIds] = useState<string[]>(['nvidia-rtx-5090', 'amd-instinct-mi355x', 'intel-arc-pro-b70'])
  const [detail, setDetail] = useState<GpuRecord | null>(null)

  const visible = useMemo(() => GPU_DATA.filter((gpu) => {
    const text = `${gpu.name} ${gpu.architecture} ${gpu.vendor}`.toLowerCase()
    const queryTokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    return queryTokens.every((token) => text.includes(token))
      && (vendor === '全部' || gpu.vendor === vendor)
      && (segment === '全部' || gpu.segment === segment)
      && gpu.vramGB >= minVram
      && (nativeFormat === '全部' || gpu.nativeFormats.some((format) => format.toUpperCase().includes(nativeFormat)))
  }).sort((a, b) => {
    if (sortBy === 'bandwidth') return b.bandwidthGBs - a.bandwidthGBs
    if (sortBy === 'vram') return b.vramGB - a.vramGB
    if (sortBy === 'rental') return (averageRental(a) ?? Number.POSITIVE_INFINITY) - (averageRental(b) ?? Number.POSITIVE_INFINITY)
    return (metricValue(b, sortBy) ?? -1) - (metricValue(a, sortBy) ?? -1)
  }), [query, vendor, segment, minVram, nativeFormat, sortBy])

  const chartData = visible
    .map((gpu) => ({ ...gpu, x: gpu.bandwidthGBs, y: metricValue(gpu, metric), z: gpu.vramGB }))
    .filter((gpu): gpu is typeof gpu & { y: number } => gpu.y != null)

  const compared = compareIds.map((id) => GPU_DATA.find((gpu) => gpu.id === id)).filter((gpu): gpu is GpuRecord => Boolean(gpu))
  const selectedMetric = METRICS.find((item) => item.key === metric) ?? METRICS[2]

  function toggleCompare(id: string) {
    setCompareIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 5 ? [...current, id] : current)
  }

  function resetFilters() {
    setQuery('')
    setVendor('全部')
    setSegment('全部')
    setMinVram(8)
    setNativeFormat('全部')
    setSortBy('int8')
  }

  return (
    <main inert={detail ? true : undefined} aria-hidden={detail ? true : undefined}>
      <header className="topbar">
        <div className="brand-mark"><Database size={18} /><span>GPU Index</span></div>
        <div className="top-meta"><span>数据截点 {DATA_AS_OF}</span><span>{GPU_DATA.length} 张卡</span></div>
      </header>

      <section className="intro">
        <div>
          <div className="eyebrow"><span className="live-dot" /> AI GPU 规格与价格数据库</div>
          <h1><span>把峰值算力放到</span><span>同一把尺子上。</span></h1>
          <p>聚焦近四年、显存 ≥ 8GB，且公开 INT8 稠密算力不低于 RTX 4090 十分之一的 GPU。稀疏值、推导值与缺失值严格分开。</p>
        </div>
        <aside className="scope-card">
          <span>入库阈值</span>
          <strong>INT8 ≥ {INT8_THRESHOLD} TOPS</strong>
          <small>按 RTX 4090 稠密 INT8 660.6 TOPS 的 1/10 计算</small>
        </aside>
      </section>

      <section className="filter-deck" aria-label="筛选器">
        <div className="filter-title"><SlidersHorizontal size={16} /><span>校准条件</span></div>
        <label className="search-box">
          <Search size={16} />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索型号或架构，如 AMD R9700、H800" aria-label="搜索型号或架构" />
        </label>
        <label><span>厂商</span><select value={vendor} onChange={(event) => setVendor(event.target.value as Vendor | '全部')}>{VENDORS.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>类型</span><select value={segment} onChange={(event) => setSegment(event.target.value as Segment | '全部')}>{SEGMENTS.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>最低显存</span><select value={minVram} onChange={(event) => setMinVram(Number(event.target.value))}>{[8, 12, 16, 24, 32, 48, 80, 128].map((value) => <option key={value} value={value}>{value} GB</option>)}</select></label>
        <label><span>原生格式</span><select value={nativeFormat} onChange={(event) => setNativeFormat(event.target.value as (typeof FORMATS)[number])}>{FORMATS.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>排序</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)}><option value="int8">INT8 高→低</option><option value="fp16">FP16 高→低</option><option value="bandwidth">带宽 高→低</option><option value="vram">显存 高→低</option><option value="rental">租价 低→高</option></select></label>
        <Button variant="ghost" onClick={resetFilters}>重置</Button>
      </section>

      <section className="compare-rail">
        <div><span className="rail-label">对比托盘</span><strong>{compareIds.length}/5</strong></div>
        <div className="compare-chips">
          {compared.map((gpu) => <button key={gpu.id} onClick={() => toggleCompare(gpu.id)}><span style={{ background: vendorColor[gpu.vendor] }} />{gpu.name}<X size={13} /></button>)}
          {!compared.length && <span className="empty-hint">从下方数据库选择最多 5 张卡</span>}
        </div>
      </section>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="workspace">
        <div className="workspace-head">
          <TabsList><TabsTrigger value="chart">算力分布</TabsTrigger><TabsTrigger value="compare">并排对比</TabsTrigger></TabsList>
          {activeTab === 'chart' && <div className="metric-switch" role="group" aria-label="图表指标">{METRICS.map((item) => <button className={metric === item.key ? 'active' : ''} key={item.key} onClick={() => setMetric(item.key)}>{item.label}</button>)}</div>}
        </div>

        <TabsContent value="chart" className="chart-layout">
          <div className="chart-panel">
            <div className="panel-heading"><div><span>横轴：显存带宽 · 双对数坐标</span><h2>{selectedMetric.label} 峰值 × 带宽</h2></div><Badge variant="outline">圆点大小 = 显存</Badge></div>
            <div className="chart-wrap">
              {chartData.length ? <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 20, bottom: 18, left: 8 }}>
                  <CartesianGrid strokeDasharray="2 6" stroke="#d8ddd7" />
                  <XAxis type="number" dataKey="x" name="带宽" unit=" GB/s" scale="log" domain={['auto', 'auto']} tickLine={false} axisLine={false} tick={{ fill: '#667069', fontSize: 11 }} />
                  <YAxis type="number" dataKey="y" name={selectedMetric.label} unit={` ${selectedMetric.unit}`} scale="log" domain={['auto', 'auto']} tickLine={false} axisLine={false} tick={{ fill: '#667069', fontSize: 11 }} width={58} />
                  <ZAxis type="number" dataKey="z" range={[70, 420]} />
                  <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => active && payload?.[0] ? <div className="chart-tooltip"><strong>{payload[0].payload.name}</strong><span>{formatNumber(payload[0].payload.y, 1)} {selectedMetric.unit}</span><span>{formatNumber(payload[0].payload.x)} GB/s · {payload[0].payload.vramGB} GB</span></div> : null} />
                  <Scatter data={chartData} onClick={(point) => { const payload = (point as { payload?: GpuRecord }).payload; if (payload) setDetail(payload) }} shape={(props: unknown) => {
                    const point = props as { cx: number; cy: number; size: number; payload: GpuRecord }
                    const radius = Math.max(5, Math.sqrt(point.size / Math.PI))
                    return <circle cx={point.cx} cy={point.cy} r={radius} fill={vendorColor[point.payload.vendor]} fillOpacity={0.78} stroke="#fff" strokeWidth={2} />
                  }} />
                </ScatterChart>
              </ResponsiveContainer> : <div className="no-data">当前条件下没有可绘制的数据</div>}
            </div>
            <div className="legend">{Object.entries(vendorColor).filter(([name]) => visible.some((gpu) => gpu.vendor === name)).map(([name, color]) => <span key={name}><i style={{ background: color }} />{name}</span>)}</div>
          </div>
          <aside className="reading-strip">
            <div><Gauge size={17} /><span>当前样本</span><strong>{visible.length}</strong></div>
            <div><MemoryStick size={17} /><span>最大显存</span><strong>{visible.length ? Math.max(...visible.map((gpu) => gpu.vramGB)) : 0} GB</strong></div>
            <div><Info size={17} /><span>口径</span><p>主视图一律采用不含结构化稀疏加速的稠密峰值；原生支持但未公布峰值的格式显示“—”。</p></div>
          </aside>
        </TabsContent>

        <TabsContent value="compare"><ComparePanel gpus={compared} /></TabsContent>
      </Tabs>

      <section className="database-section">
        <div className="section-heading"><div><span>规格数据库</span><h2>可筛选的原始记录</h2></div><p>{visible.length} / {GPU_DATA.length} 项</p></div>
        <div className="table-shell">
          <table>
            <thead><tr><th>对比</th><th>型号</th><th>显存</th><th>带宽</th><th>FP16</th><th>FP8</th><th>INT8</th><th>首发价</th><th>租用均价</th></tr></thead>
            <tbody>{visible.map((gpu) => {
              const checked = compareIds.includes(gpu.id)
              return <tr key={gpu.id}>
                <td><button className={`check ${checked ? 'checked' : ''}`} aria-label={`${checked ? '移除' : '加入'} ${gpu.name} 对比`} onClick={() => toggleCompare(gpu.id)}>{checked ? '✓' : '+'}</button></td>
                <td><button className="model-button" onClick={() => setDetail(gpu)}><span className="vendor-bar" style={{ background: vendorColor[gpu.vendor] }} /><span><strong>{gpu.name}</strong><small>{gpu.vendor} · {gpu.segment} · {gpu.architecture} · {gpu.evidence}</small></span><ArrowUpRight size={14} /></button></td>
                <td><strong>{gpu.vramGB} GB</strong><small>{gpu.memoryType}</small></td>
                <td>{formatNumber(gpu.bandwidthGBs)}<small>GB/s</small></td>
                <td>{formatNumber(gpu.fp16?.dense, 1)}<small>TFLOPS</small></td>
                <td>{formatNumber(gpu.fp8?.dense, 1)}<small>TFLOPS</small></td>
                <td>{formatNumber(gpu.int8?.dense, 1)}<small>TOPS</small></td>
                <td>{money(gpu.launchPriceUsd)}<small>{gpu.launchPriceNote ?? '—'}</small></td>
                <td>{averageRental(gpu) == null ? '—' : `$${formatNumber(averageRental(gpu), 2)}/h`}<small>{gpu.rentalQuotes.some((quote) => quote.basis === '均价') ? '公开聚合均价' : gpu.rentalQuotes.length ? `${gpu.rentalQuotes.length} 个公开样本` : '暂无可靠公开报价'}</small></td>
              </tr>
            })}</tbody>
          </table>
        </div>
      </section>

      <footer><p>数值优先取厂商规格与架构白皮书；第三方数据须交叉核验。点击型号查看每条记录的来源与口径。</p><span>GPU Index · research build</span></footer>
      <GpuSheet gpu={detail} onClose={() => setDetail(null)} />
    </main>
  )
}

function ComparePanel({ gpus }: { gpus: GpuRecord[] }) {
  if (!gpus.length) return <div className="compare-empty"><h2>对比托盘为空</h2><p>在下方数据库中勾选显卡。</p></div>
  const rows: Array<[string, (gpu: GpuRecord) => string]> = [
    ['显存', (gpu) => `${gpu.vramGB} GB ${gpu.memoryType}`],
    ['带宽', (gpu) => `${formatNumber(gpu.bandwidthGBs)} GB/s`],
    ['FP16 稠密', (gpu) => `${formatNumber(gpu.fp16?.dense, 1)} TFLOPS`],
    ['FP8 稠密', (gpu) => `${formatNumber(gpu.fp8?.dense, 1)} TFLOPS`],
    ['INT8 稠密', (gpu) => `${formatNumber(gpu.int8?.dense, 1)} TOPS`],
    ['功耗', (gpu) => gpu.powerW ? `${gpu.powerW} W` : '—'],
    ['首发价', (gpu) => money(gpu.launchPriceUsd)],
    ['租用均价', (gpu) => averageRental(gpu) == null ? '—' : `$${formatNumber(averageRental(gpu), 2)}/h`],
    ['发布日期', (gpu) => gpu.releaseDate],
    ['原生格式', (gpu) => gpu.nativeFormats.join(' · ')],
    ['并行度', (gpu) => gpu.parallelism.join(' · ') || '—'],
    ['证据等级', (gpu) => gpu.evidence],
  ]
  return <div className="compare-panel">
    <div className="compare-grid" style={{ gridTemplateColumns: `130px repeat(${gpus.length}, minmax(170px, 1fr))` }}>
      <div className="compare-corner">指标</div>{gpus.map((gpu) => <div className="compare-name" key={gpu.id}><i style={{ background: vendorColor[gpu.vendor] }} /><strong>{gpu.name}</strong><span>{gpu.vendor} · {gpu.segment}</span></div>)}
      {rows.flatMap(([label, accessor]) => [<div className="row-label" key={`${label}-label`}>{label}</div>, ...gpus.map((gpu) => <div className="compare-value" key={`${label}-${gpu.id}`}>{accessor(gpu)}</div>)])}
    </div>
  </div>
}

function GpuSheet({ gpu, onClose }: { gpu: GpuRecord | null; onClose: () => void }) {
  const precisionKeys = ['fp64', 'fp32', 'tf32', 'bf16', 'fp16', 'fp8', 'fp6', 'fp4', 'int8', 'int4'] as const
  return <Sheet open={Boolean(gpu)} onOpenChange={(open) => !open && onClose()}>
    <SheetContent className="detail-sheet">
      {gpu && <>
        <SheetHeader><div className="sheet-kicker"><span style={{ background: vendorColor[gpu.vendor] }} />{gpu.vendor} · {gpu.segment}<Badge variant="outline">{gpu.evidence}</Badge></div><SheetTitle>{gpu.name}</SheetTitle><SheetDescription>{gpu.architecture} · 发布 {gpu.releaseDate}</SheetDescription></SheetHeader>
        <div className="detail-body">
          <section className="spec-lead"><div><span>显存</span><strong>{gpu.vramGB} GB</strong><small>{gpu.memoryType}</small></div><div><span>带宽</span><strong>{formatNumber(gpu.bandwidthGBs)}</strong><small>GB/s</small></div><div><span>功耗</span><strong>{gpu.powerW ?? '—'}</strong><small>W</small></div></section>
          <section><h3>精度峰值</h3><div className="precision-list">{precisionKeys.filter((key) => gpu[key]).map((key) => { const item = gpu[key]; const provenance = item?.provenance === 'derived' ? '推导' : item?.provenance === 'cross-checked' ? '交叉核验' : '官方'; return <div key={key}><strong>{key.toUpperCase()} · {provenance}</strong><span>{formatNumber(item?.dense, 1)} {item?.unit}</span><small>{item?.sparse ? `稀疏 ${formatNumber(item.sparse, 1)}` : item?.note ?? '稠密峰值'}</small></div> })}</div></section>
          <section><h3>原生格式</h3><div className="tag-list">{gpu.nativeFormats.map((format) => <Badge variant="secondary" key={format}>{format}</Badge>)}</div></section>
          <section><h3>并行度与互联</h3><ul>{gpu.parallelism.map((item) => <li key={item}>{item}</li>)}{gpu.interconnect && <li>{gpu.interconnect}</li>}</ul></section>
          <section><h3>价格</h3><div className="price-line"><span>首发价</span><strong>{money(gpu.launchPriceUsd)}</strong></div>{gpu.rentalQuotes.length ? gpu.rentalQuotes.map((quote) => <a className="rental-line" href={quote.url} target="_blank" rel="noreferrer" key={`${quote.platform}-${quote.observedAt}`}><span>{quote.platform}<small>{quote.observedAt} · {quote.basis}</small></span><strong>${quote.hourlyUsd}/h <ArrowUpRight size={13} /></strong></a>) : <p className="muted-copy">没有足够可靠的公开租用报价，未用 0 代替。</p>}</section>
          <section><h3>来源与说明</h3>{gpu.sources.map((source) => <a className="source-link" href={source.url} target="_blank" rel="noreferrer" key={source.url}><span>{source.label}<small>{source.kind}</small></span><ArrowUpRight size={14} /></a>)}{gpu.notes.map((note) => <p className="note" key={note}>{note}</p>)}</section>
        </div>
      </>}
    </SheetContent>
  </Sheet>
}

export default App
