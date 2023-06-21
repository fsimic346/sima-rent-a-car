<template>
    <form @submit="onSubmit" class="manager-form">
        <h1>Create Manager</h1>
        <div class="wrapper">
            <label>Username</label>
            <input type="text" v-model="user.username" />
        </div>
        <div class="wrapper">
            <label>First Name</label>
            <input type="text" v-model="user.firstName" />
        </div>
        <div class="wrapper">
            <label>Last Name</label>
            <input type="text" v-model="user.lastName" />
        </div>
        <div class="wrapper">
            <label>Password</label>
            <input type="password" v-model="user.password" />
        </div>
        <div class="wrapper">
            <label>Email</label>
            <input type="email" v-model="user.email" />
        </div>
        <div
            class="error-msg"
            :style="{
                color: error === '' ? 'rgb(var(--clr-success))' : 'rgb(var(--clr-error))',
            }"
        >
            {{ error === "" ? success : error }}
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
            success: "",
            error: "",
            user: {},
        };
    },
    methods: {
        async edit() {
            try {
                this.saveText = "";
                this.$refs.saveBtn.enabled = false;
                const res = await this.axios.post(
                    "http://localhost:8080/api/user/manager",
                    this.user
                );
                this.success = "Successfully created a new manager.";
                this.saveText = "Create";
                this.error = "";
                this.$refs.saveBtn.enabled = true;
            } catch (err) {
                this.saveText = "Create";
                this.$refs.saveBtn.enabled = true;
                this.error = err.response.data;
                this.success = "";
            }
        },
    },
};
</script>

<style scoped src="../../static/css/tabContent.css"></style>
<style scoped></style>
