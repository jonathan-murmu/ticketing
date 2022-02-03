import { ResultWithContext } from 'express-validator/src/chain';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('marks an orde as cancelled', async() => {
    // create a ticket with ticket model
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();

    const user = global.signin();
    //make a  requsst to creat an order

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    //make a reqes to cancnle the order
    await request(app)
        .delete(`/api/order/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)

});

it('emits a order cancelled event', async() => {
    // create a ticket with ticket model
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();

    const user = global.signin();
    //make a  requsst to creat an order

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    //make a reqes to cancnle the order
    await request(app)
        .delete(`/api/order/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
