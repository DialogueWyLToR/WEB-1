import { fetchURL } from "./constans.js";

async function ReadCRUD(code) {
  const response = await fetch(fetchURL, {
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
async function CreateCRUD(createData) {
  const response = await fetch(fetchURL, {
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
  const data = await response.text();
  alert(data == "1" ? "Sikeres létrehozás" : "Sikertelen létrehozás");
  return data;
}
/**
 *
 * id: "5"
 * name: "Teszt Elek Módosított",
 * height: "185",
 * weight: "78",
 */
async function UpdateCRUD(updateData) {
  const response = await fetch(fetchURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      op: "update",
      ...updateData,
    }),
  });
  const data = await response.text();
  alert(data == "1" ? "Sikeres módosítás" : "Sikertelen módosítás");
  return data;
}
async function DeleteCRUD(deleteData) {
  const response = await fetch(fetchURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      op: "delete",
      ...deleteData,
    }),
  });
  const data = await response.text();
  alert(data == "1" ? "Sikeres törlés" : "Sikertelen törlés");

  return data;
}

export { ReadCRUD, CreateCRUD, UpdateCRUD, DeleteCRUD };
