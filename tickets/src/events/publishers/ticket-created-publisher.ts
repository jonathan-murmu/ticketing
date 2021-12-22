import { Publisher, Subjects, TicketCreatedEvent } from "@ticketsjm92/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}