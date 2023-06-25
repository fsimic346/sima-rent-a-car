<template>
  <div class="row">
    <form @submit="onSubmit">
      <h1>New Agency</h1>
      <div class="wrapper">
        <label>Name:</label>
        <input type="text" />
      </div>
      <div class="wrapper">
        <label>Business hours:</label>
        <input type="text" />
      </div>
      <div class="wrapper">
        <label>Logo:</label>
        <input class="logo-input" type="text" />
      </div>
    </form>
    <div class="map"></div>
  </div>
  <div class="row"></div>
</template>

<script>
import Button from '@/components/Button.vue'

export default {
  data() {
    return {
      agency: {
        name: '',
        businessHours: '',
        adress: '',
        city: '',
        state: '',
        zip: '',
        logo: '',
      },
    }
  },
}
</script>

<style scoped>
h1 {
  color: rgb(var(--clr-text));
  font-family: var(--fnt-header);
}

.row {
  display: flex;
  gap: 2rem;
  width: 100%;
  padding: 1rem;
}

form {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
}

.map {
  background-color: rgb(var(--clr-background));
  flex-grow: 1;
  height: 100%;
}

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  color: rgb(var(--clr-text));
  font-size: 20px;
}

.wrapper input {
  background-color: rgb(var(--clr-background));
  border-radius: 0.4rem;
  color: rgb(var(--clr-text));
  font-size: 1.2rem;
  border: 2px solid rgb(var(--clr-text));
  padding-inline: 1ch;
  padding-block: 0.2rem;
  outline: none;
}
</style>
