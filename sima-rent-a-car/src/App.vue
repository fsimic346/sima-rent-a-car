<template>
    <NavBar />
    <router-view />
</template>

<script>
import NavBar from "@/components/NavBar.vue";
export default {
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
    },
};
</script>

<style>
@import "@/static/css/main.css";
</style>
