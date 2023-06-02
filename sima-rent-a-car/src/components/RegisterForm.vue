<template>
    <div class="container">
        <form @submit="onSubmit" class="user-form">
            <h1>Register</h1>
            <div class="row">
                <div class="form-element">
                    <label>First Name:</label>
                    <input type="text" v-model="user.firstName" />
                </div>
                <div class="form-element">
                    <label>Last Name:</label>
                    <input type="text" v-model="user.lastName" />
                </div>
            </div>
            <div class="form-element">
                <label>Username:</label>
                <input type="text" v-model="user.username" />
            </div>
            <div class="form-element">
                <label>Email:</label>
                <input type="email" v-model="user.email" />
            </div>
            <div class="form-element">
                <label>Date of Birth:</label>
                <input type="date" v-model="user.dateOfBirth" />
            </div>
            <div class="form-element">
                <label>Gender:</label>
                <select v-model="user.gender">
                    <option>Male</option>
                    <option>Female</option>
                </select>
            </div>
            <div class="row">
                <div class="form-element">
                    <label>Password:</label>
                    <input type="password" v-model="user.password" />
                </div>
                <div class="form-element">
                    <label>Confirm Password:</label>
                    <input type="password" v-model="user.confirmPassword" />
                </div>
            </div>
            <Button class="register-btn" text="Register" @click="register" />
        </form>
    </div>
</template>

<script>
import Button from "../components/Button.vue";

export default {
    data() {
        return {
            user: {
                firstName: "",
                lastName: "",
                username: "",
                email: "",
                dateOfBirth: "",
                gender: "",
                password: "",
                confirmPassword: "",
            },
        };
    },
    components: {
        Button,
    },
    methods: {
        async register() {
            const res = await this.axios.post(
                "http://localhost:8080/api/user",
                this.user
            );
            console.log(res);
        },
    },
};
</script>

<style scoped>
@import "../static/css/forms.css";

.register-btn {
    margin-top: 2rem;
}

h1 {
    margin-bottom: 2rem;
}
</style>
