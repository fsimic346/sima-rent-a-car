<template>
    <div
        class="btn"
        :style="{
            backgroundColor: [color === undefined ? 'var(--clr-secondary)' : color],
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
    min-width: 8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    transition: border-color 0.35s;
    border: 2px solid transparent;
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
}

.btn:hover {
    cursor: pointer;
    border-color: var(--clr-accent);
}
</style>
