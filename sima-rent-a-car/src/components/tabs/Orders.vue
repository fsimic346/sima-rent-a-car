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
                                    order.vehicles.reduce((a, b) => {
                                        return (
                                            a +
                                            (a == "" ? "" : ", ") +
                                            b.brand +
                                            " " +
                                            b.model
                                        );
                                    }, "")
                                }}
                            </div>
                            <div class="row">
                                <div class="order-date">
                                    {{
                                        order.rentStartDate +
                                        " - " +
                                        order.rentEndDate
                                    }}
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
                            @click="setOrderStatus(order, 'Denied')"
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
</template>
<script>
import Button from "../Button.vue";
import commaNumber from "comma-number";
import moment from "moment";

export default {
    components: {
        Button,
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
        commaNumber(num, symbol) {
            return commaNumber(num, symbol);
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

<style scoped>
.search-bar {
    display: flex;
    width: 100%;
    min-height: 5rem;
    padding-inline: 1rem;
    align-items: center;
    font-size: 1.2rem;
    color: rgb(var(--clr-text));
    justify-content: space-around;
    border-bottom: 1px solid rgb(var(--clr-text));
}

.search {
    height: max-content;
    width: 30ch;
}

.filter {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.sort {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.search-options {
    display: flex;
    gap: 1rem;
}

i:hover {
    cursor: pointer;
}

.orders-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
    height: 100%;
    overflow: auto;
    padding: 2rem;
}

.orders-overflow {
    overflow-y: auto;
    width: 100%;
    height: 100%;
}

.order {
    display: flex;
    align-items: center;
    color: rgb(var(--clr-text));
    margin-inline: auto;
    font-size: 1.2rem;
    border: 1px solid rgb(var(--clr-neutral-500));
    border-radius: 10px;
    padding: 1rem;
    transition: 0.3s ease-in-out;
    width: 100%;
    gap: 1rem;
}

.user-image {
    width: 8rem;
    height: 8rem;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 50%;
}

.user-info {
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    line-height: 1.2rem;
    width: 100%;
}

.user-username {
    color: rgb(var(--clr-primary-300));
    font-weight: bold;
}

.order-content {
    background-color: rgb(var(--clr-background));
    height: 100%;
    border-radius: 10px;
    padding: 0.3rem;
    display: flex;
    gap: 1rem;
}

.order-text {
    display: flex;
    flex-direction: column;
    width: 40ch;
    justify-content: space-around;
}

.order-controls {
    display: flex;
    flex-direction: column;
    margin-left: auto;
    height: 100%;
    justify-content: space-between;
}

.order-status {
    margin-left: auto;
    color: rgb(var(--clr-primary-300));
}

.order-buttons {
    display: flex;
    gap: 1rem;
}

.order-buttons Button {
    flex-basis: 0;
    flex-grow: 1;
}
.user-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.price {
    font-weight: bold;
    font-size: 1.3rem;
}

.cancelled {
    color: rgb(var(--clr-error));
}

.pending {
    color: rgb(var(--clr-warning));
}

.returned {
    color: rgb(var(--clr-success));
}
</style>
