# ics-service

**Create a calendar feed people can subscribe to.**

[![npm version](https://img.shields.io/npm/v/ics-service.svg)](https://www.npmjs.com/package/ics-service)
[![build status](https://api.travis-ci.org/derhuerst/ics-service.svg?branch=master)](https://travis-ci.org/derhuerst/ics-service)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/ics-service.svg)
![minimum Node.js version](https://img.shields.io/node/v/ics-service.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


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
	start: ['2020', '08', '08', '08', '08'],
	duration: {hours: 1, minutes: 30},
	status: 'CONFIRMED',
	sequence: 1,
	productId: GENERATOR,
}, {
	uid: 'b',
	title: 'B', description: 'B.',
	start: ['2020', '09', '09', '09', '09'],
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


## Contributing

If you have a question or need support using `ics-service`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, use [the issues page](https://github.com/derhuerst/ics-service/issues).
