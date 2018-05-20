// eslint-disable-next-line no-unused-vars
function menuRender (data) {
  const menuContainer = document.getElementById("menuContainer");


  let card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `<pre>${JSON.stringify(data, "", 2)}</pre>`;

  menuContainer.appendChild(card);

  // console.log(data);
}