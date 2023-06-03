import { Router, Request, Response } from "express";
import UserService from "../service/user.service";
import { container } from "tsyringe";
import {
    authenticateToken,
    generateAccessToken,
    notAuthenticated,
} from "../utils/jwtAuthenticator";
import { CustomRequest } from "../utils/jwtAuthenticator";
import { omit } from "lodash";

export const userRouter = Router();

const userService = container.resolve(UserService);

userRouter.patch("/", (req: Request, res: Response) => {
    const result = userService.update(req.body);
    if (result.success) {
        res.sendStatus(200);
    } else {
        res.status(400).send(result.message);
    }
});

userRouter.post("/", notAuthenticated, async (req: Request, res: Response) => {
    const result = await userService.add(req.body);
    if (result.success) {
        res.send({
            token: generateAccessToken(result.value),
            user: result.value,
        });
    } else {
        res.status(400).send(result.message);
    }
});

userRouter.get("/", authenticateToken, (req: Request, res: Response) => {
    const user = userService.getByUsername((req as CustomRequest).username);
    if (!user) {
        res.sendStatus(400);
    }
    res.send(omit(user, ["password", "deleted"]));
});

userRouter.get(
    "/:username",
    authenticateToken,
    (req: Request, res: Response) => {
        const user = userService.getByUsername(req.params.username);
        if (!user) {
            res.sendStatus(401);
        }
        res.send(omit(user, ["password", "deleted"]));
    }
);
