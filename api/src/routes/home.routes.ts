import { Router, Request, Response } from "express";
import { container } from "tsyringe";
import UserService from "../service/user.service";
import {
    generateAccessToken,
    authenticateToken,
    notAuthenticated,
} from "../utils/jwtAuthenticator";
import { omit } from "lodash";
import Result from "../utils/Result";

export const homeRouter = Router();

const userService = container.resolve(UserService);

homeRouter.get("/", (req: Request, res: Response) => {
    res.send("bruh");
});

homeRouter.get("/poz", authenticateToken, (req: Request, res: Response) => {
    res.send("poz");
});

homeRouter.post(
    "/login",
    notAuthenticated,
    async (req: Request, res: Response) => {
        const { usernameOrEmail, password } = req.body;
        const result: Result = await userService.login(
            usernameOrEmail,
            password,
        );
        const user = result.value;
        if (!result.success) {
            return res.status(401).send(result.message);
        }
        res.send({
            token: generateAccessToken(user),
            user: omit(user, ["password", "deleted"]),
        });
    },
);
