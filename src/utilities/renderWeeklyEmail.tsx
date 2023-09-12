import { render } from '@react-email/render'
import React, { ComponentProps } from 'react'
import { Weekly } from './emailTemplates/Weekly'

export const renderWeeklyEmail = (props: ComponentProps<typeof Weekly>) =>
	render(<Weekly {...props} />)
