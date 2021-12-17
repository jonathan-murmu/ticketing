import nats, { Message } from 'node-nats-streaming';

import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listerner connected to NATS');

    stan.on('close', () => {
        console.log('Nats connection closed');
        process.exit();
    })

    const options = stan
        .subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()  // all the events emited in the past
        .setDurableName('acconting-service');  // never miss out and unproccessed/delivered event.
    const subscription = stan.subscribe(
        'ticket:created', 
        'queue-group-name',
        options);

    subscription.on('message', (msg: Message) => {
        console.log('Messag received');

        const data = msg.getData();

        if (typeof data === 'string') {
            console.log(`Received even #${msg.getSequence()}, with data: ${data}`);
        }

        msg.ack();
    })
});

// graceful shutdown
process.on('SIGINT', () => stan.close()); // INTERRUPT
process.on('SIGTERM', () => stan.close())  // TERMINATE