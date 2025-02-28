const tableBody = document.querySelector(".dataTable tbody");
const formHTML = document.querySelector(".table-form");
const createBtn = document.querySelector("#createBtn");
const stats = document.querySelector("#stats");
const data = JSON.parse(localStorage.getItem("data") || "[]");
const searchBtn = document.querySelector("#search-button");
const arrang = {
  byName: document.querySelector("#th-name"),
  byAge: document.querySelector("#th-age"),
  byCity: document.querySelector("#th-city"),
};
let editIndex = null;

const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const sortBy = urlParams.get("sortBy") || "name";
  const order = urlParams.get("order") || "asc";
  const search = urlParams.get("search") || "";
  const searchIn = urlParams.get("searchIn") || "all";
  return { sortBy, order, search, searchIn };
};
const renderTable = (render = data) => {
  tableBody.innerHTML = "";
  if (render.length == 0) {
    tableBody.innerHTML = "Nincs a keresési feltételeknek megfelelő találat";
  }
  render.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${row.name}</td>
        <td>${row.age}</td>
        <td>${row.city}</td>
        <td>
          <button class="button" onclick="editRow(${index})">Szerkesztés</button>
          <button class="button" onclick="deleteRow(${index})">Törlés</button>
        </td>
      `;
    tableBody.appendChild(tr);
  });
};
const { sortBy, order, search, searchIn } = getUrlParams();
const searchData = (searchQuery, searchField) => {
  const filtered = data.filter((item) => {
    if (searchField === "all") {
      return Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchQuery)
      );
    } else {
      return String(item[searchField]).toLowerCase().includes(searchQuery);
    }
  });
  return filtered;
};
const sortData = (key, order, searchQuery = "", searchField = "all") => {
  const filteredData = searchData(searchQuery, searchField).sort((a, b) => {
    let valueA = a[key];
    let valueB = b[key];

    if (typeof valueA === "number" && typeof valueB === "number") {
      return order === "asc" ? valueA - valueB : valueB - valueA;
    }

    if (typeof valueA === "string" && typeof valueB === "string") {
      return order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return 0;
  });

  renderTable(filteredData);
};

Object.values(arrang).forEach((element) => {
  const arrow = element.querySelector(`#${element.id.split("-")[1]}`);
  arrow.innerHTML = "";

  element.addEventListener("click", () => {
    const { order: orderBy } = getUrlParams();

    let newOrder = orderBy === "asc" ? "desc" : "asc";

    Object.values(arrang).forEach((el) => {
      const arrowEl = el.querySelector(`#${el.id.split("-")[1]}`);
      arrowEl.innerHTML = "";
    });

    const newArrow = element.querySelector(`#${element.id.split("-")[1]}`);
    newArrow.innerHTML = newOrder === "asc" ? "↓" : "↑";

    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("order", newOrder);
    newUrl.searchParams.set("sortBy", element.id.split("-")[1]);

    history.pushState({}, "", newUrl);

    const { sortBy, order } = getUrlParams();
    sortData(sortBy, order);
    renderTable();
  });
});

const inputChecker = (name, age, city) => {
  if (!name) {
    alert("Név megadása kötelező");
    return false;
  }
  if (isNaN(age) || age <= 0) {
    alert("Kérjük, adjon meg egy érvényes életkort.");
    return false;
  }
  if (!city) {
    alert("Város megadása kötelező");
    return false;
  }
  return true;
};
const createUpdate = (e) => {
  e.preventDefault();

  const name = document.querySelector("#form-name").value.trim();
  const ageInput = document.querySelector("#form-age").value.trim();
  const city = document.querySelector("#form-city").value.trim();
  const age = Number(ageInput);
  if (!inputChecker(name, age, city)) {
    return;
  }

  if (editIndex !== null) {
    data[editIndex] = { name, age, city };
    createBtn.innerHTML = "Hozzáadás";
    editIndex = null;
  } else {
    data.push({ name, age, city });
  }

  saveToLocal();
  renderTable();
  formHTML.reset();
};

window.editRow = (idx) => {
  createBtn.innerHTML = "Módosítás";
  editIndex = idx;

  document.querySelector("#form-name").value = data[idx].name;
  document.querySelector("#form-age").value = data[idx].age;
  document.querySelector("#form-city").value = data[idx].city;
};

window.deleteRow = (idx) => {
  if (confirm("Biztosan törölni szeretnéd ezt a sort?")) {
    data.splice(idx, 1);
    saveToLocal();
    renderTable();
  }
};
searchBtn.addEventListener("click", () => {
  const searchInput = document.getElementById("searchInput").value.trim();
  const searchField = document.getElementById("searchInSelect").value.trim();
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set("search", searchInput);
  newUrl.searchParams.set("searchIn", searchField);
  history.pushState({}, "", newUrl);
  const { sortBy, order, search, searchIn } = getUrlParams();
  sortData(sortBy, order, search, searchIn);
});
const saveToLocal = () => {
  localStorage.setItem("data", JSON.stringify(data));
};

formHTML.addEventListener("submit", createUpdate);
renderTable();
