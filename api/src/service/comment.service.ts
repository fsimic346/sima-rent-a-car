import { autoInjectable } from "tsyringe";
import UserRepository from "../repository/user.repository";
import AgencyRepository from "../repository/agency.repository";
import { Comment } from "../model/comment.model";
import Result from "../utils/Result";
import CommentRepository from "../repository/comment.repository";
import UserService from "./user.service";
import { Agency } from "../model/agency.model";
import { omit } from "lodash";

@autoInjectable()
export default class CommentService {
    constructor(
        private repository: CommentRepository,
        private userService: UserService,
        private agencyRepository: AgencyRepository,
    ) {}

    add(data: any): Result {
        const result = this.validateCommentData(data);

        if (!result.success) {
            return result;
        }
        const user = this.userService.getByUsername(data.user.username);
        const agency = this.agencyRepository.getById(data.agency.id) as Agency;
        if (user === undefined) return result; // nikada nece uci u ovo, ts momenat
        if (agency === undefined) return result; // nikada nece uci u ovo, ts momenat

        const comment: Comment = {
            id: result.value,
            user: user,
            agency: agency,
            text: data.text,
            rating: data.rating,
            deleted: false,
        };

        this.repository.save(comment);
        result.success = true;
        result.value = omit(comment.user, ["password"]);

        return result;
    }

    validateCommentData(data: any): Result {
        const result = new Result();
        const list: Comment[] = this.repository.getAll() as Comment[];

        if (!data.text || !data.text.trim()) {
            result.message = "Invalid comment.";
            return result;
        }
        if (!data.user || !this.userService.getByUsername(data.user.username)) {
            result.message = "Invalid user.";
            return result;
        }
        if (!data.agency || !this.agencyRepository.getById(data.agency.id)) {
            result.message = "Invalid agency.";
            return result;
        }
        if (!data.rating || data.rating > 5 || data.rating < 1) {
            result.message = "Invalid rating.";
            return result;
        }
        result.success = true;
        result.message = "Successfully created comment.";
        result.value = list === undefined ? 1 : list?.length + 1;
        return result;
    }
}
