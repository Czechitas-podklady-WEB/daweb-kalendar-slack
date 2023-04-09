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

export const getSmtpConfiguration = () => {
	const host = process.env.SMTP_HOST
	const port = parseInt(process.env.SMTP_PORT ?? '', 10)
	const user = process.env.SMTP_USER
	const password = process.env.SMTP_PASSWORD

	if (!host) {
		throw new Error('Missing SMTP_HOST environment variable.')
	}
	if (!port) {
		throw new Error('Missing SMTP_PORT environment variable.')
	}
	if (!user) {
		throw new Error('Missing SMTP_USER environment variable.')
	}
	if (!password) {
		throw new Error('Missing SMTP_PASSWORD environment variable.')
	}

	return {
		host,
		port,
		user,
		password,
	}
}
