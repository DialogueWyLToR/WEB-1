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
  return {
    sortBy: urlParams.get("sortBy") || "name",
    order: urlParams.get("order") || "asc",
    search: urlParams.get("search") || "",
    searchIn: urlParams.get("searchIn") || "all",
  };
};

const searchData = (searchQuery, searchField) => {
  return data.filter((item) => {
    if (!searchQuery) return true; // Ha nincs keresés, ne szűrjünk
    if (searchField === "all") {
      return Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      return String(item[searchField])
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    }
  });
};

const sortData = () => {
  const { sortBy, order, search, searchIn } = getUrlParams();
  const filteredData = searchData(search, searchIn).sort((a, b) => {
    let valueA = a[sortBy];
    let valueB = b[sortBy];

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

const renderTable = (renderData = data) => {
  tableBody.innerHTML = "";
  if (renderData.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='4'>Nincs találat</td></tr>";
    return;
  }

  renderData.forEach((row, index) => {
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

Object.values(arrang).forEach((element) => {
  element.addEventListener("click", () => {
    const { order } = getUrlParams();
    let newOrder = order === "asc" ? "desc" : "asc";
    let newSortBy = element.id.split("-")[1];

    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("order", newOrder);
    newUrl.searchParams.set("sortBy", newSortBy);
    history.pushState({}, "", newUrl);

    Object.values(arrang).forEach((el) => {
      const iconTarget = el.querySelector("span[id]");
      if (iconTarget) {
        iconTarget.textContent = ""; 
      }
    });

    const iconTarget = element.querySelector("span[id]");
    if (iconTarget) {
      iconTarget.textContent = newOrder === "asc" ? " ↓" : " ↑";
    }
    sortData();
  });
});

const createUpdate = (e) => {
  e.preventDefault();

  const name = document.querySelector("#form-name").value.trim();
  const age = Number(document.querySelector("#form-age").value.trim());
  const city = document.querySelector("#form-city").value.trim();

  if (!name || isNaN(age) || age <= 0 || !city) {
    alert("Érvényes adatokat adj meg!");
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
  sortData();
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
    sortData();
  }
};

searchBtn.addEventListener("click", () => {
  const searchInput = document.getElementById("searchInput").value.trim();
  const searchField = document.getElementById("searchInSelect").value.trim();
  const newUrl = new URL(window.location.href);

  newUrl.searchParams.set("search", searchInput);
  newUrl.searchParams.set("searchIn", searchField);
  history.pushState({}, "", newUrl);

  sortData();
});

const saveToLocal = () => {
  localStorage.setItem("data", JSON.stringify(data));
};

formHTML.addEventListener("submit", createUpdate);
sortData();
