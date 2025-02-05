<template>
  <div :class="{ dark: isDarkMode }">
    <!-- Loading Animation -->

    <!-- Welcome Message -->
    <div class="welcome-message">
      <p v-if="username">Hello😊 {{ username }}</p>
    </div>
    <!-- Navbar with Logout Button-->

    <!-- Search Bar -->
    <div class="search-container">
      <!-- <input type="text" @input="search" placeholder="Search tasks..." class="search-input" /> -->
      <div class="search-bar">
        <i class="fas fa-search search-icon"></i>
        <input
          type="text"
          v-model="searchTerm"
          @input="applyFilters"
          placeholder="Search tasks..."
          class="search-input"
        />
      </div>

      <b-dropdown
        id="dropdown-status"
        v-model="filterStatus"
        @change="applyFilters"
        text="Choose Status"
        class="m-md-2"
      >
        <b-dropdown-item>Open</b-dropdown-item>
        <b-dropdown-item>InProgess</b-dropdown-item>
        <b-dropdown-item>Finished</b-dropdown-item>
      </b-dropdown>

      <b-dropdown
        id="dropdown-priority"
        v-model="filterPriority"
        @change="applyFilters"
        text="Choose Prority"
        class="m-md-2"
      >
        <b-dropdown-item>Highest</b-dropdown-item>
        <b-dropdown-item>High</b-dropdown-item>
        <b-dropdown-item>Medium</b-dropdown-item>
        <b-dropdown-item>Low</b-dropdown-item>
      </b-dropdown>

      <div class="button">
        <button class="create-btn" @click="showCreateForm = !showCreateForm">
          <i class="fas fa-plus"></i> Add Task
        </button>
        <!-- Import Button -->
        <button class="create-btn" @click="triggerFileUpload">
          <i class="fas fa-upload"></i> Import
        </button>
        <!-- Hidden file input triggered by button -->
        <input type="file" ref="fileInput" style="display: none" @change="handleImportTask" />
        <button class="create-btn" @click="exportTasksToCSV">
          <i class="fas fa-download"></i>
          Export
        </button>
        <button class="create-btn" @click="exportTasksToPDF">
          <i class="fas fa-file-pdf"></i>
        </button>
        <div v-if="pdfDownloaded" class="notification-popup">
          {{ notificationMessage }}
        </div>

        <div class="navbar">
          <button @click="toggleDarkMode" class="toggle-bcutton">
            <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </button>
          <button class="logout-btn" @click="logout">
            <i class="fa fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Create Task Button -->

    <!-- Create Task Form (Visible when showCreateForm is true) -->
    <transition name="fade-slide">
      <TaskForm
        v-if="showCreateForm"
        :user_id="userId"
        @task-created="addTaskToTable"
        :items="tasks"
      />
    </transition>
    <!-- Import Task Section -->

    <!-- Import Form (Visible when showImportForm is true) -->
    <transition name="fade-slide">
      <div v-if="showImportForm" class="import-form">
        <h3>Import Task</h3>

        <!-- Download Sample File Button -->
        <button class="download-file-btn">
          <i class="fas fa-download"></i> Download Sample File
        </button>

        <!-- Upload File Button -->
        <div class="upload-file-container">
          <input
            type="file"
            id="upload-file"
            class="upload-file-input"
            @change="handleFileUpload"
          />
          <label for="upload-file" class="upload-file-btn">
            <i class="fas fa-upload"></i> Upload File
          </label>
        </div>

        <div class="form-buttons">
          <button @click="submitImport" class="submit-btn">Submit</button>
          <button @click="cancelImport" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </transition>

    <!-- Task List -->
    <div>
      <TaskList :tasks="filteredTasks" @edit-task="editTask" @delete-task="deleteTask" />
    </div>
  </div>
</template>

<script>
import TaskForm from '@/components/TaskForm.vue' // Import the TaskForm component
import TaskList from '@/components/TaskList.vue' // Import the TaskForm component
import axios from 'axios'
import 'jspdf-autotable'
import jsPDF from 'jspdf'

