<template>
    <div class="container">
        <div class="filter-container"><h2>search</h2></div>
        <div class="card-container">
            <div class="agency-card" v-for="agency in agencies" :key="id">
                <div
                    class="agency-logo"
                    style="background-image: url('https://picsum.photos/200')"
                ></div>
                <div class="agency-info">
                    <div class="agency-column">
                        <div class="agency-colum">
                            <div class="agency-name">{{ agency.name }}</div>
                            <div class="agency-rating">
                                <i class="fa-solid fa-star"></i> 4.8
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
                                ` ${agency.location.address}, ${agency.location.city}`
                            }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            agencies: [],
        };
    },
    async beforeMount() {
        const res = await this.axios.get(
            "http://localhost:8080/api/agency/all"
        );
        this.agencies = res.data;
    },
};
</script>
<style scoped>
.container {
    display: flex;
    height: 100%;
    width: 100%;
    color: rgb(var(--clr-text));
}
.filter-container {
    display: flex;
    flex-direction: column;
    border-right: 2px solid white;
    height: 100%;
    width: 20rem;
    align-items: center;
}
.card-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    overflow-y: scroll;
    max-height: 200rem;
}

.agency-card {
    background-color: rgb(30, 36, 43);
    display: flex;
    width: 42rem;
    transition: 0.3s ease-in-out;
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
}

.agency-card:hover {
    cursor: pointer;
    background-color: hsl(212, 18%, 22%);
    transform: scale(1.025);
}

.agency-logo {
    width: 14rem;
    height: 13rem;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}

.agency-info {
    display: flex;
    padding-inline: 1rem;
    padding-block: 2rem;
    justify-content: space-between;
    flex-grow: 1;
}

.agency-column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.agency-location {
    margin-top: auto;
}

.agency-name {
    font-weight: bold;
    font-size: 1.2rem;
}
</style>
