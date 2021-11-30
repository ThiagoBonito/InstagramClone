import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

import { Autenticacao } from 'src/app/autenticacao.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('animacao-painel', [
      state('criado', style({
        opacity: 1
      })),
      transition('void => criado', [
        // 0 void ----X---------------------X--X--X--X-X-X-------X criado 1.5s//
        animate('750ms 0s ease-in-out', keyframes([
          style({ offset: 0.15, opacity: 1, transform: 'translateX(0)' }),
          style({ offset: 0.70, opacity: 1, transform: 'translateX(0)' }),
          style({ offset: 0.75, opacity: 1, transform: 'translateX(-20px)' }),
          style({ offset: 0.80, opacity: 1, transform: 'translateX(20px)' }),
          style({ offset: 0.85, opacity: 1, transform: 'translateX(-20px)' }),
          style({ offset: 0.90, opacity: 1, transform: 'translateX(20px)' }),
          style({ offset: 0.94, opacity: 1, transform: 'translateX(-20px)' }),
          style({ offset: 0.98, opacity: 1, transform: 'translateX(20px)' }),
          style({ offset: 1, opacity: 1, transform: 'translateY(0)' })
        ])) // duração, dalay e aceleração
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {

  @Output() public exibirPainel: EventEmitter<string> = new EventEmitter<string>()

  public mensagemErroSighIn: string = ''
  public estadoAnimacaoPainelLogin: string = 'void'


  public formulario: FormGroup = new FormGroup({
    'email': new FormControl(null, [Validators.required, Validators.minLength(7), Validators.maxLength(254), Validators.pattern("")]),
    'senha': new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(20)])
  })

  constructor(private autenticacao: Autenticacao) { }

  ngOnInit(): void {
  }

  get f() { return this.formulario.controls; }

  public exibirPainelCadastro(): void{
    this.exibirPainel.emit('cadastro')
  }
  public autenticar(): void{
    this.autenticacao.autenticar(this.formulario.value.email, this.formulario.value.senha)
  }
  public onCardChange(event: any): void {
    //console.log('evento', event)
    this.estadoAnimacaoPainelLogin = 'void'
    setTimeout(() => {
      if (this.formulario.controls.email.invalid && this.formulario.controls.email.touched) {
        this.estadoAnimacaoPainelLogin = 'criado'
      }
      if (this.formulario.controls.senha.invalid && this.formulario.controls.senha.touched) {
        this.estadoAnimacaoPainelLogin = 'criado'
      }
    }, 750)
  }
}
