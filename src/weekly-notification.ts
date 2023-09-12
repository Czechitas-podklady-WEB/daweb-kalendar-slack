import { exit } from 'process'
import { capitalizeFirstLetter } from './utilities/capitalizeFirstLetter'
import { createPreviewImageUrl } from './utilities/createPreviewImageUrl'
import { createSlideUrl } from './utilities/createSlideUrl'
import { getNextWeek } from './utilities/getNextWeek'
import { mrkdwnLecturer } from './utilities/mrkdwnLecturer'
import { sendSlackMessage } from './utilities/sendSlackMessage'

const { weekNumber, weekStart, weekEnd, weekEvents } = await getNextWeek()

console.log(weekEvents)

if (weekEvents.length === 0) {
	console.log('No events found. Bye.')
	exit(0)
}

const isWeekEndingInSameMonth =
	weekStart.toLocaleDateString('cs', { month: 'numeric' }) ===
	weekEnd.toLocaleDateString('cs', { month: 'numeric' })
const dateRange = `${weekStart.toLocaleDateString('cs', {
	day: 'numeric',
	month: isWeekEndingInSameMonth ? undefined : 'long',
})} až ${weekEnd.toLocaleDateString('cs', {
	day: 'numeric',
	month: 'long',
	year: 'numeric',
})}`

const slideUrl = createSlideUrl(`${weekNumber}. týden`, dateRange)
const previewImageUrl = createPreviewImageUrl(slideUrl)

const header = `Blíží se další týden a s ním ${weekEvents.length} ${
	weekEvents.length <= 4 ? 'akce' : 'akcí'
}.`

console.log('Message:')
console.log(header)
console.log('')
console.log('Image:', previewImageUrl)

await sendSlackMessage({
	text: header,
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
				text: header,
			},
		},
		{
			type: 'divider',
		},
		...weekEvents.map((event) => {
			const { dateStart, dateEnd } = event

			const lecturer = mrkdwnLecturer(event.lecturers)

			return {
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: `> ${event.type.emoji} *${event.title}*${
						event.attendance === 'required'
							? ' - povinná lekce'
							: event.attendance === 'optional'
							? ' - nepovinná lekce'
							: ''
					}${event.type.code === 'unknown' ? '' : ` - ${event.type.label}`} ${
						event.type.emoji
					}
> _${capitalizeFirstLetter(
						dateStart.toLocaleDateString('cs', {
							day: 'numeric',
							month: 'long',
							weekday: 'long',
						}),
					)} od ${dateStart.toLocaleTimeString('cs', {
						hour: 'numeric',
						minute: 'numeric',
					})}${
						dateEnd
							? ' do ' +
							  dateEnd.toLocaleTimeString('cs', {
									hour: 'numeric',
									minute: 'numeric',
							  })
							: ''
					}_${
						lecturer
							? `
> Lektor: ${lecturer}`
							: ''
					}`,
				},
			}
		}),
		{
			type: 'divider',
		},
	],
})
