import Repository from "./repository";
import { singleton } from "tsyringe";

@singleton()
export default class VehicleRepository extends Repository {
    path = "./data/vehicle.json";

    constructor() {
        super();
        this.createStorage();
    }
}
