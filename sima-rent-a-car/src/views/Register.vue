<template>
    <div class="container">
        <form @submit="onSubmit" class="user-form">
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
            <Button text="Register" @click="register" />
            <span><RouterLink to="/login">login</RouterLink></span>
        </form>
    </div>
</template>

<script>
import Button from "../components/Button.vue";
import axios from "axios";

export default {
    data() {
        return {
            user: {
                firstName: "",
                lastName: "",
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
            const res = await axios.post("http://localhost:8080/user", this.user);
            console.log(res);
        },
    },
};
</script>

<style scoped>
.row {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.row .form-element {
    width: 18ch;
}

.container {
    height: 100%;
    display: flex;
    justify-content: space-around;
}

.user-form {
    display: flex;
    flex-direction: column;
    width: max-content;
    max-width: 30rem;
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
    width: 38ch;
}

select {
    height: 30px;
}
</style>
