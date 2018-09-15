# ![Speed Metrics]()

[![travis][travis-image]][travis-url] [![codecov][codecov-image]][codecov-url]

[travis-image]: https://img.shields.io/travis/speedracer/speedmetrics.svg?style=flat
[travis-url]: https://travis-ci.org/speedracer/speedmetrics
[codecov-image]: https://img.shields.io/codecov/c/github/speedracer/speedmetrics.svg
[codecov-url]: https://codecov.io/github/speedracer/speedmetrics

Collect meaningful metrics from Chrome's trace events.

## Quickstart

### Installation

```sh
npm install speedmetrics
```

### Usage

```js
import collectMetrics from 'speedmetrics'

const metrics = await collectMetrics('trace.json')
console.log(metrics)
```
```js
{
  timings: {
    navigationStart: 0,
    domContentLoaded: 200,
    firstPaint: 400,
    firstContentfulPaint: 400,
    firstMeaningfulPaint: 600,
    load: 1000
  }
  events: {
    /* ... */
  }
}
```

## API

### metrics(filename)

Loads a trace file name and return a promise resolving to collected metrics.

```js
const metrics = await collectMetrics('trace.json')
```

### metrics(traceEvents)

Accepts a trace events object and return a promise resolving to collected metrics.

```js
readFile('trace.json', 'utf8', async (err, data) => {
  const metrics = await collectMetrics(data.traceEvents)
})
```
