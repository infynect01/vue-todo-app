<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="title">Login</h2>
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="user_name">Email</label>
          <input v-model="email" id="email" type="email" placeholder="Enter your email" required />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input
            v-model="password"
            id="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" class="login-btn">Login</button>
        <div class="register-link">
          <p>
            Don't have an account?
            <router-link to="/register">Register</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useToast } from 'vue-toastification' // Import toast hook
export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    async login() {
      const toast = useToast() // Get the toast function
      try {
        const apiUrl = process.env.VUE_APP_API_URL
        const response = await axios.post(`${apiUrl}/auth/login`, {
          email: this.email,
          password: this.password,
        })
        // Assume the token is in response.data.token (or adjust based on your API)
        const token = response.data.token
        const username = response.data.user_name

        // Store the token in localStorage
        localStorage.setItem('authToken', token)
        localStorage.setItem('username', username)

        // Now, get the user_id by username
        const userIdResponse = await axios.post(
          `${apiUrl}/users/findUserId`,
          { user_name: response.data.user_name },
          { headers: { Authorization: `Bearer ${token}` } }, // Pass token for authorization if required
        )

        const { user_id } = userIdResponse.data

        // Store the user_id in localStorage
        localStorage.setItem('user_id', user_id)
        toast.success('Login successful!', {
          icon: '✅', // Emoji or custom icon
          style: {
            backgroundColor: '#d4edda', // Light green background
            color: '#155724', // Dark green text
          },
        })

        this.$router.push('/homepage') // Redirect to a dashboard or home after login
      } catch (error) {
        console.error(error.response?.data?.message || 'Login failed')
        toast.error('Login failed. Please try again.', {
          icon: '❌', // Error icon
          style: {
            backgroundColor: '#f8d7da', // Red background for error
            color: '#721c24', // Dark red text
          },
        })
      }
    },
  },
}
</script>

<style scoped>
/* Container for the login form */
h2 {
  font-weight: bold;
}
.login-container {
  /* margin: 0; */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  background: #f5f5f4;
  padding: 0 20px;
}

.login-card {
  background: white;
  border-top: 5px solid #45a049;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

/* Title style */
.title {
  font-size: 2em;
  margin-bottom: 20px;
  color: #333;
}

/* Input fields styling */
.input-group {
  margin-bottom: 15px;
  text-align: left;
}

.input-group label {
  font-size: 0.9em;
  font-weight: bold;
  color: #555;
}

.input-group input {
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
}

.input-group input:focus {
  border-color: #45a049;
  outline: none;
}

/* Submit button styling */
.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #45a049;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
}

/* Register link style */
.register-link {
  margin-top: 15px;
}

.register-link p {
  font-size: 0.9em;
  color: #555;
}

.register-link a {
  color: #45a049;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
