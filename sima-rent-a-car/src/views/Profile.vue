<template>
    <div class="container">
        <div class="avatar">
            <img :src="profileImg" alt="" />
        </div>
        <div class="basic-information">
            <div class="full-name">
                <div>{{ firstName }} {{ lastName }}</div>
            </div>
            <div class="username">
                <h2>@{{ username }}</h2>
            </div>
            <div class="user-icon">
                <i class="fa-solid fa-circle-info"></i>
                <h3>About</h3>
            </div>
            <div class="about">
                <div class="about-info">Role: {{ role }}</div>
                <div class="about-info">Gender: {{ gender }}</div>
                <div class="about-info">Email: {{ email }}</div>
                <div class="about-info">Date Of Birth: {{ dateOfBirth }}</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            profileImg: "",
            firstName: "",
            lastName: "",
            username: "",
            gender: "",
            role: "",
            dateOfBirth: "",
            email: "",
        };
    },
    mounted() {
        const user = this.$cookie.getCookie("user");
        this.profileImg = user.imageUrl;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.username = user.username;
        this.email = user.email;
        this.dateOfBirth = user.dateOfBirth;
        this.role = user.role;
        this.gender = user.gender;
        this.role = user.role;
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
.avatar {
    margin-top: 4rem;
    margin-left: 6rem;
    margin-right: 4rem;
    margin-bottom: 4rem;
    width: 21rem;
    height: 21rem;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid rgb(var(--clr-neutral-100));
}

.avatar:hover {
    cursor: pointer;
    border-color: rgb(var(--clr-primary-300));
}

img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
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
    color: rgb(var(--clr-primary-500));
    font-style: italic;
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
