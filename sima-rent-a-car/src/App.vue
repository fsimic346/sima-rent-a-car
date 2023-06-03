<template>
    <NavBar />
    <router-view />
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
export default {
    data() {
        return {
            darkTheme: "",
        };
    },
    components: {
        NavBar,
    },
    methods: {
        darkThemeChanged(e) {
            this.darkTheme = e.target.checked;
        },
    },
    async mounted() {
        this.axios.interceptors.request.use((config) => {
            config.headers.Authorization = this.$cookie.getCookie("token");
            return config;
        });
        if (this.$cookie.getCookie("token")) {
            const res = await this.axios.get("http://localhost:8080/api/user");
            localStorage.setItem("user", JSON.stringify(res.data));
        }
        if (localStorage.getItem("darkTheme") === null) {
            localStorage.setItem("darkTheme", true);
        }
        this.darkTheme = localStorage.getItem("darkTheme") === "true";
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
