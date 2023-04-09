import { getConfiguration } from './getConfiguration'

export const sendSlackMessage = async (data: unknown) => {
	const { webhookUrl } = getConfiguration()

	await fetch(webhookUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
}
