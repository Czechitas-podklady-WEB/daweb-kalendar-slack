import { LocationType } from './LocationType'

export const prettyLocationType = (
	type: LocationType,
	variant: 'short' | 'long',
) => {
	if (variant === 'short') {
		return type.emoji
	}
	return `${type.label} ${type.emoji}`
}
