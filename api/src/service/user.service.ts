import { autoInjectable } from "tsyringe";
import UserRepository from "../repository/user.repository";
import IEntity from "../model/IEntity";

@autoInjectable()
export default class UserService {
    constructor(private userRepository?: UserRepository) {}
}
