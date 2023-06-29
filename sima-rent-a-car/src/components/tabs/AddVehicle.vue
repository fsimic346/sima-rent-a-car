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
                <div class="add-icon change-icon" v-if="hasImage">
                    <i class="fa-solid fa-pen"></i>
                </div>
            </div>
            <div class="error error-center">{{ errorImage }}</div>
            <Button :text="btnText" ref="addBtn" @click="addVehicle"></Button>
            <div class="success">{{ success }}</div>
            <div class="error error-center">{{ error }}</div>
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
                        <div class="error" v-if="this.errorConsumption !== ''">
                            (8.5)
                        </div>
                        <div class="row">
                            <div class="wrapper">
                                <label>Doors*:</label>
                                <input
                                    class="input number"
                                    type="number"
                                    min="0"
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
                                    min="0"
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
                        </div>
                    </div>
                </form>
                <div class="wrapper">
                    <label>Description:</label>
                    <textarea
                        class="input textarea"
                        v-model="vehicle.description"
                    ></textarea>
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
                val => {
                    this.vehicle.image = val;
                    console.log(this.vehicle.image);
                    this.hasImage = true;
                    showImageModal = false;
                }
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
            errorImage: "",
            error: "",
            success: "",
            showImageModal: false,
            btnText: "Add",
        };
    },
    emits: ["updateAvailableVehicle"],
    components: {
        Button,
        ImageForm,
        VueFinalModal,
        ModalsContainer,
    },
    props: { agencyId: Number },
    methods: {
        async addVehicle() {
            const errorMessage = this.validation();
            if (errorMessage !== "") return;

            try {
                this.btnText = "";
                this.$refs.addBtn.enabled = false;
                const res = await this.axios.post(
                    "http://localhost:8080/api/vehicle/",
                    {
                        vehicle: this.vehicle,
                        agencyId: this.agencyId,
                    },
                );

                this.$refs.addBtn.enabled = true;
                this.success = "Successfully Added";

                this.vehicle.image = "";
                this.vehicle.brand = "";
                this.vehicle.model = "";
                this.vehicle.vehicleType = "";
                this.vehicle.transmissionType = "";
                this.vehicle.fuelType = "";
                this.vehicle.consumption = "";
                this.vehicle.doorNumber = "";
                this.vehicle.passangerNumber = "";
                this.vehicle.price = "";
                this.hasImage = false;
                this.error = "";
                this.btnText = "Add";
                this.$emit("updateAvailableVehicle");
            } catch (err) {
                console.log(err);
                this.btnText = "Create";
                this.$refs.addBtn.enabled = true;
                this.error = err.response.data;
            }
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
            this.errorImage = "";

            const priceRegex = "^\[1-9][0-9]*$";
            const consumptionRegex = "^\[1-9][0-9]*.?[0-9]*$";

            if (this.vehicle.brand === "") {
                this.errorBrand = "invalid brand";
                return this.errorBrand;
            } else if (this.vehicle.model === "") {
                this.errorModel = "invalid model";
                return this.errorModel;
            } else if (
                this.vehicle.price === "" ||
                !this.vehicle.price.match(priceRegex)
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
            } else if (
                this.vehicle.consumption === "" ||
                !this.vehicle.consumption.match(consumptionRegex)
            ) {
                this.errorConsumption = "invalid consumption";
                return this.errorConsumption;
            } else if (this.vehicle.doorNumber === "") {
                this.errorDoors = "invalid door number";
                return this.errorDoors;
            } else if (this.vehicle.passangerNumber === "") {
                this.errorPassangers = "invalid passanger number";
                return this.errorPassangers;
            } else if (!this.hasImage) {
                this.errorImage = "invalid image";
                return this.errorImage;
            }

            return "";
        },
    },
};
</script>
<style scoped src="../../static/css/addVehicle.css">
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
