import { sheets as s } from '@googleapis/sheets'
import { CalendarEvent } from './CalendarEvent'
import { LocationType } from './LocationType'
import { getAllLecturers } from './getAllLecturers'
import { getConfiguration } from './getConfiguration'

export const getAllCalendarEvents = async () => {
	const allLecturers = await getAllLecturers()

	const { spreadsheetId, apiKey } = getConfiguration()

	const dateColumnIndex = 2
	const timeStartColumnIndex = 3
	const timeEndColumnIndex = 4
	const titleColumnIndex = 5
	const lecturersColumnIndex = 7
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
		const lecturers = ((row[lecturersColumnIndex] as string) ?? '')
			.trim()
			.split(', ')
			.filter((name) => name !== '')
			.map((name) => {
				const known = allLecturers.find((lecturer) => lecturer.name === name)
				if (known) {
					return known
				}
				return {
					name,
					avatarUrl: null,
					slackId: null,
				}
			})
		const type: LocationType = (() => {
			const type: string = (row[typeColumnIndex] ?? '').trim()
			if (type === 'hybrid') {
				return {
					label: 'hybrid',
					code: 'hybrid',
					emoji: '🏰',
				}
			}
			if (type === 'online') {
				return {
					label: 'online',
					code: 'online',
					emoji: '💻',
				}
			}
			if (type === 'prezenčně' || type === 'prezenční') {
				return {
					label: 'online',
					code: 'online',
					emoji: '🚶',
				}
			}
			return {
				label: type,
				code: 'unkwnown',
				emoji: '🤹‍♀️',
			}
		})()
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
					lecturers,
					type,
					link,
				})
			}
		}
	})

	return cleanData
}
