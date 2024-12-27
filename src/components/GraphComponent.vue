<script>
import { ref, reactive, onMounted, watch } from "vue";
import forceGraph from "force-graph";
import {
  configureGraph,
  handleNodeHover,
  handleNodeClick,
} from "../utils/graphConfig";
import { getCoursesData } from "../utils/helper";

export default {
  name: "GraphComponent",
  setup() {
    const graphContainer = ref(null);
    const showModal = ref(false);
    const selectedNode = ref(null);
    const isModuleCourse = ref(true);

    const formData = reactive({
      name: "",
      type: "module",
    });

    const graph = ref(null);
    const graphData = ref(null);

    const initializeGraph = async () => {
      try {
        const result = await getCoursesData();
        graphData.value = result.graphData;

        if (graphData.value) {
          graph.value = forceGraph()(graphContainer.value);
          configureGraph(graph.value, graphData.value);

          graph.value.onNodeHover((node) =>
            handleNodeHover(graph.value, node, graphData.value)
          );

          graph.value.onNodeClick((node) => {
            selectedNode.value = node;

            isModuleCourse.value = !isNaN(node.courseId);
            showModal.value = true;
          });
        } else {
          console.error("Graph data is empty or undefined.");
        }
      } catch (error) {
        console.error("Error initializing graph:", error);
      }
    };

    const handleSubmit = () => {
      if (!formData.name.trim() || !formData.type) {
        alert("Both name and type are required!");
        return;
      }
      handleNodeClick(
        graph.value,
        selectedNode.value,
        graphData.value,
        formData
      );
      closeModal();
    };

    const closeModal = () => {
      showModal.value = false;
      formData.name = "";
      formData.type = "module";
      // showCourse.value = true;
    };

    onMounted(() => {
      initializeGraph();
    });

    return {
      graphContainer,
      showModal,
      isModuleCourse,
      formData,
      handleSubmit,
      closeModal,
    };
  },
};
</script>

<template>
  <div>
    <div ref="graphContainer" class="graph-container"></div>

    <div v-if="showModal" class="modal-overlay" aria-labelledby="modalTitle">
      <div class="modal">
        <h3 id="modalTitle">Add Course/Module</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-row">
            <label for="nodeName">Name:</label>
            <input
              type="text"
              id="nodeName"
              v-model="formData.name"
              placeholder="Enter the name of the course or module."
              required
              aria-describedby="nameDescription"
            />
          </div>

          <div class="form-row">
            <label>Type:</label>
            <div class="radio-group">
              <label v-if="isModuleCourse">
                <input
                  type="radio"
                  name="nodeType"
                  value="course"
                  v-model="formData.type"
                  required
                  aria-label="Course"
                />
                <span>Course</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="nodeType"
                  value="module"
                  v-model="formData.type"
                  aria-label="Module"
                />
                <span>Module</span>
              </label>
            </div>
          </div>
          <div class="btn-wrapper">
            <button type="submit">Add</button>
            <button type="button" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.graph-container {
  height: 100vh;
  display: block;
  user-select: none;
  outline: none;
  overflow: hidden;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal h3 {
  margin-top: 0;
}

.modal form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.form-row label {
  margin-right: 10px;
}

.modal form input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
}

.radio-group {
  display: flex;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.btn-wrapper button {
  width: 100%;
  max-width: 113px;
  margin-right: 20px;
  padding: 10px;
  border-radius: 4px;
  background: #5e1675;
  color: white;
  cursor: pointer;
}

.modal form button[type="button"] {
  background: #ccc;
}

input[type="radio" i] {
  margin: 8px;
}

/* Accessibility Enhancements */
input[type="text"],
input[type="radio"] {
  margin-bottom: 10px;
}

small {
  font-size: 0.9em;
  color: #666;
}
</style>
