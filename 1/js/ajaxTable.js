import { ReadCRUD } from "./ajax.js";
import { Table } from "./table.js";
import { code } from "./constans.js";
const data = await ReadCRUD(code);
const form = document.querySelector(".ajax");
const table = new Table(data, form, false);
table.init();
