import { collection, setDoc, getDoc, getDocs, doc, } from "firebase/firestore";
import { db } from "./server.js";


// Rigister User
export async function rigisterUser(data) {
    const type = "user_data"
    try {
        const docRef = await doc(collection(db, type), data.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return false;
        }

        await setDoc(docRef, {
            pw: data.password,
            nick: data.name,
            salt: data.salt
        });
        return true;
    } catch (e) {
        console.error('Error adding document: ', e);
        return false;
    }
}

// ID Check & Get salt [True = Success, False = Fail]
export async function get_salt(data) {
    const type = "user_data"
    try {
        const docRef = await doc(collection(db, type), data.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().salt;
        }
        return false;
    } catch (e) {
        console.error('Error adding document: ', e);
        return false;
    }

}



// Login Nick Check [True = Success, False = Fail]
export async function loginCheck(id, pw) {
    let type = "user_data"
    const citiesCol = collection(db, type);
    const citySnapshot = await getDocs(citiesCol);
    const cityList = citySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));

    let city = cityList.find(city => city.id === id && city.data.pw === pw);

    if (city) {
        return city.data.nick;
    }
    else {
        return false;
    }
}






// Edit User (Not implemented)
export async function editUser(data) {
    const type = "user_data"
    try {
        const docRef = await doc(collection(db, type), data.userID);
        await setDoc(docRef, {
            nick: data.userName,
            pw: data.userPW,
        });
        return true;
    } catch (e) {
        console.error('Error adding document: ', e);
        return false;
    }
}



// Delete User (Not implemented)
export async function deleteUser(data) {
    const type = "user_data"
    try {
        const docRef = await doc(collection(db, type), data.userID);
        await deleteDoc(docRef);
        return true;
    } catch (e) {
        console.error('Error adding document: ', e);
        return false;
    }
}