import fs from 'fs/promises'
import { CalendarEvent } from './CalendarEvent'

const eventsPath = 'website/events.json'

export const updateAllCalendarEventsJson = async (
	allCalendarEvents: CalendarEvent[],
) => {
	const now = new Date()
	const content = JSON.stringify({
		lastUpdateAt: now,
		events: allCalendarEvents,
	})
	await fs.writeFile(eventsPath, content, { encoding: 'utf8' })
}
