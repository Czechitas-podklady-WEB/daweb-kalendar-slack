import { sheets as s } from '@googleapis/sheets'
import dotenv from 'dotenv'
import { exit } from 'process'

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

const todayMorning = new Date()
todayMorning.setHours(0, 0, 0, 0)

const futureAndCurrentEvents = cleanData.filter((event) => {
	const eventDate = new Date(
		event.date.year,
		event.date.month - 1,
		event.date.day,
		event.date.hour,
		event.date.minute,
	)

	return todayMorning <= eventDate
})

const activeEvent = futureAndCurrentEvents[0]

if (activeEvent === undefined) {
	console.log('No active event found.')
	exit(0)
}

if (
	activeEvent.date.year !== todayMorning.getFullYear() ||
	activeEvent.date.month !== todayMorning.getMonth() + 1 ||
	activeEvent.date.day !== todayMorning.getDate()
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

const slideUrl = new URL('https://intro.czechitas-podklady.cz/slide.html')
slideUrl.searchParams.set(
	'title',
	activeEvent.title
		.split(' ')
		.reduce(
			(lines, word) => {
				console.log(lines)
				if (lines[lines.length - 1].length + word.length > 22) {
					lines.push(word + ' ')
				} else {
					lines[lines.length - 1] += word + ' '
				}
				return lines
			},
			[''],
		)
		.join('\n'),
)
slideUrl.searchParams.set('meta1', activeEvent.lecturer ?? '')
slideUrl.searchParams.set(
	'meta2',
	`${activeEvent.date.day}. ${activeEvent.date.month}. ${activeEvent.date.year} ${activeEvent.date.hour}:${activeEvent.date.minute}`,
)
const previewImage = new URL('https://api.apiflash.com/v1/urltoimage')
previewImage.searchParams.set('access_key', '051686ce27cd408ca39cc01a9b187cb3')
previewImage.searchParams.set('format', 'jpeg')
previewImage.searchParams.set('width', '1920')
previewImage.searchParams.set('height', '1080')
previewImage.searchParams.set('response_type', 'image')
previewImage.searchParams.set('ttl', '864000')
previewImage.searchParams.set('url', slideUrl.toString())

console.log('Message:')
console.log(message)
console.log('Image:', previewImage.toString())

await fetch(webhookUrl, {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		text: message,
		blocks: [
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: message,
				},
			},
			{
				type: 'image',
				image_url: previewImage.toString(),
				alt_text: '',
			},
		],
	}),
})
