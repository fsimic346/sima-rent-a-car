import { autoInjectable } from "tsyringe";
import CartRepository from "../repository/cart.repository";
import { Cart } from "../model/cart.model";
import Result from "../utils/Result";
import UserRepository from "../repository/user.repository";
import { Vehicle } from "../model/vehicle.model";
import VehicleRepository from "../repository/vehicle.repository";
import { CartItem } from "../model/cartItem.model";
import moment from "moment";
import { ParamsDictionary } from "express-serve-static-core";

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

    addCartItem(dataCartItem: any, dataUser: any): Result {
        const result = this.validateCartItem(dataCartItem);
        if (!result.success) return result;

        let cart = this.getByUserId(dataUser.id);

        const end: any = new Date(dataCartItem.dateRange.end);
        const start: any = new Date(dataCartItem.dateRange.start);

        const daysRented: any = Math.ceil(
            Math.abs(end - start + 1) / (1000 * 60 * 60 * 24),
        );

        cart.totalPrice += parseInt(dataCartItem.vehicle.price) * daysRented;
        const cartItem: CartItem = {
            vehicleId: dataCartItem.vehicle.id,
            dateRange: dataCartItem.dateRange,
        };
        cart.cartItems.push(cartItem);
        this.repository.update(cart);

        return result;
    }

    removeFromCart(dataCartItem: any, dataUser: any): Result {
        const result = this.validateCartItem(dataCartItem);
        if (!result.success) return result;

        let cart = this.getByUserId(dataUser);

        const end: any = new Date(dataCartItem.dateRange.end);
        const start: any = new Date(dataCartItem.dateRange.start);

        const daysRented: any = Math.ceil(
            Math.abs(end - start + 1) / (1000 * 60 * 60 * 24),
        );
        cart.totalPrice -= parseInt(dataCartItem.vehicle.price) * daysRented;

        cart.cartItems.splice(
            cart.cartItems.findIndex(
                x =>
                    x.vehicleId == dataCartItem.vehicle.id &&
                    x.dateRange == dataCartItem.dateRange,
            ),
            1,
        );

        this.repository.update(cart);

        return result;
    }

    getByUserId(data: any): Cart {
        let cart = (this.repository.getAll() as Cart[]).find(
            x => x.userId === data,
        ) as Cart;

        if (cart) {
            for (const cartItem of cart.cartItems) {
                cartItem.vehicle = this.vehicleRepository.getById(
                    cartItem.vehicleId,
                );
            }
        }

        return cart;
    }

    getByUser(id: any): Result {
        const result = new Result();

        let cart = (this.repository.getAll() as Cart[]).find(
            x => x.userId === id,
        ) as Cart;

        for (const cartItem of cart.cartItems) {
            cartItem.vehicle = this.vehicleRepository.getById(
                cartItem.vehicleId,
            );
        }

        result.success = true;
        result.message = "";
        return result;
    }

    validateCartItem(dataCartItem: any): Result {
        const result = new Result();

        if (!(dataCartItem.vehicle as Vehicle)) {
            result.message = "Vehicle in cart doesn't exist";
            return result;
        }

        result.success = true;
        // result.message = "Successfully added cart item.";
        return result;
    }

    emptyCart(userId: number) {
        const cart = this.repository
            .getAll()
            .find(x => x.userId === userId) as Cart;
        cart.cartItems = [];
        cart.totalPrice = 0;

        this.repository.update(cart);
    }
}
