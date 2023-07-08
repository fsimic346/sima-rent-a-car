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
                        {{ Math.round(agency.rating * 100) / 100 }}
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
                <div class="comments">
                    <Comments :agency="agency" :isAgencyView="true" />
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
import Comments from "@/components/tabs/Comments.vue";

export default {
    components: {
        AvailableVehicles,
        Comments,
    },
    created() {
        window.addEventListener("resize", this.resizeHandler);
    },
    async created() {
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
<style scoped src="../static/css/agency.css"></style>

<style scoped>
.comments {
    height: 100%;
}
.comments >>> .comments-container {
    padding: 0;
}

.comments >>> .comments-container::-webkit-scrollbar {
    width: 0.35em;
    display: none;
}

.comments >>> .comments-container::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
}

.comments >>> .comments-container::-webkit-scrollbar-thumb {
    background-color: rgba(var(--clr-background));
    outline: 1px solid slategrey;
    border-radius: 0.3rem;
}

.comments >>> .comment-text {
    width: min(100%, 40ch);
}

.comments >>> .rating {
    font-size: 0.8rem;
}

.comments >>> .user-header {
    flex-direction: column;
}

.comments >>> .comment-content {
    width: 100%;
}

.comments >>> .user-image {
    min-width: 4rem;
    width: 4rem;
    height: 4rem;
    align-self: center;
}
</style>
