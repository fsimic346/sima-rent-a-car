import Repository from "./repository";
import { singleton } from "tsyringe";

@singleton()
export default class UserRepository extends Repository {
  path = "./data/user.json";
}
