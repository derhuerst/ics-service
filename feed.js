'use strict'

const feedUrl = (req) => {
	const url = new URL(req.url, 'http://' + req.headers.host)
	url.search = ''
	return url.href
}

const createFeedRoute = (getIcs, opt = {}) => {
	const {
		cacheControl,
		maxAge,
	} = {
		cacheControl: true,
		// todo [breaking]: increase to e.g. 5m
		maxAge: 0, // in seconds
		...opt,
	}
	if ('boolean' !== typeof cacheControl) {
		throw new Error('opt.cacheControl must be a boolean')
	}
	if (!Number.isInteger(maxAge)) {
		throw new Error('opt.maxAge must be a integer')
	}

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
				const headers = {
					// iCalendar files typically have […] a MIME type of "text/calendar".
					// https://icalendar.org
					'content-type': 'text/calendar',
				}

				if (cacheControl) {
					headers['Cache-Control'] = `public,max-age=${maxAge}`
				}

				res.writeHead(200, 'ok', headers)
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
