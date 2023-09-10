const formatter = new Intl.ListFormat('cs', {
	style: 'long',
	type: 'conjunction',
})

export const formatLecturersConjunction = (lecturerNames: string[]) =>
	formatter.format(lecturerNames)
