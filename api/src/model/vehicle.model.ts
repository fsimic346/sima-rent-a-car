import IEntity from "./IEntity";
import { Agency } from "./agency.model";

//to-do add more options
export enum CarType {
  car,
  van,
  mobileHome,
  motorcycle,
  truck,
}

export enum TransmissionType {
  manual,
  automatic,
}

export enum FuelType {
  diesel,
  gasoline,
  hybrid,
  electric,
}

export interface Vehicle extends IEntity {
  brand: string;
  model: string;
  price: string;
  carType: CarType;
  agency: Agency;
  transmissionType: TransmissionType;
  fuelType: FuelType;
  consumption: number;
  doorNumber: number;
  passangerNumber: number;
  description: string;
  image: string;
  isAvailable: boolean;
}
