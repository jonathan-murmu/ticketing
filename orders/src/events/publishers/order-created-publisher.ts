import { Publisher, OrderCreatedEvent, Subjects } from '@ticketsjm92/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}