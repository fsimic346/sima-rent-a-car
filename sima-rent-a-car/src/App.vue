<template>
    <NavBar />
    <router-view />
    <input type="radio" id="enableDarkTheme" :checked="darkTheme" hidden />
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
            this.$cookie.setCookie("user", res.data);
        }
        if (this.$cookie.getCookie("darkTheme") === undefined) {
            this.$cookie.setCookie("darkTheme", true);
        }
        this.darkTheme = this.$cookie.getCookie("darkTheme") === "true";
    },
};
</script>

<style>
@import "@/static/css/main.css";
</style>
