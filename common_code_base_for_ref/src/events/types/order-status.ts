export enum OrderStatus {
    // when the order has benn created, but the 
    //ticket is trying to order has not been resereved.
    Created = 'created',
    // the ticket the order is trying to reserve has already
    // been reserved , or when the user has cancelled the order.
    // or order expires before payment
    Cancelled = 'cancelled',
    //when the order has successfully reserved the ticket
    AwaitingPayment = 'awaiting:payment',
    // the order has reserved the ticket and the user has provided payment succesfully
    Complete = 'complete'
}