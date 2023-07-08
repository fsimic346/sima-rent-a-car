import IEntity from "./IEntity";
import { Agency } from "./agency.model";
import { User } from "./user.model";

export enum CommentStatus {
    Pending = "Pending",
    Approved = "Approved",
    Rejected = "Rejected",
}

export interface Comment extends IEntity {
    userId: number;
    agencyId: number;
    user?: User;
    agency?: Agency;
    text: String;
    rating: number;
    approved: CommentStatus;
    orderId: number;
}
