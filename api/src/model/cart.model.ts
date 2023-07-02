import IEntity from "./IEntity";
import { User } from "./user.model";
import { Vehicle } from "./vehicle.model";

export interface Cart extends IEntity {
    userId: number;
    user?: User;
    vehicles: Vehicle[];
    totalPrice: number;
}
