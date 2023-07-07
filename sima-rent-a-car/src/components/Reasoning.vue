<template>
    <div class="container">
        <textarea v-model="reasoning"></textarea>
        <Button ref="btn" :text="btnText" @click="declineOrder"></Button>
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
            reasoning: "",
        };
    },
    emits: ["updateStatus"],
    methods: {
        declineOrder() {
            try {
                const status = "Denied";
                this.btnText = "";
                this.$refs.btn.enabled = false;
                const res = this.axios.patch(
                    "http://localhost:8080/api/order/deny",
                    {
                        order: this.order,
                        reasoning: this.reasoning,
                    },
                );
                this.$emit("updateStatus", this.order);
                this.btnText = "Submit";
                this.$refs.btn.enabled = true;
            } catch (err) {
                this.btnText = "Submit";
                this.$refs.btn.enabled = true;
            }

            this.btnText = "Submit";
            this.$refs.btn.enabled = true;
        },
    },
};
</script>
<style scoped src="../static/css/forms.css"></style>
<style scoped>
textarea {
    width: 30rem;
    height: 15rem;
    background-color: rgb(var(--clr-background));
    border-radius: 0.4rem;
    color: rgb(var(--clr-text));
    font-size: 1.2rem;
    border: 2px solid rgb(var(--clr-text));
    padding-inline: 1ch;
    padding-block: 0.2rem;
    outline: none;
    margin-bottom: 2rem;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
