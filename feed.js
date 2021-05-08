'use strict'

const URL = require('url');

const feedUrl = (req) => {
	const url = new URL(req.url, 'http://' + req.headers.host)
	url.search = ''
	return url.href
}

const createFeedRoute = (getIcs) => {
	const feedRoute = (req, res) => {
		const handleError = (err) => {
			console.error(err)
			if (!res.headersSent) {
				res.writeHead(500, 'error')
				res.end(err + '')
			}
		}

		try {
			Promise.resolve(getIcs(feedUrl(req), req))
			.then((ics) => {
				res.writeHead(200, 'ok', {'content-type': 'text/calendar'})
				res.end(ics)
			})
			.catch(handleError)
		} catch (err) {
			handleError(err)
		}
	}
	return feedRoute
}

module.exports = createFeedRoute
