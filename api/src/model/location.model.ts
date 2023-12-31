import IEntity from "./IEntity";

export interface Location extends IEntity {
    latitude: number;
    longitude: number;
    address: string;
}
