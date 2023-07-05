import { Order } from "../model/order.model";
import Repository from "./repository";
import { autoInjectable, singleton } from "tsyringe";
import VehicleRepository from "./vehicle.repository";
import AgencyRepository from "./agency.repository";
import UserRepository from "./user.repository";
import { Vehicle } from "../model/vehicle.model";
import { omit } from "lodash";
import { CartItem } from "../model/cartItem.model";

@autoInjectable()
@singleton()
export default class OrderRepository extends Repository {
    path = "./data/order.json";

    constructor(
        private vehicleRepository: VehicleRepository,
        private agencyRepository: AgencyRepository,
        private userRepository: UserRepository,
    ) {
        super();
        this.createStorage();
    }

    update(order: Order) {
        return super.update(omit(order, ["agency", "user"]));
    }

    getAll(): Order[] {
        const orders: Order[] = super.getAll() as Order[];
        for (const order of orders) {
            this.loadOrderData(order);
        }

        return orders;
    }

    getById(id: Number): Order {
        const order: Order = super.getById(id) as Order;
        if (order) {
            this.loadOrderData(order);
        }
        return order;
    }

    private loadOrderData(order: Order) {
        for (const cartItem of order.cartItems) {
            cartItem.vehicle = this.vehicleRepository.getById(
                cartItem.vehicleId,
            );
        }
        order.agency = this.agencyRepository.getById(order.agencyId);
        order.user = this.userRepository.getById(order.userId);
    }
}
