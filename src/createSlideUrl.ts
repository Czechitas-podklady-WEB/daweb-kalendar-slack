export const createSlideUrl = (event: any) => {
	const url = new URL('https://intro.czechitas-podklady.cz/slide.html')
	url.searchParams.set(
		'title',
		event.title
			.split(' ')
			.reduce(
				(lines: any, word: any) => {
					if (lines[lines.length - 1].length + word.length > 22) {
						lines.push(word + ' ')
					} else {
						lines[lines.length - 1] += word + ' '
					}
					return lines
				},
				[''],
			)
			.join('\n'),
	)
	url.searchParams.set('meta1', event.lecturer ?? '')
	url.searchParams.set(
		'meta2',
		`${event.date.day}. ${event.date.month}. ${event.date.year} ${
			event.date.hour
		}:${event.date.minute.toString().padStart(2, '0')}`,
	)

	return url.toString()
}
