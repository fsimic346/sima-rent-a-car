import { autoInjectable } from "tsyringe";
import UserRepository from "../repository/user.repository";
import { Gender, Role, User } from "../model/user.model";
import Result from "../utils/Result";
import config from "config";
import bcrypt from "bcrypt";
import { omit } from "lodash";
import { Agency } from "../model/agency.model";
import AgencyService from "./agency.service";

const saltRounds = config.get<number>("saltRounds");

@autoInjectable()
export default class UserService {
    constructor(
        private repository: UserRepository,
        private agencyService: AgencyService,
    ) {}

    async add(data: any): Promise<Result> {
        const result = this.validateNewUserData(data);

        if (!result.success) {
            return result;
        }
        const hashedPassword: string = await bcrypt.hash(
            data.password,
            saltRounds,
        );
        const user: User = {
            username: data.username,
            email: data.email,
            password: hashedPassword,
            imageUrl: data.imageUrl,
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender as Gender,
            role: Role.Customer,
            dateOfBirth: data.dateOfBirth,
            deleted: false,
            id: result.value,
            phoneNumber: data.phoneNumber,
        };
        // if (!user.imageUrl.match(/\.(jpeg|jpg|gif|png)$/)) {
        user.imageUrl =
            "https://repository-images.githubusercontent.com/260096455/47f1b200-8b2e-11ea-8fa1-ab106189aeb0";
        // }
        this.repository?.save(user);
        result.success = true;
        result.value = omit(user, ["password"]);
        return result;
    }

    async addManager(data: any): Promise<Result> {
        const result = this.validateNewManagerData(data);

        if (!result.success) {
            return result;
        }
        const hashedPassword: string = await bcrypt.hash(
            data.password,
            saltRounds,
        );
        const user: User = {
            username: data.username,
            email: data.email,
            password: hashedPassword,
            imageUrl: data.imageUrl,
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender as Gender,
            role: Role.Manager,
            dateOfBirth: data.dateOfBirth,
            deleted: false,
            id: result.value,
            phoneNumber: data.phoneNumber,
        };
        // if (!user.imageUrl.match(/\.(jpeg|jpg|gif|png)$/)) {
        user.imageUrl =
            "https://repository-images.githubusercontent.com/260096455/47f1b200-8b2e-11ea-8fa1-ab106189aeb0";
        // }
        this.repository?.save(user);
        result.value = omit(user, ["password"]);
        return result;
    }

    banUser(username: string): Result {
        const result = new Result();
        result.message = "Failed to ban " + username;
        const user = this.getByUsername(username);
        if (user === undefined || user.banned) return result;
        const bannedUser: User = { ...user, banned: true };
        this.repository?.update(bannedUser);
        result.success = true;
        result.message = "Banned user " + username;
        return result;
    }
    update(data: any): Result {
        const result = this.validateUpdatedUserData(data);

        if (!result.success) return result;

        const user: User = this.getById(data.id) as User;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.dateOfBirth = data.dateOfBirth;
        user.gender = data.gender;
        user.imageUrl = data.imageUrl;
        user.phoneNumber = data.phoneNumber;

        this.repository?.update(user);

        return result;
    }

    getById(id: number): User | undefined {
        const user: User | undefined = (
            this.repository?.getAll() as User[]
        ).find(x => x.id == id);
        if (user === undefined) return;
        if (user.role === Role.Manager && user.agencyId !== undefined) {
            user.agency = this.agencyService.getById(user.agencyId) as Agency;
        }
        return user;
    }

    getByUsername(username: string): User | undefined {
        const user: User | undefined = (
            this.repository?.getAll() as User[]
        ).find(x => x.username == username);
        if (user === undefined) return;
        if (user.role === Role.Manager && user.agencyId !== undefined) {
            user.agency = this.agencyService.getById(user.agencyId) as Agency;
        }
        return user;
    }

    getByEmail(email: string): User | undefined {
        const user: User | undefined = (
            this.repository?.getAll() as User[]
        ).find(x => x.email == email);
        if (user === undefined) return;
        if (user.role === Role.Manager && user.agencyId !== undefined) {
            user.agency = this.agencyService.getById(user.agencyId) as Agency;
        }
        return user;
    }

    getAvailableManagers(): User[] {
        return (this.repository.getAll() as User[]).filter(
            x => x.role === "Manager" && x.agencyId === undefined,
        );
    }

