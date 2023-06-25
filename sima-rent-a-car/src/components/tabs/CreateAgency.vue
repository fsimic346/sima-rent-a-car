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
        <div class="new-manager">
            <div class="add-menager" @click="addManager()">
                <i class="fa-solid fa-user-plus"></i>
                <div class="text">Add Manager</div>
            </div>
        </div>
        <Button text="Create" class="add-btn" />
    </div>

    <vue-final-modal
        v-model="showManagerModal"
        classes="modal-container"
        content-class="modal-content"
    >
        <AvailableManagers @createManager="createManager" />
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
        };
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
