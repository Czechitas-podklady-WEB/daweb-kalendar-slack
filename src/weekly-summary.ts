import fs from 'fs/promises'
import { exit } from 'process'
import { createPreviewImageUrl } from './utilities/createPreviewImageUrl'
import { createSlideUrl } from './utilities/createSlideUrl'
import { filterFutureCalendarEvents } from './utilities/filterFutureCalendarEvents'
import { filterPastCalendarEvents } from './utilities/filterPastCalendarEvents'
import { getAllCalendarEvents } from './utilities/getAllCalendarEvents'
import { getSmtpConfiguration } from './utilities/getConfiguration'
import { renderWeeklyEmail } from './utilities/renderWeeklyEmail'
import { sendEmail } from './utilities/sendEmail'

const { weeklySummaryEmailRecipients } = getSmtpConfiguration()

const allCalendarEvents = await getAllCalendarEvents()

const weekStart = new Date()
weekStart.setHours(0, 0, 0, 0)
weekStart.setDate(weekStart.getDate() + (7 - weekStart.getDay()) + 1) // Nearest monday
const weekEnd = new Date(weekStart)
weekEnd.setDate(weekEnd.getDate() + 7)

const futureCalendarEvents = filterFutureCalendarEvents(
	weekStart,
	allCalendarEvents,
)

if (futureCalendarEvents.length === 0) {
	console.log('Nothing in the future. Bye.')
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
const weekNumber = Math.floor(daysBetweenFirstCalendarEventAndNow / 7) + 2

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

const currentYear = weekStart.getFullYear()
const semester = weekStart.getMonth() < 7 ? 'jaro' : 'podzim'

await sendEmail(
	weeklySummaryEmailRecipients,
	`Digitální akademie: Web Praha, ${semester} ${currentYear} - ${
		weekNumber - 1
	}. týdeník`,
	`${weekNumber}. týden`,
	emailHtml,
)
