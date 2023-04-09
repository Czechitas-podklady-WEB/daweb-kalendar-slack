import fs from 'fs/promises'

const indexHTMLPath = 'website/slide-url.json'

export const updateWebsiteSlideUrl = async (slideUrl: string) => {
	const content = JSON.stringify({
		url: slideUrl,
	})
	await fs.writeFile(indexHTMLPath, content, { encoding: 'utf8' })
}
