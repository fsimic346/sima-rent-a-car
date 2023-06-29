import { Order } from "../model/order.model";
import Repository from "./repository";
import { autoInjectable, singleton } from "tsyringe";
import VehicleRepository from "./vehicle.repository";
import AgencyRepository from "./agency.repository";
import UserRepository from "./user.repository";
import { Vehicle } from "../model/vehicle.model";
import IEntity from "../model/IEntity";

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
        order.vehicles = this.vehicleRepository
            .getAll()
            .filter(x => x.id in order.vehicles.map(x => x.id)) as Vehicle[];
        order.agency = this.agencyRepository.getById(order.agency.id);
        order.customer = this.userRepository.getById(order.customer.id);
    }
}
