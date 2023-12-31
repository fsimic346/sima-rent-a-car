import { Router, Request, Response } from "express";
import { container } from "tsyringe";
import AgencyService from "../service/agency.service";

export const agencyRouter = Router();

const agencyService = container.resolve(AgencyService);

agencyRouter.post("/", (req: Request, res: Response) => {
    const result = agencyService.add(req.body.agency, req.body.manager);
    if (result.success) {
        res.sendStatus(200);
    } else {
        res.status(400).send(result.message);
    }
});

agencyRouter.get("/all", (req: Request, res: Response) => {
    res.send(agencyService.getAll());
});

agencyRouter.get("/get/:agencyId", (req: Request, res: Response) => {
    const agency = agencyService.getById(parseInt(req.params.agencyId));
    if (!agency) {
        res.sendStatus(401);
        return;
    }
    res.send(agency);
});
