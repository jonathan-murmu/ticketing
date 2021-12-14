import express from 'express';

import { currentUser } from '@ticketsjm92/common';

const router = express.Router();

router.get('/api/users/currentuser',currentUser, (req, res) => {
    res.send({ currentuser: req.currentUser  || null });
});

export { router as currentUserRouter}