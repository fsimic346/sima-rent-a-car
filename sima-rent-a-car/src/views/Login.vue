<template>
    <div class="container">
        <form class="user-form">
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
            <Button text="logout" @click="logout" />
            <span><RouterLink to="/register">register</RouterLink></span>
        </form>
    </div>
</template>

<script>
import Button from "@/components/Button.vue";

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
            try {
                const res = await this.axios.post(
                    "http://localhost:8080/api/login",
                    {
                        usernameOrEmail: this.usernameOrEmail,
                        password: this.password,
                    }
                );
                this.$cookie.setCookie("token", res.data.token);
            } catch (err) {
                console.log(err.response.data);
            }
        },
        async poz() {
            try {
                const res = await this.axios.get(
                    "http://localhost:8080/api/poz"
                );
                alert("poz");
            } catch (err) {
                console.log(err.response.data);
            }
        },
        logout() {
            this.$cookie.setCookie("token", "");
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
