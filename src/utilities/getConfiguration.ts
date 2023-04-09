import dotenv from 'dotenv'

dotenv.config()

export const getConfiguration = () => {
	const spreadsheetId = process.env.SPREADSHEET_ID
	const apiKey = process.env.API_KEY
	const webhookUrl = process.env.WEBHOOK_URL

	if (!spreadsheetId) {
		throw new Error('Missing SPREADSHEET_ID environment variable.')
	}
	if (!apiKey) {
		throw new Error('Missing API_KEY environment variable.')
	}
	if (!webhookUrl) {
		throw new Error('Missing WEBHOOK_URL environment variable.')
	}

	return {
		spreadsheetId,
		apiKey,
		webhookUrl,
	}
}
