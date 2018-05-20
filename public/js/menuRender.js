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
  let navItemText;

  if(data.name) {
    navItemText = data.name;
  } else {
    navItemText = data.id; // FIXME: Use something else!
  }

  const navItem = navItemCreator(data.id, navItemText);

  menuTabList.appendChild(navItem);

  // Tab panes
  let tabPane = createTabPane(data.id);

  let lorem = document.createElement("p");
  lorem.innerHTML = "Ex exercitation officia ad officia ullamco id reprehenderit dolor non. Sunt aliqua aliquip Lorem laboris nulla. Nulla ea eu nostrud irure. Duis eu velit velit sunt. Qui incididunt proident ullamco nostrud aute deserunt velit Lorem anim aliquip Lorem non dolore cillum. Minim cillum et incididunt magna anim fugiat pariatur in amet pariatur ullamco exercitation nulla.";

  tabPane.appendChild(lorem);

  tabPaneContainer.appendChild(tabPane);  
}