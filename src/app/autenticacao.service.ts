import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Usuario } from "./acesso/usuario.model";
import * as firebase from "firebase";


@Injectable()
export class Autenticacao{

    public token_id: string | null | undefined
    public token_fireBase: string = ''


    constructor(private router: Router) {}


    public cadastrarUsuario(usuario: Usuario): Promise<any>{
        return firebase.auth().createUserWithEmailAndPassword(usuario.email, usuario.senha)
            .then((resposta: any)=>{
                delete usuario.senha
                this.salvarDadosDoUsuario(usuario,3)
                return resposta
            })
    }
    public autenticar(email: string, senha: string): void{
        firebase.auth().signInWithEmailAndPassword(email, senha)
            .then((resposta: any)=>{
                firebase.auth().currentUser.getIdToken()
                    .then((idToken: string)=>{
                        this.token_id = idToken
                        localStorage.setItem('idToken', idToken)
                        this.router.navigate(['/home'])
                    })
            })
            .catch((erro: Error)=>{
                console.log(erro);
            })
    }
    public salvarDadosDoUsuario(dadosUser: any, retry: number): void {
 
        // registrando dados complementares do usuário no path email na base64
        firebase.database().ref(`usuario_detalhe/${btoa(dadosUser.email)}`)
            .set(dadosUser)
            .then((resposta) => {
                console.log('Dados do usuário salvo com sucesso na base', resposta)
            })
            .catch((error: Error) => {
                console.log('Erro ao salvar dados do usuario BD Firebase', error)
                if (retry > 0) { // Condição para mais tentativas de salvar dados
                    this.salvarDadosDoUsuario(dadosUser, (retry - 1))
                }
            })
    }
    public autenticado(): boolean{

        if(this.token_id === undefined && localStorage.getItem('idToken') != null){
            this.token_id = localStorage.getItem('idToken')
        }
        if(this.token_id === undefined){
            this.router.navigate(['/'])
        }

        return this.token_id !== undefined
    }
    public sair(): void{
        firebase.auth().signOut()
            .then(()=>{
                localStorage.removeItem('idToken')
                localStorage.removeItem(this.token_fireBase)
                this.token_id = undefined
                this.token_fireBase = ''
                this.router.navigate(['/'])
            })
        
    }
}