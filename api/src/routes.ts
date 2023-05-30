import { Express, Request, Response } from "express";
import UserService from "./service/user.service";

function routes(app: Express) {
    app.get("/", (req: Request, res: Response) => {
        res.send("bruh");
    });

    app.post("/user", (req: Request, res: Response) => {
        const u = new UserService();
        const result = u.add(req.body);
        if (result.success) {
            res.sendStatus(200);
        } else {
            res.send(result.message).status(400);
        }
    });
}

export default routes;
