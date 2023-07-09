<template>
    <div id="sidebar" class="sidebar">
        <div class="header">Your cart:</div>
        <div class="items-container">
            <div class="order-card" v-for="cartItem in cart.cartItems">
                <div class="delete">
                    <i
                        class="fa-solid fa-xmark"
                        @click="removeFromCart(cartItem)"
                    ></i>
                </div>
                <div class="card-info">
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
                                            cartItem.vehicle.vehicleType ===
                                            'Truck'
                                        "
                                    ></i>
                                    <i
                                        class="fa-solid fa-car-side"
                                        v-if="
                                            cartItem.vehicle.vehicleType ===
                                            'Car'
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
                        <div>
                            ${{
                                this.commaNumber(
                                    this.calculatePrice(
                                        cartItem.vehicle.price,
                                        cartItem.dateRange,
                                    ),
                                    ".",
                                )
                            }}
                        </div>
                        <div class="date-range">
                            <div class="date">
                                <div>start:</div>
                                <div>
                                    {{
                                        this.formatDates(
                                            cartItem.dateRange.start,
                                            "Do MMM YYYY",
                                        )
                                    }}
                                </div>
                            </div>
                            <div class="date">
                                <div>end:</div>
                                <div>
                                    {{
                                        this.formatDates(
                                            cartItem.dateRange.end,
                                            "Do MMM YYYY",
                                        )
                                    }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="checkout">
            <div class="column">
                <Button
                    ref="orderBtn"
                    id="btn"
                    :text="btnText"
                    @click="placeOrder"
                ></Button>
                <div class="error">{{ error }}</div>
                <div class="success">{{ success }}</div>
            </div>
            <div class="column">
                <div>Total price:</div>
                <div>${{ this.commaNumber(cart.totalPrice, ".") }}</div>
            </div>
        </div>
    </div>
</template>
<script>
import commaNumber from "comma-number";
import Button from "@/components/Button.vue";
import moment from "moment";

export default {
    data() {
        return {
            image: "https://randomwordgenerator.com/img/picture-generator/57e8dd464957ae14f1dc8460962e33791c3ad6e04e50744172297cd59e4ec1_640.jpg",
            cart: {},
            btnText: "Place order",
            error: "",
            success: "",
        };
    },
    props: { cartItem: Object },
    async mounted() {
        const navHeight = document.querySelector("nav").clientHeight + 1;

        document.getElementById(
            "sidebar",
        ).style.height = `calc(100% - ${navHeight}px)`;
        try {
            const res = await this.axios.get("http://localhost:8080/api/cart");
            this.cart = res.data;
            for (const cartItem of this.cart.cartItems) {
                cartItem.vehicle.price = commaNumber(
                    cartItem.vehicle.price,
                    ".",
                );
            }
        } catch (err) {
            console.log(err);
        }
    },
    watch: {
        cartItem(val) {
            this.cart.cartItems.push(val);
            let totalPrice = parseInt(this.cart.totalPrice);
            totalPrice += this.calculatePrice(
                parseInt(val.vehicle.price),
                val.dateRange,
            );
            this.cart.totalPrice = totalPrice;
            val.vehicle.price = commaNumber(val.vehicle.price, ".");
        },
    },
    components: {
        Button,
    },
    methods: {
        formatDates(date, format) {
            return date ? moment(date).format(format) : "";
        },
        calculatePrice(price, dateRange) {
            const daysRented = Math.ceil(
                Math.abs(
                    new Date(dateRange.end) - new Date(dateRange.start) + 1,
                ) /
                    (1000 * 60 * 60 * 24),
            );

            let discount = 1;

            if (this.cart.user.points >= 500) discount = 0.9;
            else if (this.cart.user.points >= 200) discount = 0.95;
            else if (this.cart.user.points >= 50) discount = 0.97;

            return price * daysRented * discount;
        },
        commaNumber(num, symbol) {
            return commaNumber(num, symbol);
        },
        async removeFromCart(cartItem) {
            try {
                const res = await this.axios.delete(
                    "http://localhost:8080/api/cart",
                    { data: cartItem },
                );

                this.cart.cartItems.splice(
                    this.cart.cartItems.findIndex(
                        x =>
                            x.vehicleId == cartItem.vehicle.id &&
                            x.dateRange == cartItem.dateRange,
                    ),
                    1,
                );
                let totalPrice = parseInt(this.cart.totalPrice);
                totalPrice -= this.calculatePrice(
                    parseInt(cartItem.vehicle.price),
                    cartItem.dateRange,
                );
                this.cart.totalPrice = totalPrice;
            } catch (err) {
                console.log(err.response);
            }
        },
        async placeOrder() {
            try {
                this.btnText = "";
                this.$refs.orderBtn.enabled = false;

                for (const cartItem of this.cart.cartItems) {
                    cartItem.vehicle.price = cartItem.vehicle.price.replace(
                        ".",
                        "",
                    );
                }
                console.log(this.cart);
                const res = await this.axios.post(
                    "http://localhost:8080/api/order",
                    this.cart,
                );

                this.error = "";
                this.success = "Order placed successfully";
                this.cart.cartItems = [];
                this.cart.totalPrice = 0;
                this.btnText = "Place order";
                this.$refs.orderBtn.enabled = true;
            } catch (err) {
                this.btnText = "Place order";
                this.$refs.orderBtn.enabled = true;
                this.success = "";
                this.error = err.response.data;
            }
        },
    },
};
</script>
<style scoped src="../static/css/sidebar.css"></style>
