<template lang="">
    <div class="container">
        <div class="column">
            <div
                class="car-image-placeholder"
                @click="addOrEditImage()"
                :style="{ backgroundImage: `url('${vehicle.image}')` }"
            >
                <div class="add-icon" v-if="!hasImage">
                    <i class="fa-solid fa-camera"></i>
                </div>
            </div>
            <Button text="Add" @click="addVehicle"></Button>
        </div>
        <div class="column max-width">
            <div class="primary-info">
                <h1>Vehicle info</h1>
                <form @submit="onSubmit">
                    <div class="column">
                        <div class="wrapper">
                            <label>Brand*:</label>
                            <input
                                class="input"
                                type="text"
                                v-model="vehicle.brand"
                            />
                            <div class="error">
                                {{ errorBrand }}
                            </div>
                        </div>
                        <div class="wrapper">
                            <label>Model*:</label>
                            <input
                                class="input"
                                type="text"
                                v-model="vehicle.model"
                            />
                            <div class="error">
                                {{ errorModel }}
                            </div>
                        </div>
                        <div class="wrapper">
                            <label>Vehicle type*:</label>
                            <select class="input" v-model="vehicle.vehicleType">
                                <option value="Car">Car</option>
                                <option value="Van">Van</option>
                                <option value="MobileHome">Mobile Home</option>
                                <option value="Truc">Truck</option>
                            </select>
                            <div class="error">
                                {{ errorVehicleType }}
                            </div>
                        </div>
                        <div class="wrapper">
                            <label>Transmission type*:</label>
                            <select
                                class="input"
                                type="text"
                                v-model="vehicle.transmissionType"
                            >
                                <option value="Manual">Manual</option>
                                <option value="Automatic">Automatic</option>
                            </select>
                            <div class="error">
                                {{ errorTransmissionType }}
                            </div>
                        </div>
                    </div>
                    <div class="column">
                        <div class="wrapper">
                            <label>Fuel type*:</label>
                            <select class="input" v-model="vehicle.fuelType">
                                <option value="Diesel">Diesel</option>
                                <option value="Gasoline">Gasoline</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Electric">Electric</option>
                            </select>
                            <div class="error">
                                {{ errorFuelType }}
                            </div>
                        </div>
                        <div class="wrapper">
                            <label>Consumption*:</label>
                            <input
                                class="input"
                                type="text"
                                v-model="vehicle.consumption"
                            />
                        </div>
                        <div class="error">
                            {{ errorConsumption }}
                        </div>
                        <div class="row">
                            <div class="wrapper">
                                <label>Doors*:</label>
                                <input
                                    class="input number"
                                    type="number"
                                    v-model="vehicle.doorNumber"
                                />
                                <div class="error">
                                    {{ errorDoors }}
                                </div>
                            </div>
                            <div class="wrapper">
                                <label>Passangers*:</label>
                                <input
                                    class="input number"
                                    type="number"
                                    v-model="vehicle.passangerNumber"
                                />
                                <div class="error">
                                    {{ errorPassangers }}
                                </div>
                            </div>
                        </div>
                        <div class="wrapper">
                            <label>Price*:</label>
                            <input
                                class="input"
                                type="text"
                                v-model="vehicle.price"
                            />
                            <div class="error">
                                {{ errorPrice }}
                            </div>
                            <div class="error" v-if="this.errorPrice !== ''">
                                ($1000)
                            </div>
                        </div>
                    </div>
                </form>
                <div class="wrapper">
                    <label>Description:</label>
                    <textarea class="input textarea"></textarea>
                </div>
            </div>
        </div>
    </div>

    <vue-final-modal
        v-model="showImageModal"
        classes="modal-container"
        content-class="modal-content"
    >
        <ImageForm
            :image="vehicle.image"
            header="Vehicle image url:"
            @imageChanged="
                val => ((this.vehicle.image = val), (this.hasImage = true))
            "
        />
    </vue-final-modal>
</template>
<script>
import Button from "@/components/Button.vue";
import ImageForm from "@/components/ImageForm.vue";
import { VueFinalModal, ModalsContainer } from "vue-final-modal";

