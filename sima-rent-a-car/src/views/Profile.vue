<template>
    <div class="container">
        <div class="avatar">
            <img :src="profileImg" alt="" />
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            profileImg: "",
        };
    },
    mounted() {
        this.profileImg = this.$cookie.getCookie("user").imageUrl;
    },
};
</script>
<style scoped>
.container {
    position: relative;
    border-top: 2px solid white;
    min-height: 40rem;
    width: 100%;
    margin-inline: auto;
    margin-top: 20rem;
}

.avatar {
    position: absolute;
    top: -8rem;
    left: 8rem;
    width: 20rem;
    height: 20rem;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid rgb(var(--clr-neutral-100));
}

img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
}
</style>
