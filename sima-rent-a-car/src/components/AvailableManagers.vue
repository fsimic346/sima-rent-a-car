<template lang="">
    <div class="container">
        <h1>Available Managers:</h1>
        <div class="available-managers" v-for="manager in managers">
            <div
                class="manager-logo"
                :style="{
                    backgroundImage: `url('${manager.imageUrl}') `,
                }"
            ></div>
            <div class="name">
                {{ manager.username }}
            </div>
        </div>
        <div class="create-manager" @click="createManager">
            <i class="fa-solid fa-circle-plus"></i>
            <div>Create Manager</div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            managers: {},
        };
    },
    async mounted() {
        try {
            const res = await this.axios.get(
                "http://localhost:8080/api/user/manager",
            );
            this.managers = res.data;
            console.log(this.managers);
        } catch (err) {
            console.log(err);
        }
    },
    emits: ["createManager"],
    methods: {
        createManager() {
            this.$emit("createManager", "CreateManager");
        },
    },
};
</script>
<style scoped>
.container {
    display: flex;
    flex-direction: column;
    background-color: rgba(var(--clr-background), 0.4);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    padding-inline: 2rem;
    padding-block: 2rem;
    border: 4px solid rgb(var(--clr-primary-300));
    color: rgb(var(--clr-text));
    max-width: max-content;
    gap: 0.8rem;
    align-items: center;
}

.available-managers {
    display: flex;
    margin-top: 1rem;
    transition: 0.3s;
    width: 10rem;
}

.name {
    margin-left: 0.8rem;
}

.available-managers:hover {
    transform: scale(1.2);
    cursor: pointer;
}

.create-manager {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    transition: 0.3s;
    width: 10rem;
}

.create-manager i {
    font-size: 2rem;
}

.create-manager:hover {
    transform: scale(1.2);
    cursor: pointer;
}

.manager-logo {
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}
</style>