export default {
    data() {
        return {
            vehicle: {
                brand: "",
                model: "",
                price: "",
                vehicleType: "",
                transmissionType: "",
                fuelType: "",
                consumption: "",
                doorNumber: "",
                passangerNumber: "",
                description: "",
                image: "",
            },
            hasImage: false,
            errorBrand: "",
            errorModel: "",
            errorVehicleType: "",
            errorTransmissionType: "",
            errorFuelType: "",
            errorConsumption: "",
            errorDoors: "",
            errorPassangers: "",
            errorPrice: "",
            showImageModal: false,
        };
    },
    components: {
        Button,
        ImageForm,
        VueFinalModal,
        ModalsContainer,
    },
    methods: {
        addVehicle() {
            const errorMessage = this.validation();
            if (errorMessage !== "") return;
        },
        addOrEditImage() {
            this.showImageModal = true;
        },
        validation() {
            this.errorBrand = "";
            this.errorModel = "";
            this.errorVehicleType = "";
            this.errorTransmissionType = "";
            this.errorFuelType = "";
            this.errorConsumption = "";
            this.errorDoors = "";
            this.errorPassangers = "";
            this.errorPrice = "";

            const priceRegex = "^\$[1-9][0-9]*$";

            if (this.vehicle.brand === "") {
                this.errorBrand = "invalid brand";
                return this.errorBrand;
            } else if (this.vehicle.model === "") {
                this.errorModel = "invalid model";
                return this.errorModel;
            } else if (
                this.vehicle.price === "" ||
                !this.vehicle.price.match(this.priceRegex)
            ) {
                this.errorPrice = "invalid price";
                return this.errorPrice;
            } else if (this.vehicle.vehicleType === "") {
                this.errorVehicleType = "invalid vehicle type";
                return this.errorLogo;
            } else if (this.vehicle.transmissionType === "") {
                this.errorTransmissionType = "invalid transmission type";
                return this.errorTransmissionType;
            } else if (this.vehicle.fuelType === "") {
                this.errorFuelType = "invalid fuel type";
                return this.errorFuelType;
            } else if (this.vehicle.consumption === "") {
                this.errorConsumption = "invalid consumption";
                return this.errorConsumption;
            } else if (this.vehicle.doorNumber === "") {
                this.errorDoors = "invalid door number";
                return this.errorDoors;
            } else if (this.vehicle.passangerNumber === "") {
                this.errorPassangers = "invalid passanger number";
                return this.errorPassangers;
            }

            return "";
        },
    },
};
</script>
<style scoped>
.container {
    display: flex;
    gap: 2rem;
    width: 100%;
    height: 100%;
    padding: 1rem;
    flex-grow: 1;
}

Button {
    margin-inline: auto;
    margin-top: auto;
}

.column {
    display: flex;
    flex-direction: column;
}

.row {
    display: flex;
    gap: 1.4rem;
}

.car-image-placeholder {
    position: relative;
    width: 30rem;
    height: 30rem;
    border: 2px solid rgb(var(--clr-text));
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 2rem;
    color: rgb(var(--clr-text));
    transition: 0.3s;
}

h1 {
    color: rgb(var(--clr-text));
    margin-inline: auto;
    font-family: var(--fnt-header);
}

.car-image-placeholder:hover {
    color: rgb(var(--clr-primary-300));
    background-color: rgba(var(--clr-text), 10%);
    border-color: rgb(var(--clr-primary-300));
    cursor: pointer;
}

.add-icon {
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    font-size: 10rem;
    width: 100%;
    height: 100%;
    border-radius: 2rem;
}

.primary-info {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    background-color: rgb(var(--clr-background));
    color: rgb(var(--clr-text));
    border-radius: 1rem;
    padding-block: 1rem;
    padding-inline: 3rem;
    flex-grow: 1;
}

form {
    display: flex;
    gap: 13rem;
    justify-content: space-between;
}

.input {
    background-color: rgb(var(--clr-background));
    border-radius: 0.4rem;
    color: rgb(var(--clr-text));
    font-size: 1.2rem;
    border: 2px solid rgb(var(--clr-text));
    padding-inline: 1ch;
    padding-block: 0.2rem;
    outline: none;
    width: 25ch;
}

.textarea {
    width: 100%;
    height: 100%;
}

.number {
    width: 8rem;
}

.primary-info label {
    font-size: 1.5rem;
}

.max-width {
    width: 100%;
}

.wrapper {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    height: 100%;
}

.error {
    color: rgb(var(--clr-error));
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
