<template>
  <Carousel :autoplay="5000" :wrap-around="true" :transition="1000">
    <Slide v-for="slide in images" :key="slide">
      <div class="img-container">
        <img :src="getImg(slide)" alt="" rel="preload" />
      </div>
    </Slide>
  </Carousel>
  <div class="overlay">
    <h1>Lorem ipsum dolor sit amet.</h1>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro fugiat eos
      eligendi optio non possimus nesciunt minima deserunt aliquid totam.
    </p>
    <Button text="Show Agencies" @click="agencies" />
  </div>
</template>

<script>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import Button from '@/components/Button.vue'

export default {
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
    Button,
  },
  data() {
    return {
      images: [
        'bike_black.jpg',
        'holly-mandarich.jpg',
        'car_nature.jpg',
        'sid-balachandran.jpg',
        'white_snow.jpg',
        'white_closeup.jpg',
      ],
    }
  },
  methods: {
    getImg(img) {
      return require(`../static/images/${img}`)
    },
    agencies() {
      this.$router.push('/agencies')
    },
  },
}
</script>

<style scoped src="@/static/css/home.css"></style>
