import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Bd } from 'src/app/bd.service';
import { Progresso } from 'src/app/progresso.service';
import { Observable, interval, observable, Subject, pipe } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as firebase from 'firebase';

@Component({
  selector: 'app-incluir-publicacao',
  templateUrl: './incluir-publicacao.component.html',
  styleUrls: ['./incluir-publicacao.component.css']
})
export class IncluirPublicacaoComponent implements OnInit {

  public formulario: FormGroup = new FormGroup({
    'titulo': new FormControl(null)
  })

  @Output() public atualizarTimeLine: EventEmitter<any> = new EventEmitter<any>()

  public email: string
  private imagem: any

  public progressoPublicacao: string = 'pendente'
  public porcentagemUpload: number

  constructor(private bd: Bd, private progresso: Progresso) { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged((user)=>{
      this.email = user.email
    })
  }

  public publicar(): void {
    this.bd.publicar({
      email: this.email,
      titulo: this.formulario.value.titulo,
      imagem: this.imagem[0]
    })

    let continua = new Subject()
    continua.next(true)

    let acompanhamentoUpload = interval(1500);
 
    acompanhamentoUpload.pipe(takeUntil(continua)).subscribe(() => {
      //console.log(this.progresso.estado);
      //console.log(this.progresso.status);
      this.progressoPublicacao = 'andamento'
      this.porcentagemUpload = Math.round((this.progresso.estado.bytesTransferred / this.progresso.estado.totalBytes) * 100)

      if(this.progresso.status === 'concluido'){
        this.progressoPublicacao = 'concluido'
        //emitir um evento do componente parent (home)
        this.atualizarTimeLine.emit()
        continua.next(false);
      }
    })
  }
  public preparaImagemUpload(event: Event): void{
    this.imagem = (<HTMLInputElement>event.target).files
  }

}
