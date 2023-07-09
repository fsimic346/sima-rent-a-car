import { autoInjectable } from "tsyringe";
import OrderRepository from "../repository/order.repository";
import Result from "../utils/Result";
import { Order, Status } from "../model/order.model";
import { Vehicle } from "../model/vehicle.model";
import VehicleRepository from "../repository/vehicle.repository";
import AgencyRepository from "../repository/agency.repository";
import UserRepository from "../repository/user.repository";
import { CartItem } from "../model/cartItem.model";
import { collect } from "collect.js";
import randomstring from "randomstring";
import { CustomerType } from "../model/user.model";
import { omit } from "lodash";

@autoInjectable()
export default class OrderService {
    constructor(
        private repository: OrderRepository,
        private vehicleRepository: VehicleRepository,
        private agencyRepository: AgencyRepository,
        private userRepository: UserRepository,
    ) {}

    getById(id: Number): Order {
        return this.repository.getById(id);
    }

    setCommented(orderId: any): Result {
        const result = new Result();
        const order = this.repository
            .getAll()
            .find(x => x.id === orderId) as Order;

        if (!order) {
            return result;
        }

        const newOrder = {
            ...order,
            commented: true,
        };

        this.repository.update(newOrder);
        result.success = true;
        return result;
    }

    getAll(): Order[] {
        return this.repository.getAll();
    }

    getByAgency(agencyId: number): Order[] {
        return this.repository.getAll().filter(x => x.agencyId == agencyId);
    }

    getByUser(userId: number): Order[] {
        return this.repository.getAll().filter(x => x.userId == userId);
    }

    denyOrder(id: number, reasoning: String) {
        const order: Order = this.repository.getById(id);
        order.status = Status.Denied;
        order.reasoning = reasoning;

        this.repository.update(order);
    }

    setOrderStatus(id: number, status: Status) {
        const order: Order = this.repository.getById(id);
        if (!(status in Status) || !order) {
            return false;
        }
        order.status = status;
        this.repository.update(order);
        return true;
    }

    cancelOrder(id: number) {
        const order: Order = this.repository.getById(id);
        if (!order || order.status !== Status.Pending) return false;
        order.status = Status.Cancelled;

        const cancelledOrder = { ...order, cancellationDate: new Date() };
        this.repository.update(cancelledOrder);

        const user = this.userRepository.getById(order.userId);

        if (!user.points) {
            user.points = 0 - (order.price / 1000) * 133 * 4;
        } else {
            user.points -= (order.price / 1000) * 133 * 4;
        }
        this.userRepository.update(user);
        return true;
    }

    getActiveByVehicle(id: number): Order[] {
        return this.repository
            .getAll()
            .filter(
                x =>
                    x.cartItems.map(y => y.vehicleId).includes(id) &&
                    x.status !== Status.Cancelled &&
                    x.status !== Status.Denied &&
                    x.status !== Status.Returned,
            );
    }

    add(data: any): Result {
        const result = this.validateOrderData(data);
        if (!result.success) return result;

        const orderCollection: any = collect(
            data.cartItems as CartItem[],
        ).groupBy((item, key) => (item.vehicle as Vehicle).agencyId);

        const date = new Date();
        const user = this.userRepository.getById(data.userId);

        let discount = 1;

        if (user.points) {
            if (user.points >= 500) discount = 0.9;
            else if (user.points >= 200) discount = 0.95;
            else if (user.points >= 50) discount = 0.97;
        }

        orderCollection.each((cOrder: any) => {
            const order: Order = {
                id: result.value,
                userId: data.userId,
                status: Status.Pending,
                cartItems: cOrder.items.map((x: any) => omit(x, "vehicle")),
                price:
                    cOrder.items.reduce((a: any, b: any) => {
                        const end: any = new Date(b.dateRange.end);
                        const start: any = new Date(b.dateRange.start);

                        const daysRented: any = Math.ceil(
                            Math.abs(end - start + 1) / (1000 * 60 * 60 * 24),
                        );
                        return (a += parseInt(b.vehicle.price) * daysRented);
                    }, 0) * discount,
                agencyId: cOrder.items[0].vehicle.agencyId,
                deleted: false,
                orderId:
                    randomstring.generate(10) +
                    date.getDay() +
                    date.getMonth() +
                    date.getFullYear() +
                    date.getHours() +
                    date.getMinutes() +
                    date.getSeconds() +
                    date.getMilliseconds(),
            };
            this.repository.save(order);

            if (!user.points) {
                user.points = (order.price / 1000) * 133;
            } else {
                user.points += (order.price / 1000) * 133;
            }
            this.userRepository.update(user);
        });

        return result;
    }
    private validateOrderData(data: any): Result {
        const result = new Result();
        const list: Order[] = this.repository?.getAll() as Order[];

        if (!data.cartItems || data.cartItems.length === 0) {
            result.message = "Cart is empty";
            return result;
        }
        if (
            !(data.cartItems as CartItem[])
                .map(x => (x.vehicle as Vehicle).id)
                .every(y =>
                    this.vehicleRepository
                        .getAll()
                        .map(z => z.id)
                        .includes(y),
                )
        ) {
            result.message = "Vehicle in order doesn't exist";
            return result;
        }
        if (
            !(data.cartItems as CartItem[])
                .map(x => (x.vehicle as Vehicle).agencyId)
                .every(y =>
                    this.agencyRepository
                        .getAll()
                        .map(z => z.id)
                        .includes(y),
                )
        ) {
            result.message = "Invalid agency";
            return result;
        }
        if (!this.userRepository.getById(data.user.id)) {
            result.message = "Invalid user";
            return result;
        }

        result.success = true;
        result.message = "Successfully created order";
        result.value = list === undefined ? 1 : list?.length + 1;
        return result;
    }
}
