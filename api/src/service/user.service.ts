import { autoInjectable } from "tsyringe";
import UserRepository from "../repository/user.repository";
import { Gender, Role, User } from "../model/user.model";
import Result from "../utils/Result";
import config from "config";
import bcrypt from "bcrypt";

const saltRounds = config.get<number>("saltRounds");

@autoInjectable()
export default class UserService {
    constructor(private repository?: UserRepository) {}

    async add(data: any): Promise<Result> {
        const result = this.validateData(data);

        if (!result.success) {
            return result;
        }
        const hashedPassword: string = await bcrypt.hash(data.password, saltRounds);
        const user: User = {
            username: data.username,
            email: data.email,
            password: hashedPassword,
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

    getById(id: number): User | undefined {
        return (this.repository?.getAll() as User[]).find((x) => x.id == id);
    }

    getByUsername(username: string): User | undefined {
        return (this.repository?.getAll() as User[]).find((x) => x.username == username);
    }

    getByEmail(email: string): User | undefined {
        return (this.repository?.getAll() as User[]).find((x) => x.email == email);
    }

    async login(usernameOrEmail: string, password: string): Promise<User | undefined> {
        const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        let user: User | undefined;
        if (usernameOrEmail.match(emailFormat)) {
            user = this.getByEmail(usernameOrEmail);
        } else {
            user = this.getByUsername(usernameOrEmail);
        }
        if (user === undefined) {
            return user;
        }

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            return user;
        }
        return undefined;
    }

    //premestiti u middleware
    validateData(data: any): Result {
        let result: Result = new Result();
        const list: User[] = this.repository?.getAll() as User[];
        const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

        if (list?.find((x) => x.username === data.username)) {
            result.message = "username already exists";
            return result;
        } else if (data.username === "") {
            result.message = "invalid username";
            return result;
        } else if (list?.find((x) => x.email === data.email)) {
            result.message = "email already exists";
            return result;
        } else if (data.password !== data.confirmPassword) {
            result.message = "passwords don't match";
            return result;
        } else if (data.password === "") {
            result.message = "invalid password";
        } else if (!Object.values(Gender).includes(data.gender)) {
            result.message = "gender doesn't exist";
            return result;
        } else if (data.gender === "") {
            result.message = "invalid gender";
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
