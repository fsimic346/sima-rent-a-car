<template>
    <div class="container">
        <div
            class="profile-image"
            :style="{ backgroundImage: `url('${user.imageUrl}')` }"
        ></div>
        <div class="basic-information">
            <div class="full-name">
                <div>{{ user.firstName }} {{ user.lastName }}</div>
            </div>
            <div class="username">
                <h2>@{{ user.username }}</h2>
            </div>
            <div class="user-icon">
                <i class="fa-solid fa-circle-info"></i>
                <h3>About</h3>
            </div>
            <div class="about">
                <div class="about-info">Role: {{ user.role }}</div>
                <div class="about-info">Gender: {{ user.gender }}</div>
                <div class="about-info">Email: {{ user.email }}</div>
                <div class="about-info">
                    Date Of Birth: {{ user.dateOfBirth }}
                </div>
            </div>
        </div>
    </div>
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
<style scoped src="../static/css/user.css"></style>
