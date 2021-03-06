import { Subjects } from "./subjects";

export interface TicketUpdatedEvents {
    subject: Subjects.TicketUpdated;
    data: {
        id: string;
        version: number;
        title: string;
        price: number;
        userId: string;
        orderId?: string; // ? means optional
    }
}