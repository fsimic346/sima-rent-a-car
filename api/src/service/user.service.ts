import { autoInjectable } from "tsyringe";
import UserRepository from "../repository/user.repository";
import { Gender, Role, User } from "../model/user.model";
import Result from "../utils/Result";

@autoInjectable()
export default class UserService {
    constructor(private repository?: UserRepository) {}

    add(data: any): Result {
        const result = this.validateData(data);

        if (!result.success) {
            return result;
        }

        const user: User = {
            username: data.username,
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender as Gender,
            role: Role.Customer,
            dateOfBirth: data.dateOfBirth,
            deleted: false,
            id: result.value,
        };
        this.repository?.save(user);

        return result;
    }

    update(data: any): Result {
        const result = this.validateData(data);

        if (!result.success) return result;

        this.repository?.update(data);

        return result;
    }

    //premestiti u middleware
    validateData(data: any): Result {
        let result: Result = new Result();
        const list: User[] = this.repository?.getAll() as User[];
        const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

        if (list?.find((x) => x.username === data.username)) {
            result.message = "username already exists";
            return result;
        } else if (list?.find((x) => x.email === data.email)) {
            result.message = "email already exists";
            return result;
        } else if (data.password !== data.confirmPassword) {
            result.message = "passwords don't match";
            return result;
        } else if (!Object.values(Gender).includes(data.gender)) {
            result.message = "gender doesn't exist";
            return result;
        } else if (!data.email.match(emailFormat) || data.email === "") {
            result.message = "invalid email";
            return result;
        }
        result.success = true;
        result.message = "successful registration";
        result.value = list === undefined ? 1 : list?.length + 1;
        return result;
    }
}
