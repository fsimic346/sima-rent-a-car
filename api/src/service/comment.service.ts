import { autoInjectable } from "tsyringe";
import UserRepository from "../repository/user.repository";
import AgencyRepository from "../repository/agency.repository";
import { Comment, CommentStatus } from "../model/comment.model";
import Result from "../utils/Result";
import CommentRepository from "../repository/comment.repository";
import { Agency } from "../model/agency.model";
import { omit } from "lodash";
import OrderRepository from "../repository/order.repository";

@autoInjectable()
export default class CommentService {
    constructor(
        private repository: CommentRepository,
        private userRepository: UserRepository,
        private agencyRepository: AgencyRepository,
        private orderRepository: OrderRepository,
    ) {}

    getById(id: number): Comment {
        return this.repository.getById(id);
    }

    getAll(): Comment[] {
        return this.repository.getAll();
    }

    getByAgency(agencyId: number): Comment[] | undefined {
        if (this.agencyRepository.getById(agencyId) === undefined) {
            return undefined;
        }
        return this.repository.getAll().filter(x => x.agencyId == agencyId);
    }

    approveComment(data: any): Result {
        const result = this.validateCommentApproval(data);
        if (!result.success) {
            return result;
        }

        const comment: Comment = this.getById(data.comment.id);
        comment.approved = CommentStatus.Approved;
        this.repository.update(comment);
        const agency: Agency = this.agencyRepository.getById(comment.agencyId);
        const agencyComments = this.getByAgency(agency.id)?.filter(
            x => x.approved === CommentStatus.Approved,
        ) as Comment[];
        agency.rating =
            agencyComments.map(x => x.rating).reduce((a, b) => a + b) /
            agencyComments.length;
        agency.ratingCount = agencyComments.length;
        this.agencyRepository.update(agency);
        return result;
    }

    rejectComment(data: any): Result {
        const result = this.validateCommentApproval(data);
        if (!result.success) {
            return result;
        }

        const comment: Comment = this.getById(data.comment.id);
        comment.approved = CommentStatus.Rejected;
        this.repository.update(comment);
        return result;
    }

    add(data: any): Result {
        const result = this.validateCommentData(data);

        if (!result.success) {
            return result;
        }

        const comment: Comment = {
            id: result.value,
            userId: data.userId,
            agencyId: data.agencyId,
            text: data.text,
            rating: data.rating,
            deleted: false,
            approved: CommentStatus.Pending,
            orderId: data.orderId,
        };

        this.repository.save(comment);
        result.success = true;
        result.value = comment;

        return result;
    }

    validateCommentApproval(data: any): Result {
        const result = new Result();

        if (!this.repository.getById(data.comment.id)) {
            result.message = "Invalid comment.";
            return result;
        }
        if (
            this.repository.getById(data.comment.id).approved in
            [CommentStatus.Approved, CommentStatus.Rejected]
        ) {
            result.message = "Comment already approved.";
            return result;
        }
        if (
            this.userRepository.getById(data.user.id).agencyId !=
            this.repository.getById(data.comment.id).agencyId
        ) {
            result.message = "Invalid manager.";
            return result;
        }
        result.success = true;
        result.message = "Successfully approved comment.";
        return result;
    }

    validateCommentData(data: any): Result {
        const result = new Result();
        const list: Comment[] = this.repository.getAll() as Comment[];
        if (!data.userId || !this.userRepository.getById(data.userId)) {
            result.message = "Invalid user.";
            return result;
        }
        if (!data.agencyId || !this.agencyRepository.getById(data.agencyId)) {
            result.message = "Invalid agency.";
            return result;
        }
        if (!data.rating || data.rating > 5 || data.rating < 1) {
            result.message = "Invalid rating.";
            return result;
        }
        if (
            !this.orderRepository
                .getAll()
                .some(
                    x =>
                        x.userId === data.userId &&
                        x.agencyId === data.agencyId,
                )
        ) {
            result.message =
                "User must order from agency before leaving comment.";
            return result;
        }
        result.success = true;
        result.message = "Successfully created comment.";
        result.value = list === undefined ? 1 : list?.length + 1;
        return result;
    }
}
