import { exit } from 'process'
import { createSlideUrl } from './utilities/createSlideUrl'
import { filterFutureCalendarEvents } from './utilities/filterFutureCalendarEvents'
import { filterPastCalendarEvents } from './utilities/filterPastCalendarEvents'
import { getAllCalendarEvents } from './utilities/getAllCalendarEvents'

const allCalendarEvents = await getAllCalendarEvents()

const tomorrowMorning = new Date()
tomorrowMorning.setHours(0, 0, 0, 0)
const afterWeek = new Date(tomorrowMorning)
afterWeek.setDate(afterWeek.getDate() + 7)

const futureCalendarEvents = filterFutureCalendarEvents(
	tomorrowMorning,
	allCalendarEvents,
)

if (futureCalendarEvents.length === 0) {
	console.log('Notning in the future. Bye.')
	exit(0)
}
const weekEvents = filterPastCalendarEvents(afterWeek, futureCalendarEvents)

const firstCalendarEventDate = new Date(
	allCalendarEvents[0].date.year,
	allCalendarEvents[0].date.month - 1,
	allCalendarEvents[0].date.day,
	allCalendarEvents[0].date.hour,
	allCalendarEvents[0].date.minute,
)

console.log(allCalendarEvents[0])
console.log(tomorrowMorning, firstCalendarEventDate)
const daysBetweenFirstCalendarEventAndNow = Math.floor(
	(tomorrowMorning.getTime() - firstCalendarEventDate.getTime()) /
		(1000 * 3600 * 24),
)
console.log(daysBetweenFirstCalendarEventAndNow)
const batchNumber = Math.floor(daysBetweenFirstCalendarEventAndNow / 7) + 1

const slideUrl = createSlideUrl(`${batchNumber}. týdeník`)
console.log(slideUrl)

console.log(weekEvents)
