import { sheets as s } from '@googleapis/sheets'
import { Lecturer } from './Lecturer'
import { getConfiguration } from './getConfiguration'
import { isDefined } from './isDefined'

export const getAllLecturers = async (): Promise<Lecturer[]> => {
	const { spreadsheetId, apiKey } = getConfiguration()

	const nameColumnIndex = 0
	const avatarUrlColumnIndex = 2
	const range = 'Lektoři!A1:C150'

	const sheets = s('v4')

	const sheet = await sheets.spreadsheets.values.get({
		key: apiKey,
		spreadsheetId,
		majorDimension: 'ROWS',
		range,
	})

	return (sheet.data.values ?? [])
		.map((row) => {
			const name: string = (row[nameColumnIndex] ?? '').trim()
			const avatarUrl: string | null =
				(row[avatarUrlColumnIndex] ?? '').trim() || null
			const slackId =
				avatarUrl?.split('-').find((part) => part.startsWith('U')) ?? null

			if (!name) {
				return null
			}

			return {
				name,
				avatarUrl,
				slackId,
			}
		})
		.filter(isDefined)
}
