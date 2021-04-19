const createImage = (image) => {
  const img = document.createElement("img");
  img.src = image;
  return img;
};
const selectHandler = () => {
  const myFlight = document.getElementById("flights").value;
  if (myFlight) {
    const imageEl = createImage("images/" + myFlight);
    document.getElementById("image-container").innerHTML = "";
    document.getElementById("image-container").appendChild(imageEl);
  }
};
