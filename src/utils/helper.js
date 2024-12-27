import { NodeState } from "./nodeState";

let nodeState = null;

let graphData = null;

async function fetchGraphData() {
  try {
    const response = await fetch("./graphData.json");
    graphData = await response.json();
  } catch (error) {
    console.error("Failed to fetch graph data:", error);
    throw error;
  }
}

const getCoursesData = async () => {
  await fetchGraphData();
  if (graphData) {
    const { numOfCourses, numOfModules } = getNodeCategoryCounts(graphData);
    nodeState = new NodeState(numOfCourses, numOfModules);
    return { numOfCourses, graphData, numOfModules };
  }
  return null;
};

const getNodeCategoryCounts = (data) => {
  const counts = data?.nodes?.reduce(
    (acc, val) => {
      if (!isNaN(val.courseId)) {
        acc["numOfCourses"] = Math.max(val.courseId, acc["numOfCourses"]);
      } else {
        acc["numOfModules"]++;
      }
      return acc;
    },
    { numOfCourses: 0, numOfModules: 0 }
  );

  return counts;
};
export { nodeState, getCoursesData };
