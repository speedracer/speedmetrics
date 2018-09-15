export interface TraceEvent {
  name: string
  cat: string
  args: {
    data?: {
      documentLoaderURL?: string
      url?: string
    }
    frame?: string
    snapshot?: string
  }
  pid: number
  tid: number
  ts: number
  dur: number
}

export interface MetricsBag<T> {
  navigationStart?: T
  domContentLoaded?: T
  firstContentfulPaint?: T
  firstMeaningfulPaint?: T
  firstPaint?: T
  load?: T
}

export type MetricsEvents = MetricsBag<TraceEvent>
export type MetricsTimings = MetricsBag<number>

export interface Metrics {
  events: MetricsEvents
  timings: MetricsTimings
}
