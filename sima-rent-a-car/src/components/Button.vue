<template>
    <button
        type="button"
        class="btn"
        :disabled="!enabled"
        :style="{
            backgroundColor: [
                color === undefined ? 'rgb(var(--clr-primary-500))' : color,
            ],
        }"
        @click="onClick"
    >
        <i v-if="text === ''" class="fa-solid fa-spinner fa-spin"></i>
        {{ text }}
    </button>
</template>

<script>
export default {
    name: "Button",
    expose: ["enabled"],
    data() {
        return { enabled: true };
    },
    props: {
        text: String,
        color: String,
    },
    methods: {
        onClick(e) {
            this.$emit("click");
        },
    },
    emits: ["click"],
};
</script>

<style scoped>
@import "@/static/css/button.css";
</style>
