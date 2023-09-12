import fs from 'fs/promises'
import { exit } from 'process'
import { createPreviewImageUrl } from './utilities/createPreviewImageUrl'
import { createSlideUrl } from './utilities/createSlideUrl'
import {
	getConfiguration,
	getSmtpConfiguration,
} from './utilities/getConfiguration'
import { getNextWeek } from './utilities/getNextWeek'
import { renderWeeklyEmail } from './utilities/renderWeeklyEmail'
import { sendEmail } from './utilities/sendEmail'

const { weeklySummaryEmailRecipients } = getSmtpConfiguration()
const { courseName, courseRegion } = getConfiguration()
const { weekNumber, weekStart, weekEvents } = await getNextWeek()

if (weekEvents.length === 0) {
	console.log('No events found. Bye.')
	exit(0)
}

const slideUrl = createSlideUrl(`${weekNumber}. týden`, courseName)
const previewImageUrl = createPreviewImageUrl(slideUrl)

console.log(weekEvents)

const emailHtml = renderWeeklyEmail({ weekNumber, weekEvents, previewImageUrl })
const emailFileName = `emails/${weekStart.getFullYear()}-${(
	weekStart.getMonth() + 1
)
	.toString()
	.padStart(2, '0')}-${weekStart.getDate().toString().padStart(2, '0')}.html`
await fs.writeFile(emailFileName, emailHtml, { encoding: 'utf8' })

const currentYear = weekStart.getFullYear()
const semester = weekStart.getMonth() < 7 ? 'jaro' : 'podzim'

await sendEmail(
	weeklySummaryEmailRecipients,
	`${courseName} ${courseRegion}, ${semester} ${currentYear} - ${
		weekNumber - 1
	}. týdeník`,
	`${weekNumber}. týden`,
	emailHtml,
)
