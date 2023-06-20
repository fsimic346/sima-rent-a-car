<template>
    <form @submit="onSubmit" class="manager-form">
        <h1>Create Manager</h1>
        <div class="wrapper">
            <label>Username</label>
            <input type="text" />
        </div>
        <div class="wrapper">
            <label>First Name</label>
            <input type="text" />
        </div>
        <div class="wrapper">
            <label>Last Name</label>
            <input type="text" />
        </div>
        <div class="wrapper">
            <label>Password</label>
            <input type="password" />
        </div>
        <div class="wrapper">
            <label>Email</label>
            <input type="email" />
        </div>
        <Button :text="saveText" @click="edit" ref="saveBtn" />
    </form>
</template>

<script>
import Button from "@/components/Button.vue";

export default {
    components: {
        Button,
    },
    data() {
        return {
            saveText: "Create",
        };
    },
};
</script>

<style scoped src="../../static/css/tabContent.css"></style>
<style scoped></style>
