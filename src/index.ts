import { filter, find, flow, get, mapValues, reduce, replace, sortBy } from 'lodash'

import { TraceEvent, MetricsEvents, MetricsTimings, Metrics } from './types'

const METRICS_NAME = [
  'firstPaint',
  'firstContentfulPaint',
  'firstMeaningfulPaint',
  'loadEventEnd',
  'domContentLoadedEventEnd'
]

const filterKeyEvents = (traceEvents: TraceEvent[]) => {
  return filter(
    traceEvents,
    (e: TraceEvent) =>
      e.cat.includes('blink.user_timing') ||
      e.cat.includes('loading') ||
      e.cat.includes('devtools.timeline') ||
      e.cat === '__metadata'
  )
}

const sortByTimestamp = (keyEvents: TraceEvent[]) => {
  return sortBy(keyEvents, 'ts')
}

const filterFrameEvents = (keyEvents: TraceEvent[]) => {
  const frame = get(
    find(keyEvents, (e: TraceEvent) => e.name === 'TracingStartedInBrowser'),
    'args.data.frames[0]'
  )

  return filter(keyEvents, (e: TraceEvent) => e.args.frame === frame.frame)
}

const filtertMetricEvents = (frameEvents: TraceEvent[]) => {
  const navigationStart = find(
    frameEvents,
    (e: TraceEvent) =>
      e.name === 'navigationStart' && /^https?:/.test(e.args.data.documentLoaderURL)
  )

  const events: MetricsEvents = reduce(
    METRICS_NAME,
    (metrics: MetricsEvents, name: string) => ({
      ...metrics,
      [replace(name, 'EventEnd', '')]: find(
        frameEvents,
        (e: TraceEvent) => e.name === name && e.ts > navigationStart.ts
      )
    }),
    { navigationStart }
  )

  const timings: MetricsTimings = mapValues(
    events,
    (e: TraceEvent) => (e.ts - navigationStart.ts) / 1000
  )

  return {
    timings,
    events
  }
}

const collectMetrics = (trace: TraceEvent[]): Metrics => {
  return flow(
    // Parse the trace for our key events
    filterKeyEvents,
    // Sort them by timestamp using stable sort
    sortByTimestamp,
    // Filter to just events matching the frame ID for sanity
    filterFrameEvents,
    // Collect navigation start, paint events, and load events
    filtertMetricEvents
  )(trace)
}

export default collectMetrics
