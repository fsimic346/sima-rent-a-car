import Repository from "./repository";
import { autoInjectable, singleton } from "tsyringe";
import fs from "fs";
import AgencyRepository from "./agency.repository";
import { Role, User } from "../model/user.model";

@autoInjectable()
@singleton()
export default class UserRepository extends Repository {
    path = "./data/user.json";

    constructor(private agencyRepository: AgencyRepository) {
        super();
        this.createStorage();
    }

    getAll(): User[] {
        const users: User[] = super.getAll() as User[];

        for (const user of users) {
            this.loadAgency(user);
        }

        return users;
    }

    getById(id: number): User {
        const user: User = (super.getAll() as User[]).find(
            x => x.id == id,
        ) as User;
        if (user !== undefined && user.role === Role.Manager) {
            this.loadAgency(user);
        }
        return user;
    }

    private loadAgency(user: User) {
        if (user.agencyId !== undefined) {
            user.agency = this.agencyRepository.getById(user.agencyId);
        }
    }

    getByEmail(email: string): User {
        const user: User = (super.getAll() as User[]).find(
            x => x.email == email,
        ) as User;
        if (user !== undefined && user.role === Role.Manager) {
            this.loadAgency(user);
        }
        return user;
    }

    getByUsername(username: string): User {
        const user: User = (super.getAll() as User[]).find(
            x => x.username == username,
        ) as User;
        if (user !== undefined && user.role === Role.Manager) {
            this.loadAgency(user);
        }
        return user;
    }
}
