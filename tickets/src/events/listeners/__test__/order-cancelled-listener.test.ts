import { OrderCancelledEvent, OrderStatus } from "@ticketsjm92/common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";


const setup = async () => {
    // create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();
    // crate and save the ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'asdf'
    });
    ticket.set({orderId})
    await ticket.save();

    // create the fake data event
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        }
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { msg, data, ticket, orderId, listener };

}

it('update the ticket, publish and evnent and ack the mesg', async() => {
    const { msg, data, ticket, orderId, listener } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})