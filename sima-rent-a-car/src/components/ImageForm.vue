<template>
    <div class="container">
        <form @submit="onSubmit" class="user-form">
            <h1>{{ header }}</h1>
            <div class="form-element">
                <input type="text" v-model="imageUrl" />
            </div>
            <div
                class="error-msg"
                :style="{
                    color:
                        error === ''
                            ? 'rgb(var(--clr-success))'
                            : 'rgb(var(--clr-error))',
                }"
            >
                {{ error === "" ? success : error }}
            </div>
            <Button
                class="register-btn"
                :text="editText"
                @click="edit"
                ref="registerBtn"
            />
        </form>
    </div>
</template>

<script>
import Button from "./Button.vue";

export default {
    data() {
        return {
            imageUrl: "",
            error: "",
            success: "",
            editText: "Save",
        };
    },
    props: {
        header: String,
        image: String,
    },
    components: {
        Button,
    },
    mounted() {
        this.imageUrl = this.image;
    },
    methods: {
        async edit() {
            if (!this.imageUrl.match(/\.(jpeg|jpg|gif|png)$/)) {
                this.error = "Invalid image url.";
                this.success = "";
                return;
            }
            this.error = "";
            this.success = "Successfully changed image.";
            this.$emit("imageChanged", this.imageUrl);
        },
    },
};
</script>

<style scoped src="../static/css/forms.css"></style>

<style scoped>
.register-btn {
    margin-top: 2rem;
}

h1 {
    margin-bottom: 2rem;
}

.container {
    padding-inline: 3rem;
}

input {
    font-size: 1.2rem;
    background-color: transparent;
    border-bottom: 3px solid rgb(var(--clr-neutral-100));
    color: rgb(var(--clr-text));
    border-radius: 0.2rem;
    transition: 0.2s ease-in-out;
}
input:focus {
    outline: none;
    border-bottom: 3px solid rgb(var(--clr-primary-300));
}
</style>
