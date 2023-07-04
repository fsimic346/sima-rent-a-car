import { Vehicle } from "./vehicle.model";

export interface CartItem {
    vehicleId: number;
    vehicle?: Vehicle;
    dateRange: string;
}
