<template>
    <div class="wrapper">
        <div class="row">
            <div class="logo" :style="{ backgroundImage: `url('${agency.logo}')` }"></div>
            <div class="data">
                <div class="name">{{ agency.name }}</div>
                <div class="rating-data">
                    <span class="rating"
                        >4.2{{ agency.rating }}
                        <span class="icons">
                            <i class="fa-sharp fa-solid fa-star"></i
                            ><i class="fa-sharp fa-solid fa-star"></i
                            ><i class="fa-sharp fa-solid fa-star"></i
                            ><i class="fa-sharp fa-solid fa-star"></i
                            ><i class="fa-sharp fa-regular fa-star"></i>
                        </span>
                    </span>
                    <span class="rating-count">(1,204{{ agency.ratingCount }})</span>
                </div>
                <div class="location">
                    {{ agency.location.address }}, {{ agency.location.city }}
                </div>
                <div class="hours">{{ agency.businessHours }}</div>
            </div>
        </div>
        <div class="cars"></div>
    </div>
</template>
<script>
export default {
    props: {
        agency: Object,
    },
};
</script>
<style scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    color: rgb(var(--clr-text));
    padding: 2rem;
}

.row {
    display: flex;
    height: max-content;
    gap: 2rem;
    align-items: center;
}

.logo {
    width: 22rem;
    height: 22rem;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

.data {
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    gap: 0.5rem;
}

.name {
    font-family: var(--fnt-header);
    font-size: 4rem;
}

.location {
    font-size: 1.7rem;
}

.hours {
    font-size: 1.5rem;
}

.rating {
    color: rgb(var(--clr-text));
    font-size: 2rem;
    font-weight: bold;
}

.icons {
    color: rgb(var(--clr-warning-500));
}

.cars {
    outline: 2px solid red;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
}
</style>
