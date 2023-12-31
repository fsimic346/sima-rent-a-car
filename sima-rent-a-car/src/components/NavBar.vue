<template>
    <nav :class="[isHomePage ? '' : 'not-home']">
        <div class="logo" @click="home">
            <div class="logo-img"></div>
            SI-MA
        </div>
        <div class="button-container">
            <Button text="Login" v-if="!authorized" @click="login" />
            <Button text="Register" v-if="!authorized" @click="register" />

            <div class="profile" v-if="authorized">
                <span class="points" v-if="user.role === 'Customer'"
                    >{{ user.points ? Math.floor(user.points) : 0 }}
                    <i class="fa-solid fa-coins"></i
                ></span>
                <span class="username" @click="gotoProfile">{{
                    username
                }}</span>
                <div
                    class="profile-image"
                    :style="{ backgroundImage: `url('${profileImage}')` }"
                ></div>
                <div class="dropdown-menu">
                    <router-link to="/profile" class="dropdown-item">
                        <i class="fa-solid fa-user"></i>
                        <span> Profile</span>
                    </router-link>
                    <div
                        id="cart"
                        @click="showCart"
                        v-if="user.role === 'Customer'"
                        class="dropdown-item"
                    >
                        <i class="fa-solid fa-cart-shopping"></i>
                        <span>Cart</span>
                    </div>
                    <div class="dropdown-item">
                        <i class="fa-solid fa-moon"></i>
                        <span>
                            <label class="switch" for="darkTheme">
                                <input
                                    type="checkbox"
                                    @click="darkThemeUpdate"
                                    v-model="darkTheme"
                                    id="darkTheme"
                                />
                                <div class="slider round"></div>
                            </label>
                        </span>
                    </div>
                    <div class="dropdown-item signout" @click="logout">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                        <span>Sign out</span>
                    </div>
                </div>
            </div>
        </div>

        <vue-final-modal
            v-model="showLoginModal"
            classes="modal-container"
            content-class="modal-content"
        >
            <Login />
        </vue-final-modal>

        <vue-final-modal
            v-model="showRegisterModal"
            classes="modal-container"
            content-class="modal-content"
        >
            <Register />
        </vue-final-modal>
    </nav>
</template>
<script>
import Button from "@/components/Button.vue";
import Login from "@/components/LoginForm.vue";
import Register from "@/components/RegisterForm.vue";
import { VueFinalModal, ModalsContainer } from "vue-final-modal";
export default {
    name: "NavBar",
    data() {
        return {
            authorized: "",
            username: "",
            profileImage: "",
            isHomePage: "",
            showLoginModal: false,
            showRegisterModal: false,
            darkTheme: "",
            user: {},
        };
    },
    components: {
        Button,
        VueFinalModal,
        ModalsContainer,
        Login,
        Register,
    },
    methods: {
        login() {
            this.showLoginModal = true;
        },
        register() {
            this.showRegisterModal = true;
        },
        home() {
            this.$router.push("/");
        },
        logout() {
            this.$cookie.setCookie("token", "");
            localStorage.setItem("user", "");
            this.authorized = false;
            this.$router.push("/");
            this.$emit("signout");
        },
        darkThemeUpdate() {
            const darkTheme = document.getElementById("enableDarkTheme");
            darkTheme.click();
        },
        gotoProfile() {
            this.$router.push("/profile");
        },
        showCart() {
            this.$emit("showCart");
        },
    },
    emits: ["showCart", "signout"],
    watch: {
        "$route.params": {
            async handler(val) {
                this.darkTheme = localStorage.getItem("darkTheme") === "true";
                this.authorized = this.$cookie.getCookie("token") != null;
                if (this.authorized) {
                    this.user = JSON.parse(localStorage.getItem("user"));
                    this.username = this.user.username;
                    this.profileImage = this.user.imageUrl;
                }
                this.isHomePage = this.$route.name === "home";
            },
            immediate: true,
        },
    },
};
</script>
<style scoped>
@import "@/static/css/navbar.css";

::v-deep .modal-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
::v-deep .modal-content {
    display: flex;
    flex-direction: column;
    margin: 0;
    border: none;
    border-radius: 0.25rem;
}
</style>
