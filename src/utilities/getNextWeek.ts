import { filterFutureCalendarEvents } from './filterFutureCalendarEvents'
import { filterPastCalendarEvents } from './filterPastCalendarEvents'
import { getAllCalendarEvents } from './getAllCalendarEvents'

export const getNextWeek = async () => {
	const allCalendarEvents = await getAllCalendarEvents()

	const weekStart = new Date()
	weekStart.setHours(0, 0, 0, 0)
	weekStart.setDate(
		weekStart.getDate() + (7 - ((weekStart.getDay() - 1 + 7) % 7)),
	) // Nearest monday
	const weekEnd = new Date(weekStart)
	weekEnd.setDate(weekEnd.getDate() + 6)

	const futureCalendarEvents = filterFutureCalendarEvents(
		weekStart,
		allCalendarEvents,
	)

	const weekEvents = filterPastCalendarEvents(weekEnd, futureCalendarEvents)

	const firstCalendarEventDate = new Date(
		allCalendarEvents[0].date.year,
		allCalendarEvents[0].date.month - 1,
		allCalendarEvents[0].date.day,
		allCalendarEvents[0].date.hour,
		allCalendarEvents[0].date.minute,
	)

	const daysBetweenFirstCalendarEventAndNow = Math.floor(
		(weekStart.getTime() - firstCalendarEventDate.getTime()) /
			(1000 * 3600 * 24),
	)
	const weekNumber = Math.floor(daysBetweenFirstCalendarEventAndNow / 7) + 2

	return { weekNumber, weekStart, weekEnd, weekEvents }
}
