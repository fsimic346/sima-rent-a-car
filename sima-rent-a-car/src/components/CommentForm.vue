<template>
    <div class="container">
        <textarea v-model="text"></textarea>
        <div
            class="stars-container"
            @mouseleave="clearRating()"
            @mouseenter="setEnter()"
        >
            <div class="stars" v-for="x in rated">
                <i
                    class="fa-solid fa-star"
                    @mouseleave="hoverRated(x, $event)"
                    @click="setRating(x)"
                ></i>
            </div>
            <div class="stars" v-for="x in unrated">
                <i class="fa-regular fa-star" @mouseover="hoverUnrated(x)"></i>
            </div>
        </div>
        <Button ref="btn" :text="btnText" @click="leaveComment"></Button>
    </div>
</template>
<script>
import Button from "@/components/Button.vue";

export default {
    props: { order: Object },
    components: {
        Button,
    },
    data() {
        return {
            btnText: "Submit",
            text: "",
            rating: 1,
            unrated: 4,
            rated: 1,
            ratingSelected: false,
        };
    },
    emits: ["setCommented"],
    methods: {
        setEnter() {
            this.ratingSelected = false;
        },
        setRating(rating) {
            this.rating = rating;
            this.rated = rating;
            this.unrated = 5 - rating;
            this.ratingSelected = true;
        },
        clearRating() {
            if (!this.ratingSelected) {
                this.unrated = 4;
                this.rated = 1;
            }
        },
        hoverRated(x, e) {
            if (e.relatedTarget.classList.contains("fa-solid")) {
                this.unrated += x;
                this.rated -= x;
            }
        },
        hoverUnrated(x) {
            this.unrated -= x;
            this.rated += x;
        },
        async leaveComment() {
            try {
                this.btnText = "";
                this.$refs.btn.enabled = false;

                const comment = {
                    userId: this.order.userId,
                    agencyId: this.order.agencyId,
                    text: this.text,
                    rating: this.rating,
                    orderId: this.order.id,
                };

                const res = this.axios.post(
                    "http://localhost:8080/api/comment/",
                    {
                        comment: comment,
                    },
                );
                this.btnText = "Submit";
                this.$refs.btn.enabled = true;
                this.$emit("setCommented", this.order);
            } catch (err) {
                console.log(err);
                this.btnText = "Submit";
                this.$refs.btn.enabled = true;
            }
        },
    },
};
</script>
<style scoped src="../static/css/forms.css"></style>
<style scoped src="../static/css/reasoning.css"></style>
<style>
.stars-container {
    display: flex;
    font-size: 2rem;
    margin-bottom: 2rem;
}

.stars {
    color: gold;
}

textarea {
    margin-bottom: 0rem !important;
}
</style>
