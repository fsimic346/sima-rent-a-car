import { Router, Request, Response } from "express";
import { container } from "tsyringe";
import VehicleService from "../service/vehicleService";
import { CustomRequest, authenticateToken } from "../utils/jwtAuthenticator";
import UserService from "../service/user.service";
import { Role } from "../model/user.model";

export const vehicleRouter = Router();

const vehicleService = container.resolve(VehicleService);
const userService = container.resolve(UserService);

vehicleRouter.post("/", (req: Request, res: Response) => {
    const result = vehicleService.add(req.body.vehicle, req.body.agencyId);
    if (result.success) {
        res.sendStatus(200);
    } else {
        res.status(400).send(result.message);
    }
});

vehicleRouter.patch("/", authenticateToken, (req: Request, res: Response) => {
    if (
        userService.getByUsername((req as CustomRequest).username)?.role !==
        Role.Manager
    ) {
        res.sendStatus(401);
        return;
    }
    const result = vehicleService.update(req.body.vehicle);
    if (result.success) {
        res.sendStatus(200);
    } else {
        res.status(400).send(result.message);
    }
});

vehicleRouter.delete(
    "/:vehicleId",
    authenticateToken,
    (req: Request, res: Response) => {
        if (
            userService.getByUsername((req as CustomRequest).username)?.role !==
            Role.Manager
        ) {
            res.sendStatus(401);
            return;
        }
        const result = vehicleService.delete(req.params.vehicleId);
        if (result.success) {
            res.sendStatus(200);
        } else {
            res.status(400).send(result.message);
        }
    },
);
