<template>
  <h3>Task List Details</h3>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>S.No</th>
          <th>Task Name</th>

          <th>Priority</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Status</th>
          <th><i class="fas fa-cog"></i></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="tasks.length === 0" class="create-here">
          <td colspan="3">
            <p>No Tasks are available, Please Add Tasks Your Self.</p>
          </td>
        </tr>
        <tr v-for="(task, index) in tasks" :key="task.task_id">
          <td>{{ index + 1 }}</td>
          <td>{{ task.task_name }}</td>
          <td>
            <b-badge :variant="getPriorityBadgeVariant(task.priority)">
              {{ task.priority }}
            </b-badge>
          </td>
          <td>{{ formatDate(task.start_date) }}</td>
          <td>{{ formatDate(task.end_date) }}</td>
          <td>
            <b-badge :variant="getBadgeVariant(task.status)">{{ task.status }}</b-badge>
          </td>
          <td>
            <button @click="openEditTaskModal(task.task_id)" class="icon-button create-btn">
              <i class="fa fa-edit"></i>
            </button>
            <button @click="openDeleteModal(task.task_id)" class="icon-button delete">
              <i class="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteModal" class="modal">
    <div class="modal-content">
      <h3>Are you sure you want to delete this task?</h3>
      <div class="modal-buttons">
        <button @click="confirmDelete" class="confirm-button">Delete</button>
        <button @click="closeDeleteModal" class="cancel-button">Cancel</button>
      </div>
    </div>
  </div>
  <!-- Task Edit Mode -->
  <div v-if="showEditModal" class="modal">
    <div class="modal-content">
      <h3>Update Task</h3>
      <form @submit.prevent="updateTask">
        <!-- Task Name -->
        <div class="form-group">
          <label for="task_name">Task Name:</label>
          <input
            type="text"
            id="task_name"
            v-model="task.task_name"
            class="form-control"
            required
          />
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea
            id="description"
            v-model="task.description"
            class="form-control"
            rows="3"
            required
          ></textarea>
        </div>

        <!-- Priority and Status Dropdowns -->

        <div class="form-drop-down">
          <div class="form-group">
            <label for="priority">Priority:</label>
            <select id="priority" v-model="task.priority" class="form-control" required>
              <option value="HIGHEST">Highest</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div class="form-group">
            <label for="status">Status:</label>
            <select id="status" v-model="task.status" class="form-control" required>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        <!-- Start and End Dates -->
        <div class="form-group-date">
          <div class="form-group">
            <label for="start_date">Start Date:</label>
            <input
              type="date"
              id="start_date"
              v-model="task.start_date"
              class="form-control"
              required
            />
          </div>

          <div class="form-group">
            <label for="end_date">End Date:</label>
            <input
              type="date"
              id="end_date"
              v-model="task.end_date"
              class="form-control"
              required
            />
          </div>
        </div>
        <div class="sbt-btn">
          <button type="submit" class="btn btn-primary">Update Task</button>
          <button type="button" class="btn btn-secondary" @click="closeEditTaskModal">
            Cancel
          </button>
        </div>
        <!-- Buttons -->
      </form>
    </div>
  </div>

  <!-- Task Edit Model -->
</template>

<script>
import axios from 'axios'

