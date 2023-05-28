import { Express, Request, Response } from "express";

function routes(app: Express) {
    app.get("/", (req: Request, res: Response) => {
        res.send("bruh");
    });
}

export default routes;
