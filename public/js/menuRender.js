function createNavItem() {
  let element = document.createElement("div");
  element.classList.add("nav-item");

  return element;
}

function createNavLink(tabName) {
  let element = document.createElement("a");
  element.classList.add("nav-link");
  element.href = "#" + tabName;

  element.dataset.toggle = "tab";

  return element;
}

function navItemCreator(id, text) {
  let navItem = createNavItem();
  let navItemLink = createNavLink(id);

  navItemLink.text = text;

  // Append navItemLink to navItem
  navItem.appendChild(navItemLink);

  // Return navItem
  return navItem;
}

// eslint-disable-next-line no-unused-vars
function menuRender (data) {
  const menuTabList = document.getElementById("menuTabList");

  let navItemText;

  if(data.name) {
    navItemText = data.name;
  } else {
    navItemText = data.id; // FIXME: Use something else!
  }

  const navItem = navItemCreator(data.id, navItemText);

  menuTabList.appendChild(navItem);
}