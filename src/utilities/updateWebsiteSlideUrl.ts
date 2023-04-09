import fs from 'fs/promises'

const indexHTMLPath = 'website/index.html'

export const updateWebsiteSlideUrl = async (slideUrl: string) => {
	const originalContent = await fs.readFile(indexHTMLPath, { encoding: 'utf8' })
	const newContent = originalContent.replaceAll('__SLIDE_URL__', slideUrl)
	await fs.writeFile(indexHTMLPath, newContent, { encoding: 'utf8' })
}
