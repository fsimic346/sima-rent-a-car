import IEntity from "./IEntity";
import { Location } from "./location.model";
import { Vehicle } from "./vehicle.model";

export enum Status {
  Open,
  Closed,
}

export interface Agency extends IEntity {
  name: string;
  availableVehicles: Vehicle[];
  businessHours: string;
  status: Status;
  location: Location;
  logo: string;
  rating: number;
  ratingCount: number;
}
