const palettes = ["#5E1675", "#8F3BAD", "#C170E6", "#F2A6FF"];

const defaultImage = (num) => {
  return `https://api.multiavatar.com/Bin${num}%20Bond.svg`;
};

const graphConfigSetup = {
  linkColor: "#999",
  activelinkColor: "#FF79CD",
  linkArrowColor: "#808080",
  minZoom: 2.2,
  centerAtX: 0,
  centerAtY: 20,
  distanceMax: 85,
  arrowLength: 3,
  nodeColor: "#638C6D",
};

export { palettes, defaultImage, graphConfigSetup };
