import { Router } from "express";
import { createChat, getYourChats } from "./functions.js";
import { authenticateToken } from '../auth/functions.js';

const router = Router();

router.post('/createChat', authenticateToken, async (req, res) => {
      console.log('Body:', req.body);
      res.send(await createChat(req, res));
})

router.post('/getYourChats', authenticateToken, async (req, res) => {
      console.log('Body:', req.body);
      res.send(await getYourChats(req, res));
})

export default router