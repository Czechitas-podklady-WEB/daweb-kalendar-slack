import { knownSlackUsers } from './knownSlackUsers'

export const mrkdwnLecturer = (lecturer: string | undefined) =>
	lecturer
		?.split(', ')
		.map((name) => {
			const lecturer = knownSlackUsers.find((user) => user.name === name)
			if (lecturer) {
				return `<@${lecturer.memberId}>`
			}
			return name
		})
		.join(', ')
