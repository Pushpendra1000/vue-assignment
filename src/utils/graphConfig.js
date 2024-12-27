import { palettes, graphConfigSetup, defaultImage } from "./constant";
import { nodeState } from "../utils/helper";

const {
  linkColor,
  arrowLength,
  linkArrowColor,
  minZoom,
  centerAtX,
  centerAtY,
  distanceMax,
  activelinkColor,
  nodeColor,
} = graphConfigSetup;


/**
 * Calculates the radius of a node based on its level, global scale, and other configurable parameters.
 *
 * @param {number} level - The depth or hierarchy level of the node. Higher levels result in smaller node sizes.
 * @param {number} globalScale - The scaling factor applied globally to adjust the node size relative to the graph zoom level.
 * @param {number} [baseSize=18] - The default size of a node at the root or lowest level (level 0).
 * @param {number} [minSize=4] - The minimum allowable size for a node, ensuring it remains visible even at deep levels.
 * @param {number} [levelFactor=1.5] - The factor by which the node size decreases for each level.
 * @returns {number} - The calculated radius of the node, scaled by the global zoom level.
 */
const calculateNodeRadius = (
  level,
  globalScale,
  baseSize = 18,
  minSize = 4,
  levelFactor = 1.5
) => {
  return Math.max(baseSize - levelFactor * level, minSize) / globalScale;
};

const drawNodeImage = (ctx, img, x, y, radius) => {
  if (img.complete) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.clip();
    ctx.drawImage(img, x - radius, y - radius, 2 * radius, 2 * radius);
    ctx.restore();
  }
};

const drawColoredNode = (ctx, x, y, radius, color) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
};

const drawNode = (n, ctx, globalScale) => {
  const fontSize = 9 / globalScale;
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const nodeRadius = calculateNodeRadius(n.level, globalScale);

  if (isNaN(n.courseId)) {
    const img = nodeState.getImage(n.id, n.img);
    drawNodeImage(ctx, img, n.x, n.y, nodeRadius);
  } else {
    const color = palettes[n.level - 1] || palettes[palettes.length - 1];
    drawColoredNode(ctx, n.x, n.y, nodeRadius, color);
  }

  const nodeName = !isNaN(n.courseId) ? `${n.courseId}. ${n.name}` : n.name;
  ctx.fillText(nodeName, n.x, n.y + nodeRadius + fontSize);
  
};

const configureGraph = (graph, graphData) => {
  graph
    .graphData(graphData)
    .linkColor(() => linkColor)
    .nodeColor((node) => node.color)
    .nodeCanvasObject((node, ctx, globalScale) => {
      const nodeColor = node.color;
      drawNode(node, ctx, globalScale, nodeColor);
    })
    .linkDirectionalArrowLength(arrowLength)
    .linkDirectionalArrowColor(() => linkArrowColor)
    .minZoom(minZoom)
    .centerAt(centerAtX, centerAtY)
    .onZoom((currentZoom) => {
      const adjustedArrowLength =  12 / currentZoom.k;
      graph.linkDirectionalArrowLength(adjustedArrowLength);
    })
    .d3Force("charge")
    .distanceMax(distanceMax)
    
};

const findConnectedElements = (node, graphData) => {
  const connectedNodes = new Set();
  const connectedLinks = new Set();

  if (node) {
    graphData.links.forEach((link) => {
      if (link.source.id === node.id || link.target.id === node.id) {
        connectedLinks.add(link);
        connectedNodes.add(link.source);
        connectedNodes.add(link.target);
      }
    });
  }

  return { connectedNodes, connectedLinks };
};

const updateGraphVisuals = (graph, connectedNodes, connectedLinks) => {
  graph
    .nodeCanvasObject((n, ctx, globalScale) => {
      const toggleNodeColor = connectedNodes.has(n) ? nodeColor : n.color;
      drawNode(n, ctx, globalScale, toggleNodeColor);
    })
    .linkColor((l) => (connectedLinks.has(l) ? activelinkColor : linkColor))
    .linkDirectionalArrowColor((l) =>
      connectedLinks.has(l) ? activelinkColor : linkColor
    );
};

const handleNodeHover = (graph, node, graphData) => {
  const { connectedNodes, connectedLinks } = findConnectedElements(
    node,
    graphData
  );
  updateGraphVisuals(graph, connectedNodes, connectedLinks);
};

const generateId = (input) => {
  return input.toLowerCase().replace(/\s+/g, "-");
};

const generateNewNode = (node, name, isMainCourse) => {
  const courseId = isMainCourse ? nodeState.incrementCourses() : undefined;
  const newImg = isMainCourse ? "" : defaultImage(nodeState.incrementImages());
  const newId = generateId(name);

  return {
    id: newId,
    name,
    color: "lightblue",
    level: node.level + 1,
    img: newImg,
    courseId
  };
};

const generateNewLink = (sourceNode, targetId, targetName) => ({
  source: sourceNode.id,
  target: targetId,
  name: `Link: ${sourceNode.name} to ${targetName}`,
});

const handleNodeClick = (graph, node, graphData, formData) => {
  const { name, type } = formData;
  const isMainCourse = type === "course";

  const newNode = generateNewNode(node, name, isMainCourse);
  const newLink = generateNewLink(node, newNode.id, name);

  graphData.nodes.push(newNode);
  graphData.links.push(newLink);
  graph.graphData(graphData);
};

export { handleNodeClick, handleNodeHover, configureGraph };
