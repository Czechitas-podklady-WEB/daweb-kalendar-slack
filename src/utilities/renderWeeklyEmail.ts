import fs from 'fs/promises'
import Handlebars from 'handlebars'
import { CalendarEvent } from './CalendarEvent'
import { fullUrlToShortText } from './fullUrlToShortText'

Handlebars.registerHelper('prettyDate', (date: CalendarEvent['date']) => {
	const d = new Date(
		date.year,
		date.month - 1,
		date.day,
		date.hour,
		date.minute,
	)
	const raw = `${d.toLocaleDateString('cs', {
		day: 'numeric',
		month: 'long',
		hour: 'numeric',
		minute: 'numeric',
		weekday: 'long',
	})}`

	return `${raw.substring(0, 1).toUpperCase()}${raw.substring(1)}`
})

Handlebars.registerHelper('shortLink', (link: string) => {
	const url = Handlebars.escapeExpression(link)
	const text = fullUrlToShortText(link)

	return new Handlebars.SafeString(`<a href="${url}">${text}</a>`)
})

Handlebars.registerHelper(
	'locationType',
	(type: CalendarEvent['type'], variant: 'short' | 'long') => {
		if (type === 'hybrid') {
			if (variant === 'short') {
				return '🏰'
			}
			return 'hybrid 🏰'
		}
		if (type === 'online') {
			if (variant === 'short') {
				return '💻'
			}
			return 'online 💻'
		}
		if (type === 'prezenčně') {
			if (variant === 'short') {
				return '🚶'
			}
			return 'prezenčně 🚶'
		}
		if (variant === 'short') {
			return '🤹‍♀️'
		}
		return `${type} 🤹‍♀️`
	},
)

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
