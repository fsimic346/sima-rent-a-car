<template>
    <Carousel :autoplay="5000" :wrap-around="true" :transition="1000">
        <Slide v-for="slide in images" :key="slide">
            <div class="img-container">
                <img :src="getImg(slide)" alt="" rel="preload" />
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
                "bike_black.jpg",
                "holly-mandarich.jpg",
                "car_nature.jpg",
                "sid-balachandran.jpg",
                "white_snow.jpg",
                "white_closeup.jpg",
            ],
        };
    },
    methods: {
        getImg(img) {
            return require(`../static/images/${img}`);
        },
    },
};
</script>

<style scoped>
@import "@/static/css/home.css";
</style>