export default {
  props: {
    tasks: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // tasks: [],
      showEditModal: false,
      showDeleteModal: false,
      selectedTaskId: null,
      task: {
        task_id: '',
        task_name: '',
        description: '',
        priority: '',
        status: '',
        start_date: '',
        end_date: '',
        loading: false,
      },
      showDeleteModal: false,
      selectedTaskId: null,
      editing: false, // Track if editing mode is active
    }
  },
  mounted() {
    this.fetchTasks()
  },

  methods: {
    getPriorityBadgeVariant(priority) {
      switch (priority) {
        case 'HIGHEST':
          return 'danger' // Red for highest priority
        case 'HIGH':
          return 'warning' // Yellow for high priority
        case 'MEDIUM':
          return 'info' // Light blue for medium priority
        case 'LOW':
          return 'secondary' // Gray for low priority
        default:
          return 'light' // Default color if priority is unknown
      }
    },
    getBadgeVariant(status) {
      switch (status) {
        case 'OPEN':
          return 'primary' // Light blue for 'Open'
        case 'IN_PROGRESS':
          return 'secondary' // Gray for 'In Progress'
        case 'COMPLETED':
          return 'success' // Green for 'Completed'
        default:
          return 'light' // Default color if status is unknown
      }
    },
    openEditTaskModal(task_id) {
      this.showEditModal = true
      this.selectedTaskId = task_id

      this.loadTaskDetails(task_id)
    },
    async loadTaskDetails(task_id) {
      try {
        // Make the API call to get the task details
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/task/${task_id}`)
        if (response.data) {
          this.task = { ...response.data } // Assign fetched data to `task` object
          this.showEditModal = true // Show the modal after data is fetched
        } else {
          console.error('No data received for the task')
        }
      } catch (error) {
        console.error('Error fetching task details:', error)
      }
    },
    closeEditTaskModal() {
      this.showEditModal = false
    },

    async addTask(newTask) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/task`, newTask)
        this.tasks.push(response.data.task) // Add the new task to the array

        // Optionally clear the form or close a modal here if you’re using one
      } catch (error) {
        console.error('Error adding task:', error)
      }
    },
    // Update the task in tasks array after a successful update
    async updateTask() {
      try {
        const response = await axios.put(
          `${process.env.VUE_APP_API_URL}/task/${this.selectedTaskId}`,
          this.task,
        )
        window.location.reload()
        const updatedTask = response.data

        const index = this.tasks.findIndex((t) => t.task_id === updatedTask.task_id)
        if (index !== -1) {
          this.tasks.splice(index, 1, updatedTask) // Replace the old task with the updated one
        }
        this.showEditModal = false // Close the edit modal
      } catch (error) {
        console.error('Error updating task:', error)
      }
    },

    async fetchTasks() {
      try {
        const user_id = localStorage.getItem('user_id')
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/task?user_id=${user_id}`)

        console.log('responsess::', response)
        this.tasks = response.data
      } catch (error) {
        console.error('Error fetching tasks:', error)
      } finally {
        this.loading = false // Set loading to false after the request is done
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    },
    editTask(taskId) {
      console.log(`Edit task with ID: ${taskId}`)
    },
    openDeleteModal(taskId) {
      this.selectedTaskId = taskId
      this.showDeleteModal = true
    },
    closeDeleteModal() {
      this.showDeleteModal = false
      this.selectedTaskId = null
    },
    async confirmDelete() {
      try {
        const response = await axios.delete(
          `${process.env.VUE_APP_API_URL}/task/${this.selectedTaskId}`,
        )
        if (response.status === 200) {
          this.fetchTasks() // Refresh task list
          window.location.reload()
        } else {
          alert('Failed to delete task.')
        }
      } catch (error) {
        console.error('Error deleting task:', error)
      } finally {
        this.closeDeleteModal()
      }
    },
  },
}
</script>

<style scoped>
.form-group-date {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}
.form-group {
  flex: 1;
}
tr:nth-child(even) {
  background-color: #e9e9e9;
}
tr:hover {
  background-color: #eee;
}
.form-drop-down {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
}
.form-group {
  flex: 1;

  margin-bottom: 10px;
}
/* Add these styles to your global CSS or scoped CSS */

table {
  margin: 0 auto;
  width: 100%;
  border-collapse: collapse;
  border: none;
  border-left: 5px solid #45a049;
  box-shadow: rgba(90, 90, 70, 0.1) 0px 3px 4px 0px;
}
tbody p {
  height: 40vh;
  text-align: center;
  /* background-color: #e9e9e9; */

  color: gray;
}

thead {
  position: sticky;
  top: 0;
  background-color: #f5f5f5;
  z-index: 1;
  /* Ensures header stays visible while scrolling */
}
i {
  font-size: 18px;
}

th,
td {
  /* border: 1px solid #ddd; */
  font-size: 12px;
  padding: 10px 15px;
  font-weight: bold;
  text-align: center;

  border-bottom: 1px solid #eee;
}
.modal-content h3 {
  font-weight: bold;
  text-align: left;
  padding-bottom: 5px;
  /* color: #45a049; */
  text-align: center;
  border-bottom: 1px solid whitesmoke;
}
textarea {
  outline: none;
  resize: none;
  height: 3rem;
}
label {
  text-align: left !important;
  font-size: 13px;
  font-weight: bold;
}
.sbt-btn {
  display: flex;
  justify-content: space-around;
}
h3 {
  font-size: 22px;
  font-weight: bold;
  color: #000;
  margin-top: 5px;
}
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.table-container {
  max-width: 1100px;
  margin: 0 auto;
  max-height: 280px; /* Adjust the height as needed */
  overflow-y: auto;
  display: block; /* Makes the container block-level */
  scroll-behavior: smooth;
}

th {
  font-weight: bold;
  font-size: 16px;
}

.icon-button {
  background: #f1f1f1;
  border: none;
  border-radius: 4px;
  color: black;
  font-size: 18px;
  cursor: pointer;
  margin: 0 5px;
  transition: color 0.2s ease;
}

.icon-button:hover {
  color: #000;
}

.icon-button.delete {
  color: #dc3545;
}

.icon-button.delete:hover {
  color: #c82333;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 25px;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.modal-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}

.confirm-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 7px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-button {
  background-color: linear-gradient(
      to top,
      transparent 0%,
      transparent 2rem,
      rgb(0, 0, 0) 2rem,
      rgb(0, 0, 0) 100%
    ),
    linear-gradient(
      to right,
      rgb(0, 0, 0) 0%,
      rgb(0, 0, 0) -21px,
      transparent 3px,
      transparent 100%
    );
  color: black;
  border: none;
  font-weight: bold;

  padding: 7px 20px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
