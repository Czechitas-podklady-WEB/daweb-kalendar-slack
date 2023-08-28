import fs from 'fs/promises'
import { exit } from 'process'
import { createPreviewImageUrl } from './utilities/createPreviewImageUrl'
import { createSlideUrl } from './utilities/createSlideUrl'
import { getSmtpConfiguration } from './utilities/getConfiguration'
import { getNextWeek } from './utilities/getNextWeek'
import { renderWeeklyEmail } from './utilities/renderWeeklyEmail'
import { sendEmail } from './utilities/sendEmail'

const { weeklySummaryEmailRecipients } = getSmtpConfiguration()
const { weekNumber, weekStart, weekEvents } = await getNextWeek()

if (weekEvents.length === 0) {
	console.log('No events found. Bye.')
	exit(0)
}

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
