<template>
    <div
        class="btn"
        :style="{
            backgroundColor: [color === undefined ? 'dodgerblue' : color],
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
    transition: filter ease-in-out 0.2s;
}

.btn:hover {
    cursor: pointer;
    filter: brightness(0.8);
}
</style>
