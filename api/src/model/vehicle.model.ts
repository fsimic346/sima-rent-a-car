import IEntity from './IEntity'
import { Agency } from './agency.model'

//to-do add more options
export enum VehicleType {
  Car = 'Car',
  Van = 'Van',
  MobileHome = 'MobileHome',
  Motorcycle = 'Motorcycle',
  Truck = 'Truck',
}

export enum TransmissionType {
  Manual = 'Manual',
  Automatic = 'Automatic',
}

export enum FuelType {
  Diesel = 'Diesel',
  Gasoline = 'Gasoline',
  Hybrid = 'Hybrid',
  Electric = 'Electric',
}

export interface Vehicle extends IEntity {
  brand: string
  model: string
  price: string
  vehicleType: VehicleType
  agencyId: number
  transmissionType: TransmissionType
  fuelType: FuelType
  consumption: number
  doorNumber: number
  passangerNumber: number
  description: string
  image: string
  isAvailable: boolean
}
