<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="register" class="register-form">
      <div class="form-group">
        <label for="user_name">Username</label>
        <input id="user_name" v-model="user_name" required />
        <p v-if="userError" class="error">{{ userError }}</p>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" required />
        <p v-if="emailError" class="error">{{ emailError }}</p>
      </div>
      <div class="form-group password-group">
        <label for="password">Password</label>
        <input
          id="password"
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          type="password"
          required
        />

        <i
          :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
          @click="togglePasswordVisibility('password')"
          class="toggle-icon"
        ></i>
        <p v-if="passwordError" class="error">{{ passwordError }}</p>
      </div>
      <div class="form-group password-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          v-model="confirmPassword"
          type="password"
          required
        />
        <i
          :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
          @click="togglePasswordVisibility('confirmPassword')"
          class="toggle-icon"
        ></i>
        <p v-if="confirmPasswordError" class="error">{{ confirmPasswordError }}</p>
      </div>
      <button type="submit" class="submit-button">Register</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
    <div class="login-link">
      <p>
        Don't have an account?
        <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import { useToast } from 'vue-toastification' // Import toast hook
export default {
  data() {
    return {
      user_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      userError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
      errorMessage: '', // To display validation or API errors
      showPassword: false,
      showConfirmPassword: false,
    }
  },
  methods: {
    togglePasswordVisibility(field) {
      if (field === 'password') {
        this.showPassword = !this.showPassword
      } else if (field === 'confirmPassword') {
        this.showConfirmPassword = !this.showConfirmPassword
      }
    },
    validateForm() {
      // Reset errors
      this.userError = ''
      this.emailError = ''
      this.passwordError = ''
      this.confirmPasswordError = ''
      this.errorMessage = ''

      let isValid = true

      // Validate Username
      if (!this.user_name.trim()) {
        this.userError = 'Username is required.'
        isValid = false
      } else if (this.user_name.length < 5) {
        this.userError = 'Username must be at least 5 characters.'
        isValid = false
      }

      // Validate Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.email.trim()) {
        this.emailError = 'Email is required.'
        isValid = false
      } else if (!emailPattern.test(this.email)) {
        this.emailError = 'Invalid email format.'
        isValid = false
      }

      // Validate Password
      const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      if (!this.password.trim()) {
        this.passwordError = 'Password is required.'
        isValid = false
      } else if (!passwordPattern.test(this.password)) {
        this.passwordError =
          'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.'
        isValid = false
      }

      // Validate Confirm Password
      if (!this.confirmPassword.trim()) {
        this.confirmPasswordError = 'Confirm Password is required.'
        isValid = false
      } else if (this.password !== this.confirmPassword) {
        this.confirmPasswordError = 'Passwords do not match.'
        isValid = false
      }

      return isValid
    },
    async register() {
      const toast = useToast() // Get the toast function
      if (!this.validateForm()) {
        return
      }

      try {
        const apiUrl = process.env.VUE_APP_API_URL
        await axios.post(`${apiUrl}/auth/register`, {
          user_name: this.user_name,
          email: this.email,
          password: this.password,
        })
        // Success toast
        toast.success('Registration successful! You can now login.', {
          icon: '*', // Custom icon or emoji
          style: {
            backgroundColor: '#d4edda', // Light green background
            color: '#155724', // Dark green text
          },
        })
        this.user_name = ''
        this.email = ''
        this.password = ''
        this.confirmPassword = ''
        this.errorMessage = ''
        this.$router.push('/login')
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'An error occurred'
      }
    },
  },
}
</script>

<style scoped>
.register-container {
  font-family: Arial, sans-serif;
  max-width: 420px;
  margin: 30px auto;
  padding: 10px 30px;
  border-radius: 8px;
  border-top: 5px solid #45a049;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  text-align: center;
}

.register-container h2 {
  font-family: Arial, sans-serif;
  margin-bottom: 20px;
  color: #333;
  font-weight: bold;
}

.register-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 14px;
  color: #000;
}

.form-group input {
  width: 100%;
  padding: 7px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-weight: bold;
  font-size: 16px;
}
.login-link {
  margin-top: 0.6rem;
  color: #000;
}

/* password Icon Styles */
.password-group {
  position: relative;
}

.toggle-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  /* transform: translateY(-50%); */
  cursor: pointer;
  font-size: 1.2rem;
  color: #666;
  transition: color 0.3s ease;
}

.toggle-icon:hover {
  color: #000;
}

.submit-button {
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #45a049;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}
input:focus {
  border-color: #45a049;
  outline: none;
}

.error {
  color: #ff0000;
  /* margin-top: 10px; */
  /* font-size: 14px; */
}
</style>
