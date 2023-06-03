<template>
    <div></div>
</template>
<script>
export default {
    data() {
        return {
            user: "",
        };
    },
    async mounted() {
        try {
            const res = await this.axios.get(
                `http://localhost:8080/api/user/${this.$route.params.username}`
            );
            this.user = res.data;
        } catch (err) {
            console.log(err);
            this.$router.push("/");
        }
    },
};
</script>
<style></style>
