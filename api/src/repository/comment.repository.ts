import Repository from "./repository";
import { singleton } from "tsyringe";

@singleton()
export default class CommentRepository extends Repository {
    path = "./data/comment.json";

    constructor() {
        super();
        this.createStorage();
    }
}
