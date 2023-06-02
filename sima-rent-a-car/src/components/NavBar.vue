<template>
  <nav :class="!isHomePage ? 'solid-nav' : ''">
    <div class="logo" @click="home">LOGO</div>
    <div class="button-container">
      <Button text="Login" v-if="!authorized" @click="login" />
      <Button text="Register" v-if="!authorized" @click="register" />
      <div class="profile" v-if="authorized" @click="logout">
        <span class="username">{{ username }}</span>
        <div class="profile-image"></div>
      </div>
    </div>
  </nav>
</template>
<script>
import Button from "@/components/Button.vue";
export default {
  name: "NavBar",
  data() {
    return {
      authorized: "",
      username: "",
      isHomePage: "",
    };
  },
  components: {
    Button,
  },
  methods: {
    login() {
      this.$router.push("/login");
    },
    register() {
      this.$router.push("/register");
    },
    home() {
      this.$router.push("/");
    },
    logout() {
      this.$cookie.setCookie("token", "");
      this.$cookie.setCookie("user", "");
      this.$router.go("/");
    },
  },
  watch: {
    "$route.params": {
      handler(val) {
        this.authorized = this.$cookie.getCookie("token") != null;
        if (this.authorized)
          this.username = this.$cookie.getCookie("user").username;
        this.isHomePage = this.$route.name === "home";
      },
      immediate: true,
    },
  },
};
</script>
<style scoped>
nav {
  display: flex;
  max-height: 5rem;
  height: 5rem;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding-inline: 3rem;
  position: absolute;
  z-index: 2;
}
.logo {
  display: flex;
}

.button-container {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  padding: 0.1rem 0.8rem;
  border-radius: 7px;
  transition: color 0.2s ease-in-out;
}

.profile:hover {
  cursor: pointer;
  color: var(--clr-primary-300);
  filter: drop-shadow();
}

.profile:hover .profile-image {
  box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.4);
}

.profile-image {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  border: 1px solid blue;
  background-image: url("https://repository-images.githubusercontent.com/260096455/47f1b200-8b2e-11ea-8fa1-ab106189aeb0");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  transition: box-shadow 0.2s ease-in-out;
}

.solid-nav {
  background-color: var(--clr-primary-900);
}
</style>
