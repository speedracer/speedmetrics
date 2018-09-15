import test from 'ava'
import { readFile } from 'fs'
import { gunzip } from 'zlib'
import { memoize } from 'lodash'

import collectMetrics from '../src'
import { TraceEvent } from '../src/types'

const readTrace = memoize((filename: string): Promise<TraceEvent[]> => {
  return new Promise((resolve, reject) => {
    readFile(filename, (err, rawData) => {
      if (err) reject(err)
      gunzip(rawData, (err, data) => {
        if (err) reject(err)
        resolve(JSON.parse(data.toString('utf8')).traceEvents)
      })
    })
  })
})

test('collect events and timings', async t => {
  const trace = await readTrace('./test/fixtures/trace.json.gz')
  const metrics = await collectMetrics(trace)

  t.is(typeof metrics.timings, 'object')
  t.is(typeof metrics.events, 'object')
})

test('compute timings of each event', async t => {
  const trace = await readTrace('./test/fixtures/trace.json.gz')
  const metrics = await collectMetrics(trace)

  t.is(typeof metrics.timings.navigationStart, 'number')
})

test('collect events from the tab\'s process', async t => {
  const trace = await readTrace('./test/fixtures/trace.json.gz')
  const metrics = await collectMetrics(trace)

  const { navigationStart } = metrics.events
  t.is(navigationStart.pid, metrics.events.domContentLoaded.pid)
  t.is(navigationStart.pid, metrics.events.firstPaint.pid)
  t.is(navigationStart.pid, metrics.events.firstContentfulPaint.pid)
  t.is(navigationStart.pid, metrics.events.firstMeaningfulPaint.pid)
  t.is(navigationStart.pid, metrics.events.load.pid)
})

test('find correct metrics timings', async t => {
  const trace = await readTrace('./test/fixtures/trace.json.gz')
  const { timings } = await collectMetrics(trace)

  t.snapshot(timings)
})
