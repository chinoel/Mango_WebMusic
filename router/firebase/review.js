import { collection, getDoc, setDoc, doc } from "firebase/firestore";
import { db } from "./server.js";


// Review Update
export async function review_update(data) {
    const type = "music_list"
    try {
        const docRef = doc(collection(db, type), data.name);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await setDoc(docRef, {
                review: [...docSnap.data().review, data.review]
            }, { merge: true });
        } else {
            await setDoc(docRef, {
                review: [data.review]
            });
        }

        return true;
    } catch (e) {
        console.error('Error adding document: ', e);
        return false;
    }
}


// Review Get
export async function review_get(data) {
    const type = "music_list"
    try {
        if (!data.name) {
            throw new Error('Invalid document path');
        }
        const docRef = doc(collection(db, type), data.name);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return false;
        }
    } catch (e) {
        console.error('Error adding document: ', e);
        return false;
    }
}