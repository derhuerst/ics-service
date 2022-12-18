'use strict'

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
				res.writeHead(500, {
					'content-type': 'application/json',
				})
				res.end(JSON.stringify(err, null, '\t'))
			}
		}

		try {
			Promise.resolve(getIcs(feedUrl(req), req))
			.then((ics) => {
				// iCalendar files typically have […] a MIME type of "text/calendar".
				// https://icalendar.org
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
