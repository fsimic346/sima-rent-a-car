<template>
    <div class="container">
        <form @submit="onSubmit" class="user-form">
            <h1>Login</h1>
            <div class="form-element login-form-element">
                <label>Username or email:</label>
                <input type="text" v-model="usernameOrEmail" />
            </div>
            <div class="form-element login-form-element">
                <label>Password:</label>
                <input type="password" v-model="password" />
            </div>
            <Button
                class="login-btn"
                :text="loginText"
                @click="login"
                ref="loginBtn"
            />
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
            loginText: "Login",
        };
    },
    components: {
        Button,
    },
    methods: {
        async login() {
            try {
                this.loginText = "";
                this.$refs.loginBtn.enabled = false;
                const res = await this.axios.post(
                    "http://localhost:8080/api/login",
                    {
                        usernameOrEmail: this.usernameOrEmail,
                        password: this.password,
                    }
                );
                this.$cookie.setCookie("token", res.data.token);
                this.$cookie.setCookie("user", res.data.user);
                console.log(res.data.user);
                this.$router.push("/");
            } catch (err) {
                this.loginText = "Login";
                this.$refs.loginBtn.enabled = true;
                console.log(err.response.data);
            }
        },
    },
};
</script>

<style scoped>
@import "../static/css/forms.css";

.login-form-element {
    width: 28ch;
}

.login-btn {
    margin-top: 2rem;
}

h1 {
    margin-bottom: 2rem;
    font-weight: 700;
}
</style>
