import { CalendarEvent } from './CalendarEvent'
import { createSlideUrl } from './createSlideUrl'

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
	const meta1 = event.lecturer ?? ''
	const meta2 = `${event.dateStartLegacy.day}. ${
		event.dateStartLegacy.month
	}. ${event.dateStartLegacy.year} ${
		event.dateStartLegacy.hour
	}:${event.dateStartLegacy.minute.toString().padStart(2, '0')}`

	return createSlideUrl(title, meta1, meta2)
}
