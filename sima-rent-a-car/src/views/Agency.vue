<template>
    <div class="container" id="container">
        <div class="agency-container">
            <div class="agency-info">
                <div class="row">
                    <div
                        class="logo"
                        id="agencyImg"
                        :style="{ backgroundImage: `url('${agency.logo}')` }"
                    ></div>
                </div>
                <div class="row">
                    <div class="name">{{ agency.name }}</div>
                </div>
                <div class="row">
                    <div
                        class="agency-rating"
                        v-if="typeof agency.rating === 'number'"
                    >
                        {{ agency.rating }}
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
                        ({{ agency.ratingCount }})
                    </div>
                </div>
                <div class="row">
                    <div
                        class="businessHours"
                        :class="{ closed: !agency.isOpen }"
                    >
                        {{ agency.businessHours }}
                    </div>
                </div>
            </div>
        </div>
        <AvailableVehicles
            :agency="agency"
            @addToCart="addToCart"
        ></AvailableVehicles>
    </div>
</template>
<script>
import AvailableVehicles from "@/components/AvailableVehicles.vue";

export default {
    components: {
        AvailableVehicles,
    },
    created() {
        window.addEventListener("resize", this.resizeHandler);
    },
    async beforeMount() {
        try {
            const res = await this.axios.get(
                `http://localhost:8080/api/agency/get/${this.$route.params.agencyId}`,
            );
            this.agency = res.data;

            const currentDate = new Date();
            const currentHour = currentDate.getHours();
            const currentMinute = currentDate.getMinutes();

            this.agency.isOpen = isOpen(
                getBusinessHours(this.agency.businessHours.split(" ")),
            );

            function getBusinessHours(hours) {
                const openingHour =
                    parseInt(hours[0].split(":")[0]) +
                    (hours[1] === "PM" ? 12 : 0);
                const closingHour =
                    parseInt(hours[3].split(":")[0]) +
                    (hours[4] === "PM" ? 12 : 0);
                const openingMinute = parseInt(hours[0].split(":")[1]);
                const closingMinute = parseInt(hours[3].split(":")[1]);
                return {
                    openingHour,
                    closingHour,
                    openingMinute,
                    closingMinute,
                };
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
        } catch (err) {
            console.log(err);
            this.$router.push("/");
        }
    },
    destroyed() {
        window.removeEventListener("resize", this.resizeHandler);
    },
    emits: ["addToCart"],
    data() {
        return {
            agency: {},
        };
    },
    mounted() {
        setTimeout(() => {
            const image = document.getElementById("agencyImg");
            image.style.height = `${image.offsetWidth}px`;
        }, 0.1);
        const navHeight = document.querySelector("nav").clientHeight + 1;
        document.getElementById(
            "container",
        ).style.height = `calc(100% - ${navHeight}px)`;
    },
    methods: {
        resizeHandler(e) {
            const element = document.getElementById("agencyImg");
            element.style.height = `${element.offsetWidth}px`;
        },
        addToCart(val) {
            this.$emit("addToCart", val);
        },
    },
};
</script>
<style scoped>
.container {
    display: flex;
    height: calc(100% - 4rem);
    width: 100%;
    overflow: auto;
}

.agency-container {
    display: flex;
    height: 100%;
    width: 20%;
}

.agency-info {
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
    border-radius: 1rem;
    background-color: rgb(var(--clr-background-secondary));
    color: rgb(var(--clr-text));
    padding: 1rem;
    overflow: hidden;
}

.logo {
    width: 100%;
    border-radius: 2rem;
    border: 2px solid rgb(var(--clr-neutral-100));
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    transition: box-shadow 0.2s ease-in-out, border 0.2s ease-in-out;
    position: relative;
}

.row {
    display: flex;
    justify-content: center;
}

.name {
    font-size: 2.2rem;
    font-family: var(--fnt-header);
    width: max-content;
}

.businessHours {
    font-size: 1.5rem;
    color: rgb(var(--clr-success));
    margin-top: 1rem;
}

.closed {
    color: rgb(var(--clr-error));
}

.agency-rating {
    font-size: 1.6rem;
}

.icons {
    color: gold;
}
</style>
