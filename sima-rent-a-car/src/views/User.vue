<template>
    <div class="container">
        <div class="profile-image" :style="{ backgroundImage: `url('${user.imageUrl}')` }"></div>
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
                <div class="about-info">Date Of Birth: {{ user.dateOfBirth }}</div>
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
<style scoped>
.container {
    display: flex;
    align-items: start;
    margin-top: 1rem;
    width: 60%;
    height: 80%;
    border-radius: 1rem;
    margin-inline: auto;
    background-color: rgb(30, 36, 43);
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
}

.profile-image:hover {
    cursor: pointer;
    border-color: rgb(var(--clr-primary-300));
}

.profile-image {
    margin-top: 4rem;
    margin-left: 6rem;
    margin-right: 4rem;
    margin-bottom: 4rem;
    width: 21rem;
    height: 21rem;
    border-radius: 50%;
    border: 2px solid rgb(var(--clr-neutral-100));
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    transition: box-shadow 0.2s ease-in-out, border 0.2s ease-in-out;
}

.basic-information {
    width: 30rem;
    height: 20rem;
    margin-top: 6rem;
    display: flex;
    flex-direction: column;
}

.full-name {
    display: flex;
    gap: 1rem;
    font-size: 45px;
    color: rgb(var(--clr-neutral-100));
}

.username {
    color: rgb(var(--clr-primary-300));
}

.user-icon {
    margin-top: 8rem;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    color: rgba(var(--clr-neutral-100), 50%);
}

.about {
    border-top: 1px solid rgba(var(--clr-neutral-100), 50%);
    color: rgb(var(--clr-neutral-100));
}

.about-info {
    font-size: 20px;
    margin-top: 2rem;
}
</style>
