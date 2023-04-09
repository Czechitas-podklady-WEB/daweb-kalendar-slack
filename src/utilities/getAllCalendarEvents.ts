import { sheets as s } from '@googleapis/sheets'
import { CalendarEvent } from './CalendarEvent'
import { getConfiguration } from './getConfiguration'

export const getAllCalendarEvents = async () => {
	const { spreadsheetId, apiKey } = getConfiguration()

	const dateColumnIndex = 2
	const timeColumnIndex = 3
	const titleColumnIndex = 5
	const lecturerColumnIndex = 7
	const typeColumnIndex = 8
	const linkColumnIndex = 14
	const range = 'Rozvrh!A1:O150'

	const sheets = s('v4')

	const sheet = await sheets.spreadsheets.values.get({
		key: apiKey,
		spreadsheetId,
		majorDimension: 'ROWS',
		range,
	})

	const cleanData: CalendarEvent[] = []

	sheet.data.values?.forEach((row) => {
		const date = row[dateColumnIndex]
		const time = row[timeColumnIndex]
		const title = row[titleColumnIndex]
		const lecturer = row[lecturerColumnIndex]
		const type = row[typeColumnIndex]
		const link = row[linkColumnIndex]

		if (date && time && title) {
			const [day, month, year] = date.split('. ')
			const [hour, minute] = time.split(':')
			cleanData.push({
				date: {
					year: parseInt(year),
					month: parseInt(month),
					day: parseInt(day),
					hour: parseInt(hour),
					minute: parseInt(minute),
				},
				title,
				lecturer,
				type,
				link,
			})
		}
	})

	return cleanData
}
