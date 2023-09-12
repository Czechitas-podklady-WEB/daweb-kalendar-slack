import { Attendance } from './Attendance'
import { Lecturer } from './Lecturer'
import { LocationType } from './LocationType'

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
	type: LocationType
	link: string
	attendance: Attendance
	address: string | null
}
