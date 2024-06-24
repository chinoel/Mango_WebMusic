import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "./server.js";



// Get Music Rank
export async function getrank(types) {
  let type = "music_rank"
  const citiesCol = collection(db, type);
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => ({types: doc.id, data: doc.data()}));

  let result = cityList.find(city => city.types === types);

  return result.data;
}


// Update Music Rank
export async function rank_update(data, type) {
    try {
        for (let i = 1; i <= 100; i++) {
            const docRef = doc(collection(db, type), i.toString());
            await updateDoc(docRef, {
                array: data[i-1],
            });
        }
        return true;
    } catch (e) {
        console.error('Error updating document: ', e);
        return false;
    }
}