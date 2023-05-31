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
            <Button text="Login" @click="login" />
            <Button text="poz" @click="poz" />
            <span><RouterLink to="/register">register</RouterLink></span>
        </form>
    </div>
</template>

<script>
import Button from "@/components/Button.vue";
import axios from "axios";

export default {
    name: "Login",
    data() {
        return {
            usernameOrEmail: "",
            password: "",
        };
    },
    components: {
        Button,
    },
    methods: {
        async login() {
            const res = await axios.post("http://localhost:8080/api/login", {
                usernameOrEmail: this.usernameOrEmail,
                password: this.password,
            });
            this.$cookie.setCookie("token", res.data.token);
        },
        async poz() {
            const res = await axios.get("http://localhost:8080/api/poz", {
                headers: { Authorization: this.$cookie.getCookie("token") },
            });
            console.log(res);
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