    getAll(): User[] {
        return this.repository.getAll() as User[];
    }

    async login(usernameOrEmail: string, password: string): Promise<Result> {
        let result: Result = new Result();

        const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        let user: User | undefined;
        if (usernameOrEmail.match(emailFormat)) {
            user = this.getByEmail(usernameOrEmail);
        } else {
            user = this.getByUsername(usernameOrEmail);
        }
        result.message = "Invalid login credentials.";
        result.value = user;
        if (user?.banned) {
            result.message = "User is banned.";
            return result;
        }

        if (user === undefined) {
            return result;
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            result.message = "Successful login.";
            result.success = true;
            return result;
        }
        return result;
    }

    validateNewUserData(data: any): Result {
        let result: Result = new Result();
        const list: User[] = this.repository?.getAll() as User[];
        const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

        if (data.username === "" || !("username" in data)) {
            result.message = "Invalid username.";
            return result;
        } else if (list?.find(x => x.username === data.username)) {
            result.message = "Username already exists.";
            return result;
        } else if (data.email === "" || !("email" in data)) {
            result.message = "Invalid email.";
            return result;
        } else if (!data.email.match(emailFormat)) {
            result.message = "Invalid email.";
            return result;
        } else if (list?.find(x => x.email === data.email)) {
            result.message = "Email already exists.";
            return result;
        } else if (data.password !== data.confirmPassword) {
            result.message = "Passwords don't match.";
            return result;
        } else if (data.password === "" || !("password" in data)) {
            result.message = "Invalid password.";
            return result;
        } else if (data.firstName === "" || !("firstName" in data)) {
            result.message = "Invalid first name.";
            return result;
        } else if (data.lastName === "" || !("lastName" in data)) {
            result.message = "Invalid last name.";
            return result;
        }
        result.success = true;
        result.message = "Successful registration.";
        result.value = list === undefined ? 1 : list?.length + 1;
        return result;
    }

    validateNewManagerData(data: any): Result {
        let result: Result = new Result();
        const list: User[] = this.repository?.getAll() as User[];
        const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

        if (data.username === "" || !("username" in data)) {
            result.message = "Invalid username.";
            return result;
        } else if (list?.find(x => x.username === data.username)) {
            result.message = "Username already exists.";
            return result;
        } else if (data.email === "" || !("email" in data)) {
            result.message = "Invalid email.";
            return result;
        } else if (list?.find(x => x.email === data.email)) {
            result.message = "Email already exists.";
            return result;
        } else if (!data.email.match(emailFormat)) {
            result.message = "Invalid email.";
            return result;
        } else if (data.password === "" || !("password" in data)) {
            result.message = "Invalid password.";
            return result;
        } else if (data.firstName === "" || !("firstName" in data)) {
            result.message = "Invalid first name.";
            return result;
        } else if (data.lastName === "" || !("lastName" in data)) {
            result.message = "Invalid last name.";
            return result;
        }
        result.success = true;
        result.message = "successful manager registration";
        result.value = list === undefined ? 1 : list?.length + 1;
        return result;
    }

    //ToDo: implement validation for phone number
    validateUpdatedUserData(data: any): Result {
        let result: Result = new Result();

        if (data.firstName === "" || !("firstName" in data)) {
            result.message = "Invalid first name.";
            return result;
        } else if (data.lastName === "" || !("lastName" in data)) {
            result.message = "Invalid last name.";
            return result;
        } else if (
            data.gender !== "" &&
            "gender" in data &&
            !Object.values(Gender).includes(data.gender)
        ) {
            result.message = "Gender doesn't exist.";
            return result;
        } else if (
            data.imageUrl !== null &&
            "imageUrl" in data &&
            data.imageUrl !=
                "https://repository-images.githubusercontent.com/260096455/47f1b200-8b2e-11ea-8fa1-ab106189aeb0" &&
            !data.imageUrl.match(/\.(jpeg|jpg|gif|png)$/)
        ) {
            result.message = "Invalid image url.";
            return result;
        } else if (
            isNaN(data.phoneNumber) &&
            "phoneNumber" in data &&
            data.phoneNumber !== ""
        ) {
            result.message = "Invalid phone number";
            return result;
        }
        result.success = true;
        result.message = "successful update";
        return result;
    }
}
