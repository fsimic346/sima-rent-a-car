import { autoInjectable, singleton } from "tsyringe";
import VehicleRepository from "../repository/vehicle.repository";
import Result from "../utils/Result";
import {
    FuelType,
    TransmissionType,
    Vehicle,
    VehicleType,
} from "../model/vehicle.model";
import AgencyRepository from "../repository/agency.repository";

@autoInjectable()
@singleton()
export default class VehicleService {
    constructor(
        private vehicleRepository: VehicleRepository,
        private agencyRepository: AgencyRepository,
    ) {}

    add(dataVehicle: any, dataAgency: any): Result {
        const result = this.validateData(dataVehicle, dataAgency);

        if (!result.success) return result;

        if (!this.agencyRepository.getById(dataAgency)) {
            result.message = "invalid agency";
            return result;
        }

        const vehicle: Vehicle = {
            brand: dataVehicle.brand,
            model: dataVehicle.model,
            vehicleType: dataVehicle.vehicleType as VehicleType,
            transmissionType: dataVehicle.transmissionType as TransmissionType,
            fuelType: dataVehicle.fuelType as FuelType,
            image: dataVehicle.image,
            consumption: dataVehicle.consumption,
            doorNumber: dataVehicle.doorNumber,
            passangerNumber: dataVehicle.passangerNumber,
            price: dataVehicle.price,
            description: dataVehicle.description,
            id: result.value,
            deleted: false,
            isAvailable: true,
            agencyId: dataAgency,
        };

        this.vehicleRepository?.save(vehicle);

        return result;
    }

    getById(id: number): Vehicle {
        return this.vehicleRepository.getById(id);
    }

    update(data: any): Result {
        const result = this.validateData(data);

        if (!result.success) return result;

        const vehicle: Vehicle = this.getById(data.id);

        vehicle.brand = data.brand;
        vehicle.model = data.model;
        vehicle.vehicleType = data.vehicleType;
        vehicle.transmissionType = data.transmissionType;
        vehicle.fuelType = data.fuelType;
        vehicle.image = data.image;
        vehicle.consumption = data.consumption;
        vehicle.doorNumber = data.doorNumber;
        vehicle.passangerNumber = data.passangerNumber;
        vehicle.price = data.price;
        vehicle.description = data.description;

        this.vehicleRepository?.update(vehicle);

        return result;
    }

    delete(dataVehicle: any): Result {
        let result: Result = new Result();
        const vehicle = this.vehicleRepository.getById(dataVehicle);
        if (!vehicle) {
            result.message = "invalid vehicle";
            return result;
        }

        this.vehicleRepository.delete(vehicle.id);
        result.success = true;

        return result;
    }

    validateData(dataVehicle: any, dataAgency?: any): Result {
        let result: Result = new Result();
        const priceRegex = "^[1-9][0-9]*$";
        const consumptionRegex = "^[1-9][0-9]*.?[0-9]*$";

        const vehicles: Vehicle[] =
            this.vehicleRepository?.getAll() as Vehicle[];

        if (dataVehicle.brand === "") {
            result.message = "invalid brand";
            return result;
        }
        if (dataVehicle.model === "") {
            result.message = "invalid model";
            return result;
        }
        if (dataVehicle.price === "" || !dataVehicle.price.match(priceRegex)) {
            result.message = "invalid price";
            return result;
        }
        if (dataVehicle.vehicleType === "") {
            result.message = "invalid vehicle type";
            return result;
        }
        if (dataVehicle.transmissionType === "") {
            result.message = "invalid transmission type";
            return result;
        }
        if (dataVehicle.fuelType === "") {
            result.message = "invalid fuel type";
            return result;
        }
        if (
            dataVehicle.consumption === "" ||
            !dataVehicle.consumption.toString().match(consumptionRegex)
        ) {
            result.message = "invalid consumption";
            return result;
        }
        if (dataVehicle.doorNumber === "") {
            result.message = "invalid door number";
            return result;
        }
        if (dataVehicle.passangerNumber === "") {
            result.message = "invalid passanger number";
            return result;
        }
        if (dataVehicle.image === "") {
            result.message = "invalid image";
            return result;
        }

        result.success = true;
        result.message = "vehicle added successfully";
        result.value = this.vehicleRepository.getNextId();
        return result;
    }
}
