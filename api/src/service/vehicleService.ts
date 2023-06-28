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
            agencyId: dataAgency.id,
        };

        this.vehicleRepository?.save(vehicle);

        return result;
    }
    validateData(dataVehicle: any, dataAgency: any): Result {
        let result: Result = new Result();
        const priceRegex = "^[1-9][0-9]*$";
        const consumptionRegex = "^[1-9][0-9]*.[0-9]*$";

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
            !dataVehicle.consumption.match(consumptionRegex)
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
        if (!this.agencyRepository.getById(dataAgency)) {
            result.message = "invalid agency";
            return result;
        }
        result.success = true;
        result.message = "vehicle added successfully";
        result.value = vehicles === undefined ? 1 : vehicles?.length + 1;
        return result;
    }
}
