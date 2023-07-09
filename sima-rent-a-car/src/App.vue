<template>
    <NavBar @showCart="showSideBar" @signout="signout" />
    <Sidebar v-if="user.role === 'Customer'" :cartItem="cartItem"></Sidebar>
    <router-view @addToCart="addToCart" />
    <input
        type="checkbox"
        id="enableDarkTheme"
        :checked="darkTheme"
        @change="darkThemeChanged"
        hidden
    />
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import Sidebar from "@/components/Sidebar.vue";

export default {
    data() {
        return {
            darkTheme: "",
            cartItem: {},
            sideBar: false,
            user: {},
        };
    },
    components: {
        NavBar,
        Sidebar,
    },
    methods: {
        darkThemeChanged(e) {
            this.darkTheme = e.target.checked;
        },
        addToCart(val) {
            this.cartItem = val;
            this.showSideBar();
        },
        showSideBar() {
            if (!document.querySelector("nav").classList.contains("not-home")) {
                const navHeight =
                    document.querySelector("nav").clientHeight + 1;
                document.getElementById(
                    "sidebar",
                ).style.marginTop = `${navHeight}px`;
            } else {
                document.getElementById("sidebar").style.marginTop = `0`;
            }
            setTimeout(() => {
                document.getElementById("sidebar").classList.add("active");
                this.sideBar = true;
            }, 1);
        },
        signout() {
            if (this.sideBar)
                setTimeout(() => {
                    document
                        .getElementById("sidebar")
                        .classList.remove("active");
                    this.sideBar = false;
                }, 1);
        },
    },
    beforeMount() {
        this.axios.interceptors.request.use(config => {
            config.headers.Authorization = this.$cookie.getCookie("token");
            return config;
        });
    },
    async mounted() {
        if (this.$cookie.getCookie("token")) {
            const res = await this.axios.get("http://localhost:8080/api/user");
            localStorage.setItem("user", JSON.stringify(res.data));
            this.user = res.data;
        }
        if (localStorage.getItem("darkTheme") === null) {
            localStorage.setItem("darkTheme", true);
        }
        this.darkTheme = localStorage.getItem("darkTheme") === "true";

        document.addEventListener("click", e => {
            let sidebar = document.getElementById("sidebar");
            let cart = document.getElementById("cart");
            let button = document.getElementById("btn");
            if (sidebar === null || cart === null || button === null) {
                return;
            }

            if (
                sidebar !== e.target &&
                cart !== e.target &&
                button !== e.target &&
                this.sideBar &&
                !sidebar.contains(e.target)
            ) {
                this.sideBar = false;
                document.getElementById("sidebar").classList.remove("active");
            }
        });
    },
    watch: {
        darkTheme(val) {
            localStorage.setItem("darkTheme", val);
            const root = document.querySelector(":root");
            if (val) {
                root.classList.add("dark-theme");
            } else {
                root.classList.remove("dark-theme");
            }
        },
    },
};
</script>

<style>
@import "@/static/css/main.css";
</style>
