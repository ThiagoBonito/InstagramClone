import * as firebase from "firebase"
import { Progresso } from "./progresso.service"
import { Injectable } from "@angular/core"

@Injectable()
export class Bd{

    constructor(private progresso: Progresso) {}


    public publicar(publicacao: any): void{
        console.log(publicacao)
        
        firebase.database().ref(`publicacoes/${btoa(publicacao.email)}`)
            .push( {titulo: publicacao.titulo})
            .then((resposta: any)=>{
                let nomeImagem = resposta.key
                firebase.storage().ref()
                    .child(`imagens/${nomeImagem}`)
                    .put(publicacao.imagem)
                    .on(firebase.storage.TaskEvent.STATE_CHANGED,
                    (snapshot: any) => {
                        this.progresso.status = 'andamento'
                        this.progresso.estado = snapshot
                        //console.log('Snapshot capturado no on() ',snapshot)
                    },
                    (error) => {
                        this.progresso.status = 'erro'
                        //console.log(error)
                    },
                    () => {
                        this.progresso.status = 'concluido'
                        //console.log('Upload Completo')
                }    
            )
        })
    }
    public consultaPublicacoes(emailUsuario: string): Promise<any>{
        return new Promise((resolve,reject)=>{
                // consultar as publicações  (database)
            firebase.database().ref(`publicacoes/${btoa(emailUsuario)}`)
            .orderByKey()
            .once('value')
            .then((snapshot: any)=>{
                let publicacoes: Array<any> = []

                snapshot.forEach((childSnapshot: any)=>{
                    let publicacao = childSnapshot.val() 
                    publicacao.key = childSnapshot.key
                    publicacoes.push(publicacao)
                })
                return publicacoes.reverse()
            })
            .then((publicacoes: any)=>{
                publicacoes.forEach((publicacao)=>{
                    //consultar a url da imagem  (storage)
                    firebase.storage().ref()
                        .child(`imagens/${publicacao.key}`)
                        .getDownloadURL()
                        .then((url: string)=>{
                            publicacao.url_imagem = url

                            //consultar o nome do usuario
                            firebase.database().ref(`usuario_detalhe/${btoa(emailUsuario)}`)
                                .once('value')
                                .then((snapshot: any)=>{
                                    publicacao.nome_usuario = snapshot.val().nome_usuario
                            })
                        })
                })
                resolve(publicacoes)
            })
        })
        
    }
}