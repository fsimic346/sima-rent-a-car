import IEntity from "../model/IEntity";
import { Agency } from "../model/agency.model";
import { Role, User } from "../model/user.model";
import { Vehicle } from "../model/vehicle.model";
import Repository from "./repository";
import { autoInjectable, singleton } from "tsyringe";
import VehicleRepository from "./vehicle.repository";

@autoInjectable()
@singleton()
export default class AgencyRepository extends Repository {
    path = "./data/agency.json";

    constructor(private vehicleRepository: VehicleRepository) {
        super();
        this.createStorage();
    }

    getById(id: number): Agency {
        const agency: Agency = (super.getAll() as Agency[]).find(
            x => x.id == id,
        ) as Agency;

        if (agency !== undefined) {
            this.loadVehicles(agency);
        }

        return agency;
    }

    getAll(): Agency[] {
        const agencies: Agency[] = super.getAll() as Agency[];

        for (const agency of agencies) {
            this.loadVehicles(agency);
        }

        return agencies;
    }

    private loadVehicles(agency: Agency) {
        agency.availableVehicles = (
            this.vehicleRepository.getAll() as Vehicle[]
        ).filter(x => {
            return x.agencyId == agency.id;
        });
    }
}
