<template>
  <div class="container">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="navbar-left">
        <h1>TodoApp</h1>
      </div>
      <div class="navbar-right">
        <button @click="goToLogin" class="login-btn">Login</button>
        <button @click="goToRegister" class="btn register">Register</button>
      </div>
    </nav>

    <!-- Main Section -->
    <section class="main-section">
      <div class="image-container">
        <!-- SVG Image for TodoApp -->
        <img src="../assets/images/imageTodo.png" alt="Todo App" height="250" />
      </div>
      <div class="text-content">
        <h2>Welcome to<span class="mainText">TodoApp</span></h2>
        <p>TodoApp helps you keep track of your tasks and Goals. Organize your day with ease!</p>
        <button @click="goToRegister" class="btn">Click Here To Register YourSelf</button>
      </div>
    </section>
  </div>

  <div class="features-section">
    <section class="main-section">
      <div class="text-content">
        <button class="action-button"><i class="fa fa-plus"></i></button>
        <h6 style="font-weight: bold"><span class="mainText">Create </span>Task</h6>
        <p>TodoApp helps you keep track of your tasks and Goals. Organize your day with ease!</p>
      </div>

      <!-- SVG Image for TodoApp -->
      <!-- <img src="../assets/images/create.svg" alt="Todo App" /> -->
    </section>
    <section class="main-section">
      <div class="text-content">
        <button class="action-button"><i class="fa fa-edit"></i></button>
        <h6 style="font-weight: bold"><span class="mainText">Edit </span>Your Task</h6>
        <p>TodoApp helps you keep track of your tasks and Goals. Organize your day with ease!</p>
      </div>

      <!-- SVG Image for TodoApp -->
    </section>
    <section class="main-section">
      <div class="text-content">
        <button class="action-button"><i class="fa fa-trash"></i></button>
        <h6 style="font-weight: bold"><span class="mainText">Delete </span>Your Task</h6>
        <p>TodoApp helps you keep track of your tasks and Goals. Organize your day with ease!</p>
      </div>

      <!-- SVG Image for TodoApp -->
    </section>
  </div>

  <div class="export-import-section">
    <section class="main-section export-import-function-layout">
      <div class="text-content">
        <span class="number">1</span>
        <h3>Import <span class="mainText">Functionality</span></h3>
        <p>
          The Import Functionality allows users to upload and integrate external data into the
          application seamlessly. This feature enables importing files, such as CSV, JSON, or Excel,
          to quickly populate or update records without manual data entry
        </p>
      </div>
      <div class="image-container">
        <!-- SVG Image for TodoApp -->
        <img src="../assets/images/download_10826773.gif" alt="Todo App" height="100" />
      </div>
    </section>
    <section class="main-section export-import-function-layout">
      <img src="../assets/images/boxing_15309743.gif" alt="Todo App" height="100" />

      <div class="text-content">
        <span class="number-right">2</span>
        <h3>Export<span class="mainText"> Functionality</span></h3>

        <p>
          The Export Functionality enables users to download and extract data from the application
          in a structured format, such as CSV, JSON, or Excel. This feature allows users to generate
          reports, share information, or back up data efficiently.
        </p>
      </div>
    </section>
    <section class="main-section export-import-function-layout">
      <div class="text-content">
        <span class="number">3</span>
        <h3>PDF<span class="mainText"> Functionality</span></h3>
        <p>
          he PDF Export Functionality allows users to generate and download content in a
          professional and portable PDF format. This feature is ideal for creating reports,
          invoices, summaries, or documentation.
        </p>
      </div>
      <div class="image-container">
        <!-- SVG Image for TodoApp -->
        <img src="../assets/images/pdf-file.gif" alt="Todo App" height="100" />
      </div>
    </section>
    <footer>
      <ul>
        <li>
          <a href="https://github.com/ramesh043" target="_blank"
            ><i class="fab fa-github fa-2x" style="color: #2ec866"></i
          ></a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/rameshjangam/" target="_blank"
            ><i class="fab fa-linkedin fa-2x" style="color: #2ec866"></i
          ></a>
        </li>
        <li>
          <a href="https://www.hackerrank.com/dashboard" target="_blank">
            <i class="fab fa-hackerrank fa-2x" style="color: #2ec866"></i
          ></a>
        </li>
        <li>
          <a href="https://leetcode.com/u/rummy0003/" target="_blank">
            <i class="fas fa-code fa-2x" style="color: #2ec866"></i
          ></a>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script>
export default {
  methods: {
    goToLogin() {
      this.$router.push('/login') // Adjust the route to your login page
    },
    goToRegister() {
      this.$router.push('/register') // Adjust the route to your register page
    },
  },
}
</script>

