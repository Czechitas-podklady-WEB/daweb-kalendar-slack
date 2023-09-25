import fs from 'fs/promises'

const slideUrlPath = 'website/slide-url.json'

export const updateWebsiteSlideUrl = async (slideUrl: string) => {
	const content = JSON.stringify({
		url: slideUrl,
	})
	await fs.writeFile(slideUrlPath, content, { encoding: 'utf8' })
}
