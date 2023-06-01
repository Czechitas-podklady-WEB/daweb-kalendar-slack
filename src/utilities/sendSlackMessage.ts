import { getConfiguration } from './getConfiguration'

export const sendSlackMessage = async (data: unknown) => {
	const { webhookUrl } = getConfiguration()

	const response = await fetch(webhookUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})

	const text = await response.text()
	if (text !== 'ok') {
		throw new Error(`Slack message was not sent. "${text}"`)
	}
}
