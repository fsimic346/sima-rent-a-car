import { Router, Request, Response } from "express";
import { container } from "tsyringe";
import CommentService from "../service/comment.service";
import { omit } from "lodash";
import Result from "../utils/Result";
import { CustomRequest, authenticateToken } from "../utils/jwtAuthenticator";
import UserService from "../service/user.service";
import { Role } from "../model/user.model";

export const commentRouter = Router();

const commentService = container.resolve(CommentService);
const userService = container.resolve(UserService);

commentRouter.get("/", (req: Request, res: Response) => {
    const result = commentService.getAll();
    res.send(result.map(x => omit(x, ["deleted"])));
});

commentRouter.get("/:agencyId", (req: Request, res: Response) => {
    const result = commentService.getByAgency(parseInt(req.params.agencyId));
    if (!result) {
        res.sendStatus(400);
        return;
    }
    res.send(result);
});

commentRouter.post("/", (req: Request, res: Response) => {
    const result: Result = commentService.add(req.body);
    if (!result.success) {
        res.status(400).send(result.message);
        return;
    }
    res.send(result.message);
});

commentRouter.post(
    "/approve",
    authenticateToken,
    (req: Request, res: Response) => {
        const user = userService.getByUsername((req as CustomRequest).username);
        if (!user || user.role != Role.Manager) {
            res.sendStatus(401);
            return;
        }
        const result: Result = commentService.approveComment(req.body);
        if (!result.success) {
            res.status(400).send(result.message);
            return;
        }
        res.send(result.message);
    },
);

commentRouter.post(
    "/reject",
    authenticateToken,
    (req: Request, res: Response) => {
        const user = userService.getByUsername((req as CustomRequest).username);
        if (!user || user.role != Role.Manager) {
            res.sendStatus(401);
            return;
        }
        const result: Result = commentService.rejectComment(req.body);
        if (!result.success) {
            res.status(400).send(result.message);
            return;
        }
        res.send(result.message);
    },
);
