import { Router, Request, Response } from "express";
import { container } from "tsyringe";
import VehicleService from "../service/vehicleService";

export const vehicleRouter = Router();

const vehicleService = container.resolve(VehicleService);

vehicleRouter.post("/", (req: Request, res: Response) => {
    const result = vehicleService.add(req.body.vehicle, req.body.agencyId);
    if (result.success) {
        res.sendStatus(200);
    } else {
        res.status(400).send(result.message);
    }
});
