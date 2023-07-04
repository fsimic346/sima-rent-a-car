import Repository from "./repository";
import { autoInjectable, singleton } from "tsyringe";
import UserRepository from "./user.repository";
import VehicleRepository from "./vehicle.repository";
import { Cart } from "../model/cart.model";
import { Vehicle } from "../model/vehicle.model";
import IEntity from "../model/IEntity";
import { omit } from "lodash";

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

    update(cart: Cart) {
        for (let i = 0; i < cart.cartItems.length; i++) {
            cart.cartItems[i] = omit(cart.cartItems[i], ["vehicle"]);
        }
        super.update(omit(cart, ["user"]));
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
        cart.user = this.userRepository.getById(cart.userId);
        for (const cartItem of cart.cartItems) {
            cartItem.vehicle = this.vehicleRepository.getById(
                cartItem.vehicleId,
            );
        }
    }
}
