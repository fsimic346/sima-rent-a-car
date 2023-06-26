<template>
    <div class="row">
        <form @submit="onSubmit">
            <h1>New Agency</h1>
            <div class="wrapper">
                <label>Name:</label>
                <input type="text" />
            </div>
            <div class="wrapper">
                <label>Business hours:</label>
                <input type="text" />
            </div>
            <div class="wrapper">
                <label>Logo:</label>
                <input class="logo-input" type="text" />
            </div>
        </form>
        <div class="map"></div>
    </div>
    <div class="row">
        <Button text="Create" class="add-btn" />
        <div class="new-manager">
            <div
                v-if="manager === ''"
                class="add-manager"
                @click="addManager()"
            >
                <i class="fa-solid fa-user-plus"></i>
                <div class="text">Add Manager</div>
            </div>

            <div id="appointManager" class="appointed-manager">
                <i class="fa-solid fa-pen" @click="addManager"></i>
                <div class="credentials">
                    <div class="full-name">
                        <div>{{ manager.firstName }}</div>
                        <div>{{ manager.lastName }}</div>
                    </div>
                    <div class="username">@{{ manager.username }}</div>
                    <div class="email">{{ manager.email }}</div>
                </div>
                <div
                    class="manager-profile-img"
                    :style="{ backgroundImage: `url('${manager.imageUrl}')` }"
                    id="managerImg"
                ></div>
            </div>
        </div>
    </div>

    <vue-final-modal
        v-model="showManagerModal"
        classes="modal-container"
        content-class="modal-content"
    >
        <AvailableManagers
            @createManager="createManager"
            @selectManager="appointManager"
        />
    </vue-final-modal>
</template>

<script>
import Button from "@/components/Button.vue";
import { VueFinalModal, ModalsContainer } from "vue-final-modal";
import AvailableManagers from "@/components/AvailableManagers.vue";

export default {
    data() {
        return {
            agency: {
                name: "",
                businessHours: "",
                adress: "",
                city: "",
                state: "",
                zip: "",
                logo: "",
            },
            showManagerModal: false,
            manager: "",
        };
    },

    created() {
        window.addEventListener("resize", this.resizeHandler);
    },

    destroyed() {
        window.removeEventListener("resize", this.resizeHandler);
    },

    emits: ["createManager"],

    components: {
        Button,
        VueFinalModal,
        ModalsContainer,
        AvailableManagers,
    },

    methods: {
        addManager() {
            this.showManagerModal = true;
        },
        createManager(val) {
            this.$emit("createManager", val);
        },
        appointManager(manager) {
            this.manager = manager;
            this.showManagerModal = false;
            document.getElementById("appointManager").style.opacity = 1;
            setTimeout(() => {
                const element = document.getElementById("managerImg");
                element.style.width = `${element.offsetHeight}px`;
            }, 0.1);
        },
        resizeHandler(e) {
            const element = document.getElementById("managerImg");
            element.style.width = `${element.offsetHeight}px`;
        },
    },
};
</script>

<style scoped src="../../static/css/createAgency.css">
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
    max-width: max-content;
}
</style>
