const SALT_SIZE = 16;

export function set_User(data) {
    var SALT = CryptoJS.lib.WordArray.random(SALT_SIZE).toString();
    return ({
        email: data.email,
        password: Hashing(data.password + "후C추i를F송a송F넣f어E봅r니S다T", SALT),
        name: data.name,
        salt: SALT,
    });
}

export function pw_Check(password, salt) {
    return Hashing(password + "후C추i를F송a송F넣f어E봅r니S다T", salt);
}

function Hashing(password, salt) {
    var hashed = CryptoJS.PBKDF2(password, salt, { keySize: 256/32, iterations: 100000 });
    return CryptoJS.SHA256(hashed.toString()).toString();
}