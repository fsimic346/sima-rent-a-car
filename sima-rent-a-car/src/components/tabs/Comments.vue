<template>
    <div class="comments-overflow">
        <div class="comments-container">
            <div class="comment" v-for="comment in comments">
                <div class="comment-content">
                    <div
                        class="user-image"
                        :style="{
                            backgroundImage: `url(${comment.user.imageUrl})`,
                        }"
                    ></div>
                    <div class="comment-text">
                        <div class="user-info">
                            <div class="user-header">
                                <span>{{
                                    comment.user.firstName +
                                    " " +
                                    comment.user.lastName
                                }}</span>
                                <span class="rating">
                                    <span class="icons">
                                        <i
                                            class="fa-sharp fa-solid fa-star"
                                            v-for="n in Math.floor(
                                                comment.rating,
                                            )"
                                        ></i>
                                        <i
                                            class="fa-sharp fa-regular fa-star"
                                            v-for="n in 5 -
                                            Math.floor(comment.rating)"
                                        ></i>
                                    </span>
                                </span>
                            </div>
                            <div class="user-username">
                                @{{ comment.user.username }}
                            </div>
                        </div>

                        {{ comment.text }}
                    </div>
                </div>
                <div class="comment-controls" v-if="!isAgencyView">
                    <div
                        class="comment-status"
                        :class="{
                            approved: comment.approved === 'Approved',
                            rejected: comment.approved === 'Rejected',
                            pending: comment.approved === 'Pending',
                        }"
                    >
                        {{ comment.approved }}
                    </div>
                    <div
                        class="comment-buttons"
                        v-if="
                            user &&
                            user.role === 'Manager' &&
                            comment.approved === 'Pending'
                        "
                    >
                        <Button
                            text="Approve"
                            color="rgb(var(--clr-success-500))"
                            @click="approveComment(comment)"
                        />
                        <Button
                            text="Deny"
                            color="rgb(var(--clr-error-500))"
                            @click="denyComment(comment)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Button from "../Button.vue";
export default {
    components: {
        Button,
    },
    props: {
        user: Object,
        isAgencyView: Boolean,
        agency: Object,
    },
    data() {
        return {
            comments: [],
        };
    },
    methods: {
        approveComment(comment) {
            try {
                const res = this.axios.post(
                    "http://localhost:8080/api/comment/approve",
                    { comment: comment, user: this.user },
                );
                comment.approved = "Approved";
            } catch (error) {
                console.log(error);
            }
        },
        denyComment(comment) {
            try {
                const res = this.axios.post(
                    "http://localhost:8080/api/comment/reject",
                    { comment: comment, user: this.user },
                );
                comment.approved = "Rejected";
            } catch (error) {
                console.log(error);
            }
        },
    },
    async beforeMount() {
        try {
            let requestParams = "";
            if (this.user && this.user.role === "Manager") {
                requestParams = this.user.agencyId;
            }

            if (this.isAgencyView) {
                requestParams = "approved/" + this.agency.id;
            }

            this.comments = (
                await this.axios.get(
                    `http://localhost:8080/api/comment/${requestParams}`,
                )
            ).data;
            this.comments.sort((a, b) => {
                if (a.approved === "Pending") {
                    return -1;
                }
                if (b.approved === "Pending") {
                    return 1;
                }
                return 0;
            });
        } catch (err) {
            console.log(err);
        }
    },
    watch: {
        async agency(val) {
            try {
                let requestParams = "";
                if (this.user && this.user.role === "Manager") {
                    requestParams = this.user.agencyId;
                }

                if (this.isAgencyView) {
                    requestParams = "approved/" + val.id;
                }

                this.comments = (
                    await this.axios.get(
                        `http://localhost:8080/api/comment/${requestParams}`,
                    )
                ).data;
                this.comments.sort((a, b) => {
                    if (a.approved === "Pending") {
                        return -1;
                    }
                    if (b.approved === "Pending") {
                        return 1;
                    }
                    return 0;
                });
            } catch (err) {
                console.log(err);
            }
        },
    },
};
</script>
<style scoped src="../../static/css/tabContent.css"></style>

<style scoped>
.comments-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
    height: 100%;
    overflow: auto;
    padding: 2rem;
}

.comments-overflow {
    overflow-y: auto;
    width: 100%;
    height: 100%;
}

.comment {
    display: flex;
    align-items: center;
    color: rgb(var(--clr-text));
    margin-inline: auto;
    font-size: 1.2rem;
    border: 1px solid rgb(var(--clr-neutral-500));
    border-radius: 10px;
    padding: 1rem;
    transition: 0.3s ease-in-out;
    width: 100%;
    gap: 1rem;
}

.user-image {
    width: 8rem;
    height: 8rem;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 50%;
}

.user-info {
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    line-height: 1.2rem;
    width: 100%;
}

.user-username {
    color: rgb(var(--clr-primary-300));
    font-weight: bold;
}

.comment-content {
    background-color: rgb(var(--clr-background));
    height: 100%;
    border-radius: 10px;
    padding: 0.3rem;
    display: flex;
    gap: 1rem;
}

.comment-text {
    display: flex;
    flex-direction: column;
    width: 40ch;
    justify-content: space-around;
}

.comment-controls {
    display: flex;
    flex-direction: column;
    margin-left: auto;
    height: 100%;
    justify-content: space-between;
}

.comment-status {
    margin-left: auto;
}

.approved {
    color: rgb(var(--clr-success));
}
.pending {
    color: rgb(var(--clr-warning));
}
.rejected {
    color: rgb(var(--clr-error));
}

.comment-buttons {
    display: flex;
    gap: 1rem;
}

.comment-buttons Button {
    flex-basis: 0;
    flex-grow: 1;
}

.icons {
    color: rgb(var(--clr-warning-500));
}
.user-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
}
</style>
