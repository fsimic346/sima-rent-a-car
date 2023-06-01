<template>
  <div class="container">
    <form @submit="onSubmit" class="user-form">
      <div class="form-element">
        <label>Username or email:</label>
        <input type="text" v-model="usernameOrEmail" />
      </div>
      <div class="form-element">
        <label>Password:</label>
        <input type="password" v-model="password" />
      </div>
      <Button :text="loginText" @click="login" ref="loginBtn" />
      <span><RouterLink to="/register">register</RouterLink></span>
    </form>
  </div>
</template>

<script>
import Button from "@/components/Button.vue";

export default {
  name: "Login",
  data() {
    return {
      usernameOrEmail: "",
      password: "",
      loginText: "Login",
    };
  },
  components: {
    Button,
  },
  methods: {
    async login() {
      try {
        this.loginText = "";
        this.$refs.loginBtn.enabled = false;
        const res = await this.axios.post("http://localhost:8080/api/login", {
          usernameOrEmail: this.usernameOrEmail,
          password: this.password,
        });
        this.$cookie.setCookie("token", res.data.token);
        this.$cookie.setCookie("user", res.data.user);
        this.$router.push("/");
      } catch (err) {
        this.loginText = "Login";
        this.$refs.loginBtn.enabled = true;
        console.log(err.response.data);
      }
    },
  },
};
</script>

<style scoped>
.container {
  height: 100%;
  display: flex;
}

.user-form {
  display: flex;
  flex-direction: column;
  width: max-content;
  padding: 1rem;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: auto;
}
.form-element {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
