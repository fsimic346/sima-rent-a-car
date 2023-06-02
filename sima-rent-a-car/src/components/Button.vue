<template>
    <div
        class="btn"
        :style="{
            backgroundColor: [
                color === undefined ? 'var(--clr-primary-500)' : color,
            ],
        }"
        @click="onClick"
    >
        {{ text }}
    </div>
</template>

<script>
export default {
    name: "Button",
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
    padding: 0.5rem 2rem;
    min-width: 7.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    transition: filter 0.35s;
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
    color: var(--clr-neutral-100);
}

.btn:hover {
    cursor: pointer;
    filter: brightness(1.2);
}
</style>
