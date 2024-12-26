import { palettes, linkColor, defaultImage } from "./constant";
import { initializeNodeState, nodeState } from "../utils/helper";

initializeNodeState().then(() => {});

const drawNode = (n, ctx, globalScale) => {
  const fontSize = 8 / globalScale;
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const baseSize = 18; 
  const minSize = 4; 
  const levelFactor = 2;
  const nodeRadius =
    Math.max(baseSize - levelFactor * n.level, minSize) / globalScale;

  if (!n?.isNumber) {
    const img = nodeState.getImage(n.id, n.img);

    if (img.complete) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(n.x, n.y, nodeRadius, 0, 2 * Math.PI, false);
      ctx.clip();

      ctx.drawImage(
        img,
        n.x - nodeRadius,
        n.y - nodeRadius,
        2 * nodeRadius,
        2 * nodeRadius
      );

      ctx.restore();
    }
  } else {
    ctx.beginPath();
    ctx.arc(n.x, n.y, nodeRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = palettes[n.level - 1] || palettes[palettes.length - 1];
    ctx.fill();
  }

  ctx.fillText(n.name, n.x, n.y + nodeRadius + fontSize);
};

export const configureGraph = (graph, graphData) => {
  graph
  .graphData(graphData)
  .nodeLabel("name")
  .nodeAutoColorBy("group")
  .linkColor(() => "#999")
  .nodeColor((node) => node.color || "lightblue")
  .nodeCanvasObject((node, ctx, globalScale) => {
    const nodeColor = node.color || "lightblue";
    drawNode(node, ctx, globalScale, nodeColor);
  })
  .linkDirectionalArrowLength(3)
  .linkDirectionalArrowColor(() => "gray")
  .minZoom(2.2)
  .centerAt(0, 20)
  .d3Force("charge").distanceMax(85)

}

export const handleNodeHover = (graph, node, graphData) => {
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

  graph
    .nodeCanvasObject((n, ctx, globalScale) => {
      const nodeColor = connectedNodes.has(n) ? "#638C6D" : n.color;
      drawNode(n, ctx, globalScale, nodeColor);
    })
    .linkColor((l) => (connectedLinks.has(l) ? linkColor : "#999"))
    .linkDirectionalArrowColor((l) =>
      connectedLinks.has(l) ? linkColor : "#999"
    );
};

function convertToKebabCase(input) {
  return input.toLowerCase().replace(/\s+/g, "-");
}

export const handleNodeClick = (graph, node, graphData, formData) => {
  const { name, type } = formData;
  const isMainCourse = type === "course";
  
  const generateNewNode = (node) => {
    const newName = isMainCourse ? `${nodeState.incrementCourses()}. ${name}` : name;
    const newImg = isMainCourse ? "" : defaultImage(nodeState.incrementImages());
    const newId = convertToKebabCase(name);

    return {
      id: newId,
      name: newName,
      color: "lightblue",
      level: node.level + 1,
      isNumber: isMainCourse,
      img: newImg,
    };
  };

  const generateNewLink = (node, id, name) => ({
    source: node.id,
    target: id,
    name: `Link: ${node.name} to ${name}`,
  });

  const newNode = generateNewNode(node);
  const newLink = generateNewLink(node, newNode.id, name);

  graphData.nodes.push(newNode);
  graphData.links.push(newLink);

  graph.graphData(graphData);

};

