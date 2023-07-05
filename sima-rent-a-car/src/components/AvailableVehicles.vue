<template>
    <div class="wrapper">
        <div class="vehicle-overflow">
            <div class="vehicle-container">
                <div
                    class="vehicle-card"
                    v-for="vehicle in agency.availableVehicles"
                >
                    <div>
                        <div
                            class="image"
                            :style="{
                                backgroundImage: `url('${vehicle.image}')`,
                            }"
                        ></div>
                    </div>
                    <div class="data-row vehicle-name">
                        <span class="brand"
                            >{{ vehicle.brand }} {{ vehicle.model }}</span
                        >
                        <div class="type-icon">
                            <i
                                class="fa-solid fa-truck-pickup"
                                v-if="vehicle.vehicleType === 'Truck'"
                            ></i>
                            <i
                                class="fa-solid fa-car-side"
                                v-if="vehicle.vehicleType === 'Car'"
                            ></i>
                            <i
                                class="fa-solid fa-motorcycle"
                                v-if="vehicle.vehicleType === 'Motorcycle'"
                            ></i>
                            <i
                                class="fa-solid fa-caravan"
                                v-if="vehicle.vehicleType === 'MobileHome'"
                            ></i>
                        </div>
                    </div>
                    <div class="data-row">
                        {{ vehicle.description }}
                    </div>
                    <div class="data-row">
                        <div class="info-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="icon icon-tabler icon-tabler-manual-gearbox"
                                width="24"
                                height="24"
                                stroke-width="1.5"
                                stroke="#ffffff"
                            >
                                <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                />
                                <path
                                    d="M5 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"
                                />
                                <path
                                    d="M12 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"
                                />
                                <path
                                    d="M19 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"
                                />
                                <path
                                    d="M5 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"
                                />
                                <path
                                    d="M12 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"
                                />
                                <path d="M5 8l0 8" />
                                <path d="M12 8l0 8" />
                                <path d="M19 8v2a2 2 0 0 1 -2 2h-12" /></svg
                            >{{ vehicle.transmissionType }}
                        </div>
                        <div class="info-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                style="height: 25px; width: 25px"
                            >
                                <path
                                    d="M149.6 41L42.88 254.4c23.8 24.3 53.54 58.8 78.42 97.4 24.5 38.1 44.1 79.7 47.1 119.2h270.3L423.3 41H149.6zM164 64h230l8 192H74l90-192zm86.8 17.99l-141 154.3 81.99h-88.5zM336 279h64v18h-64v-18z"
                                    fill="#fff"
                                    fill-opacity="1"
                                ></path>
                            </svg>
                            {{ vehicle.doorNumber }}
                        </div>
                        <div class="info-icon">
                            <i class="fa-solid fa-gas-pump"></i>
                            {{ vehicle.fuelType }}
                        </div>
                    </div>
                    <div class="data-row price">
                        ${{ vehicle.price }}
                        <Button
                            :text="btnText"
                            v-if="user && user.role === 'Customer'"
                            @click="rent(vehicle)"
                        ></Button>
                    </div>
                </div>
            </div>
        </div>
        <Sidebar :cartItem="cartItem"></Sidebar>
        <!-- <div class="fade-out" id="fadeOut" @click="showSideBar"></div> -->
    </div>

    <vue-final-modal
        v-model="showRentModal"
        classes="modal-container"
        content-class="modal-content"
    >
        <RentVehicle :vehicle="selectedVehicle" @addToCart="addToCart" />
    </vue-final-modal>
</template>
<script>
import commaNumber from "comma-number";
import Button from "@/components/Button.vue";
import RentVehicle from "@/components/RentVehicle.vue";
import Sidebar from "@/components/Sidebar.vue";
import { VueFinalModal, ModalsContainer } from "vue-final-modal";

export default {
    data() {
        return {
            btnText: "Rent",
            user: "",
            showRentModal: false,
            selectedVehicle: {},
            cartItem: {},
            sideBar: false,
        };
    },
    created() {
        if (localStorage.getItem("user")) {
            this.user = JSON.parse(localStorage.getItem("user"));
        }
    },
    mounted() {
        document.addEventListener("click", e => {
            let sidebar = document.getElementById("sidebar");
            let cart = document.getElementById("cart");
            let button = document.getElementById("btn");
            if (sidebar === null || cart === null || button === null) {
                return;
            }

            if (
                sidebar !== e.target &&
                cart !== e.target &&
                button !== e.target &&
                this.sideBar
            ) {
                setTimeout(() => {
                    document
                        .getElementById("sidebar")
                        .classList.toggle("active");
                }, 1);
                this.sideBar = false;
            }
        });
    },
    props: { agency: Object },
    watch: {
        agency(val) {
            for (const vehicle of val.availableVehicles) {
                vehicle.price = commaNumber(vehicle.price, ".");
            }
        },
    },
    components: {
        Button,
        Sidebar,
        VueFinalModal,
        ModalsContainer,
        RentVehicle,
    },
    methods: {
        rent(vehicle) {
            this.selectedVehicle = vehicle;
            this.showRentModal = true;
        },
        showSideBar() {
            document.getElementById("sidebar").classList.toggle("active");
            // document.getElementById("fadeOut").classList.toggle("active");
            this.sideBar = true;
        },
        addToCart(val) {
            this.cartItem = val;
            this.showRentModal = false;
            document.getElementById("sidebar").classList.toggle("active");
            // document.getElementById("fadeOut").classList.toggle("active");
            this.sideBar = true;
        },
    },
};
</script>
<style scoped src="../static/css/forms.css"></style>
<style scoped src="../static/css/availableVehicles.css"></style>
<style scoped>
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
