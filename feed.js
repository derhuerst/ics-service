'use strict'

const feedUrl = (req) => {
	const url = new URL(req.url, 'http://' + req.headers.host)
	url.search = ''
	return url.href
}

const createFeedRoute = (getIcs) => {
	const feedRoute = (req, res) => {
		try {
			const ics = getIcs(feedUrl(req))
			res.writeHead(200, 'ok', {'content-type': 'text/calendar'})
			res.end(ics)
		} catch (err) {
			console.error(err)
			res.writeHead(500, 'error')
			res.end(err + '')
		}
	}
	return feedRoute
}

module.exports = createFeedRoute
