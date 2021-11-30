import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Bd } from 'src/app/bd.service';

@Component({
  selector: 'app-publicacoes',
  templateUrl: './publicacoes.component.html',
  styleUrls: ['./publicacoes.component.css']
})
export class PublicacoesComponent implements OnInit {


  public email: string
  public publicacoes: any

  constructor(private bd: Bd) { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged((user)=>{
      this.email = user.email
      this.atualizarTimeLine()
    })
  }

  public atualizarTimeLine(): void{
    this.bd.consultaPublicacoes(this.email)
      .then((publicacoes: any)=>{
        this.publicacoes = publicacoes
      })
  }

}
