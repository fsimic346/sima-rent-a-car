import IEntity from "./IEntity";
import { CartItem } from "./cartItem.model";
import { User } from "./user.model";

export interface Cart extends IEntity {
    userId: number;
    user?: User;
    cartItems: CartItem[];
    totalPrice: number;
}
