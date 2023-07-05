<template lang="">
    <div class="container">
        <div class="header">
            <div>Rent</div>
            <div class="car-brand">{{ vehicle.brand }} {{ vehicle.model }}</div>
        </div>
        <DatePicker
            v-model.range="selectedDatesRange"
            mode="date"
            :disabled-dates="disabledDates"
            :min-date="new Date()"
        />
        <div class="dates">
            <div class="date-container">
                <div class="label">Start Date:</div>
                <div>
                    {{ selectedDatesRange ? selectedDatesRange.start : "" }}
                </div>
            </div>
            <div class="date-container">
                <div class="label">End Date:</div>
                <div>
                    {{ selectedDatesRange ? selectedDatesRange.end : "" }}
                </div>
            </div>
        </div>
        <Button :text="btnText" @click="addToCart" ref="rentBtn"></Button>
        <div class="error">{{ error }}</div>
        <div id="success" class="success">{{ success }}</div>
    </div>
</template>
<script>
import { DatePicker } from "v-calendar";
import "v-calendar/style.css";
import moment from "moment";
import Button from "@/components/Button.vue";

export default {
    props: { vehicle: Object },
    components: {
        DatePicker,
        Button,
    },
    data() {
        return {
            selectedDatesRange: { start: "", end: "" },
            disabledDates: [],
            btnText: "Add to cart",
            error: "",
            success: "",
            cartItem: { vehicle: {}, dateRange: "" },
        };
    },
    emits: ["addToCart"],
    watch: {
        async vehicle(val) {
            try {
                const res = await this.axios.get(
                    "http://localhost:8080/api/order/vehicle/" + val.id,
                );

                for (const order of res.data) {
                    order.rentEndDate = moment(order.rentStartDate).add(
                        order.rentLength,
                        "days",
                    );
                    order.rentStartDate = moment(order.rentStartDate);
                }

                this.selectedDatesRange = { start: "", end: "" };

                this.setDisabledDates(res.data);
            } catch (err) {
                console.log(err);
                this.error = err.response.data;
            }
        },
        selectedDatesRange(val) {
            if (!val) return;
            if (val.start !== "" && val.end !== "") {
                val.start = moment(val.start).format("Do MMMM YYYY");
                val.end = moment(val.end).format("Do MMMM YYYY");
            }
        },
    },
    methods: {
        setDisabledDates(orders) {
            this.disabledDates = [];
            for (const order of orders) {
                for (const cartItem of order.cartItems) {
                    const daysRange = {
                        start: new Date(cartItem.dateRange.start),
                        end: new Date(cartItem.dateRange.end),
                    };
                    this.disabledDates.push(daysRange);
                }
            }
        },
        async addToCart() {
            if (
                this.selectedDatesRange.start === "" ||
                this.selectedDatesRange.end === ""
            ) {
                this.error = "invalid dates";
                return;
            }

            try {
                this.btnText = "";
                this.$refs.rentBtn.enabled = false;

                this.vehicle.price = this.vehicle.price.replace(".", "");
                this.cartItem = {
                    vehicleId: this.vehicle.id,
                    vehicle: this.vehicle,
                    dateRange: this.selectedDatesRange,
                };

                const res = await this.axios.post(
                    "http://localhost:8080/api/cart",
                    {
                        cartItem: this.cartItem,
                    },
                );

                this.success = "Item added to cart succesfully";
                setTimeout(() => {
                    document.getElementById("success").style.display = "none";
                }, 400);
                this.$refs.rentBtn.enabled = true;
                this.error = "";
                this.btnText = "Add to cart";

                this.$emit("addToCart", this.cartItem);
            } catch (err) {
                this.error = err.data;
            }
        },
    },
};
</script>

<style scoped src="../static/css/rentVehicle.css"></style>
