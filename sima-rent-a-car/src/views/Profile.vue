<template>
    <div class="separator">
        <div class="s-left">
            <div class="line"></div>
        </div>
        <div class="avatar">
            <img :src="profileImg" alt="" />
        </div>
        <div class="s-right">
            <div class="line"></div>
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
.separator {
    display: table;
    width: 100%;
    position: relative;
}

.s-left {
    display: table-cell;
    width: 10%;
}
.s-right {
    display: table-cell;
    width: 90%;
}

.line {
    border-bottom: 2px solid rgb(var(--clr-neutral-300));
    margin-bottom: 21rem;
}

.avatar {
    width: 24rem;
    height: 24rem;
    border-radius: 50%;
    overflow: hidden;
    margin-top: 10rem;
}

img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 4px solid rgb(var(--clr-neutral-100));
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    transition: box-shadow 0.2s ease-in-out, border 0.2s ease-in-out;
}
</style>
