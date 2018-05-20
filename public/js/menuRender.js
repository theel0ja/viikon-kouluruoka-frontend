/**
 * (i) = Internal
 * (p) = Public
 * (g) = Global
 */

// navItemCreator (i)
function createNavItem () {
  let element = document.createElement("li");
  element.classList.add("nav-item");

  return element;
}

function createNavLink (tabName) {
  let element = document.createElement("a");
  element.classList.add("nav-link");
  element.href = "#" + tabName;

  element.dataset.toggle = "tab";

  return element;
}

function navItemCreator (id, text) {
  let navItem = createNavItem();
  let navItemLink = createNavLink(id);

  navItemLink.text = text;

  // Append navItemLink to navItem
  navItem.appendChild(navItemLink);

  // Return navItem
  return navItem;
}

// menuRenderNavItems (p)
function menuRenderNavItems (data) {
  let navItemText;

  if(data.name) {
    navItemText = data.name;
  } else {
    navItemText = data.id; // FIXME: Use something else!
  }

  const navItem = navItemCreator(data.id, navItemText);

  return navItem;
}


// createTabPane (p)
function createTabPane (id) {
  let element = document.createElement("div");
  element.classList.add("tab-pane");
  element.classList.add("fade");
  // element.classList.add("show");
  element.id = id;

  // Return element
  return element;
}


// createCard (i)
function createCard () {
  let element = document.createElement("div");
  element.classList.add("card");

  // Return element
  return element;
}

// createCardText (i)
function createCardText (innerHTML) {
  let element = document.createElement("p");
  element.classList.add("card-text");

  element.innerHTML = innerHTML;

  return element;
}

// createCardBody (i)
function createCardBody () {
  let element = document.createElement("div");
  element.classList.add("card-body");

  // Return element
  return element;
}

// createCardBody
function createCardHeader (innerHTML) {
  let element = document.createElement("p");
  element.classList.add("card-header");

  element.innerHTML = innerHTML;

  return element;
}

// CreateTabPane
function createTable() {
  let element = document.createElement("table");
  element.classList.add("table");

  return element;
}

function createTheadWithTr() {
  let thead = document.createElement("thead");
  
  // Start tr
  let tr = document.createElement("tr");
  thead.appendChild(tr);
  // End tr

  return thead;
}

// createTh
function createTh(scope, innerHTML) {
  let element = document.createElement("th");

  element.scope = scope;

  element.innerHTML = innerHTML;

  return element;
}

// createTbody
function createTbody() {
  let element = document.createElement("tbody");

  return element;
}

// createTr
function createTr() {
  let element = document.createElement("tr");

  return element;
}

// createTd
function createTd(innerHTML) {
  let element = document.createElement("td");

  element.innerHTML = innerHTML;

  return element;
}

// createDayCard (p)
function createDayCard (data) {
  let card = createCard();
  // card.style.width = "36rem";
  
  // Start cardHeader
  if(data.dateAsText) {
    let cardHeader = createCardHeader(data.dateAsText);
  
    card.appendChild(cardHeader);
  }
  // End cardHeader


  // Start cardBody
  let cardBody = createCardBody();
  cardBody.style.padding = 0; // Disable padding

  // Start cardBody->table
  let table = createTable();

  // Start cardBody->table->thead->tr
  (function() {
    let theadTr = createTheadWithTr();
  
    // Start Create some <th> elements
    theadTr.appendChild(
      createTh("col", "Type")
    );
    theadTr.appendChild(
      createTh("col", "Description")
    );
    // End Create some <th> elements
  
    table.appendChild(theadTr);
  })(table);
  // End cardBody->table->thead->tr

  // Start cardBody->table->tbody
  let tbody = createTbody();

  // Start cardBody->table->tbody->tr[]
  data.meals.forEach(function(meal) {
    let tr = createTr();

    let thType = createTh("row", meal.type);
    tr.appendChild(thType);

    let tdDescription = createTd(meal.description);
    tr.appendChild(tdDescription);

    tbody.appendChild(tr);
  });
  // End cardBody->table->tbody->tr

  table.appendChild(tbody);
  // End cardBody->table->tbody



  cardBody.appendChild(table);
  // End cardBody->table
  
  card.appendChild(cardBody);
  // End cardBody

  return card;
}

// menuRender (g)
function menuRender (data) { // eslint-disable-line no-unused-vars
  // Elements
  const menuTabList = document.getElementById("menuTabList");
  const tabPaneContainer = document.getElementById("tabPaneContainer");

  // Nav items
  const navItem = menuRenderNavItems(data);
  menuTabList.appendChild(navItem);

  // Tab panes
  let tabPane = createTabPane(data.id);



  // Create card
  data.days.forEach(function(data) {
    let card = createDayCard(data);
    
    tabPane.appendChild(card);
  });


  // Add tabPane to tabPaneContainer
  tabPaneContainer.appendChild(tabPane);  
}