<template>
    <div class="search-bar">
        <input
            type="text"
            class="search"
            placeholder="Search..."
            @keyup="search($event)"
        />
        <div class="search-options">
            <div class="sort">
                <div>Sort by:</div>
                <select name="sort" id="sort" v-model="sort">
                    <option value="none" selected>None</option>
                    <option value="user" v-if="user.role === 'Manager'">
                        Name
                    </option>
                    <option value="price">Price</option>
                    <option value="rentStartDate">Date</option>
                </select>

                <i
                    class="fa-solid"
                    :class="{
                        'fa-arrow-down-short-wide': sortOrder === 'descending',
                        'fa-arrow-up-short-wide': sortOrder === 'ascending',
                    }"
                    id="order"
                    @click="changeSortOrder"
                ></i>
            </div>
        </div>
    </div>
    <div class="orders-overflow">
        <div class="orders-container">
            <div class="order" v-for="order in orders">
                <div class="order-content">
                    <div
                        class="user-image"
                        :style="{
                            backgroundImage: `url(${order.user.imageUrl})`,
                        }"
                    ></div>
                    <div class="order-text">
                        <div class="user-info">
                            <div class="user-header">
                                {{
                                    order.user.firstName +
                                    " " +
                                    order.user.lastName
                                }}
                                <span class="price">{{
                                    "$" + this.commaNumber(order.price, ".")
                                }}</span>
                            </div>
                            <div class="user-username">
                                @{{ order.user.username }}
                            </div>
                        </div>
                        <div class="order-info">
                            <div class="vehicles">
                                Vehicles:
                                {{
                                    order.cartItems.reduce((a, b) => {
                                        return (
                                            a +
                                            (a == "" ? "" : ", ") +
                                            b.vehicle.brand +
                                            " " +
                                            b.vehicle.model
                                        );
                                    }, "")
                                }}
                            </div>
                            <div class="row">
                                <div class="order-date">
                                    <!-- {{
                                        order.rentStartDate +
                                        " - " +
                                        order.rentEndDate
                                    }} -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="order-controls">
                    <div
                        class="order-status"
                        :class="{
                            cancelled: order.status === 'Cancelled',
                            pending: order.status === 'Pending',
                            returned: order.status === 'Returned',
                        }"
                    >
                        {{ order.status }}
                    </div>
                    <div class="order-buttons">
                        <Button
                            text="Approve"
                            color="rgb(var(--clr-success-500))"
                            v-if="
                                order.status === 'Pending' &&
                                user.role === 'Manager'
                            "
                            @click="setOrderStatus(order, 'Approved')"
                        />
                        <Button
                            text="Deny"
                            color="rgb(var(--clr-error-500))"
                            v-if="
                                order.status === 'Pending' &&
                                user.role === 'Manager'
                            "
                            @click="declineOrder(order)"
                        />
                        <Button
                            text="Set as rented"
                            color="rgb(var(--clr-success-500))"
                            v-if="
                                order.status === 'Approved' &&
                                user.role === 'Manager'
                            "
                            @click="setOrderStatus(order, 'Rented')"
                        />
                        <Button
                            text="Set as returned"
                            color="rgb(var(--clr-success-500))"
                            v-if="
                                order.status === 'Rented' &&
                                user.role === 'Manager'
                            "
                            @click="setOrderStatus(order, 'Returned')"
                        />
                        <Button
                            text="Cancel"
                            color="rgb(var(--clr-error-500))"
                            v-if="
                                order.status === 'Pending' &&
                                user.role === 'Customer'
                            "
                            @click="cancelOrder(order)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <vue-final-modal
        v-model="showModal"
        classes="modal-container"
        content-class="modal-content"
    >
        <Reasoning :order="deniedOrder" @updateStatus="updateStatus" />
    </vue-final-modal>
</template>
<script>
import Button from "../Button.vue";
import commaNumber from "comma-number";
import Reasoning from "@/components/Reasoning.vue";
import moment from "moment";
import { VueFinalModal, ModalsContainer } from "vue-final-modal";

export default {
    components: {
        Button,
        Reasoning,
        VueFinalModal,
        ModalsContainer,
    },
    props: {
        user: Object,
    },
    data() {
        return {
            sortOrder: "descending",
            searchParams: "",
            sort: "none",
            orders: [],
            allOrders: [],
            showModal: false,
            deniedOrder: {},
        };
    },
    async beforeMount() {
        try {
            this.allOrders = (
                await this.axios.get(
                    "http://localhost:8080/api/order/" +
                        (this.user.role === "Customer"
                            ? "user/" + this.user.id
                            : this.user.agencyId),
                )
            ).data;
            for (const order of this.allOrders) {
                order.rentEndDate = moment(order.rentStartDate)
                    .add(order.rentLength, "days")
                    .format("Do MMMM YYYY");
                order.rentStartDate = moment(order.rentStartDate).format(
                    "Do MMMM YYYY",
                );
            }
            this.orders = this.allOrders;
        } catch (error) {
            console.log(error);
        }
    },
    methods: {
        updateStatus(val) {
            val.status = "Denied";
            showModal = false;
        },
        commaNumber(num, symbol) {
            return commaNumber(num, symbol);
        },
        declineOrder(order) {
            this.deniedOrder = order;
            this.showModal = true;
        },
        async setOrderStatus(order, status) {
            try {
                const res = this.axios.patch(
                    "http://localhost:8080/api/order/setStatus",
                    {
                        order,
                        status: status,
                    },
                );
                order.status = status;
            } catch (error) {
                console.log(error);
            }
        },
        async cancelOrder(order) {
            try {
                const res = this.axios.patch(
                    "http://localhost:8080/api/order/cancel/",
                    {
                        order,
                    },
                );
                order.status = "Cancelled";
            } catch (error) {
                console.log(error);
            }
        },
        changeSortOrder() {
            if (this.sortOrder === "descending") {
                this.sortOrder = "ascending";
                this.filterOrders();
                return;
            }
            this.sortOrder = "descending";
            this.filterOrders();
        },
        search(e) {
            this.searchParams = e.target.value.toLowerCase();

            this.filterOrders();
        },
        filterOrders() {
            const params = this.searchParams.split(" ");
            this.orders = this.allOrders.filter(x => {
                return params.some(
                    param =>
                        x.user.username.toLowerCase().includes(param) ||
                        x.user.lastName.toLowerCase().includes(param) ||
                        x.user.firstName.toLowerCase().includes(param) ||
                        x.price.toString().includes(param) ||
                        x.rentStartDate.toLowerCase().includes(param) ||
                        x.rentEndDate.toLowerCase().includes(param),
                );
            });

            if (this.sort !== "none") {
                this.orders = this.orders.sort((a, b) => {
                    if (this.sort === "price")
                        return this.sortOrder === "ascending"
                            ? a.price - b.price
                            : b.price - a.price;

                    let sortVal = 0;
                    const aVal =
                        this.sort === "user"
                            ? a[this.sort].username
                            : a[this.sort].toLowerCase();
                    const bVal =
                        this.sort === "user"
                            ? b[this.sort].username
                            : b[this.sort].toLowerCase();
                    if (aVal < bVal) sortVal = 1;
                    else if (aVal > bVal) sortVal = -1;
                    return this.sortOrder === "ascending"
                        ? sortVal
                        : sortVal * -1;
                });
            }
        },
    },
    watch: {
        sort(val) {
            this.filterOrders();
        },
    },
};
</script>

<style scoped src="../../static/css/tabContent.css"></style>
<style scoped src="../../static/css/orders.css"></style>
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
    max-width: max-content;
}
</style>
