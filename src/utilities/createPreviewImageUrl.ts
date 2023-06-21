import { getConfiguration } from './getConfiguration'

export const createPreviewImageUrl = (slideUrl: string) => {
	const { apiflashAccessKey } = getConfiguration()

	const url = new URL('https://api.apiflash.com/v1/urltoimage')
	url.searchParams.set('access_key', apiflashAccessKey)
	url.searchParams.set('format', 'jpeg')
	url.searchParams.set('width', '1920')
	url.searchParams.set('height', '1080')
	url.searchParams.set('response_type', 'image')
	url.searchParams.set('ttl', `${60 * 60 * 24 * 30}` /* 30 days */)
	url.searchParams.set('url', slideUrl)

	return url.toString()
}
