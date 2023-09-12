import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text,
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'
import React, { CSSProperties, FunctionComponent } from 'react'
import { CalendarEvent } from '../CalendarEvent'
import { Lecturer } from '../Lecturer'
import { formatLecturersConjunction } from '../formatLecturersConjunction'
import { fullUrlToShortText } from '../fullUrlToShortText'

export const Weekly: FunctionComponent<{
	weekNumber: number
	weekEvents: CalendarEvent[]
	previewImageUrl: string
}> = ({ weekNumber, weekEvents, previewImageUrl }) => {
	return (
		<Html>
			<Head />
			<Preview>{weekNumber.toString()}. týden digitální akademie</Preview>
			<Tailwind
				config={{
					theme: {
						extend: {
							colors: {
								brand: '#e6007e',
							},
						},
					},
				}}
			>
				<Body
					style={{
						backgroundColor: '#f8f8fc',
						fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
					}}
				>
					<Container
						className="rounded-md"
						style={{
							maxWidth: '680px',
							width: '100%',
							margin: '0 auto',
							backgroundColor: '#ffffff',
							overflow: 'hidden',
						}}
					>
						<Section
							style={{
								display: 'flex',
								backgroundColor: '#613786',
							}}
						>
							<Img
								width={1920}
								height={1080}
								src={previewImageUrl}
								style={{
									width: '100%',
									height: 'auto',
								}}
							/>
						</Section>
						<Section style={{ padding: '30px 30px 40px 30px' }}>
							<Heading
								as="h2"
								style={{
									margin: '0 0 15px',
									fontWeight: 'bold',
									fontSize: '21px',
									lineHeight: '21px',
									color: '#0c0d0e',
								}}
							>
								Hezké nedělní ráno 🌞
							</Heading>
							<Text style={paragraph}>
								doufám, že všechno běží jak má! Níže naleznete plán na
								následující týden.
							</Text>
							<Hr style={divider} />
							{weekEvents.map((event, index) => (
								<Section key={index} style={{ margin: '20px 0' }}>
									<Heading
										as="h3"
										style={{
											margin: '0',
											fontWeight: 'bold',
											fontSize: '18px',
											lineHeight: '18px',
											color:
												event.attendance === 'required'
													? '#bf9000'
													: event.attendance === 'optional'
													? '#1c4587'
													: '#0c0d0e',
										}}
									>
										{event.type.emoji} {event.title}
										<span className="font-normal">
											{event.attendance === 'required'
												? ' - povinná lekce'
												: event.attendance === 'optional'
												? ' - nepovinná lekce'
												: null}
											{event.type.code !== 'unknown' && (
												<> - {event.type.label}</>
											)}{' '}
											{event.type.emoji}
										</span>
									</Heading>
									<Text style={{ margin: '4px 0 6px 0', fontStyle: 'italic' }}>
										{prettyDate(event.dateStart)}
									</Text>
									{event.lecturers.length > 0 && (
										<Text style={line}>
											Výuku povede: {formatLecturers(event.lecturers)}
										</Text>
									)}
									{event.address && (
										<Text style={line}>Místo: {event.address}</Text>
									)}
									{event.link && (
										<Text style={line}>
											Odkaz pro připojení:{' '}
											<Link
												className="text-brand font-bold underline"
												href={event.link}
											>
												{fullUrlToShortText(event.link)}
											</Link>
										</Text>
									)}
								</Section>
							))}
							<Hr style={divider} />
							<Text style={paragraph}>
								Měj se krásně 🌟
								<br />
								<strong>Niky 💗</strong>
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

const prettyDate = (date: CalendarEvent['dateStart']) => {
	const raw = `${date.toLocaleDateString('cs', {
		day: 'numeric',
		month: 'long',
		hour: 'numeric',
		minute: 'numeric',
		weekday: 'long',
	})}`

	return `${raw.substring(0, 1).toUpperCase()}${raw.substring(1)}`
}

const formatLecturers = (lecturers: Lecturer[]) => {
	return formatLecturersConjunction(lecturers.map(({ name }) => name))
}

const paragraph = {
	fontSize: '15px',
	lineHeight: '21px',
	color: '#3c3f44',
} satisfies CSSProperties

const divider = {
	margin: '30px 0',
} satisfies CSSProperties

const line = {
	margin: 0,
} satisfies CSSProperties
