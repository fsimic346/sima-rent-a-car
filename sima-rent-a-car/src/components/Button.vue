<template>
    <button
        type="button"
        class="btn"
        :disabled="!enabled"
        :style="{
            backgroundColor: [
                color === undefined ? 'var(--clr-primary-500)' : color,
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
.btn {
    width: max-content;
    padding: 0.5rem 1rem;
    min-width: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: filter 0.35s;
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
    color: var(--clr-neutral-100);
    max-height: 40px;
    height: 40px;
    border-radius: 4px;
    border: none;
}

.btn:hover {
    cursor: pointer;
    filter: brightness(1.2);
}
</style>
