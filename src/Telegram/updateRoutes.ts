import express, { Request, Response } from "express";

import { memberStatusHandler, messageHandler } from "./routeHandler";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    const { update_id, message, my_chat_member, edited_message } = req.body;
    console.log(req.body);


    // Handle Message Content
    if (message) {
        await messageHandler({ update_id, message });
    }

    // Handle Member Status updates
    if (my_chat_member) {
        await memberStatusHandler({ update_id, my_chat_member });
    }

    // Handle edit message
    if (edited_message) {
    }

    return res.send("success");    
});


export default router;