import nodemailer from 'nodemailer'
import { getSmtpConfiguration } from './getConfiguration'

const { host, port, user, password } = getSmtpConfiguration()

const transporter = nodemailer.createTransport({
	host,
	port,
	secure: true,
	auth: {
		user,
		pass: password,
	},
})

export const sendEmail = async (
	to: string,
	subject: string,
	text: string,
	html: string,
) => {
	if (to === '') {
		console.warn('Empty recipients. Skipping.')
		return
	}
	await transporter.sendMail({
		from: '"Info" <info@czechitas-podklady.cz>',
		to,
		subject,
		text,
		html,
	})
}
