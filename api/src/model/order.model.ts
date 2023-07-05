import IEntity from "./IEntity";
import { Agency } from "./agency.model";
import { CartItem } from "./cartItem.model";
import { User } from "./user.model";

export enum Status {
    Pending = "Pending",
    Approved = "Approved",
    Denied = "Denied",
    Cancelled = "Cancelled",
    Returned = "Returned",
    Rented = "Rented",
}

export interface Order extends IEntity {
    orderId: String;
    cartItems: CartItem[];
    agencyId: number;
    agency?: Agency;
    price: number;
    userId: number;
    user?: User;
    status: Status;
}
