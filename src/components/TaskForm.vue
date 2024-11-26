<template>
  <div>
    <!-- Task Form Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>Add Task</h3>
        <form @submit.prevent="submitTask">
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

          <div class="form-drop-down">
            <div class="form-group">
              <label for="priority" class="label">Priority:</label>
              <select id="priority" v-model="task.priority" class="form-control" required>
                <option value="HIGHEST">🔴 Highest</option>
                <option value="HIGH">🟠 High</option>
                <option value="MEDIUM">🔵 Medium</option>
                <option value="LOW">🟢 Low</option>
              </select>
            </div>

            <div class="form-group">
              <label for="status">Status:</label>
              <select id="status" v-model="task.status" class="form-control" required>
                <option value="OPEN">📂 Open</option>
                <option value="IN_PROGRESS">⏳ In Progress</option>
                <option value="COMPLETED">✅ Completed</option>
              </select>
            </div>
          </div>

          <!-- Add a similar structure for "Status" -->

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
            <button type="submit" class="btn btn-primary">Create Task</button>
            <button type="button" class="btn btn-secondary" @click="closeCreateTaskModal">
              Cancel
            </button>
          </div>
        </form>

        <!-- Success or Error Message -->
        <div v-if="responseMessage" class="alert alert-success mt-3">
          {{ responseMessage }}
        </div>

        <div v-if="errorMessage" class="alert alert-danger mt-3">
          {{ errorMessage }}
        </div>
      </div>
    </div>

    <!-- Toast Notification for Success -->
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    user_id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      task: {
        user_id: '',
        task_name: '',
        description: '',
        priority: '',
        status: '',
        start_date: '',
        end_date: '',
      },
      responseMessage: '',
      errorMessage: '',
      showModal: true, // Controls modal visibility
    }
  },
  methods: {
    openCreateTaskModal() {
      this.showModal = true // Open the modal when the button is clicked
    },
    closeCreateTaskModal() {
      this.showModal = false // Close the modal when "Cancel" is clicked
    },

    addTask() {
      if (this.task.priority) {
        this.tasks.push({ ...this.task, id: Date.now() }) // Add task with priority
        this.task.priority = '' // Reset priority after adding
      }
    },

    async submitTask() {
      try {
        const taskData = { ...this.task, user_id: this.user_id }
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/task`, taskData)
        if (response.status === 201) {
          this.$emit('task-created', response.data.task) // Emit event with the new task data
          // Close modal after task is created
          window.location.reload()
          this.closeCreateTaskModal()
          // Hide the toast after 3 seconds
        } else {
          this.errorMessage = 'Failed to create task.'
          this.responseMessage = ''
        }
      } catch (error) {
        this.errorMessage = error.response
          ? error.response.data.message
          : 'An error occurred while adding the task.'
      }
    },
  },
}
</script>

<style scoped>
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
  text-align: left;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  max-width: 450px;
  width: 100%;
}
.modal-content h3 {
  font-weight: bold;
  text-align: center;
  padding-bottom: 5px;
  border-bottom: 2px solid whitesmoke;
}
label {
  text-align: left !important;
  font-size: 13px;
  font-weight: bold;
}
button {
  margin-top: 10px;
}
.form-group-date {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}
.form-drop-down {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
}
textarea {
  outline: none;
  resize: none;
  height: 3rem;
}

.form-group {
  flex: 1;
  margin-bottom: 10px;
}
input,
textarea,
select {
  padding: 3px;
  border-bottom: 1px solid #ddd;
}
.sbt-btn {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

/* Toast Styling */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #4caf50; /* Green for success */
  color: white;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: slideIn 0.5s ease-in-out;
}

/* Toast Slide In Animation */
@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
