// src/db.jsx
import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";

export const db = new Dexie("todo-photos");
db.version(1).stores({
  photos: "id", // Primary key, don't index photos.
});

async function addPhoto(id, imgSrc) {
  console.log("addPhoto", imgSrc.length, id);
  try {
    // put() will insert or update by primary key, so re-saving a task photo works.
    const i = await db.photos.put({
      id: id,
      imgSrc: imgSrc,
    });
    console.log(`Photo ${imgSrc.length} bytes successfully added. Got id ${i}`);
  } catch (error) {
    console.log(`Failed to add photo: ${error}`);
  }
}

function GetPhotoSrc(id) {
  console.log("getPhotoSrc", id);
  const img = useLiveQuery(() => db.photos.where("id").equals(id).toArray());
  if (Array.isArray(img)) return img[0].imgSrc;
}

export { addPhoto, GetPhotoSrc };
