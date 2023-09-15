import { exit } from 'process'
import { createCalenderEventSlideUrl } from './utilities/createCalenderEventSlideUrl'
import { createPreviewImageUrl } from './utilities/createPreviewImageUrl'
import { filterFutureCalendarEvents } from './utilities/filterFutureCalendarEvents'
import { fullUrlToShortText } from './utilities/fullUrlToShortText'
import { getAllCalendarEvents } from './utilities/getAllCalendarEvents'
import { mrkdwnLecturer as mrkdwnLecturers } from './utilities/mrkdwnLecturer'
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
	activeEvent.dateStartLegacy.year !== todayMorning.getFullYear() ||
	activeEvent.dateStartLegacy.month !== todayMorning.getMonth() + 1 ||
	activeEvent.dateStartLegacy.day !== todayMorning.getDate()
) {
	console.log('No active event scheduled for today.')
	exit(0)
}

let message = `Dnes, *${activeEvent.dateStart.toLocaleDateString('cs', {
	day: 'numeric',
	month: 'numeric',
	year: 'numeric',
})}* bude od *${activeEvent.dateStart.toLocaleTimeString('cs', {
	hour: 'numeric',
	minute: 'numeric',
})}*${
	activeEvent.dateEnd
		? ` do *${activeEvent.dateEnd.toLocaleTimeString('cs', {
				hour: 'numeric',
				minute: 'numeric',
		  })}*`
		: ''
} probíhat další${
	activeEvent.attendance === 'required'
		? ' *povinná*'
		: activeEvent.attendance === 'optional'
		? ' nepovinná'
		: ''
} lekce.
Plánované téma je *${activeEvent.title.replaceAll('\n', ', ')}*.`

const lecturers = mrkdwnLecturers(activeEvent.lecturers)

if (lecturers) {
	message += `\nVýuku povede *${lecturers}*.`
}
const link = activeEvent.link
	? `<${activeEvent.link}|${fullUrlToShortText(activeEvent.link)}>`
	: null
if (activeEvent.type.code === 'online') {
	message += `\nLekce bude probíhat *pouze online 💻*`

	if (link) {
		message += ` a odkaz pro připojení najdeš zde: ${link}`
	}
	message += '.'
} else {
	if (activeEvent.type) {
		message += `\nLekce bude probíhat *${activeEvent.type.label}*. ${activeEvent.type.emoji}`
	}
	if (activeEvent.address) {
		message += `\nMísto: *${activeEvent.address}*`
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

const mainLecturer =
	(activeEvent.lecturers.length === 1 && activeEvent.lecturers.at(0)) || null

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
			...(mainLecturer?.avatarUrl
				? {
						accessory: {
							type: 'image',
							image_url: mainLecturer?.avatarUrl,
							alt_text: mainLecturer.name,
						},
				  }
				: {}),
		},
	],
})
