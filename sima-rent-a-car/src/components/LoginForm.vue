<template>
  <div class="container">
    <form @submit="onSubmit" class="user-form">
      <h1>Login</h1>
      <div class="form-element login-form-element">
        <label>Username or email:</label>
        <input type="text" v-model="usernameOrEmail" />
      </div>
      <div class="form-element login-form-element">
        <label>Password:</label>
        <input type="password" v-model="password" />
      </div>
      <div class="error-msg">{{ error }}</div>
      <Button
        class="login-btn"
        :text="loginText"
        @click="login"
        ref="loginBtn"
      />
    </form>
  </div>
</template>

<script>
import Button from '@/components/Button.vue'

export default {
  name: 'Login',
  data() {
    return {
      usernameOrEmail: '',
      password: '',
      loginText: 'Login',
      error: '',
    }
  },
  components: {
    Button,
  },
  methods: {
    async login() {
      try {
        this.loginText = ''
        this.$refs.loginBtn.enabled = false
        const res = await this.axios.post('http://localhost:8080/api/login', {
          usernameOrEmail: this.usernameOrEmail,
          password: this.password,
        })
        this.$cookie.setCookie('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        this.$router.go('/')
      } catch (err) {
        this.loginText = 'Login'
        this.$refs.loginBtn.enabled = true
        this.error = err.response.data
      }
    },
  },
}
</script>

<style scoped src="../static/css/forms.css"></style>

<style scoped>
.login-form-element {
  width: 28ch;
}

.login-btn {
  margin-top: 1rem;
}

h1 {
  margin-bottom: 2rem;
  font-weight: 700;
}
</style>
