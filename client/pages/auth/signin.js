import { useState } from 'react';
import Router from 'next/router';
import axios from 'axios';

import useRequest from '../../hooks/use-request';


const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: {
            email, password
        },
        onSuccess: () => Router.push('/')
    });

    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(email, password);

        await doRequest();
    }

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign In</h1>
            <div className="form-group">
                <label>Email Address </label>
                <input 
                    value={email}
                    onChange={e => setEmail(e.target.value)} 
                    className="form-control" 
                />
            </div>
            <div className="form-group">
                <label>Password </label>
                <input 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password" className="form-control" />
            </div>
            {errors}
            {/* {errors.length > 0 && (<div className='alert alert-danger'>
                <h4>Oops...</h4>
                <ul className='my-0'>
                    {errors.map(err => <li key={err.message}>{err.message}</li>)}
                </ul>
            </div>)} */}
            
            <button className="btn btn-primary">Sign In</button>
        </form>
    )
};

export default Signup;