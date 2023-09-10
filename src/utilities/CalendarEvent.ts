import { Lecturer } from './Lecturer'

export type CalendarEvent = {
	dateStartLegacy: {
		year: number
		month: number
		day: number
		hour: number
		minute: number
	} // @TODO: remove
	timeEndLegacy: null | {
		hour: number
		minute: number
	} // @TODO: remove
	dateStart: Date
	dateEnd: Date | null
	title: string
	lecturers: Lecturer[]
	type: string
	link: string
}
