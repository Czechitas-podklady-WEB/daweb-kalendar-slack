import { CalendarEvent } from './CalendarEvent'

export const filterFutureCalendarEvents = (
	fromDate: Date,
	allCalendarEvents: CalendarEvent[],
) => {
	return allCalendarEvents.filter((event) => fromDate <= event.dateStart)
}
