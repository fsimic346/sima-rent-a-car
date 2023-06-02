<template>
    <Carousel :autoplay="5000" :wrap-around="true" :transition="1000">
        <Slide v-for="slide in images" :key="slide">
            <div class="img-container">
                <img :src="slide" alt="" />
            </div>
        </Slide>
    </Carousel>
</template>

<script>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";

export default {
    components: {
        Carousel,
        Slide,
        Pagination,
        Navigation,
    },
    data() {
        return {
            images: [
                "../static/bike_black.jpg",
                "../static/holly-mandarich.jpg",
                "../static/car_nature.jpg",
                "../static/sid-balachandran.jpg",
                "../static/white_snow.jpg",
                "../static/white_closeup.jpg",
            ],
        };
    },
};
</script>

<style scoped>
img {
    object-fit: cover;
    height: 50rem;
    width: 100%;
}

.img-container {
    width: 100%;
}
</style>
