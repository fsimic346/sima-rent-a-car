<template>
    <div class="container" id="cardContainer">
        <div class="filter-container">
            <input
                type="text"
                class="search"
                placeholder="Search..."
                @keyup="search($event)"
            />
            <div class="sort">
                <div>Sort by:</div>
                <select name="sort" id="sort" v-model="sort">
                    <option value="none" selected>None</option>
                    <option value="name">Name</option>
                    <option value="location">Location</option>
                    <option value="rating">Rating</option>
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
            <div class="filter">
                <div>Fuel type:</div>
                <select name="filter" id="filter" v-model="fuelFilter">
                    <option value="none" selected>None</option>
                    <option value="diesel">Diesel</option>
                    <option value="gasoline">Gasoline</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="electric">Electric</option>
                </select>
            </div>
            <div class="filter">
                <div>Vehicle type:</div>
                <select name="filter" id="filter" v-model="typeFilter">
                    <option value="none" selected>None</option>
                    <option value="car">Car</option>
                    <option value="van">Van</option>
                    <option value="mobilehome">Mobile Home</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="truck">Truck</option>
                </select>
            </div>
            <div class="filter">
                <div>
                    Show only opened:
                    <input
                        type="checkbox"
                        name="opened"
                        id="opened"
                        v-model="openedFilter"
                    />
                </div>
            </div>
        </div>
        <div class="card-container">
            <div
                class="agency-card"
                v-for="agency in agencies"
                @click="showVehicles(agency)"
                :class="{ open: agency.isOpen }"
                :key="agency.id"
            >
                <div
                    class="agency-logo"
                    :style="{ backgroundImage: `url('${agency.logo}')` }"
                ></div>
                <div class="agency-info">
                    <div class="agency-column">
                        <div class="agency-colum">
                            <div class="agency-name">{{ agency.name }}</div>
                            <div class="agency-rating">
                                {{ Math.round(agency.rating * 100) / 100 }}
                                <span class="icons">
                                    <i
                                        class="fa-sharp fa-solid fa-star"
                                        v-for="n in Math.floor(agency.rating)"
                                    ></i>
                                    <i
                                        class="fa-sharp fa-regular fa-star"
                                        v-for="n in 5 -
                                        Math.floor(agency.rating)"
                                    ></i>
                                </span>
                                ({{ agency.ratingCount }})
                            </div>
                        </div>
                        <div class="agency-hours">
                            <i class="fa-solid fa-clock"></i>
                            {{ agency.businessHours }}
                        </div>
                    </div>
                    <div class="agency-column">
                        <div class="agency-location">
                            <i class="fa-solid fa-location-dot"></i>
                            {{
                                ` ${
                                    agency.location.road +
                                    " " +
                                    agency.location.house_number
                                }, ${agency.location.city}`
                            }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import AvailableVehicles from "@/components/AvailableVehicles.vue";

export default {
    data() {
        return {
            allAgencies: [],
            agencies: [],
            sortOrder: "descending",
            searchParams: "",
            fuelFilter: "none",
            typeFilter: "none",
            openedFilter: false,
            sort: "none",
        };
    },
    methods: {
        showVehicles(agency) {
            this.$router.push("/agency/" + agency.id);
        },
        search(e) {
            this.searchParams = e.target.value.toLowerCase();

            this.filterAgencies();
        },
        filterAgencies() {
            const params = this.searchParams.split(" ");

            this.agencies = this.allAgencies.filter(x => {
                return params.some(
                    param =>
                        x.name.toLowerCase().includes(param) ||
                        x.location.city.toLowerCase().includes(param) ||
                        x.location.address.toLowerCase().includes(param) ||
                        x.availableVehicles.some(veh =>
                            veh.vehicleType.toLowerCase().includes(param),
                        ),
                );
            });

            if (this.fuelFilter !== "none") {
                this.agencies = this.agencies.filter(x => {
                    return x.availableVehicles.some(
                        x => x.fuelType.toLowerCase() === this.fuelFilter,
                    );
                });
            }

            if (this.typeFilter !== "none") {
                this.agencies = this.agencies.filter(x => {
                    return x.availableVehicles.some(x => {
                        return x.vehicleType.toLowerCase() === this.typeFilter;
                    });
                });
            }

            if (this.openedFilter) {
                this.agencies = this.agencies.filter(x => {
                    return x.isOpen;
                });
            }

            if (this.sort !== "none") {
                this.agencies = this.agencies.sort((a, b) => {
                    if (this.sort === "rating")
                        return this.sortOrder === "ascending"
                            ? a.rating - b.rating
                            : b.rating - a.rating;

                    let sortVal = 0;
                    const val1 =
                        this.sort === "location"
                            ? a[this.sort].city.toLowerCase()
                            : a[this.sort].toLowerCase();
                    const val2 =
                        this.sort === "location"
                            ? b[this.sort].city.toLowerCase()
                            : b[this.sort].toLowerCase();

                    if (val1 < val2) sortVal = 1;
                    else if (val1 > val2) sortVal = -1;
                    return this.sortOrder === "ascending"
                        ? sortVal
                        : sortVal * -1;
                });
            }
        },
        changeSortOrder() {
            if (this.sortOrder === "descending") {
                this.sortOrder = "ascending";
                this.filterAgencies();
                return;
            }
            this.sortOrder = "descending";
            this.filterAgencies();
        },
    },
    watch: {
        fuelFilter(val) {
            this.filterAgencies();
        },
        typeFilter(val) {
            this.filterAgencies();
        },
        openedFilter(val) {
            this.filterAgencies();
        },
        sort(val) {
            this.filterAgencies();
        },
    },
    async beforeMount() {
        const res = await this.axios.get(
            "http://localhost:8080/api/agency/all",
        );
        const agencies = res.data;

        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();

        for (const agency of agencies) {
            agency.isOpen = isOpen(
                getBusinessHours(agency.businessHours.split(" ")),
            );
        }

        agencies.sort((a, b) => {
            if (a.isOpen && !b.isOpen) return -1;
            if (!a.isOpen && b.isOpen) return 1;
            return 0;
        });

        this.allAgencies = agencies;
        this.agencies = agencies;

        function getBusinessHours(hours) {
            const openingHour =
                parseInt(hours[0].split(":")[0]) + (hours[1] === "PM" ? 12 : 0);
            const closingHour =
                parseInt(hours[3].split(":")[0]) + (hours[4] === "PM" ? 12 : 0);
            const openingMinute = parseInt(hours[0].split(":")[1]);
            const closingMinute = parseInt(hours[3].split(":")[1]);
            return { openingHour, closingHour, openingMinute, closingMinute };
        }

        function isOpen(hours) {
            if (hours.openingHour < currentHour) {
                if (hours.closingHour > currentHour) {
                    return true;
                }

                if (hours.closingHour === currentHour) {
                    if (hours.closingMinute > currentMinute) {
                        return true;
                    }
                }
            } else if (hours.openingHour === currentHour) {
                if (hours.openingMinute < currentMinute) {
                    return true;
                }
            }
            return false;
        }
    },
    components: {
        AvailableVehicles,
    },
    mounted() {
        const navHeight = document.querySelector("nav").clientHeight + 1;
        document.getElementById(
            "cardContainer",
        ).style.height = `calc(100% - ${navHeight}px)`;
    },
};
</script>
<style scoped src="../static/css/agencies.css"></style>

<style scoped></style>
