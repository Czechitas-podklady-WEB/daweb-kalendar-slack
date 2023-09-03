import { CalendarEvent } from './CalendarEvent'

export const filterPastCalendarEvents = (
	fromDate: Date,
	allCalendarEvents: CalendarEvent[],
) => {
	const fromDateNextDay = new Date(fromDate)
	fromDateNextDay.setDate(fromDateNextDay.getDate() + 1)
	return allCalendarEvents.filter((event) => {
		const eventDate = new Date(
			event.date.year,
			event.date.month - 1,
			event.date.day,
			event.date.hour,
			event.date.minute,
		)

		return fromDateNextDay > eventDate
	})
}
