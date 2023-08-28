import { exit } from 'process'
import { capitalizeFirstLetter } from './utilities/capitalizeFirstLetter'
import { createPreviewImageUrl } from './utilities/createPreviewImageUrl'
import { createSlideUrl } from './utilities/createSlideUrl'
import { getNextWeek } from './utilities/getNextWeek'
import { locationType } from './utilities/locationType'
import { mrkdwnLecturer } from './utilities/mrkdwnLecturer'
import { sendSlackMessage } from './utilities/sendSlackMessage'

const { weekNumber, weekStart, weekEvents } = await getNextWeek()

console.log(weekEvents)

if (weekEvents.length === 0) {
	console.log('No events found. Bye.')
	exit(0)
}

const nextWeekStart = new Date(weekStart)
nextWeekStart.setDate(nextWeekStart.getDate() + 7)
const isWeekEndingInSameMonth =
	weekStart.toLocaleDateString('cs', { month: 'numeric' }) ===
	nextWeekStart.toLocaleDateString('cs', { month: 'numeric' })
const dateRange = `${weekStart.toLocaleDateString('cs', {
	day: 'numeric',
	month: isWeekEndingInSameMonth ? undefined : 'long',
})} až ${nextWeekStart.toLocaleDateString('cs', {
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
			const date = new Date(
				event.date.year,
				event.date.month - 1,
				event.date.day,
				event.date.hour,
				event.date.minute,
			)
			const lecturer = mrkdwnLecturer(event.lecturer)

			return {
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: `> ${locationType(event.type, 'short')} *${
						event.title
					}* - ${locationType(event.type, 'long')}
> _${capitalizeFirstLetter(
						date.toLocaleDateString('cs', {
							day: 'numeric',
							month: 'long',
							hour: 'numeric',
							minute: 'numeric',
							weekday: 'long',
						}),
					)}_${
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
