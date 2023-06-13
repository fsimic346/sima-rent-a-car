<template>
    <div class="container" id="profileContainer">
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
                    <div class="label">
                        <span>Gender</span>
                        <i
                            class="fa-solid fa-pen"
                            @click="showGenderModal()"
                        ></i>
                    </div>
                    <div class="data">{{ user.gender }}</div>
                    <div class="gender-overlay" id="genderOverlay">
                        <div
                            class="gender-container male"
                            @click="setGender('Male')"
                        >
                            <i class="fa-solid fa-mars"></i>
                            <span>Male</span>
                        </div>
                        <div
                            class="gender-container female"
                            @click="setGender('Female')"
                        >
                            <i class="fa-solid fa-venus"></i>
                            <span>Female</span>
                        </div>
                    </div>
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
                    <div class="label">
                        <span>Date of birth</span>
                        <i
                            class="fa-solid fa-pen"
                            @click="enableEdit('dateOfBirthInput')"
                        ></i>
                    </div>
                    <div class="data">
                        <input
                            type="date"
                            hidden
                            id="dateOfBirthInput"
                            v-model="user.dateOfBirth"
                            disabled
                            @blur="disableEdit('dateOfBirthInput')"
                            @keypress="
                                disableEditOnEnter($event, 'dateOfBirthInput')
                            "
                        />
                    </div>
                    <div class="label">
                        <span>Phone number</span>
                        <i
                            class="fa-solid fa-pen"
                            @click="enableEdit('phoneNumberInput')"
                        ></i>
                    </div>
                    <div class="data">
                        <input
                            type="text"
                            id="phoneNumberInput"
                            v-model="user.phoneNumber"
                            disabled
                            @focusout="disableEdit('phoneNumberInput')"
                            @keypress="
                                disableEditOnEnter($event, 'phoneNumberInput')
                            "
                        />
                    </div>
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
            genderModal: false,
        };
    },
    components: {
        Button,
        VueFinalModal,
        ModalsContainer,
        Edit,
    },
    mounted() {
        const navHeight = document.querySelector("nav").clientHeight + 1;
        document.getElementById(
            "profileContainer"
        ).style.height = `calc(100% - ${navHeight}px)`;

        this.user = JSON.parse(localStorage.getItem("user"));
        document.addEventListener("click", (e) => {
            let element = document.getElementById("genderOverlay");
            if (element == null) {
                return;
            }

            if (element !== e.target && this.genderModal) {
                element.style.opacity = 0;
                this.genderModal = false;
                setTimeout(() => {
                    document.getElementById("genderOverlay").style.display =
                        "none";
                }, 200);
            }
        });
    },
    methods: {
        edit() {
            this.showRegisterModal = true;
        },
        enableEdit(id) {
            const element = document.getElementById(id);
            element.disabled = false;
            if (id === "dateOfBirthInput") {
                element.hidden = false;
                setTimeout(() => {
                    element.showPicker();
                }, 1);
            }
            element.focus();
        },
        disableEdit(id) {
            const element = document.getElementById(id);
            element.disabled = true;
            if (
                this.user.dateOfBirth == undefined &&
                id === "dateOfBirthInput"
            ) {
                element.hidden = true;
            }
        },
        disableEditOnEnter(e, id) {
            const element = document.getElementById(id);
            if (e.keypress === "Enter" || e.keyCode === 13) {
                element.disabled = true;
            }
        },
        showGenderModal() {
            document.getElementById("genderOverlay").style.display = "flex";
            setTimeout(() => {
                this.genderModal = true;
                document.getElementById("genderOverlay").style.opacity = 1;
            }, 10);
        },
        setGender(gender) {
            this.user.gender = gender;
            document.getElementById("genderOverlay").style.opacity = 0;
            setTimeout(() => {
                document.getElementById("genderOverlay").style.display = "none";
            }, 200);
            this.genderModal = false;
        },
    },
};
</script>
<style scoped src="../static/css/profile.css">
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
