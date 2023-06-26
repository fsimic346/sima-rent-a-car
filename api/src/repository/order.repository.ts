import Repository from "./repository";
import { singleton } from "tsyringe";

@singleton()
export default class OrderRepository extends Repository {
    path = "./data/order.json";

    constructor() {
        super();
        this.createStorage();
    }
}
