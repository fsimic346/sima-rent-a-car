<template lang="">
    <div
        class="tab"
        :class="{ 'selected-tab': selected, disabled: disabled }"
        @click="setSelected"
    >
        <div class="icon">
            <i :class="icon"></i>
        </div>
        <div class="tab-name">
            {{ text }}
        </div>
    </div>
</template>
<script>
export default {
    props: {
        text: String,
        icon: String,
        disabled: Boolean,
    },
    expose: ["selected", "setSelected"],
    data() {
        return {
            selected: false,
        };
    },
    methods: {
        setSelected() {
            if (this.disabled) return;
            this.selected = true;
            this.$emit("selectedTabChanged", this.text.replace(/ /g, ""));
        },
    },
};
</script>
<style scoped>
.tab {
    display: flex;
    align-items: center;
    padding: 0.7rem 1rem 0.7rem 1rem;
    gap: 1rem;
    border: 2px solid rgb(var(--clr-neutral-500));
    background-color: rgb(var(--clr-background-secondary));
    color: rgb(var(--clr-text));
    border-radius: 0.6rem;
    font-size: 20px;
    flex: 1 0 0;
    white-space: nowrap;
    transition: 0.3s ease-in-out;
    min-width: 17.5rem;
    max-width: max-content;
}

.tab:hover {
    /* background-color: rgba(var(--clr-text-contrast), 0.8); */
    border-color: rgb(var(--clr-text));
    filter: brightness(1.1);
    /* color: rgb(var(--clr-primary-300)); */
    cursor: pointer;
}

.tab-name {
    width: 100%;
    text-align: center;
    margin-right: calc(1rem + 20px);
}

.icon {
    display: flex;
    width: 20px;
    height: 20px;
}
.selected-tab {
    border-color: rgb(var(--clr-primary-300)) !important;
    color: rgb(var(--clr-primary-300));
}

.disabled {
    /* color: rgb(var(--clr-neutral-300)); */
    filter: grayscale(1);
    pointer-events: none;
}
</style>
