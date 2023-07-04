<template>
    <div id="sidebar" class="sidebar">
        <div class="header">Your cart:</div>
        <div class="items-container">
            <div class="order-card" v-for="cartItem in cart.cartItems">
                <div class="row">
                    <div
                        class="image"
                        :style="{
                            backgroundImage: `url('${cartItem.vehicle.image}')`,
                        }"
                    ></div>
                    <div class="column">
                        <div class="name">
                            {{ cartItem.vehicle.brand }}
                            {{ cartItem.vehicle.model }}
                        </div>
                        <div class="row">
                            <div class="column">
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
                                        <path
                                            d="M19 8v2a2 2 0 0 1 -2 2h-12"
                                        /></svg
                                    >{{ cartItem.vehicle.transmissionType }}
                                </div>
                                <div class="icon">
                                    <i class="fa-solid fa-gas-pump"></i>
                                    {{ cartItem.vehicle.fuelType }}
                                </div>
                            </div>

                            <div class="column">
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
                                    {{ cartItem.vehicle.doorNumber }}
                                </div>
                                <i
                                    class="fa-solid fa-truck-pickup"
                                    v-if="
                                        cartItem.vehicle.vehicleType === 'Truck'
                                    "
                                ></i>
                                <i
                                    class="fa-solid fa-car-side"
                                    v-if="
                                        cartItem.vehicle.vehicleType === 'Car'
                                    "
                                ></i>
                                <i
                                    class="fa-solid fa-motorcycle"
                                    v-if="
                                        cartItem.vehicle.vehicleType ===
                                        'Motorcycle'
                                    "
                                ></i>
                                <i
                                    class="fa-solid fa-caravan"
                                    v-if="
                                        cartItem.vehicle.vehicleType ===
                                        'MobileHome'
                                    "
                                ></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="description">
                    {{ cartItem.vehicle.description }}
                </div>
                <div class="price">
                    <div>${{ cartItem.vehicle.price }}</div>
                </div>
            </div>
        </div>
        <div class="checkout">
            <Button :text="btnText"></Button>
            <div class="total-price">
                <div>Total price:</div>
                <div>${{ cart.totalPrice }}</div>
            </div>
        </div>
    </div>
</template>
<script>
import commaNumber from "comma-number";
import Button from "@/components/Button.vue";

export default {
    data() {
        return {
            image: "https://randomwordgenerator.com/img/picture-generator/57e8dd464957ae14f1dc8460962e33791c3ad6e04e50744172297cd59e4ec1_640.jpg",
            cart: Object,
            btnText: "Place order",
        };
    },
    props: { cartItem: Object },
    async mounted() {
        try {
            const res = await this.axios.get("http://localhost:8080/api/cart");
            this.cart = res.data;
            this.cart.totalPrice = commaNumber(this.cart.totalPrice, ".");
            for (const cartItem of this.cartItems) {
                cartItem.vehicle.price = commaNumber(
                    cartItem.vehicle.price,
                    ".",
                );
            }
        } catch (err) {
            console.log(err.data);
        }
    },
    watch: {
        cartItem(val) {
            // console.log(typeof this.cart.totalPrice);
            // console.log(typeof val.vehicle.price);
            this.cart.cartItems.push(val);
            // let totalPrice = parseInt(this.cart.totalPrice);
            // totalPrice += parseInt(val.vehicle.price);
            // this.cart.totalPrice = totalPrice;
        },
    },
    components: {
        Button,
    },
};
</script>
<style scoped src="../static/css/sidebar.css"></style>
