'use strict'

const {htmlEscape} = require('escape-goat')

const createAboutRoute = (title, feedPath = '/feed') => {
	const aboutRoute = (req, res) => {
		const {host} = req.headers
		const body = `
<!DOCTYPE html>
<head>
<meta charset="utf-8">
<title>${htmlEscape(title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<h1>${htmlEscape(title)}</h1>
<p>
	<a href="webcal://${host}${feedPath}">subscribe to this calendar</a>
</p>
<p>
	If the link above doesn't open your calendar, copy the link below and create a subscription in your calendar app:
	<br>
	<code style="display:block">https://${host}${feedPath}</code>
</p>
</body>
</html>`

		res.writeHead(200, 'ok', {'content-type': 'text/html'})
		res.end(body)
	}
	return aboutRoute
}

module.exports = createAboutRoute
