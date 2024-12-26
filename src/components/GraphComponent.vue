<template>
  <div>
    <div ref="graphContainer" class="graph-container"></div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>Add Course/Module</h3>
        <form @submit.prevent="handleSubmit">
          <label for="nodeName">Name:</label>
          <input
            type="text"
            id="nodeName"
            v-model="formData.name"
            placeholder="Enter name"
            required
          />

          <label>Type:</label>
          <div class="radio-group">
            <label>
              <input
                type="radio"
                name="nodeType"
                value="course"
                v-model="formData.type"
                required
              />
              Course
            </label>
            <label>
              <input
                type="radio"
                name="nodeType"
                value="module"
                v-model="formData.type"
              />
              Module
            </label>
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

<script>
import { ref, reactive, onMounted } from "vue";
import forceGraph from "force-graph";
import { configureGraph, handleNodeHover, handleNodeClick } from "../utils/graphConfig";
import { getNumOfCourses } from "../utils/helper";

export default {
  name: "GraphComponent",
  setup() {
    const graphContainer = ref(null);
    const showModal = ref(false);
    const selectedNode = ref(null);
    
    const formData = reactive({
      name: "",
      type: "module",
    });
    
    const graph = ref(null);
    const graphData = ref(null);

    const initializeGraph = async () => {
      try {
        const result = await getNumOfCourses();
        graphData.value = result.graphData;

        if (graphData.value) {
          graph.value = forceGraph()(graphContainer.value);
          configureGraph(graph.value, graphData.value);

          graph.value.onNodeHover((node) =>
            handleNodeHover(graph.value, node, graphData.value)
          );

          graph.value.onNodeClick((node) => {
            selectedNode.value = node;
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
    };

    onMounted(() => {
      initializeGraph();
    });

    return {
      graphContainer,
      showModal,
      formData,
      handleSubmit,
      closeModal,
    };
  },
};
</script>

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

.modal form input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.radio-group {
  display: flex;
  gap: 15px;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Button styles */
.modal form button {
  padding: 10px;
  border: none;
  border-radius: 4px;
  background: #5e1675;
  color: white;
  cursor: pointer;
}

.modal form button[type="button"] {
  background: #ccc;
}

.btn-wrapper {
  display: flex;
  justify-content: center;
}

.btn-wrapper button {
  width: 100%;
  max-width: 113px;
  margin-right: 20px;
}
</style>
