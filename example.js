'use strict'

const connect = require('connect')
const {createServer} = require('http')
const generateIcs = require('./generate-ics')
const aboutRoute = require('./about')
const feedRoute = require('./feed')

const TITLE = 'some calendar feed'

const productId = 'https://github.com/derhuerst/ics-service'
const events = [{
	uid: 'a',
	title: 'Event A', description: 'This is A.',
	location: 'Alamo Square, San Francisco, CA',
	url: 'https://example.org/',
	geo: {lat: 37.774703, lon: -122.432642, radius: 20},
	categories: ['event'],
	start: ['2020', '08', '08', '08', '08'],
	// todo: `tzid: 'America/Los_Angeles'`
	startOutputType: 'local',
	duration: {hours: 1, minutes: 30},
	status: 'CONFIRMED',
	sequence: 1,
	productId,
}, {
	uid: 'b',
	title: 'Event B', description: 'This is B.',
	location: 'Bank of America, 501 Castro St, San Francisco, CA',
	url: 'https://example.com/',
	geo: {lat: 37.760728, lon: -122.434741, radius: 30},
	categories: ['event'],
	start: ['2020', '09', '09', '09', '09'],
	// todo: `tzid: 'America/Los_Angeles'`
	startOutputType: 'local',
	duration: {hours: 0, minutes: 45},
	status: 'CONFIRMED',
	sequence: 2,
	productId,
}]

const getIcs = feedUrl => generateIcs(TITLE, events, feedUrl)

const app = connect()
app.use('/feed', feedRoute(getIcs))
app.use('/', aboutRoute(TITLE))

createServer(app).listen(3000)
