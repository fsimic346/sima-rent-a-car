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
import { Role, User } from "../model/user.model";

export const userRouter = Router();

const userService = container.resolve(UserService);

userRouter.patch("/", (req: Request, res: Response) => {
    const result = userService.update(req.body);
    if (result.success) {
        res.status(200).send(result.message);
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

userRouter.post(
    "/manager",
    authenticateToken,
    async (req: Request, res: Response) => {
        if (
            userService.getByUsername((req as CustomRequest).username)?.role !==
            Role.Admin
        ) {
            res.sendStatus(401);
            return;
        }
        const result = await userService.addManager(req.body);
        if (result.success) {
            res.sendStatus(200);
            return;
        }
        res.status(400).send(result.message);
    },
);

userRouter.get("/all", authenticateToken, (req: Request, res: Response) => {
    if (
        userService.getByUsername((req as CustomRequest).username)?.role !==
        Role.Admin
    ) {
        res.sendStatus(401);
        return;
    }
    res.send(userService.getAll().map(x => omit(x, ["password", "deleted"])));
});

userRouter.get("/", authenticateToken, (req: Request, res: Response) => {
    const user = userService.getByUsername((req as CustomRequest).username);
    if (!user) {
        res.sendStatus(400);
    }
    res.send(omit(user, ["password", "deleted"]));
});

userRouter.get(
    "/availableManagers",
    authenticateToken,
    (req: Request, res: Response) => {
        if (
            userService.getByUsername((req as CustomRequest).username)?.role !==
            Role.Admin
        ) {
            res.sendStatus(401);
            return;
        }
        const users: User[] = userService.getAvailableManagers();
        res.send(users.map(x => omit(x, ["password", "deleted"])));
    },
);

userRouter.get(
    "/get/:username",
    authenticateToken,
    (req: Request, res: Response) => {
        const user = userService.getByUsername(req.params.username);
        if (!user) {
            res.sendStatus(401);
            return;
        }
        res.send(omit(user, ["password", "deleted"]));
    },
);
