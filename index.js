import { sheets as s } from '@googleapis/sheets'
import dotenv from 'dotenv'

dotenv.config()

const spreadsheetId = '1bwBwbf7Li0pMZho7cK66Zrmv1X_An9UufQ_W5QCoYX4'
const apiKey = process.env.API_KEY
const dateColumnIndex = 2
const timeColumnIndex = 3
const titleColumnIndex = 5
const lecturerColumnIndex = 7
const linkColumnIndex = 14
const range = 'Rozvrh!A1:O150'

const sheets = s('v4')

const sheet = await sheets.spreadsheets.values.get({
	key: apiKey,
	spreadsheetId,
	majorDimension: 'ROWS',
	range,
})

const cleanData = []

sheet.data.values.forEach((row) => {
	const date = row[dateColumnIndex]
	const time = row[timeColumnIndex]
	const title = row[titleColumnIndex]
	const lecturer = row[lecturerColumnIndex]
	const link = row[linkColumnIndex]

	if (date && time && title && lecturer && link) {
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
			time,
			title,
			lecturer,
			link,
		})
	}
})

const nowMorning = new Date()
nowMorning.setHours(0, 0, 0, 0)

const futureAndCurrentEvents = cleanData.filter((event) => {
	const eventDate = new Date(
		event.date.year,
		event.date.month - 1,
		event.date.day,
		event.date.hour,
		event.date.minute,
	)

	return nowMorning <= eventDate
})

if (futureAndCurrentEvents.length === 0) {
	exit(0)
}

const activeEvent = futureAndCurrentEvents[0]

console.log(activeEvent)
