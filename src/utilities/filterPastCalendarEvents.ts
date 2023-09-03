import { CalendarEvent } from './CalendarEvent'

export const filterPastCalendarEvents = (
	fromDate: Date,
	allCalendarEvents: CalendarEvent[],
) => {
	const fromDateNextDay = new Date(fromDate)
	fromDateNextDay.setDate(fromDateNextDay.getDate() + 1)
	return allCalendarEvents.filter((event) => fromDateNextDay > event.dateStart)
}
