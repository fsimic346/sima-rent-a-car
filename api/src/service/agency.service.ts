import { autoInjectable, singleton } from "tsyringe";
import AgencyRepository from "../repository/agency.repository";
import Result from "../utils/Result";
import { Agency, Status } from "../model/agency.model";
import { Location } from "../model/location.model";
import VehicleRepository from "../repository/vehicle.repository";
import UserService from "./user.service";
import { Role, User } from "../model/user.model";

@autoInjectable()
@singleton()
export default class AgencyService {
    constructor(
        private repository: AgencyRepository,
        private vehicleRepository: VehicleRepository,
        private userService: UserService,
    ) {}

    getAll(): Agency[] {
        return this.repository.getAll();
    }

    getById(id: number): Agency {
        return this.repository.getById(id);
    }

    add(dataAgency: any, dataManager: any): Result {
        const resultAgency = this.validateData(dataAgency, dataManager);

        if (!resultAgency.success) return resultAgency;

        dataAgency.location = dataAgency.location;

        dataAgency.businessHours = this.convertDate(dataAgency.businessHours);

        const agency: Agency = {
            name: dataAgency.name,
            businessHours: dataAgency.businessHours,
            status: dataAgency.status as Status,
            location: dataAgency.location as Location,
            logo: dataAgency.logo,
            rating: 0,
            ratingCount: 0,
            id: parseInt(resultAgency.value),
            deleted: false,
        };

        this.userService.assignAgency(dataManager.username, agency);

        this.repository?.save(agency);

        return resultAgency;
    }

    validateData(dataAgency: any, dataManager: any): Result {
        let result: Result = new Result();
        const agencies: Agency[] = this.repository?.getAll() as Agency[];
        const managerExists = this.userService.getByUsername(
            dataManager.username,
        );
        const businessHoursFormat =
            /^([0-9]{1}|1[0-9]{1}|2[0-3]{1}){1}:([0-5]{1}[0-9]{1})-([0-9]{1}|1[0-9]{1}|2[0-3]{1}){1}:([0-5]{1}[0-9]{1})$/;

        if (agencies?.find(x => x.name === dataAgency.name)) {
            result.message = "name already in use";
            return result;
        }
        if (dataAgency.name === "") {
            result.message = "invalid name";
            return result;
        }
        if (
            !dataAgency.businessHours.match(businessHoursFormat) ||
            dataAgency.businessHours === "" ||
            !this.checkBusinessHours(dataAgency)
        ) {
            result.message = "invalid format";
            return result;
        }
        if (dataAgency.logo === "") {
            result.message = "invalid logo";
            return result;
        }
        if (!managerExists) {
            result.message = "invalid manager";
            return result;
        }
        if (
            this.userService.getByUsername(dataManager.username)?.agency ||
            this.userService.getByUsername(dataManager.username)?.role !==
                Role.Manager
        ) {
            result.message = "invalid manager";
            return result;
        }

        result.success = true;
        result.message = "successful registration";
        result.value = this.repository.getNextId();
        return result;
    }

    checkBusinessHours(data: any) {
        const splitBusinessHours = data.businessHours.split("-");
        const hoursMinutes1 = splitBusinessHours[0].split(":");
        const hoursMinutes2 = splitBusinessHours[1].split(":");
        if (parseInt(hoursMinutes1[0]) === parseInt(hoursMinutes2[0])) {
            if (parseInt(hoursMinutes1[1]) >= parseInt(hoursMinutes2[1])) {
                return false;
            }
        }
        if (parseInt(hoursMinutes1[0]) > parseInt(hoursMinutes2[0])) {
            return false;
        }

        return true;
    }

    convertDate(businessHours: any) {
        let sufix1 = " AM";
        let sufix2 = " AM";
        const splitBusinessHours = businessHours.split("-");
        const hoursMinutes1 = splitBusinessHours[0].split(":");
        const hoursMinutes2 = splitBusinessHours[1].split(":");
        if (parseInt(hoursMinutes1[0]) > 12) {
            const newHours1 = parseInt(hoursMinutes1[0]) - 12;
            const newHours2 = parseInt(hoursMinutes2[0]) - 12;
            hoursMinutes1[0] = newHours1.toString();
            hoursMinutes2[0] = newHours2.toString();
            sufix1 = " PM";
            sufix2 = " PM";
        } else if (parseInt(hoursMinutes2[0]) > 12) {
            const newHours2 = parseInt(hoursMinutes2[0]) - 12;
            hoursMinutes2[0] = newHours2.toString();
            sufix2 = " PM";
        }

        return (
            hoursMinutes1[0] +
            ":" +
            hoursMinutes1[1] +
            sufix1 +
            " - " +
            hoursMinutes2[0] +
            ":" +
            hoursMinutes2[1] +
            sufix2
        );
    }
}
