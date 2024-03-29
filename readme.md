# ics-service

**Create a calendar feed people can subscribe to.**

[![npm version](https://img.shields.io/npm/v/ics-service.svg)](https://www.npmjs.com/package/ics-service)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/ics-service.svg)
![minimum Node.js version](https://img.shields.io/node/v/ics-service.svg)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)
[![chat with me on Twitter](https://img.shields.io/badge/chat%20with%20me-on%20Twitter-1da1f2.svg)](https://twitter.com/derhuerst)


## Installation

```shell
npm install ics-service
```


## Usage

```js
const express = require('express')
const generateIcs = require('ics-service/generate-ics')
const aboutRoute = require('ics-service/about')
const feedRoute = require('ics-service/feed')

const TITLE = 'some calendar feed'
const GENERATOR = 'my feed generator'

const events = [{
	uid: 'a', title: 'A', description: 'A.',
	location: 'Alamo Square, San Francisco, CA',
	url: 'https://example.org/',
	geo: {lat: 37.774703, lon: -122.432642, radius: 20},
	categories: ['event'],
	start: [2020, 8, 8, 8, 8],
	duration: {hours: 1, minutes: 30},
	status: 'CONFIRMED',
	sequence: 1,
	productId: GENERATOR,
}, {
	uid: 'b',
	title: 'B', description: 'B.',
	start: [2020, 9, 9, 9, 9],
	duration: {hours: 0, minutes: 45},
	status: 'CONFIRMED',
	sequence: 2,
	productId: GENERATOR,
}]

const getIcs = feedUrl => generateIcs(TITLE, events, feedUrl)

const app = express()
app.use('/feed', feedRoute(getIcs))
app.use('/', aboutRoute(TITLE))
```

The `events` array is passed into [`ics@3`](https://github.com/adamgibbons/ics/tree/v3.0.0) almost unaltered, so check [`ics`'s docs](https://github.com/adamgibbons/ics/blob/v3.0.0/README.md) for more information on the format.

Optionally, you can pass an options object into `generateIcs`, whose fields selectively override the following defaults:

```js
{
	// Send a Cache-Control header to let clients and/or shared caches (a.k.a. CDNS)
	// cache the calendar feed. If you set this option to false, it won't be sent.
	// see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
	cacheControl: true,
	// The number of seconds that a the calendar-feed is allowed to be cached.
	// Note: With ics-service's next major version dump, this will be increased.
	maxAge: 0,
	// Send an ETag header, so that clients don't have to redownload the calendar feed.
	// see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag
	etag: true,
}
```


## Contributing

If you have a question or need support using `ics-service`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, use [the issues page](https://github.com/derhuerst/ics-service/issues).
