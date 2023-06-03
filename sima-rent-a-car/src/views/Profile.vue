<template>
    <div class="container">
        <div class="user-info">
            <div class="row">
                <div
                    class="profile-image"
                    :style="{ backgroundImage: `url('${user.imageUrl}')` }"
                ></div>
                <div class="credentials">
                    <div class="full-name">
                        <div>{{ user.firstName }} {{ user.lastName }}</div>
                    </div>
                    <div class="username">
                        <h2>@{{ user.username }}</h2>
                    </div>
                </div>
            </div>
            <div class="row space-around">
                <div class="info-container">
                    <div class="label">Role</div>
                    <div class="data">{{ user.role }}</div>
                </div>
                <div class="info-container">
                    <div class="label">Gender</div>
                    <div class="data">{{ user.gender }}</div>
                </div>
            </div>
            <div class="row">
                <div class="about-headher">
                    <div class="user-icon">
                        <i class="fa-solid fa-circle-info"></i>
                    </div>
                    <h3>About</h3>
                </div>
            </div>
            <div class="row space-around">
                <div class="info-container">
                    <div class="label">Email</div>
                    <div class="data">{{ user.email }}</div>
                    <div class="label">Date of birth</div>
                    <div class="data">{{ user.dateOfBirth }}</div>
                    <div class="label">Phone number</div>
                    <div class="data">+381624564</div>
                </div>
            </div>
            <div class="row push-bottom">
                <Button text="Edit" @click="edit"></Button>
            </div>
        </div>

        <vue-final-modal
            v-model="showRegisterModal"
            classes="modal-container"
            content-class="modal-content"
        >
            <Edit />
        </vue-final-modal>
    </div>
</template>
<script>
import Button from "@/components/Button.vue";
import { VueFinalModal, ModalsContainer } from "vue-final-modal";
import Edit from "@/components/EditForm.vue";

export default {
    data() {
        return {
            user: "",
            showRegisterModal: false,
        };
    },
    components: {
        Button,
        VueFinalModal,
        ModalsContainer,
        Edit,
    },
    mounted() {
        this.user = JSON.parse(localStorage.getItem("user"));
    },
    methods: {
        edit() {
            this.showRegisterModal = true;
        },
    },
};
</script>
<style scoped>
.container {
    display: flex;
    height: calc(100% - 4rem);
}

.user-info {
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: 1rem;
    background-color: rgb(30, 36, 43);
    padding-inline: 1rem;
    padding-bottom: 1rem;
}

.row {
    display: flex;
}

.space-around {
    gap: 1rem;
    padding: 1rem;
}

.profile-image:hover {
    cursor: pointer;
    border-color: rgb(var(--clr-primary-300));
}

.profile-image {
    width: 7rem;
    height: 7rem;
    margin-top: 1rem;
    margin-left: 1rem;
    border-radius: 2rem;
    border: 2px solid rgb(var(--clr-neutral-100));
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    transition: box-shadow 0.2s ease-in-out, border 0.2s ease-in-out;
}

.credentials {
    margin-top: 1rem;
    margin-left: 2rem;
    color: rgb(var(--clr-neutral-100));
}

.full-name {
    font-size: 30px;
}

.username {
    font-size: 15px;
    font-style: italic;
    color: rgb(var(--clr-primary-300));
}

.info-container {
    display: flex;
    flex-direction: column;
    color: rgb(var(--clr-neutral-100));
    border-radius: 1rem;
    background-color: rgb(var(--clr-background));
    padding: 0.8rem;
    flex: 1 1 0;
    max-height: 13rem;
}

.label {
    color: rgba(255, 255, 255, 50%);
    font-size: 18px;
}

.data {
    font-size: 24px;
}

.about-headher {
    display: flex;
    color: rgb(var(--clr-neutral-100), 50%);
    align-items: center;
    gap: 0.5rem;
    margin-top: 2rem;
    margin-left: 2rem;
}

.push-bottom {
    margin-top: auto;
    margin-inline: auto;
}

::v-deep .modal-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
::v-deep .modal-content {
    display: flex;
    flex-direction: column;
    margin: 0;
    border: none;
    border-radius: 0.25rem;
}
</style>
