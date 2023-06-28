import { Comment } from "../model/comment.model";
import AgencyRepository from "./agency.repository";
import Repository from "./repository";
import { autoInjectable, singleton } from "tsyringe";
import UserRepository from "./user.repository";

@autoInjectable()
@singleton()
export default class CommentRepository extends Repository {
    path = "./data/comment.json";

    constructor(
        private agencyRepository: AgencyRepository,
        private userRepository: UserRepository,
    ) {
        super();
        this.createStorage();
    }

    getAll(): Comment[] {
        const comments: Comment[] = super.getAll() as Comment[];
        for (const comment of comments) {
            this.loadCommentData(comment);
        }
        return comments;
    }

    getById(id: Number): Comment {
        const comment: Comment = super.getById(id) as Comment;
        if (comment) {
            this.loadCommentData(comment);
        }
        return comment;
    }

    private loadCommentData(comment: Comment) {
        comment.agency = this.agencyRepository.getById(comment.agency.id);
        comment.user = this.userRepository.getById(comment.user.id);
    }
}
