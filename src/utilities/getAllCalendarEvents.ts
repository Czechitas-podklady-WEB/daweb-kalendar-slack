import { sheets as s } from '@googleapis/sheets'
import { Attendance } from './Attendance'
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

	const { values } = (
		await sheets.spreadsheets.values.get({
			key: apiKey,
			spreadsheetId,
			majorDimension: 'ROWS',
			range,
		})
	).data
	const backgroundColorValues = (
		await sheets.spreadsheets.get({
			key: apiKey,
			spreadsheetId,
			ranges: [range],
			fields: 'sheets.data.rowData.values.userEnteredFormat.backgroundColor',
		})
	).data.sheets
		?.at(0)
		?.data?.at(0)?.rowData

	const cleanData: CalendarEvent[] = []

	values?.forEach((row, rowIndex) => {
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
					label: 'prezenčně',
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
				emoji: '🤹',
			}
		})()
		const link: string = (row[linkColumnIndex] ?? '').trim()
		const attendance: Attendance = (() => {
			const backgroundColor = backgroundColorValues
				?.at(rowIndex)
				?.values?.at(titleColumnIndex)?.userEnteredFormat?.backgroundColor
			if (
				backgroundColor?.red === 1 &&
				backgroundColor?.green === 0.9490196 &&
				backgroundColor?.blue === 0.8
			) {
				return 'required'
			}
			if (
				backgroundColor?.red === 0.8117647 &&
				backgroundColor?.green === 0.8862745 &&
				backgroundColor?.blue === 0.9529412
			) {
				return 'optional'
			}
			return 'unknown'
		})()

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
					attendance,
				})
			}
		}
	})

	return cleanData
}
