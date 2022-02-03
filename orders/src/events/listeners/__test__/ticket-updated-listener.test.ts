import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketUpdatedEvents } from '@ticketsjm92/common';
import { TicketUpdatedListener } from '../ticket-update-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
    // create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // create a fake data event
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    
    await ticket.save();

    // create a face data object
    const data: TicketUpdatedEvents['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new concert',
        price: 999,
        userId: 'asdfasf'
    }

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, ticket }
}

it('creates and save a ticket', async () => {
    const { listener, data, msg, ticket } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version)

})

it('acks the message', async () => {

    const { listener, data, msg } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
} )

it('does not call ack if the event has a skipped version number', async() => {
    const { listener, data, msg, ticket } = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data, msg);
    } catch(err) {

    }
    expect(msg.ack).not.toHaveBeenCalled();
    


})