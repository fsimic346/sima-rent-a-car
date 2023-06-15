<template lang="">
    <div class="tab">
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
    flex: 0 0 20%;
    white-space: nowrap;
    transition: 0.4s;
}

.tab:hover {
    background-color: rgba(var(--clr-background), 0.8);
    border-color: rgb(var(--clr-primary-300));
    color: rgb(var(--clr-primary-300));
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
</style>
