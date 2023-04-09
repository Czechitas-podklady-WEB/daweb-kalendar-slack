import { sheets as s } from '@googleapis/sheets'
import dotenv from 'dotenv'
import { exit } from 'process'
import { createPreviewImageUrl } from './utilities/createPreviewImageUrl'
import { createSlideUrl } from './utilities/createSlideUrl'
import { knownSlackUsers } from './utilities/knownSlackUsers'
import { updateWebsiteSlideUrl } from './utilities/updateWebsiteSlideUrl'

dotenv.config()

const spreadsheetId = process.env.SPREADSHEET_ID as string
const apiKey = process.env.API_KEY as string
const webhookUrl = process.env.WEBHOOK_URL as string
// @TODO: remove cast and throw if undefined

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

const cleanData: Array<{
	date: {
		year: number
		month: number
		day: number
		hour: number
		minute: number
	}
	title: string
	lecturer: string
	type: string
	link: string
}> = []

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
}* v *${activeEvent.date.hour}:${activeEvent.date.minute
	.toString()
	.padStart(2, '0')}* začíná další lekce.
Plánované téma je *${activeEvent.title.replaceAll('\n', ', ')}*.`

const lecturer = activeEvent.lecturer
	?.split(', ')
	.map((name) => {
		const lecturer = knownSlackUsers.find((user) => user.name === name)
		if (lecturer) {
			return `<@${lecturer.memberId}>`
		}
		return name
	})
	.join(', ')

if (lecturer) {
	message += `\nVýuku povede *${lecturer}*.`
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

const slideUrl = createSlideUrl(activeEvent)

const previewImageUrl = createPreviewImageUrl(slideUrl)

console.log('Message:')
console.log(message)
console.log('')
console.log('Image:', previewImageUrl)

await fetch(webhookUrl, {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		text: message,
		blocks: [
			{
				type: 'image',
				image_url: previewImageUrl,
				alt_text: '',
			},
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: message,
				},
			},
		],
	}),
})

await updateWebsiteSlideUrl(slideUrl)
