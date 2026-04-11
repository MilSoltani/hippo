import { createDb } from '@api/core/database/db'
import { createTicketModule } from '@api/modules/ticket'
import { createUserModule } from '@api/modules/user'

const db = createDb()

export const userModule = createUserModule(db)
export const ticketModule = createTicketModule(db)
