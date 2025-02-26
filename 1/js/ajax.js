import { code } from "./constans.js";

async function ReadCRUD() {
  const response = await fetch("http://gamf.nhely.hu/ajax2/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      op: "read",
      code,
    }),
  });
  const data = await response.json();
  return data;
}
/**
 * name: 'Teszt Elek',
 * height: '185',
 * weight: '78',
 */
async function CreateCRUD({ createData }) {
  const response = await fetch("http://gamf.nhely.hu/ajax2/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      op: "create",
      code,
      ...createData,
    }),
  });
  const data = await response.json();
  return data;
}
/**
 *
 * id: "5"
 * name: "Teszt Elek Módosított",
 * height: "185",
 * weight: "78",
 */
async function UpdateCRUD({ updateData }) {
  const response = await fetch("http://gamf.nhely.hu/ajax2/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      op: "update",
      code,
      ...updateData,
    }),
  });
  const data = await response.json();
  return data;
}
async function DeleteCRUD({ id }) {
  const response = await fetch("http://gamf.nhely.hu/ajax2/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      op: "delete",
      id,
      code,
    }),
  });
  const data = await response.json();
  return data;
}

export { ReadCRUD, CreateCRUD, UpdateCRUD, DeleteCRUD };
