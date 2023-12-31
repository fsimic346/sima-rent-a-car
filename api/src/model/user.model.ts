import IEntity from "./IEntity";
import { Agency } from "./agency.model";
import { Cart } from "./cart.model";
import { Vehicle } from "./vehicle.model";

export enum Gender {
    Male = "Male",
    Female = "Female",
}

export enum Role {
    Customer = "Customer",
    Manager = "Manager",
    Admin = "Admin",
}

export enum CustomerType {
    Bronze = "Bronze",
    Silver = "Silver",
    Gold = "Gold",
}

export interface User extends IEntity {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    dateOfBirth: Date;
    role: Role;
    email: string;
    imageUrl: string;
    phoneNumber: string;
    banned?: Boolean;
    // optional customer props
    rentedCars?: Vehicle[];
    cart?: Cart;
    points?: number;
    customerType?: CustomerType;
    isSus?: Boolean;

    // optional manager props
    agencyId?: number;
    agency?: Agency;
}
