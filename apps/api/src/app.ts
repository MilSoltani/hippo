import { createTicketModule } from '@api/modules/ticket'
import { createUserModule } from '@api/modules/user'

export const userModule = createUserModule()
export const ticketModule = createTicketModule()
