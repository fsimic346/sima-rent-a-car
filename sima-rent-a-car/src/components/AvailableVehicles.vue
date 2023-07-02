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
                            @click="rent"
                        ></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <vue-final-modal
        v-model="showRentModal"
        classes="modal-container"
        content-class="modal-content"
    >
        <RentVehicle />
    </vue-final-modal>
</template>
<script>
import commaNumber from "comma-number";
import Button from "@/components/Button.vue";
import RentVehicle from "@/components/RentVehicle.vue";
import { VueFinalModal, ModalsContainer } from "vue-final-modal";

export default {
    data() {
        return {
            btnText: "Rent",
            user: "",
            showRentModal: false,
            selectedVehicle: {},
        };
    },
    created() {
        if (localStorage.getItem("user")) {
            this.user = JSON.parse(localStorage.getItem("user"));
        }
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
        VueFinalModal,
        ModalsContainer,
        RentVehicle,
    },
    methods: {
        rent(vehicle) {
            this.showRentModal = true;
            this.selectedVehicle = vehicle;
        },
    },
};
</script>
<style scoped src="../static/css/forms.css"></style>
<style scoped>
.wrapper {
    width: 100%;
}

.container {
    background-color: rgb(var(--clr-background-secondary));
    max-height: 58rem;
    overflow: hidden;
}

.vehicle-overflow {
    display: flex;
    overflow-y: auto;
    width: 100%;
    height: 100%;
}
.vehicle-container {
    display: flex;
    color: rgb(var(--clr-text));
    max-width: 88rem;
    flex-wrap: wrap;
    margin-inline: auto;
    justify-content: space-between;
    height: max-content;
    padding: 1rem;
}

.vehicle-overflow::-webkit-scrollbar {
    width: 0.5em;
}

.vehicle-overflow::-webkit-scrollbar-thumb {
    background-color: rgba(var(--clr-background));
    outline: 1px solid slategrey;
    border-radius: 0.3rem;
}

.header {
    display: flex;
    width: 100%;
    justify-content: center;
    margin-bottom: 2rem;
    font-family: var(--fnt-header);
}

.vehicle-card {
    background-color: rgb(var(--clr-background));
    border-radius: 10px;
    border: solid 2px;
    margin-bottom: 1.5rem;
    transition: 0.2s;
}

.vehicle-card:hover {
    border-color: rgb(var(--clr-primary-300));
}

.brand {
    font-family: var(--fnt-header);
}

.data-row {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 0.8rem;
    align-items: center;
    padding-inline: 0.8rem;
}

.image {
    width: 28rem;
    height: 20rem;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 10px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    margin-bottom: 0.8rem;
}

.info-icon {
    display: flex;
    gap: 0.2rem;
    align-items: center;
}

.type-icon {
    margin-left: auto;
}

.vehicle-name {
    margin-bottom: 0;
    font-size: 1.4rem;
}

.price {
    margin-top: 4rem;
    font-size: 1.4rem;
}

Button {
    margin-left: auto;
    font-size: 18px;
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
