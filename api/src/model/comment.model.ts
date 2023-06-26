import IEntity from "./IEntity";
import { Agency } from "./agency.model";
import { User } from "./user.model";

export interface Comment extends IEntity {
    user: User;
    agency: Agency;
    text: String;
    rating: Number;
}
