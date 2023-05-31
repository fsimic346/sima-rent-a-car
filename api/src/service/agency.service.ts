import { autoInjectable } from "tsyringe";
import AgencyRepository from "../repository/agency.repository";
import Result from "../utils/Result";
import { Agency, Status } from "../model/agency.model";
import { Location } from "../model/location.model";
import { Vehicle } from "../model/vehicle.model";

@autoInjectable()
export default class AgencyService {
    constructor(private repository?: AgencyRepository) {}

    add(data: any): Result {
        const result = this.validateData(data);

        if (!result.success) return result;

        const agency: Agency = {
            name: data.name,
            availableVehicles: data.availableVehicles as Vehicle[],
            businessHours: data.businessHours,
            status: data.status as Status,
            location: data.location as Location,
            logo: data.logo,
            rating: data.rating,
            ratingCount: data.ratingCount,
            id: data.id,
            deleted: data.deleted,
        };
        this.repository?.save(agency);

        return result;
    }

    validateData(data: any): Result {
        let result: Result = new Result();
        const agencies: Agency[] = this.repository?.getAll() as Agency[];
        const businessHoursFormat =
            /^(0[0-9]{1}|1[0-9]{1}|2[0-3]{1}){1}:([0-5]{1}[0-9]{1})$/;

        if (agencies?.find((x) => x.name === data.name)) {
            result.message = "name already in use";
            return result;
        } else if (data.name === "") {
            result.message = "invalid name";
            return result;
        } else if (
            !data.businessHours.match(businessHoursFormat) ||
            data.businessHours === ""
        ) {
            result.message = "invalid format";
            return result;
        } else if (!Object.values(Status).includes(data.status)) {
            result.message = "status doesn't exist";
            return result;
        } else if (data.location === "") {
            result.message = "invalid location";
            return result;
        } else if (data.logo === "") {
            result.message = "invalid logo";
            return result;
        }

        result.success = true;
        result.message = "successful registration";
        result.value = agencies === undefined ? 1 : agencies?.length + 1;
        return result;
    }
}
