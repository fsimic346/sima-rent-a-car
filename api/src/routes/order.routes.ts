import { Router, Request, Response } from "express";
import { container } from "tsyringe";
import OrderService from "../service/order.service";
import { CustomRequest, authenticateToken } from "../utils/jwtAuthenticator";
import { omit } from "lodash";
import UserService from "../service/user.service";
import { Role, User } from "../model/user.model";

export const orderRouter = Router();

const orderSerivce = container.resolve(OrderService);
const userService = container.resolve(UserService);

orderRouter.get(
    "/:agencyId",
    authenticateToken,
    (req: Request, res: Response) => {
        const user = userService.getByUsername(
            (req as CustomRequest).username,
        ) as User;
        if (
            user.role != Role.Manager ||
            user.agencyId != parseInt(req.params.agencyId)
        ) {
            res.sendStatus(401);
            return;
        }
        const result = orderSerivce.getByAgency(parseInt(req.params.agencyId));
        res.send(result.map(x => omit(x, ["deleted"])));
    },
);
