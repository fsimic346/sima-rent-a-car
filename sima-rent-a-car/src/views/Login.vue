<template>
    <div class="container">
        <form @submit="onSubmit" class="user-form">
            <div class="form-element">
                <label>Username or email:</label>
                <input type="text" v-model="usernameOrEmail" />
            </div>
            <div class="form-element">
                <label>Password:</label>
                <input type="password" v-model="password" />
            </div>
            <input type="submit" value="Login" />
            <span><RouterLink to="/register">register</RouterLink></span>
        </form>
    </div>
</template>

<script>
export default {
    name: "Login",
    data() {
        return {
            usernameOrEmail: "",
            password: "",
        };
    },
    methods: {
        onSubmit(e) {
            e.preventDefault();
            alert(`${this.usernameOrEmail}\n${this.password}`);
        },
    },
};
</script>

<style scoped>
.container {
    height: 100%;
    display: flex;
}

.user-form {
    display: flex;
    flex-direction: column;
    width: max-content;
    padding: 1rem;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin: auto;
}
.form-element {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>
