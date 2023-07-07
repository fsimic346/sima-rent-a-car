import { Router, Request, Response } from "express";
import { container } from "tsyringe";
import OrderService from "../service/order.service";
import { CustomRequest, authenticateToken } from "../utils/jwtAuthenticator";
import { omit } from "lodash";
import UserService from "../service/user.service";
import { Role, User } from "../model/user.model";
import CartService from "../service/cart.service";

export const orderRouter = Router();

const orderSerivce = container.resolve(OrderService);
const userService = container.resolve(UserService);
const cartService = container.resolve(CartService);

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

orderRouter.get("/vehicle/:vehicleId", (req: Request, res: Response) => {
    const result = orderSerivce.getActiveByVehicle(
        parseInt(req.params.vehicleId),
    );
    res.send(result);
});
orderRouter.get(
    "/user/:userId",
    authenticateToken,
    (req: Request, res: Response) => {
        const user = userService.getByUsername(
            (req as CustomRequest).username,
        ) as User;
        if (
            user.role != Role.Customer ||
            user.id != parseInt(req.params.userId)
        ) {
            res.sendStatus(401);
            return;
        }
        const result = orderSerivce.getByUser(parseInt(req.params.userId));
        res.send(result.map(x => omit(x, ["deleted"])));
    },
);

orderRouter.patch(
    "/cancel",
    authenticateToken,
    (req: Request, res: Response) => {
        const user = userService.getByUsername(
            (req as CustomRequest).username,
        ) as User;
        if (
            user.role != Role.Customer ||
            user.id != parseInt(req.body.order.userId)
        ) {
            res.sendStatus(401);
            return;
        }
        const result = orderSerivce.cancelOrder(req.body.order.id);
        if (result) {
            res.sendStatus(200);
            return;
        }
        res.sendStatus(400);
        return;
    },
);

orderRouter.patch(
    "/setStatus",
    authenticateToken,
    (req: Request, res: Response) => {
        const user = userService.getByUsername(
            (req as CustomRequest).username,
        ) as User;
        if (
            user.role != Role.Manager ||
            user.agencyId != parseInt(req.body.order.agencyId)
        ) {
            res.sendStatus(401);
            return;
        }
        const result = orderSerivce.setOrderStatus(
            req.body.order.id,
            req.body.status,
        );
        if (result) {
            res.sendStatus(200);
            return;
        }
        res.send(400);
        return;
    },
);

orderRouter.post("/", authenticateToken, (req: Request, res: Response) => {
    const user = userService.getByUsername(
        (req as CustomRequest).username,
    ) as User;
    if (user.role != Role.Customer) {
        res.sendStatus(401);
        return;
    }

    const result = orderSerivce.add(req.body);
    if (result.success) {
        cartService.emptyCart(user.id);
        res.sendStatus(200);
        return;
    }
    res.send(400);
    return;
});
