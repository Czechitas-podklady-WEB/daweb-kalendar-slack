import fs from 'fs/promises'
import { exit } from 'process'
import { createPreviewImageUrl } from './utilities/createPreviewImageUrl'
import { createSlideUrl } from './utilities/createSlideUrl'
import { filterFutureCalendarEvents } from './utilities/filterFutureCalendarEvents'
import { filterPastCalendarEvents } from './utilities/filterPastCalendarEvents'
import { getAllCalendarEvents } from './utilities/getAllCalendarEvents'
import { renderWeeklyEmail } from './utilities/renderWeeklyEmail'
import { sendEmail } from './utilities/sendEmail'

const allCalendarEvents = await getAllCalendarEvents()

const weekStart = new Date()
weekStart.setHours(0, 0, 0, 0)
const weekEnd = new Date(weekStart)
weekEnd.setDate(weekEnd.getDate() + 7)

const futureCalendarEvents = filterFutureCalendarEvents(
	weekStart,
	allCalendarEvents,
)

if (futureCalendarEvents.length === 0) {
	console.log('Notning in the future. Bye.')
	exit(0)
}
const weekEvents = filterPastCalendarEvents(weekEnd, futureCalendarEvents)

const firstCalendarEventDate = new Date(
	allCalendarEvents[0].date.year,
	allCalendarEvents[0].date.month - 1,
	allCalendarEvents[0].date.day,
	allCalendarEvents[0].date.hour,
	allCalendarEvents[0].date.minute,
)

const daysBetweenFirstCalendarEventAndNow = Math.floor(
	(weekStart.getTime() - firstCalendarEventDate.getTime()) / (1000 * 3600 * 24),
)
console.log(daysBetweenFirstCalendarEventAndNow)
const weekNumber = Math.floor(daysBetweenFirstCalendarEventAndNow / 7) + 1

const slideUrl = createSlideUrl(
	`${weekNumber}. týden`,
	'Digitální akademie: Web',
)
const previewImageUrl = createPreviewImageUrl(slideUrl)

console.log(weekEvents)

const emailHtml = await renderWeeklyEmail(
	weekNumber,
	weekEvents,
	previewImageUrl,
)
await fs.writeFile(
	`emails/${weekStart.getFullYear()}-${(weekStart.getMonth() + 1)
		.toString()
		.padStart(2, '0')}-${weekStart.getDate().toString().padStart(2, '0')}.html`,
	emailHtml,
	{ encoding: 'utf8' },
)

await sendEmail(
	'nikol.hanzelkova@czechitas.cz, chalupa.filip@gmail.com',
	`Digitální akademie: Web Praha, jaro 2023 - ${weekNumber}. Týdeník`,
	`${weekNumber}. týden`,
	emailHtml,
)
