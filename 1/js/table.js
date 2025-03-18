import { CreateCRUD, DeleteCRUD, ReadCRUD, UpdateCRUD } from "./ajax.js";
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
    byweight: document.querySelector("#th-weight"),
    byheight: document.querySelector("#th-height"),
    bycode: document.querySelector("#th-code"),
  };
  editIndex = null;
  constructor(data, form, staticSite = true) {
    this.data = staticSite ? data : [];
    this.form = form;
    this.staticSite = staticSite;
  }
  async getDatas() {
    const responsed = await ReadCRUD(code);
    this.data = responsed.list;
    this.renderTable(this.data);
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
        <td>${row.weight}</td>
        <td>${row.height}</td>
        ${this.isAsync() ? "" : `<td>${row.code}</td>`}
        <td>
          <button class="button" onclick="editRow(${
            this.staticSite ? index : row.id
          })">Szerkesztés</button>
          <button class="button" onclick="deleteRow(${
            this.staticSite ? index : row.id
          })">Törlés</button>
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
  createUpdate = async (e) => {
    e.preventDefault();

    const name = document.querySelector("#form-name").value.trim();
    const weight = Number(document.querySelector("#form-weight").value.trim());
    const height = Number(document.querySelector("#form-height").value.trim());
    const code = this.isAsync()
      ? CODE
      : document.querySelector("#form-code").value.trim();
    const isOkweight = isNaN(weight) || weight <= 0;
    const isOkHeight = isNaN(height) || height <= 0;
    if (!name || isOkweight || isOkHeight || !code) {
      alert("Érvényes adatokat adj meg!");
      return;
    }

    if (this.editIndex !== null) {
      if (!this.isAsync()) {
        this.data[this.editIndex] = { name, weight, height, code };
        this.saveToLocal();
        this.renderTable();
        this.sortData();
      } else {
        const updatedData = {
          id: document.querySelector("#form-id").value,
          name,
          weight: weight.toString(),
          height: height.toString(),
          code: CODE,
        };
        await UpdateCRUD(updatedData);
        await this.getDatas();
      }
    } else {
      if (this.isAsync()) {
        const sendedData = {
          name,
          weight: weight.toString(),
          height: height.toString(),
          code: CODE,
        };
        await CreateCRUD(sendedData);
        await this.getDatas();
      } else {
        this.data[this.editIndex] = { name, weight, height, code };
        this.data.push({ name, weight, height, code });
        this.saveToLocal();
        this.renderTable();
        this.sortData();
      }
    }
    this.createBtn.innerHTML = "Hozzáadás";
    this.editIndex = null;
    this.form.reset();
  };
  isAsync() {
    return this.staticSite == false;
  }
  async initAsync() {
    this.arrang.bycode.style.display = "none";
    Object.values(this.formCode).forEach((el) => (el.style.display = "none"));
    document.querySelector(".search-container").style.display = "none";
    await this.getDatas();
  }
  saveToLocal = () => {
    localStorage.setItem("data", JSON.stringify(this.data));
  };
  initStatic() {
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
  }
  async init() {
    if (this.isAsync()) {
      await this.initAsync();
    } else {
      this.initStatic();
    }

    window.editRow = (idx) => {
      this.createBtn.innerHTML = "Módosítás";
      this.editIndex = idx;
      if (this.isAsync()) {
        this.editIndex = this.data.findIndex((dat) => dat.id == idx);
      }
      document.querySelector("#form-id").value = idx;
      document.querySelector("#form-name").value =
        this.data[this.staticSite ? idx : this.editIndex].name;
      document.querySelector("#form-weight").value =
        this.data[this.staticSite ? idx : this.editIndex].weight;
      document.querySelector("#form-height").value =
        this.data[this.staticSite ? idx : this.editIndex].height;
      document.querySelector("#form-code").value =
        this.data[this.staticSite ? idx : this.editIndex].code;
    };
    window.deleteRow = async (idx) => {
      if (confirm("Biztosan törölni szeretnéd ezt a sort?")) {
        if (!this.isAsync()) {
          this.data.splice(idx, 1);
          this.saveToLocal();
          this.sortData();
        } else {
          const deleteData = {
            id: idx,
            code,
          };
          await DeleteCRUD(deleteData);
          await this.getDatas();
          this.form.reset();
        }
      }
    };
    this.form.addEventListener("submit", this.createUpdate);
    this.sortData();
  }
}
