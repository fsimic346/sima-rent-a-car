<template>
    <div class="container" id="cardContainer">
        <div class="filter-container"><h2>search</h2></div>
        <div class="card-container">
            <div
                class="agency-card"
                v-for="agency in agencies"
                :class="{ open: agency.isOpen }"
                :key="agency.id"
            >
                <div
                    class="agency-logo"
                    style="background-image: url('https://picsum.photos/200')"
                ></div>
                <div class="agency-info">
                    <div class="agency-column">
                        <div class="agency-colum">
                            <div class="agency-name">{{ agency.name }}</div>
                            <div class="agency-rating"><i class="fa-solid fa-star"></i> 4.8</div>
                        </div>
                        <div class="agency-hours">
                            <i class="fa-solid fa-clock"></i>
                            {{ agency.businessHours }}
                        </div>
                    </div>
                    <div class="agency-column">
                        <div class="agency-location">
                            <i class="fa-solid fa-location-dot"></i>
                            {{ ` ${agency.location.address}, ${agency.location.city}` }}
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
        const res = await this.axios.get("http://localhost:8080/api/agency/all");
        const agencies = res.data;

        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();

        for (const agency of agencies) {
            agency.isOpen = isOpen(getBusinessHours(agency.businessHours.split(" ")));
        }

        agencies.sort((a, b) => {
            if (a.isOpen && !b.isOpen) return -1;
            if (!a.isOpen && b.isOpen) return 1;
            return 0;
        });

        this.agencies = agencies;
        console.log(agencies);

        function getBusinessHours(hours) {
            const openingHour = parseInt(hours[0].split(":")[0]) + (hours[1] === "PM" ? 12 : 0);
            const closingHour = parseInt(hours[3].split(":")[0]) + (hours[4] === "PM" ? 12 : 0);
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
    mounted() {
        const navHeight = document.querySelector("nav").clientHeight + 1;
        document.getElementById("cardContainer").style.height = `calc(100% - ${navHeight}px)`;
    },
};
</script>
<style scoped>
.container {
    display: flex;
    width: 100%;
    color: rgb(var(--clr-text));
}
.filter-container {
    display: flex;
    flex-direction: column;
    border-right: 2px solid white;
    height: 100%;
    width: 30rem;
    align-items: center;
}
.card-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    gap: 1.5rem;
    padding: 4rem;
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

.agency-hours {
    font-weight: bold;
    color: rgb(var(--clr-error-300));
}

.open .agency-hours {
    color: rgb(var(--clr-success-300));
}
</style>
