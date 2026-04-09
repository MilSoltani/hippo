import { ErrorSchema } from '@api/errors'
import { QueryParamsSchema } from '@api/lib'
import { IdParamSchema } from '@api/types'
import { createRoute, z } from '@hono/zod-openapi'
import { CreateTicketSchema, TicketSchema, UpdateTicketSchema } from './ticket.schema'

export const TicketRoutes = {
  getAll: createRoute({
    method: 'get',
    path: '/',
    tags: ['Ticket'],
    request: {
      query: QueryParamsSchema,
    },
    responses: {
      200: {
        content: { 'application/json': { schema: z.array(TicketSchema) } },
        description: 'List of all tickets',
      },
    },
  }),

  getById: createRoute({
    method: 'get',
    path: '/{id}',
    tags: ['Ticket'],
    request: { params: IdParamSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: TicketSchema } },
        description: 'The requested ticket',
      },
      404: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Ticket not found',
      },
    },
  }),

  create: createRoute({
    method: 'post',
    path: '/',
    tags: ['Ticket'],
    request: {
      body: { content: { 'application/json': { schema: CreateTicketSchema } } },
    },
    responses: {
      201: {
        content: { 'application/json': { schema: TicketSchema } },
        description: 'Ticket created successfully',
      },
      400: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Validation failed or invalid references',
      },
      409: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Ticket already exists (Unique constraint)',
      },
    },
  }),

  update: createRoute({
    method: 'put',
    path: '/{id}',
    tags: ['Ticket'],
    request: {
      params: IdParamSchema,
      body: { content: { 'application/json': { schema: UpdateTicketSchema } } },
    },
    responses: {
      200: {
        content: { 'application/json': { schema: TicketSchema } },
        description: 'Ticket updated successfully',
      },
      400: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Invalid input data',
      },
      404: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Ticket not found',
      },
    },
  }),

  remove: createRoute({
    method: 'delete',
    path: '/{id}',
    tags: ['Ticket'],
    request: { params: IdParamSchema },
    responses: {
      204: {
        description: 'Ticket deleted successfully',
      },
      404: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Ticket not found',
      },
    },
  }),
}
