<template>
    <div class="container">
        <div class="headher">
            <div>Ban</div>
            <div class="username">@{{ user.username }}</div>
            <div>?</div>
        </div>
        <div class="buttons">
            <Button
                text="Yes"
                class="btn"
                color="transparent"
                @click="banUser"
            ></Button>
            <Button
                text="No"
                class="btn"
                color="transparent"
                @click="closeModal"
            ></Button>
        </div>
    </div>
</template>
<script>
import Button from "@/components/Button.vue";

export default {
    data() {
        return {
            yesBtn: "",
        };
    },
    emits: ["closeModal"],
    props: ["user"],
    components: {
        Button,
    },
    methods: {
        closeModal() {
            this.$emit("closeModal");
        },
        banUser() {
            try {
                const res = this.axios.get(
                    "http://localhost:8080/api/user/ban/" + this.user.username,
                );
            } catch (error) {
                console.log(error);
            }
            //toDo: oznaciti banovane korisnike
            //toDo: banovanima omoguciti unban
            alert(`${this.user.username} banned.`);
        },
    },
};
</script>
<style scoped src="../static/css/banConformation.css">
::v-deep .modal-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
::v-deep .modal-content {
    display: flex;
    flex-direction: column;
    margin: 0;
    border: none;
    border-radius: 0.25rem;
    max-width: max-content;
}
</style>
