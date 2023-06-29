<template>
    <div class="container">
        <div class="header">
            <div>{{ title }}</div>
        </div>
        <div class="buttons">
            <Button
                text="Yes"
                class="btn"
                color="transparent"
                @click="yes"
            ></Button>
            <Button
                text="No"
                class="btn"
                color="transparent"
                @click="no"
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
    emits: ["yes", "no"],
    props: ["title"],
    components: {
        Button,
    },
    methods: {
        no() {
            this.$emit("no");
        },
        yes() {
            this.$emit("yes");
        },
    },
};
</script>
<style scoped src="../static/css/dialogModal.css">
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
