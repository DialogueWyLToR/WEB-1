import { Table } from "./table.js";

const data = JSON.parse(localStorage.getItem("data") || "[]");
const form = document.querySelector(".static");
const table = new Table(data, form, true);
table.init();
