import * as firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyBUCG7MYr2MAKnCGSFry2TbcQPRZXnrfuQ",
    authDomain: "daily101-d017b.firebaseapp.com",
    databaseURL: "https://daily101-d017b.firebaseio.com",
    projectId: "daily101-d017b",
    storageBucket: "daily101-d017b.appspot.com",
    messagingSenderId: "1062216976082",
    appId: "1:1062216976082:web:25c28e910ddbe3ce934f0b",
    measurementId: "G-65TXRPFDB6",
};

firebase.initializeApp(firebaseConfig);
export default firebase;
