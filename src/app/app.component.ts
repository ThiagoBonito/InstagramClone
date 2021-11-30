import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app3';

  ngOnInit(){
  const firebaseConfig = {
    apiKey: "AIzaSyA9sdNBzl-VZva9LM_zeeDw42J43o7StkE",
    authDomain: "jta-instagram-clone-48870.firebaseapp.com",
    databaseURL: "https://jta-instagram-clone-48870-default-rtdb.firebaseio.com",
    projectId: "jta-instagram-clone-48870",
    storageBucket: "jta-instagram-clone-48870.appspot.com",
    messagingSenderId: "165254118957",
    appId: "1:165254118957:web:bce7389ca7b2c5f805c2a4",
    measurementId: "G-806DV3SR01"
  };
    firebase.initializeApp(firebaseConfig)
  }
}
