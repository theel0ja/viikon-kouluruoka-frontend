// navItemCreator

function createNavItem() {
  let element = document.createElement("li");
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

function menuRenderNavItems(data) {
  let navItemText;

  if(data.name) {
    navItemText = data.name;
  } else {
    navItemText = data.id; // FIXME: Use something else!
  }

  const navItem = navItemCreator(data.id, navItemText);

  return navItem;
}

// tabPaneCreator

function createTabPane(id) {
  let element = document.createElement("div");
  element.classList.add("tab-pane");
  element.classList.add("fade");
  // element.classList.add("show");
  element.id = id;

  // Return element
  return element;
}

// eslint-disable-next-line no-unused-vars
function menuRender (data) {
  // Elements
  const menuTabList = document.getElementById("menuTabList");
  const tabPaneContainer = document.getElementById("tabPaneContainer");

  // Nav items
  const navItem = menuRenderNavItems(data);

  menuTabList.appendChild(navItem);

  // Tab panes
  let tabPane = createTabPane(data.id);

  let jsonDebug = document.createElement("pre");
  jsonDebug.innerHTML = JSON.stringify(data, true, 2);

  tabPane.appendChild(jsonDebug);

  tabPaneContainer.appendChild(tabPane);  
}