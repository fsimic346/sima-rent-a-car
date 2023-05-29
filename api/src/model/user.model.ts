import IEntity from "./IEntity";
import { Agency } from "./agency.model";
import { Vehicle } from "./vehicle.model";

export enum Gender {
    Male,
    Female,
}

export enum Role {
    Customer,
    Manager,
    Admin,
}

export enum CustomerType {
    Bronze = 100,
    Silver = 250,
    Gold = 500,
}

export interface User extends IEntity {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    dateOfBirth: Date;
    role: Role;
    // optional customer props
    rentedCars?: Vehicle[];
    cart?: string; //to-do cart
    points?: number;
    customerType?: CustomerType;

    // optional manager props
    agency?: Agency;
}
