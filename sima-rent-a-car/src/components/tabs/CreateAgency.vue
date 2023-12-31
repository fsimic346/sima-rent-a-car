<template>
    <div class="flex-wrapper">
        <div class="column">
            <form @submit="onSubmit">
                <h1>New Agency</h1>
                <div class="wrapper">
                    <label>Name:</label>
                    <input type="text" v-model="agency.name" />
                    <div class="error">{{ errorName }}</div>
                </div>
                <div class="wrapper">
                    <label>Business hours:</label>
                    <input type="text" v-model="agency.businessHours" />
                    <div class="error">{{ errorBusinessHours }}</div>
                    <div class="error" v-if="errorBusinessHours !== ''">
                        (9:00-18:00)
                    </div>
                </div>
                <div class="wrapper">
                    <label>Logo:</label>
                    <input type="text" v-model="agency.logo" />
                    <div class="error">{{ errorLogo }}</div>
                </div>
            </form>
            <div class="create">
                <Button
                    :text="btnText"
                    class="add-btn"
                    ref="createBtn"
                    @click="createAgency"
                />

                <div class="error">{{ errorLocation }}</div>
                <div class="success">{{ success }}</div>
                <div class="error">{{ error }}</div>
            </div>
        </div>
        <div class="column max-width">
            <div class="map" id="map"></div>
            <div class="new-manager">
                <div
                    v-if="!isManagerSelected"
                    class="add-manager"
                    @click="addManager()"
                >
                    <i class="fa-solid fa-user-plus"></i>
                    <div class="text">Add Manager</div>
                    <div class="error">{{ errorManager }}</div>
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
                        :style="{
                            backgroundImage: `url('${
                                manager.imageUrl === undefined
                                    ? ''
                                    : manager.imageUrl
                            }')`,
                        }"
                        id="managerImg"
                    ></div>
                </div>
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
import "leaflet/dist/leaflet.css";
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default {
    data() {
        return {
            agency: {
                name: "",
                businessHours: "",
                logo: "",
            },
            showManagerModal: false,
            manager: {
                firstName: "placeholder",
                lastName: "placeholder",
                username: "placeholder",
                email: "placeholder",
            },
            isManagerSelected: false,
            btnText: "Create",
            error: "",
            success: "",
            errorName: "",
            errorBusinessHours: "",
            errorLogo: "",
            errorManager: "",
            errorLocation: "",
            map: {},
            marker: {},
        };
    },

    created() {
        window.addEventListener("resize", this.resizeHandler);
    },

    destroyed() {
        window.removeEventListener("resize", this.resizeHandler);
    },

    mounted() {
        this.map = L.map("map").setView([45, 20], 6);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(this.map);
        const element = document.querySelector(".leaflet-control-container");
        element.style.display = "none";
        this.map.on("click", this.onMapClick);
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
            this.isManagerSelected = true;
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
        async createAgency() {
            const errorMessage = this.validation();
            if (errorMessage !== "") return;
            try {
                this.btnText = "";
                this.$refs.createBtn.enabled = false;
                const res = await this.axios.post(
                    "http://localhost:8080/api/agency/",
                    {
                        agency: this.agency,
                        manager: this.manager,
                    },
                );

                this.$refs.createBtn.enabled = true;
                this.success = "Successfully Created";

                this.agency.name = "";
                this.agency.businessHours = "";
                this.agency.logo = "";
                this.manager.firstName = "placeholder";
                this.manager.lastName = "placeholder";
                this.manager.username = "placeholder";
                this.manager.email = "placeholder";
                document.getElementById("appointManager").style.opacity = 0;
                this.isManagerSelected = false;
                this.error = "";
                this.btnText = "Create";
            } catch (err) {
                this.btnText = "Create";
                this.$refs.createBtn.enabled = true;
                this.error = err.response.data;
                this.success = "";
            }
        },
        validation() {
            this.errorName = "";
            this.errorBusinessHours = "";
            this.errorLogo = "";
            this.errorLocation = "";
            const businessHoursFormat =
                /^([0-9]{1}|1[0-9]{1}|2[0-3]{1}){1}:([0-5]{1}[0-9]{1})-([0-9]{1}|1[0-9]{1}|2[0-3]{1}){1}:([0-5]{1}[0-9]{1})$/;

            if (this.agency.name === "") {
                this.errorName = "invalid name";
                return this.errorName;
            } else if (
                !this.agency.businessHours.match(businessHoursFormat) ||
                this.agency.businessHours === "" ||
                !this.checkBusinessHours()
            ) {
                this.errorBusinessHours = "invalid business hours";
                return this.errorBusinessHours;
            } else if (
                !this.agency.location ||
                !this.agency.location.house_number ||
                !this.agency.location.city ||
                !this.agency.location.road
            ) {
                this.errorLocation = "invalid location";
                return this.errorLocation;
            } else if (this.agency.logo === "") {
                this.errorLogo = "invalid logo";
                return this.errorLogo;
            } else if (!this.isManagerSelected) {
                this.errorManager = "Manager is required";
                return this.errorManager;
            }

            return "";
        },
        checkBusinessHours() {
            const splitBusinessHours = this.agency.businessHours.split("-");
            const hoursMinutes1 = splitBusinessHours[0].split(":");
            const hoursMinutes2 = splitBusinessHours[1].split(":");
            if (parseInt(hoursMinutes1[0]) === parseInt(hoursMinutes2[0])) {
                if (parseInt(hoursMinutes1[1]) >= parseInt(hoursMinutes2[1])) {
                    return false;
                }
            }
            if (parseInt(hoursMinutes1[0]) > parseInt(hoursMinutes2[0])) {
                return false;
            }

            return true;
        },
        async onMapClick(e) {
            if (this.marker) {
                this.map.removeLayer(this.marker);
            }
            this.marker = L.marker(e.latlng).addTo(this.map);
            this.agency.location = {
                ...(
                    await this.axios.get(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${e.latlng.lat}&lon=${e.latlng.lng}`,
                    )
                ).data.address,
                ...e.latlng,
            };
        },
    },
};
</script>

<style scoped src="../../static/css/createAgency.css">
.map a {
    display: none !important;
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
    max-width: max-content;
}
</style>
