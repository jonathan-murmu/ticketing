import { Publisher, OrderCancelledEvent, Subjects } from '@ticketsjm92/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}