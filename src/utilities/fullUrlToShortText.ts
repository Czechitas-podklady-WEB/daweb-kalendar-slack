export const fullUrlToShortText = (fullUrl: string) => {
	if (fullUrl.includes('zoom.us/')) {
		return 'Zoom'
	}
	if (fullUrl.includes('meet.google.com/')) {
		return 'Google Meet'
	}
	if (fullUrl.includes('teams.microsoft.com/')) {
		return 'Microsoft Teams'
	}
	return fullUrl
}
