import CryptoJS from 'crypto-js';


export default function (length: number) {
    const randomArray = CryptoJS.lib.WordArray.random(length);
    const randomString = CryptoJS.enc.Base64.stringify(randomArray);
    return randomString;
}