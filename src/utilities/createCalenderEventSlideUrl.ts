import { CalendarEvent } from './CalendarEvent'
import { createSlideUrl } from './createSlideUrl'
import { formatLecturersConjunction } from './formatLecturersConjunction'

export const createCalenderEventSlideUrl = (event: CalendarEvent) => {
	const title = event.title
		.split(' ')
		.reduce(
			(lines, word) => {
				if (lines[lines.length - 1].length + word.length > 22) {
					lines.push(word + ' ')
				} else {
					lines[lines.length - 1] += word + ' '
				}
				return lines
			},
			[''],
		)
		.join('\n')
	const meta1 = formatLecturersConjunction(
		event.lecturers.map(({ name }) => name),
	)
	const meta2 = event.dateStart.toLocaleTimeString('cs', {
		day: 'numeric',
		month: 'numeric',
		year: 'numeric',
		minute: 'numeric',
		hour: 'numeric',
	})

	return createSlideUrl(title, meta1, meta2)
}