<style scoped>
.container {
  font-family: Arial, sans-serif;

  height: 70vh;
}
.features-section .main-section {
  border: 1px solid #f1f1f1;

  margin-left: 4px;
  border-radius: 9px;
}
.features-section > .main-section {
  border-top-left-radius: black;
}
.export-import-function-layout {
  height: 30vh;
  margin: 0 auto;
  /* padding-bottom: 80px; */
  border-radius: 99px;
  display: flex;
  /* padding: 40px; */
  justify-content: space-evenly;
  gap: 5rem;
  position: relative;
  max-width: 900px;
}
.text-content .number {
  position: absolute;

  top: -30px;
  font-size: 22px;
  background-color: #cdecd4;
  padding: 14px;
  clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%);

  font-weight: bold;
  left: 200px;
  width: 6%;
  z-index: -1;
  color: #25ad2b;
  border-radius: 50%;
}
.export-import-section {
  height: 80vh;
  /* border: 1px solid #c3e6cb; */
}
.text-content .number-right {
  position: absolute;
  top: -19px;
  font-size: 22px;
  clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%);

  background-color: #d4edda;
  padding: 14px;
  font-weight: bold;
  right: 435px;
  width: 6%;
  z-index: -1;
  color: #25ad2b;
  border-radius: 50%;
}
footer {
  border-top: 1px solid #f1f1ff;
  max-width: 1100px;
  /* margin: 10px auto; */
  /* height: 70vh; */
  margin-top: 120px;
  padding: 1rem 0 0.2rem 0;
  /* background-color: #45a049; */
}
ul {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
img {
  object-fit: cover;
  max-width: 100%;
  display: block;
}
.navbar {
  display: flex;
  width: 100%;
  height: 60px;
  padding: 0.5rem 3rem;
  position: fixed;
  z-index: 1;
  margin: 0;
  top: 0;
  left: 0;
  justify-content: space-between;
  align-items: center;
  /* border-bottom: 0.5px solid #d4edda; */
  background-color: #fff;
}
li {
  list-style-type: none;
}
a {
  text-decoration: none;
  display: block;
}
.navbar-left h1 {
  /* margin: 0; */
  color: #4caf50;
  font-weight: bolder;
}
h3 {
  font-weight: bold;
  font-size: 18px;
}
.features-section {
  display: flex;
  max-width: 1300px;
  /* background-color: #d4edda; */
  margin: 0px auto;
  height: 40vh;
  justify-content: space-evenly;
  align-items: center;
  padding: 1rem 2rem 6rem 2rem;
  /* border: 1px solid #c3e6cb; */
}

.navbar-right .register {
  margin-left: 20px;
  padding: 0.3rem 1rem;
  font-size: 16px;
  background-color: #45a049;
  /* border: 1px solid #acacac; */
  color: #fff;
  /* box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.15); */
  cursor: pointer;
  /* color: #d9d9d9; */
  font-weight: bold;
  border-radius: 4px;
}
.register:hover {
  background-color: #f9f9f9;
  border: 1px solid #4caf50;
  color: #45a049;
}

.main-section {
  display: flex;
  justify-content: center;
  align-items: center;
  /* max-width: 1200; */
  margin-top: 80px;
  padding: 0 20px;
}
@media (max-width: 576px) {
  .main-section {
    flex-direction: column;
    align-items: center;
  }
  img {
    /* max-width: 80px; */
    height: 100px;
    object-fit: cover;
  }
}
.image-container {
  width: 50%;
}
.login-btn {
  margin-left: 10px;
  padding: 0.3rem 1rem;
  font-size: 16px;
  transition: all 0.1s ease-in;
  background-color: #fff;
  border: 1px solid #45a049;
  cursor: pointer;
  color: #45a049;
  font-weight: bold;
  border-radius: 4px;
}
.login-btn:hover {
  background-color: #45a049;
  color: white;
}
.text-content {
  /* width: 55%; */
  padding: 20px;
}

.text-content h2 {
  font-size: 2rem;
  font-weight: bold;
  /* margin-bottom: 1rem; */
}

.text-content p {
  font-size: 0.9rem;
  color: grey;
  /* margin-bottom: 1.5rem; */
}
.action-button {
  background-color: #d4edda; /* Light green background */
  border: none;
  color: #45a049; /* Green color for text and icon */
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  /* display: flex;
  align-items: center; */
  margin-bottom: 10px;
  gap: 8px; /* Space between icon and text */
  transition: background-color 0.3s ease;
}

.action-button:hover {
  background-color: #c3e6cb; /* Slightly darker green */
}

/* Icon Styling */
.action-button i {
  color: #45a049;
}
.text-content .btn {
  /* padding: 0.5rem 1rem; */
  font-size: 16px;
  background-color: #45a049;
  color: #fff;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
}
.mainText {
  color: #45a049;
  text-transform: capitalize;
}
.register {
  background-color: #4caf50;
}
</style>
