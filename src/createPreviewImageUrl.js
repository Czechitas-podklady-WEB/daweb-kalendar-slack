export const createPreviewImageUrl = (slideUrl) => {
	const url = new URL('https://api.apiflash.com/v1/urltoimage')
	url.searchParams.set('access_key', '051686ce27cd408ca39cc01a9b187cb3')
	url.searchParams.set('format', 'jpeg')
	url.searchParams.set('width', '1920')
	url.searchParams.set('height', '1080')
	url.searchParams.set('response_type', 'image')
	url.searchParams.set('ttl', '864000')
	url.searchParams.set('url', slideUrl)

	return url.toString()
}
