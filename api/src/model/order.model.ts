import IEntity from "./IEntity";
import { Agency } from "./agency.model";
import { User } from "./user.model";
import { Vehicle } from "./vehicle.model";

enum Status {
    Pending = "Pending",
    Approved = "Approved",
    Denied = "Denied",
    Cancelled = "Cancelled",
    Returned = "Returned",
    Rented = "Rented",
}

export interface Order extends IEntity {
    orderId: String;
    vehicles: Vehicle[];
    agency: Agency;
    rentStartDate: Date;
    rentLength: number;
    price: number;
    customer: User;
    status: Status;
}
