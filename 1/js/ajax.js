async function ReadCRUD(code) {
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
async function CreateCRUD(createData) {
  let bodyData = "op=create";
  for (const [key, value] of Object.entries(createData)) {
    bodyData+=`&${key}=${value}`
  }
  const response = await fetch("http://gamf.nhely.hu/ajax2/", {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyData
  });
  const data = await response.text();
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
    }),
  });
  const data = await response.json();
  return data;
}

export { ReadCRUD, CreateCRUD, UpdateCRUD, DeleteCRUD };
