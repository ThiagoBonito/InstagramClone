import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Usuario } from '../usuario.model';
import { Autenticacao } from 'src/app/autenticacao.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  @Output() public exibirPainel: EventEmitter<string> = new EventEmitter<string>()

  public mensagemErroSighIn: string = ''
  public estadoAnimacaoPainelLogin: string = 'void'

  public formulario: FormGroup = new FormGroup({
    'email': new FormControl(null, [Validators.required, Validators.minLength(7), Validators.maxLength(254), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    'nome_completo': new FormControl(null, [Validators.required, Validators.minLength(8)]),
    'nome_usuario': new FormControl(null),
    'senha': new FormControl(null, [Validators.required, Validators.minLength(6)])
  })

  constructor(private autenticacao: Autenticacao, private router: Router) { }

  ngOnInit(): void {
  }

  get f() { return this.formulario.controls; }

  public exibirPainelLogin(): void{
    this.exibirPainel.emit('login')
  }
  public cadastrarUsuario(): void{
    //console.log(this.formulario)
    let usuario: Usuario = new Usuario(
      this.formulario.value.email,
      this.formulario.value.nome_completo,
      this.formulario.value.nome_usuario,
      this.formulario.value.senha
    )
    this.autenticacao.cadastrarUsuario(usuario)
      .then(()=> this.exibirPainelLogin())
  }
}
