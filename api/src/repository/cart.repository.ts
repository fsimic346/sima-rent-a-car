import Repository from "./repository";
import { autoInjectable, singleton } from "tsyringe";
import UserRepository from "./user.repository";
import VehicleRepository from "./vehicle.repository";
import { Cart } from "../model/cart.model";
import { Vehicle } from "../model/vehicle.model";
import IEntity from "../model/IEntity";

@autoInjectable()
@singleton()
export default class CartRepository extends Repository {
    path = "./data/cart.json";

    constructor(
        private userRepository: UserRepository,
        private vehicleRepository: VehicleRepository,
    ) {
        super();
        this.createStorage();
    }

    getById(id: Number): Cart {
        const cart: Cart = super.getById(id) as Cart;
        if (cart) {
            this.loadCartData(cart);
        }
        return cart;
    }

    getAll(): Cart[] {
        const carts: Cart[] = super.getAll() as Cart[];

        for (const cart of carts) {
            this.loadCartData(cart);
        }
        return carts;
    }

    private loadCartData(cart: Cart) {
        cart.user = this.userRepository.getById(cart.user.id);
        cart.vehicles = this.vehicleRepository
            .getAll()
            .filter(x => x.id in cart.vehicles.map(x => x.id)) as Vehicle[];
    }
}
