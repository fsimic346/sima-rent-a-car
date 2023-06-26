import Repository from "./repository";
import { singleton } from "tsyringe";

@singleton()
export default class CartRepository extends Repository {
    path = "./data/cart.json";

    constructor() {
        super();
        this.createStorage();
    }
}
