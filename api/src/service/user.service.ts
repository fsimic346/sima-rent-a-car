import { autoInjectable } from "tsyringe";
import UserRepository from "../repository/user.repository";
import { Gender, Role, User } from "../model/user.model";
import Result from "../utils/Result";
import config from "config";
import bcrypt from "bcrypt";
import { omit } from "lodash";

const saltRounds = config.get<number>("saltRounds");

@autoInjectable()
export default class UserService {
    constructor(private repository?: UserRepository) {}

    async add(data: any): Promise<Result> {
        const result = this.validateData(data);

        if (!result.success) {
            return result;
        }
        const hashedPassword: string = await bcrypt.hash(
            data.password,
            saltRounds
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
        };
        if (!user.imageUrl.match(/\.(jpeg|jpg|gif|png)$/)) {
            user.imageUrl =
                "https://repository-images.githubusercontent.com/260096455/47f1b200-8b2e-11ea-8fa1-ab106189aeb0";
        }
        this.repository?.save(user);
        result.value = omit(user, ["password"]);
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
        return (this.repository?.getAll() as User[]).find(
            (x) => x.username == username
        );
    }

    getByEmail(email: string): User | undefined {
        return (this.repository?.getAll() as User[]).find(
            (x) => x.email == email
        );
    }

    async login(
        usernameOrEmail: string,
        password: string
    ): Promise<User | undefined> {
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
            result.message = "Username already exists.";
            return result;
        } else if (data.username === "") {
            result.message = "Invalid username.";
            return result;
        } else if (list?.find((x) => x.email === data.email)) {
            result.message = "Email already exists.";
            return result;
        } else if (data.password !== data.confirmPassword) {
            result.message = "Passwords don't match.";
            return result;
        } else if (data.password === "") {
            result.message = "Invalid password.";
        } else if (!Object.values(Gender).includes(data.gender)) {
            result.message = "Gender doesn't exist.";
            return result;
        } else if (data.gender === "") {
            result.message = "Invalid gender.";
            return result;
        } else if (!data.email.match(emailFormat) || data.email === "") {
            result.message = "Invalid email.";
            return result;
        }
        result.success = true;
        result.message = "successful registration";
        result.value = list === undefined ? 1 : list?.length + 1;
        return result;
    }
}
