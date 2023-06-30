import { Vehicle } from "../model/vehicle.model";
import Repository from "./repository";
import { singleton } from "tsyringe";

@singleton()
export default class VehicleRepository extends Repository {
    path = "./data/vehicle.json";

    constructor() {
        super();
        this.createStorage();
    }

    getById(id: number): Vehicle {
        const vehicle: Vehicle = (super.getAll() as Vehicle[]).find(
            x => x.id == id,
        ) as Vehicle;

        return vehicle;
    }
}
