import { sheets as s } from '@googleapis/sheets'
import dotenv from 'dotenv'

dotenv.config()

const spreadsheetId = '1bwBwbf7Li0pMZho7cK66Zrmv1X_An9UufQ_W5QCoYX4'
const apiKey = process.env.API_KEY
const webhookUrl = process.env.WEBHOOK_URL
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

const cleanData = []

sheet.data.values.forEach((row) => {
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

const activeEvent = futureAndCurrentEvents[0]

if (activeEvent === undefined) {
	console.log('No active event found.')
	exit(0)
}

if (
	activeEvent.date.year !== nowMorning.getFullYear() ||
	activeEvent.date.month !== nowMorning.getMonth() + 1 ||
	activeEvent.date.day !== nowMorning.getDate()
) {
	console.log('No active event scheduled for today.')
	exit(0)
}

let message = `Dnes, *${activeEvent.date.day}. ${activeEvent.date.month}. ${
	activeEvent.date.year
}* v *${activeEvent.date.hour}:${activeEvent.date.minute}* začíná další lekce.
Plánované téma je *${activeEvent.title.replaceAll('\n', ', ')}*.`

if (activeEvent.lecturer) {
	message += `\nVýuku povede *${activeEvent.lecturer}*.`
}
if (activeEvent.type === 'online') {
	message += `\nLekce bude probíhat *pouze online*`

	if (activeEvent.link) {
		message += ` a odkaz pro připojení najdeš zde: ${activeEvent.link}`
	}
	message += '.'
} else {
	if (activeEvent.type) {
		message += `\nLekce bude probíhat ${
			activeEvent.type === 'hybrid'
				? '*hybridně*'
				: `v režimu *${activeEvent.type}*`
		}.`
	}
	if (activeEvent.link) {
		message += `\nOdkaz pro připojení online: ${activeEvent.link}.`
	}
}

console.log('Message:')
console.log(message)

await fetch(webhookUrl, {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		text: message,
	}),
})
