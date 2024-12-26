import { NodeState } from "./nodeState";

let nodeState = null;
let graphData = null;
let graphDataPromise = null;

async function fetchGraphData() {
  if (graphData) {
    return graphData;
  }
  if (!graphDataPromise) {
    graphDataPromise = fetch("public/graphData.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        graphData = data;
        return graphData;
      })
      .catch((error) => {
        console.error("Failed to fetch graph data:", error);
        throw error;
      });
  }
  return graphDataPromise;
}

export const initializeNodeState = async () => {
  if (!nodeState) {
    const data = await fetchGraphData();
    const numOfCourses = data?.nodes?.reduce((acc, val) => {
      if (val.isNumber) {
        acc++;
      }
      return acc;
    }, 0);
    nodeState = new NodeState(numOfCourses);
  }
  return nodeState;
};

export const getNumOfCourses = async () => {
  const data = await fetchGraphData();
  const numOfCourses = data?.nodes?.reduce((acc, val) => {
    if (val.isNumber) {
      acc++;
    }
    return acc;
  }, 0);
  return { numOfCourses, graphData: data };
};

export { nodeState };
