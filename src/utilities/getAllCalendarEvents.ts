import { sheets as s } from '@googleapis/sheets'
import { CalendarEvent } from './CalendarEvent'
import { getConfiguration } from './getConfiguration'

export const getAllCalendarEvents = async () => {
	const { spreadsheetId, apiKey } = getConfiguration()

	const dateColumnIndex = 2
	const timeStartColumnIndex = 3
	const timeEndColumnIndex = 4
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
		const date: string = (row[dateColumnIndex] ?? '').trim()
		const timeStart: string = (row[timeStartColumnIndex] ?? '').trim()
		const timeEnd: string = (row[timeEndColumnIndex] ?? '').trim()
		const title: string = (row[titleColumnIndex] ?? '')
			.trim()
			.replaceAll('\n', ' ')
		const lecturer: string = (row[lecturerColumnIndex] ?? '').trim()
		const type: string = (row[typeColumnIndex] ?? '').trim()
		const link: string = (row[linkColumnIndex] ?? '').trim()

		if (date && timeStart && title) {
			const [day, month, year] = date.split('. ')
			const [hourStart, minuteStart] = timeStart.split(':')
			const [hourEnd, minuteEnd] = timeEnd.split(':')
			if (day && month && year && hourStart && minuteStart) {
				const dateStart = new Date(
					parseInt(year),
					parseInt(month) - 1,
					parseInt(day),
					parseInt(hourStart),
					parseInt(minuteStart),
				)
				const dateEnd =
					hourEnd && minuteEnd
						? (() => {
								const date = new Date(dateStart)
								date.setHours(parseInt(hourEnd), parseInt(minuteEnd))
								return date
						  })()
						: null

				cleanData.push({
					dateStart,
					dateEnd,
					dateStartLegacy: {
						year: parseInt(year),
						month: parseInt(month),
						day: parseInt(day),
						hour: parseInt(hourStart),
						minute: parseInt(minuteStart),
					},
					timeEndLegacy:
						hourEnd && minuteEnd
							? {
									hour: parseInt(hourEnd),
									minute: parseInt(minuteEnd),
							  }
							: null,
					title,
					lecturer,
					type,
					link,
				})
			}
		}
	})

	return cleanData
}
