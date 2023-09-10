import { Lecturer } from './Lecturer'
import { formatLecturersConjunction } from './formatLecturersConjunction'

export const mrkdwnLecturer = (lecturers: Lecturer[]) =>
	formatLecturersConjunction(
		lecturers.map(({ name, slackId }) => {
			if (slackId) {
				return `<@${slackId}>`
			}
			return name
		}),
	)
