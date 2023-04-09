export const createSlideUrl = (
	title: string,
	meta1?: string,
	meta2?: string,
	meta3?: string,
) => {
	const url = new URL('https://intro.czechitas-podklady.cz/slide.html')
	url.searchParams.set('title', title ?? '')
	url.searchParams.set('meta1', meta1 ?? '')
	url.searchParams.set('meta2', meta2 ?? '')
	url.searchParams.set('meta3', meta3 ?? '')
	return url.toString()
}