export default {
  components: {
    TaskForm, // Register TaskForm as a local component
    TaskList,
  },
  data() {
    return {
      showCreateForm: false,
      showImportForm: false,
      isDarkMode: false,
      searchTerm: '', // Add this line
      filterStatus: '', // Selected status for filtering
      filterPriority: '', // Selected priority for filtering
      filteredTasks: [], // Tasks filtered by search and dropdowns
      taskName: '',
      description: '',
      priority: '',
      status: '',
      startDate: '',
      endDate: '',
      file: null,
      notificationMessage: '',
      pdfDownloaded: false, // Track if the PDF is downloaded
      username: null, // To hold the username
      userId: null, // Set as null initially, will be loaded from localStorage
      tasks: [], // List of tasks fetched from the backend
    }
  },

  mounted() {
    // Retrieve username and user_id from localStorage when the component mounts

    this.username = localStorage.getItem('username')
    this.userId = localStorage.getItem('user_id')
    console.log('Username:', this.username)
    this.fetchTasks()
    this.isDarkMode = JSON.parse(localStorage.getItem('isDarkMode')) || false
  },

  methods: {
    applyFilters() {
      this.filteredTasks = this.tasks.filter((task) => {
        const matchesSearch = task.task_name.toLowerCase().includes(this.searchTerm.toLowerCase())
        //const matchesStatus = this.filterStatus ? task.status === this.filterStatus : true
        //const matchesPriority = this.filterPriority ? task.priority === this.filterPriority : true
        const matchesStatus = this.filterStatus === '' || task.status === this.filterStatus
        const matchesPriority = this.filterPriority === '' || task.priority === this.filterPriority
        return matchesSearch && matchesStatus && matchesPriority
      })
    },
    watch: {
      // Automatically apply filters when searchTerm, filterStatus, or filterPriority changes
      searchTerm: 'applyFilters',
      filterStatus: 'applyFilters',
      filterPriority: 'applyFilters',
    },
    async createTask() {
      // Handle task creation logic (e.g., send data to the backend)
      console.log('Task created:', {
        taskName: this.taskName,
        description: this.description,
        startDate: this.startDate,
        endDate: this.endDate,
      })
      // Reset form
      this.showCreateForm = false
      this.taskName = ''
      this.description = ''
      this.startDate = ''
      this.endDate = ''
    },

    cancelCreate() {
      // Reset form and close the task creation form
      this.showCreateForm = false
      this.taskName = ''
      this.description = ''
      this.startDate = ''
      this.endDate = ''
    },

    // Handle file upload
    handleFileUpload(event) {
      this.file = event.target.files[0]
      console.log('File uploaded:', this.file)
    },

    // Method to export tasks to PDF
    exportTasksToPDF() {
      // Check if tasks array has data
      if (!this.tasks || this.tasks.length === 0) {
        alert('No tasks available to export.')
        this.showNotification('No tasks available to export.')
        return
      }

      // Initialize jsPDF
      const doc = new jsPDF('landscape')
      doc.setFontSize(22)
      doc.setTextColor(40)
      doc.text('Task List', 105, 20, null, null, 'center')

      // Table headers
      const headers = [
        'Task ID',
        'Task Name',
        'Description',
        'Priority',
        'Status',
        'Start Date',
        'End Date',
      ]

      // Task data
      const data = this.tasks.map((task) => [
        task.task_id,
        task.task_name,
        task.description,
        task.priority,
        task.status,
        task.start_date,
        task.end_date,
      ])

      // Add table to PDF
      doc.autoTable({
        head: [headers],
        body: data,
      })

      // Save the PDF with a filename
      doc.save(`tasks_${new Date().toISOString().slice(0, 10)}.pdf`)
      this.showNotification('PDF downloaded successfully!')
    },
    showNotification(message) {
      this.notificationMessage = message
      this.pdfDownloaded = true
      setTimeout(() => {
        this.pdfDownloaded = false // Hide after 3 seconds
      }, 3000)
    },
    // method to export tasks to pdf

    submitImport() {
      if (this.file) {
        console.log('File submitted:', this.file)
        // Handle the file upload logic (send it to backend or process here)
        this.showImportForm = false
      } else {
        alert('Please upload a file before submitting.')
      }
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
      localStorage.setItem('isDarkMode', JSON.stringify(this.isDarkMode))
    },

    cancelImport() {
      // Reset file and hide the import form
      this.file = null
      this.showImportForm = false
    },
    async fetchTasks() {
      try {
        const user_id = localStorage.getItem('user_id')
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/task?user_id=${user_id}`)
        // Check if response contains data
        console.log('Response from API:', response)
        if (this.searchTerm) {
          this.search() // Filter tasks based on the search term after fetching
        }
        if (response.data && Array.isArray(response.data)) {
          this.tasks = response.data
          this.filteredTasks = [...this.tasks] // Initialize filteredTasks
          console.log('Tasks successfully fetched and assigned:', this.tasks)
        } else {
          console.warn('Unexpected data format or no tasks found in response:', response.data)
        }
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    },
    addTaskToTable(task) {
      // Add the new task to the tasks array
      this.tasks.push(task)
      this.showCreateForm = false // Hide the create task form
    },

    async handleImportTask(event) {
      this.file = event.target.files[0] // Assign the file directly
      if (this.file) {
        const fileType = this.file.type

        try {
          if (fileType === 'application/json') {
            // JSON import
            const tasks = await this.parseJSONFile(this.file)
            this.tasks.push(...tasks)
          } else if (fileType === 'text/csv') {
            // CSV import
            const tasks = await this.parseCSVFile(this.file)
            // Send parsed tasks to backend
            const response = await axios.post(`${process.env.VUE_APP_API_URL}/task/bulk_add`, {
              user_id: this.userId,
              tasks: tasks,
            })

            // Check if tasks were successfully added
            if (response.data) {
              this.fetchTasks() // Refresh the task list after bulk create
              window.location.reload()
              // this.tasks.push(...response.data) // Append new tasks to the tasks array
              console.log('Tasks successfully added in bulk:', response.data)
            } else {
              console.warn('Unexpected response from bulk add:', response.data)
            }

            // this.tasks.push(...tasks)
          } else {
            alert('Unsupported file format. Please upload a JSON or CSV file.')
          }

          // Clear the import form and file after upload
          this.showImportForm = false
          this.file = null
        } catch (error) {
          console.error('Error importing tasks:', error)
          alert('Error importing tasks. Please check the file format.')
        }
      } else {
        alert('Please upload a file before submitting11.')
      }
    },
    async parseJSONFile(file) {
      const text = await file.text()
      const data = JSON.parse(text)

      // Ensure each item matches task structure
      return data.map((task) => ({
        task_id: task.task_id,
        task_name: task.task_name,
        description: task.description,
        priority: task.priority,
        status: task.status,
        start_date: task.start_date,
        end_date: task.end_date,
      }))
    },

    async parseCSVFile(file) {
      const text = await file.text()
      const rows = text.trim().split('\n')
      const headers = rows[0].split(',')

      // Map CSV rows to task objects
      return rows.slice(1).map((row) => {
        const values = row.split(',')
        const task = {}
        headers.forEach((header, index) => {
          task[header.trim().toLowerCase().replace(' ', '_')] = values[index].trim()
        })
        return {
          task_id: task.task_id,
          task_name: task.task_name,
          description: task.description,
          priority: task.priority,
          status: task.status,
          start_date: task.start_date,
          end_date: task.end_date,
        }
      })
    },

    // Method to export tasks to CSV
    async exportTasksToCSV() {
      const userId = localStorage.getItem('user_id')
      const response = await axios.get(`${process.env.VUE_APP_API_URL}/task?user_id=${userId}`)
      // Check if response contains data
      console.log('Response from API:', response.data)
      this.tasks = response.data
      // Check if tasks array has data
      if (!this.tasks || this.tasks.length === 0) {
        alert('No tasks available to export.')
        return
      }

      // Define CSV headers and rows
      const headers = [
        'Task ID',
        'Task Name',
        'Description',
        'Priority',
        'Status',
        'Start Date',
        'End Date',
      ]
      const rows = this.tasks.map((task) => [
        task.task_id,
        task.task_name,
        task.description,
        task.priority,
        task.status,
        task.start_date,
        task.end_date,
      ])

      // Generate CSV content
      const csvContent = [
        headers.join(','), // add headers row
        ...rows.map((row) => row.join(',')), // add each task as a row
      ].join('\n')

      // Create a blob and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `tasks_${new Date().toISOString().slice(0, 10)}.csv`
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    triggerFileUpload() {
      this.$refs.fileInput.click()
    },

    logout() {
      // Clear authentication data (e.g., remove token from localStorage)
      localStorage.removeItem('authToken') // Adjust depending on how you're storing the token
      localStorage.removeItem('username')
      localStorage.removeItem('user_id')
      // Redirect to login page (assuming you're using Vue Router)
      this.$router.push('/login') // Ensure that you have a login route defined in Vue Router
    },
  },
}
</script>

<style scoped>
/* Navbar styles */

/* Search Bar styles */
.search-container {
  /* background-color:rgb(59 130 246 / 0.5); */
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding-bottom: 10px;
  z-index: 999;
  margin-bottom: 50px;
  /* margin-top: 70px; */
  border-bottom: 1px solid #f1f1f1;
}
/* rgb(59 130 246 / 0.5); */

.search-input {
  padding: 4px;
  width: 60%;
  cursor: pointer;
  max-width: 300px;
  /* outline: none; */
  border-radius: 5px;
  border-bottom: 5px solid black;
  font-size: 1em;
}

/* Create Task Button styles */
.create-btn {
  display: block;
  background-color: #f1f1f1;
  font-weight: bold;
  color: black;
  padding: 7px 10px;
  border: none;
  border-radius: 99px;
  margin-left: 0.1;
  cursor: pointer;
}
.notification-popup {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4caf50;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation:
    fadein 0.5s,
    fadeout 0.5s 2.5s;
  z-index: 1000;
}

/* Fade-in and fade-out animations */
@keyframes fadein {
  from {
    opacity: 0;
    top: 0;
  }
  to {
    opacity: 1;
    top: 20px;
  }
}

@keyframes fadeout {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.create-btn:hover {
  background-color: #f1f1f1;
}

/* Import Task Section */
.import-btn {
  background-color: #ff6347;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  /* margin-top: 20px; */
  cursor: pointer;
}

.import-btn:hover {
  background-color: #ff4500;
}
.dark {
  background-color: #333;
  color: #fff;
}

.toggle-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: inherit;
  margin-right: 15px; /* Add space between dark mode and logout buttons */
}

.toggle-button:focus {
  outline: none;
}

.import-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* margin-top: 20px; */
  border: 1px solid #ddd;
  max-width: 500px;
  margin: 50px auto;
}

.import-form h3 {
  text-align: center;
  color: #333;
}

/* Download & Upload buttons */
.download-file-btn,
.upload-file-btn {
  display: flex;
  gap: 2rem;
  font-weight: bold;
  /* background-color: #4facfe; */
  border: 1px solid #ddd !important;
  color: rgb(22, 22, 22);
  padding: 10px 15px;
  border: none;

  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 15px;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.fade-slide-enter,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.download-file-btn {
  width: 100%;
}
.download-file-btn i,
.upload-file-btn i {
  margin-right: 2px;
}

.upload-file-container {
  position: relative;
  margin-bottom: 25px;
}
.download-file-input {
  width: 100%;
}
.upload-file-input {
  display: none;
}
.button {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.submit-btn,
.cancel-btn {
  padding: 10px 20px;
  border: none;
  margin-left: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.submit-btn {
  background-color: #4facfe;
  color: white;
}

.submit-btn:hover {
  background-color: #00f2fe;
}

.cancel-btn {
  background-color: #ccc;
  color: white;
}

.cancel-btn:hover {
  background-color: #aaa;
}

.task-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 20px auto;
}

.task-form h3 {
  text-align: center;
  font-size: 1.8em;
  color: #333;
  margin-bottom: 20px;
}

/* Input Group */
.input-group {
  margin-bottom: 15px;
  text-align: left;
}
.date-flex {
  display: flex;
  justify-content: flex-start;
  gap: 2rem;
  align-items: center;
}
.input-group label {
  display: block;
  font-size: 0.9em;
  font-weight: bold;
  color: #555;
  margin-bottom: 5px;
}

.input-group input[type='text'],
.input-group textarea,
.input-group input[type='date'] {
  width: 40%;
  padding: 12px;

  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  transition: border-color 0.3s;
}

.input-group input:focus,
.input-group textarea:focus,
.input-group input[type='date']:focus {
  border-color: #4facfe;
  outline: none;
}

/* Textarea Styling */
.input-group textarea {
  resize: vertical;
  min-height: 50px;
}

/* Form Buttons */
.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.save-btn,
.cancel-btn {
  flex: 1;
  padding: 10px;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 0 5px;
}

/* Save Button */
.save-btn {
  background-color: #4facfe;
  color: white;
}

.save-btn:hover {
  background-color: #00f2fe;
}

/* Cancel Button */
.cancel-btn {
  background-color: #ccc;
  color: white;
}

.cancel-btn:hover {
  background-color: #aaa;
}

/* Logout Button */
.navbar {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}

.logout-btn {
  padding: 8px 16px;
  /* background-color: #e9e9e9; */
  color: red;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #ccc;
}
input[type='search'] {
  cursor: pointer;
}
.welcome-message {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;

  color: #557c55; /* Custom green color */
}
.search-bar {
  display: flex;
  align-items: center;
  /* padding-right: 20px; */
  border-radius: 5px;
  /* padding: 2px; */
  /* width: 70%; */
  /* max-width: 300px; */
  border-bottom: 3px solid black;
  background-color: #e9e9e9;
}

.search-icon {
  color: #171515;
  margin-right: 8px;
  padding-left: 2px;
  font-weight: bold;
}

.search-input {
  border: none;
  outline: none;

  background-color: #e9e9e9;
  font-size: 1rem;
}

.search-input::placeholder {
  color: #aaa;
}

/* Hover and focus effects */
</style>
