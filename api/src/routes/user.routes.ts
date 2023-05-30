import { Router, Request, Response } from "express";
import UserService from "../service/user.service";
import { container } from "tsyringe";

export const userRouter = Router();

const userService = container.resolve(UserService);

userRouter.post("/user", (req: Request, res: Response) => {
    const result = userService.add(req.body);
    if (result.success) {
        res.sendStatus(200);
    } else {
        res.send(result.message).status(400);
    }
});
