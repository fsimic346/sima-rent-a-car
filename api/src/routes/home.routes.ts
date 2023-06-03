import { Router, Request, Response } from "express";
import { container } from "tsyringe";
import UserService from "../service/user.service";
import {
    generateAccessToken,
    authenticateToken,
    notAuthenticated,
} from "../utils/jwtAuthenticator";
import { omit } from "lodash";

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
        const user = await userService.login(usernameOrEmail, password);
        if (user === undefined) {
            return res.status(401).send("Invalid username or password.");
        }
        res.send({
            token: generateAccessToken(user),
            user: omit(user, ["password", "deleted"]),
        });
    }
);
