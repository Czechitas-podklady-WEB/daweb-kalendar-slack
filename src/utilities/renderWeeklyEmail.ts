import fs from 'fs/promises'
import Handlebars from 'handlebars'
import { CalendarEvent } from './CalendarEvent'

export const renderWeeklyEmail = async (
	weekNumber: number,
	calendarEvents: CalendarEvent[],
	previewImageUrl: string,
) => {
	const templateContent = await fs.readFile(
		'src/utilities/emailTemplates/weekly.hbs',
		{ encoding: 'utf8' },
	)
	const template = Handlebars.compile(templateContent)
	return template({ previewImageUrl, weekNumber, calendarEvents })
}
