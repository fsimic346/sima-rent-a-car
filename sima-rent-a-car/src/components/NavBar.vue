<template>
    <nav :class="[isHomePage ? '' : 'not-home']">
        <div class="logo" @click="home">SI-MA</div>
        <div class="button-container">
            <Button text="Login" v-if="!authorized" @click="login" />
            <Button text="Register" v-if="!authorized" @click="register" />
            <div class="profile" v-if="authorized">
                <span class="username">{{ username }}</span>
                <div
                    class="profile-image"
                    :style="{ backgroundImage: `url('${profileImage}')` }"
                ></div>
                <div class="dropdown-menu">
                    <div class="dropdown-item">
                        <i class="fa-solid fa-user"></i>
                        <router-link to="profile"> Profile</router-link>
                    </div>
                    <div class="dropdown-item">
                        <i class="fa-solid fa-cart-shopping"></i>
                        <router-link to="cart">Cart</router-link>
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
            this.$cookie.setCookie("user", "");
            this.authorized = false;
            this.$router.push("/");
        },
        darkThemeUpdate() {
            this.$cookie.setCookie("darkTheme", !this.darkTheme);
        },
    },
    watch: {
        "$route.params": {
            async handler(val) {
                this.darkTheme = this.$cookie.getCookie("darkTheme") === "true";
                this.authorized = this.$cookie.getCookie("token") != null;
                if (this.authorized) {
                    this.username = this.$cookie.getCookie("user").username;
                    this.profileImage = this.$cookie.getCookie("user").imageUrl;
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
