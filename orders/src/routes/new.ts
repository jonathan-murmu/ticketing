import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@ticketsjm92/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60  // 15mins

router.post('/api/orders', requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('TicketId must be provided')
], async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // find the ticket the user it trying to order in db.
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
        throw new NotFoundError();
    }
    
    // make sure the ticket is not already reserved.
    // run query to look at all orders. find an order where the ticket is the 
    // the ticket we just found and the order status is not cancelled.
    // If we find an order from that means the ticket is received.
    const isReserved = await ticket.isReserved();
    if (isReserved) {
        throw new BadRequestError("Ticket is already reserved!");
    }

    // calculate an expiration date for the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    // build the order and save it in db
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });
    await order.save();

    // Publish an event saying that an order was created.
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    })
    res.status(201).send(order);
});

export { router as newOrderRouter };