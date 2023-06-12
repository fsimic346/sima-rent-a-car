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
    padding-bottom: 3rem;
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
    max-width: 22.5rem;
    position: relative;
}

.data input {
    background: transparent;
    border: none;
    outline: none;
    color: rgb(var(--clr-neutral-100));
}

.label {
    display: flex;
    justify-content: space-between;
    color: rgba(255, 255, 255, 50%);
    font-size: 18px;
}

.label i {
    transition: color 0.2s ease-in-out;
}

.label i:hover {
    cursor: pointer;
    color: rgb(var(--clr-primary-300));
}

.data {
    font-size: 24px;
    min-height: 2.25rem;
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
    justify-content: center;
}

.gender-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    display: none;
    justify-content: space-around;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 1rem;
    z-index: 2;
    left: 0;
    top: 0;
    opacity: 0;
    transition: 0.2s ease-in-out;
}

.gender-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    flex: 1 1 0;
    transition: 0.2s ease-in-out;
}

.male {
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
}

.female {
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
}

.gender-container i {
    font-size: 1.5rem;
}

.gender-container:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.1);
}

.male:hover {
    color: cornflowerblue;
}

.female:hover {
    color: pink;
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
