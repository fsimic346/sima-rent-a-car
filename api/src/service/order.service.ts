import { autoInjectable } from "tsyringe";
import OrderRepository from "../repository/order.repository";
import Result from "../utils/Result";
import { Order, Status } from "../model/order.model";
import { Vehicle } from "../model/vehicle.model";
import VehicleRepository from "../repository/vehicle.repository";
import AgencyRepository from "../repository/agency.repository";
import UserRepository from "../repository/user.repository";
import { User } from "../model/user.model";
import { Agency } from "../model/agency.model";
import randomstring from "randomstring";

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

    getAll(): Order[] {
        return this.repository.getAll();
    }

    setOrderStatus(id: Number, status: Status) {
        const order: Order = this.repository.getById(id);
        order.status = status;
        this.repository.update(order);
    }

    add(data: any): Result {
        const result = this.validateNewOrderData(data);
        if (!result.success) {
            return result;
        }
        const user: User = this.userRepository.getById(data.user.id);
        const agency: Agency = this.agencyRepository.getById(data.agency.id);
        const vehicles = this.vehicleRepository
            .getAll()
            .filter(
                x => x.id in (data.vehicles as Vehicle[]).map(x => x.id),
            ) as Vehicle[];

        const date = new Date();
        const order: Order = {
            id: result.value,
            orderId:
                randomstring.generate(10) +
                date.getDay +
                date.getMonth +
                date.getFullYear +
                date.getHours +
                date.getMinutes +
                date.getSeconds +
                date.getMilliseconds,
            userId: data.user.id,
            agencyId: data.agency.id,
            vehicles: vehicles,
            rentStartDate: data.rentStartDate,
            rentLength: data.rentLength,
            price: vehicles.reduce((a, b) => {
                return a + b.price;
            }, 0),
            status: Status.Pending,
            deleted: false,
        };
        return result;
    }

    private validateNewOrderData(data: any): Result {
        const result = new Result();
        const list: Order[] = this.repository.getAll();

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
            result.message = "Vehicle in order doesn't exist";
            return result;
        }
        if (!this.agencyRepository.getById(data.agency.id)) {
            result.message = "Invalid agency";
            return result;
        }
        if (!this.userRepository.getById(data.user.id)) {
            result.message = "Invalid user";
            return result;
        }
        if (data.rentLength < 1) {
            result.message = "Invalid renting time";
            return result;
        }
        result.success = true;
        result.message = "Successfully created order";
        result.value = result;
        return result;
    }
}
