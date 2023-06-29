import { autoInjectable } from "tsyringe";
import CartRepository from "../repository/cart.repository";
import { Cart } from "../model/cart.model";
import Result from "../utils/Result";
import UserRepository from "../repository/user.repository";
import VehicleRepository from "../repository/vehicle.repository";
import { Vehicle } from "../model/vehicle.model";
import { User } from "../model/user.model";

@autoInjectable()
export default class CartService {
    constructor(
        private repository: CartRepository,
        private userRepository: UserRepository,
        private vehicleRepository: VehicleRepository,
    ) {}

    getById(id: number): Cart {
        return this.repository.getById(id);
    }

    add(data: any): Result {
        const result = this.validateCartData(data);
        const user: User = this.userRepository.getById(data.user.id);
        const vehicles: Vehicle[] = this.vehicleRepository
            .getAll()
            .filter(
                x => x.id in (data.vehicles as Vehicle[]).map(x => x.id),
            ) as Vehicle[];
        const cart: Cart = {
            id: result.value,
            user: user,
            vehicles: vehicles,
            totalPrice: vehicles.reduce((a, b) => {
                return a + b.price;
            }, 0),
            deleted: false,
        };

        return result;
    }

    update(data: any): Result {
        const result = this.validateCartUpdateData(data);
        if (!result.success) return result;

        const cart: Cart = this.getById(data.id);
        const user: User = this.userRepository.getById(data.user.id);
        const vehicles: Vehicle[] = this.vehicleRepository
            .getAll()
            .filter(
                x => x.id in (data.vehicles as Vehicle[]).map(x => x.id),
            ) as Vehicle[];

        cart.vehicles = vehicles;
        cart.user = user;
        cart.totalPrice = vehicles.reduce((a, b) => {
            return a + b.price;
        }, 0);

        this.repository.update(cart);
        return result;
    }

    validateCartUpdateData(data: any): Result {
        const result = new Result();
        const list: Cart[] = this.repository.getAll() as Cart[];

        if (!this.userRepository.getById(data.user.id)) {
            result.message = "Invalid user";
            return result;
        }

        if (!(data.id in this.repository.getAll())) {
            result.message = "Cart doesn't exist";
            return result;
        }

        if (
            !(data.vehicles as Vehicle[])
                .map(x => x.id)
                .every(x =>
                    this.vehicleRepository
                        .getAll()
                        .map(x => x.id)
                        .includes(x),
                )
        ) {
            result.message = "Vehicle in cart doesn't exist";
            return result;
        }

        result.success = true;
        result.message = "Successfully updated cart.";
        return result;
    }

    validateCartData(data: any): Result {
        const result = new Result();
        const list: Cart[] = this.repository.getAll() as Cart[];

        if (!this.userRepository.getById(data.user.id)) {
            result.message = "Invalid user";
            return result;
        }

        if (list.some(x => x.user.id === data.user.id)) {
            result.message = "User already has a cart";
            return result;
        }

        if (
            !(data.vehicles as Vehicle[])
                .map(x => x.id)
                .every(x =>
                    this.vehicleRepository
                        .getAll()
                        .map(x => x.id)
                        .includes(x),
                )
        ) {
            result.message = "Vehicle in cart doesn't exist";
            return result;
        }

        result.value = list === undefined ? 1 : list?.length + 1;
        result.success = true;
        result.message = "Successfully created cart.";
        return result;
    }
}
