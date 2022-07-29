'use strict'

const {strictEqual} = require('assert')
const {createEvents: formatEvents} = require('ics')

// todo: do this properly
const wrap = (str, at = 72) => {
	let res = str.slice(0, at)
	for (let i = at; i < str.length; i += at - 1) {
		res += '\r\n ' + str.slice(i, i + at - 1)
	}
	return res
}
strictEqual(
	wrap('-'.repeat(30), 12),
	`------------\r\n -----------\r\n -------`
)

const insertAfter = (lines, marker, newStr) => {
	const match = marker.exec(lines)
	if (match === null) {
		throw new Error(`couldnt find the ${marker} marker`)
	}
	const endI = match.index + match[0].length
	return lines.slice(0, endI) + newStr + lines.slice(endI)
}
strictEqual(insertAfter(
	'foo\r\nbar\r\nfoo\r\nbaz',
	/foo/,
	'123'
), 'foo123\r\nbar\r\nfoo\r\nbaz')

const appleStructuredLocation = (ev) => {
	if (!ev.location) return null
	if (!ev.geo) return null
	if ('number' !== typeof ev.geo.lat) return null
	if ('number' !== typeof ev.geo.lon) return null
	if ('number' !== typeof ev.geo.radius) return null

	return wrap([
		'X-APPLE-STRUCTURED-LOCATION;',
		'VALUE=URI;',
		`X-APPLE-RADIUS=${ev.geo.radius | 0};`,
		`X-TITLE="${ev.location}":`,
		`geo:${ev.geo.lat.toFixed(6)},${ev.geo.lon.toFixed(6)}`,
	].join(''))
}

const generateIcs = (title, rawEvents, feedUrl = null) => {
	const events = rawEvents.map((ev) => {
		ev = {...ev}
		if (ev.geo) {
			ev.geo = {...ev.geo}
			delete ev.geo.radius
		}
		if (ev.location) {
			ev.location = ev.location.replace(/,/g, '\\,')
		}
		return ev
	})
	let {error, value: ics} = formatEvents(events)
	ics = ics || ''
	if (error) throw error

	// per event, insert Apple-specific location markup
	for (const ev of rawEvents) {
		const locMarkup = appleStructuredLocation(ev)
		if (!locMarkup) continue

		const startI = ics.indexOf(`\r\nUID:${ev.uid}\r\n`)
		if (startI < 0) continue
		const evL = ics.slice(startI).indexOf(`\r\nEND:VEVENT\r\n`)
		if (evL < 0) continue
		ics = [
			ics.slice(0, startI + evL),
			'\r\n', locMarkup,
			ics.slice(startI + evL),
		].join('')
	}

	// add feed metadata
	// todo: this is really brittle, make it more robust
	const methodPublish = `\r\nMETHOD:PUBLISH\r\n`
	const markerI = ics.indexOf(methodPublish)
	if (markerI >= 0) {
		const endI = markerI + methodPublish.length
		ics = [
			ics.slice(0, endI),
			`X-WR-CALNAME:${title}\r\n`,
			feedUrl ? `X-ORIGINAL-URL:${feedUrl}\r\n` : '',
			ics.slice(endI),
		].join('')
	}

	return ics
}

module.exports = generateIcs
