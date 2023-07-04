import { Router, Request, Response } from "express";
import { container } from "tsyringe";
import { CustomRequest, authenticateToken } from "../utils/jwtAuthenticator";
import CartService from "../service/cart.service";
import UserService from "../service/user.service";
import { Role, User } from "../model/user.model";

export const cartRouter = Router();

const cartService = container.resolve(CartService);
const userService = container.resolve(UserService);

cartRouter.post("/", authenticateToken, (req: Request, res: Response) => {
    if (
        (userService.getByUsername((req as CustomRequest).username) as User)
            .role !== Role.Customer
    ) {
        res.send(400);
    }
    const result = cartService.addCartItem(
        req.body.cartItem,
        userService.getByUsername((req as CustomRequest).username),
    );
    if (result.success) {
        res.sendStatus(200);
    } else {
        res.status(400).send(result.message);
    }
});

cartRouter.get("/", authenticateToken, (req: Request, res: Response) => {
    if (
        (userService.getByUsername((req as CustomRequest).username) as User)
            .role !== Role.Customer
    ) {
        res.send(400);
    }
    res.send(
        cartService.getByUserId(
            userService.getByUsername((req as CustomRequest).username)?.id,
        ),
    );
});
