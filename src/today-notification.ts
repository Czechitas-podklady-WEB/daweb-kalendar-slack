import { exit } from 'process'
import { createCalenderEventSlideUrl } from './utilities/createCalenderEventSlideUrl'
import { createPreviewImageUrl } from './utilities/createPreviewImageUrl'
import { filterFutureCalendarEvents } from './utilities/filterFutureCalendarEvents'
import { fullUrlToShortText } from './utilities/fullUrlToShortText'
import { getAllCalendarEvents } from './utilities/getAllCalendarEvents'
import { knownSlackUsers } from './utilities/knownSlackUsers'
import { sendSlackMessage } from './utilities/sendSlackMessage'
import { updateWebsiteSlideUrl } from './utilities/updateWebsiteSlideUrl'

const allCalendarEvents = await getAllCalendarEvents()

const todayMorning = new Date()
todayMorning.setHours(0, 0, 0, 0)

const futureAndCurrentEvents = filterFutureCalendarEvents(
	todayMorning,
	allCalendarEvents,
)

const activeEvent = futureAndCurrentEvents[0]

if (activeEvent === undefined) {
	console.log('No active event found.')
	exit(0)
}

const slideUrl = createCalenderEventSlideUrl(activeEvent)

await updateWebsiteSlideUrl(slideUrl)

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
const link = activeEvent.link
	? `<${activeEvent.link}|${fullUrlToShortText(activeEvent.link)}>`
	: null
if (activeEvent.type === 'online') {
	message += `\nLekce bude probíhat *pouze online 💻*`

	if (link) {
		message += ` a odkaz pro připojení najdeš zde: ${link}`
	}
	message += '.'
} else {
	if (activeEvent.type) {
		message += `\nLekce bude probíhat ${
			activeEvent.type === 'hybrid'
				? '*hybridně 🏰*'
				: `v režimu *${activeEvent.type}*`
		}.`
	}
	if (link) {
		message += `\nOdkaz pro připojení online: ${link}.`
	}
}

const previewImageUrl = createPreviewImageUrl(slideUrl)

console.log('Message:')
console.log(message)
console.log('')
console.log('Image:', previewImageUrl)

await sendSlackMessage({
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
})
