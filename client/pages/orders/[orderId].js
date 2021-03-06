import { useEffect, useState } from "react";
// import StripeCheckout from 'react-stripe-checkout';
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeleft] = useState(0);
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: (payment) => Router.push('/orders')
    });

    useEffect( () => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeleft(Math.round(msLeft /1000));
        };

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000)

        return () => {
            clearInterval(timerId);
        };
    }, [order]);

    if(timeLeft < 0 ) {
        return <div>Order Expired</div>
    }
    return <div>
        Time left to pay: {timeLeft} seconds
        <button className="btn btn-primary">Pay</button>
        {/* <StripeCheckout 
            token={ (id) => doRequest({token: id}) }
            stripeKey="pk_test_51KVdOLSGSx4rg7cgqHMcaYu1Uh1eM4bWZtuLwD9FQDBIGIvE6ZOpsb7eAxoCoVgB4QcVnUcE1MN8FfAV98EFf27c00jcCygkAe"
            amount= {order.ticket.price * 100}
            email={currentUser.email}
        /> */}

        {errors}
    </div>;

}

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`)

    return { order: data}
}

export default OrderShow;