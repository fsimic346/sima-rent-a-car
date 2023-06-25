<template>
    <div class="wrapper">
        <div class="row">
            <div
                class="logo"
                :style="{ backgroundImage: `url('${agency.logo}')` }"
            ></div>
            <div class="data">
                <div class="name">{{ agency.name }}</div>
                <div class="rating-data">
                    <span class="rating"
                        >{{ agency.rating }}
                        <span class="icons">
                            <i
                                class="fa-sharp fa-solid fa-star"
                                v-for="n in Math.floor(agency.rating)"
                            ></i>
                            <i
                                class="fa-sharp fa-regular fa-star"
                                v-for="n in 5 - Math.floor(agency.rating)"
                            ></i>
                        </span>
                    </span>
                    <span class="rating-count">({{ agency.ratingCount }})</span>
                </div>
                <div class="location">
                    {{ agency.location.address }}, {{ agency.location.city }}
                </div>
                <div class="hours">{{ agency.businessHours }}</div>
            </div>
        </div>
        <div class="vehicle-overflow">
            <div class="vehicle-container">
                <div
                    class="vehicle-card"
                    v-for="vehicle in agency.availableVehicles"
                >
                    <div
                        class="vehicle-image"
                        :style="{ backgroundImage: `url('${vehicle.image}')` }"
                    ></div>
                    <div class="vehicle-info">
                        <div class="vehicle-title">
                            <!-- Zameniti (vehicle-type) sa odgovarajucom ikonicom -->
                            <!-- Na hover kartice smanjiti sliku i prikazati dodatne informacije ili povecati sliku pa na klik prikazati dodatne informacije -->
                            <span class="vehicle-name">{{
                                vehicle.brand + " " + vehicle.model
                            }}</span>
                            <span class="vehicle-type">
                                {{ `(${vehicle.vehicleType})` }}</span
                            >
                        </div>
                        <div class="vehicle-description">
                            {{ vehicle.description }}
                        </div>
                        <div class="vehicle-price">{{ vehicle.price }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        agency: Object,
    },
};
</script>
<style scoped src="../../static/css/agencyOverview.css"></style>
