<template>
    <NavBar />
    <router-view />
    <input
        type="radio"
        id="enableDarkTheme"
        :checked="darkTheme"
        style="display: none"
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
};
</script>

<style>
@import "@/static/css/main.css";
</style>
