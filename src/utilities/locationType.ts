import { CalendarEvent } from './CalendarEvent'

export const locationType = (
	type: CalendarEvent['type'],
	variant: 'short' | 'long',
) => {
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
}
