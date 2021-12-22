import { Publisher, Subjects, TicketUpdatedEvents } from "@ticketsjm92/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvents> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}