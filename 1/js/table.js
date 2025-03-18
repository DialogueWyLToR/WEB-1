import { CreateCRUD } from "./ajax.js";
import { code } from "./constans.js";
const CODE = code;
export class Table {
  formCode = {
    label: document.querySelector("#label-form-code"),
    input: document.querySelector("#form-code"),
  };
  tableBody = document.querySelector(".dataTable tbody");
  createBtn = document.querySelector("#createBtn");
  searchBtn = document.querySelector("#search-button");
  arrang = {
    byName: document.querySelector("#th-name"),
    bywidth: document.querySelector("#th-width"),
    byheight: document.querySelector("#th-height"),
    bycode: document.querySelector("#th-code"),
  };
  editIndex = null;
  constructor(data, form, staticSite = true) {
    this.data = staticSite ? data : data.list;
    this.form = form;
    this.staticSite = staticSite;
  }
  getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      sortBy: urlParams.get("sortBy") || "name",
      order: urlParams.get("order") || "asc",
      search: urlParams.get("search") || "",
      searchIn: urlParams.get("searchIn") || "all",
    };
  }
  searchData = (searchQuery, searchField) => {
    if (!this.data) return;
    return this.data.filter((item) => {
      if (!searchQuery) return true;
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
  sortData = () => {
    const { sortBy, order, search, searchIn } = this.getUrlParams();
    const filteredData = this.searchData(search, searchIn).sort((a, b) => {
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

    this.renderTable(filteredData);
  };
  renderTable = (renderData = this.data) => {
    this.tableBody.innerHTML = "";
    if (renderData.length === 0) {
      this.tableBody.innerHTML = "<tr><td colspan='4'>Nincs találat</td></tr>";
      return;
    }

    renderData.forEach((row, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.name}</td>
        <td>${row.width}</td>
        <td>${row.height}</td>
        ${this.isAsync() ? "" : `<td>${row.code}</td>`}
        <td>
          <button class="button" onclick="editRow(${index})">Szerkesztés</button>
          <button class="button" onclick="deleteRow(${index})">Törlés</button>
        </td>
      `;
      this.tableBody.appendChild(tr);
    });
  };
  getNextUniqueId(data) {
    const numbers = data.map((item) => {
      const num = Number(item.id.replace("NLYG87", "").trim());
      return isNaN(num) ? -Infinity : num;
    });

    return Math.max(...numbers) + 1;
  }
  createUpdate = (e) => {
    e.preventDefault();

    const name = document.querySelector("#form-name").value.trim();
    const width = Number(document.querySelector("#form-width").value.trim());
    const height = Number(document.querySelector("#form-height").value.trim());
    const code = this.isAsync()
      ? CODE
      : document.querySelector("#form-code").value.trim();
    const isOkWidth = isNaN(width) || width <= 0;
    const isOkHeight = isNaN(height) || height <= 0;
    if (!name || isOkWidth || isOkHeight || !code) {
      alert("Érvényes adatokat adj meg!");
      return;
    }

    if (this.editIndex !== null) {
      this.data[this.editIndex] = { name, width, height, code };
      this.createBtn.innerHTML = "Hozzáadás";
      this.editIndex = null;
    } else {
      if (this.isAsync()) {
        const sendedData = {
          name,
          width: width.toString(),
          height: height.toString(),
          code: CODE,
        };
        console.log(sendedData);
        CreateCRUD({ ...sendedData });
      } else {
        this.data.push({ name, width, height, code });
      }
    }
    if (!this.isAsync()) {
      this.saveToLocal();
    }
    this.sortData();
    this.form.reset();
  };
  isAsync() {
    return this.staticSite == false;
  }
  initAsync() {
    if (this.isAsync()) {
      this.arrang.bycode.style.display = "none";
      Object.values(this.formCode).forEach((el) => (el.style.display = "none"));
    }
  }
  saveToLocal = () => {
    localStorage.setItem("data", JSON.stringify(this.data));
  };
  init() {
    this.initAsync();
    Object.values(this.arrang).forEach((element) => {
      element.addEventListener("click", () => {
        const { order } = this.getUrlParams();
        let newOrder = order === "asc" ? "desc" : "asc";
        let newSortBy = element.id.split("-")[1];

        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("order", newOrder);
        newUrl.searchParams.set("sortBy", newSortBy);
        history.pushState({}, "", newUrl);

        Object.values(this.arrang).forEach((el) => {
          const iconTarget = el.querySelector("span[id]");
          if (iconTarget) {
            iconTarget.textContent = "";
          }
        });

        const iconTarget = element.querySelector("span[id]");
        if (iconTarget) {
          iconTarget.textContent = newOrder === "asc" ? " ↓" : " ↑";
        }
        this.sortData();
      });
    });
    this.searchBtn.addEventListener("click", () => {
      const searchInput = document.getElementById("searchInput").value.trim();
      const searchField = document
        .getElementById("searchInSelect")
        .value.trim();
      const newUrl = new URL(window.location.href);

      newUrl.searchParams.set("search", searchInput);
      newUrl.searchParams.set("searchIn", searchField);
      history.pushState({}, "", newUrl);

      this.sortData();
    });
    window.editRow = (idx) => {
      this.createBtn.innerHTML = "Módosítás";
      this.editIndex = idx;

      document.querySelector("#form-name").value = this.data[idx].name;
      document.querySelector("#form-width").value = this.data[idx].width;
      document.querySelector("#form-height").value = this.data[idx].height;
      document.querySelector("#form-code").value = this.data[idx].code;
    };
    window.deleteRow = (idx) => {
      if (confirm("Biztosan törölni szeretnéd ezt a sort?")) {
        this.data.splice(idx, 1);
        if (!this.isAsync()) {
          this.saveToLocal();
        }
        this.sortData();
      }
    };
    this.form.addEventListener("submit", this.createUpdate);
    this.sortData();
  }
}
