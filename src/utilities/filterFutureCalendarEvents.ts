import { CalendarEvent } from './CalendarEvent'

export const filterFutureCalendarEvents = (
	fromDate: Date,
	allCalendarEvents: CalendarEvent[],
) => {
	return allCalendarEvents.filter((event) => {
		const eventDate = new Date(
			event.date.year,
			event.date.month - 1,
			event.date.day,
			event.date.hour,
			event.date.minute,
		)

		return fromDate <= eventDate
	})
}
