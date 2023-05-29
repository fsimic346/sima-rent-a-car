import { autoInjectable } from "tsyringe";
import UserRepository from "../repository/user.repository";

@autoInjectable()
export default class UserService {
  constructor(private userRepository?: UserRepository) {}

  showAll() {
    console.log(this.userRepository?.getAll());
  }
}
