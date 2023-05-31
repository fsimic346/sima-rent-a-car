import Repository from "./repository";
import { singleton } from "tsyringe";

@singleton()
export default class AgencyRepository extends Repository {
    path = "./data/agency.json";

    constructor() {
        super();
        this.createStorage();
    }
}
