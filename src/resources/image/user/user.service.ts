import { url } from "inspector";
import { METHODS } from "http";
import { Header } from "next/dist/lib/load-custom-routes";
import { resolve } from "path";
import { json } from "stream/consumers";
import { useNotification } from '@/components'
import { User, AcessToken, Credentials, UserSessionToken } from "./user.resources";
import jwt from 'jwt-decode'

class UserService {
    baseUrl: string = process.env.NODE_ENV + '/vi/user'; // Api de usuários no banco de dados
    static AUTH_PARAM: string = "_auth";

    async authenticate(credentials: Credentials): Promise<AcessToken> {
        const userGetToken = this.getUserSession();
        const Response = await fetch(this.baseUrl + "/auth", {
            method: 'POST',
            body: JSON.stringify(credentials), // passando as credentials string para json string
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userGetToken?.acessToken}`
            }
        });
        if (Response.status == 401) {
            throw new Error("User or password are incorrent!")
        }
        return await Response.json();
    }

    async save(user: User): Promise<void> {
        const Response = await fetch(this.baseUrl, {
            method: 'POST',
            body: JSON.stringify(user), // passando as credentials json para string
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (Response.status == 409) {
            throw new Error("User already exists!")
        }
    }

    initSession(token: AcessToken) { // Método para decodificar o token gerado no método authenticate
    if(token.acessToken){ // se existir um token
    const decodedToken: any = jwt(token.acessToken) // decodificando o token através da biblioteca jwt armazenando na variável decodedToken
    
    const userSessionToken: UserSessionToken = {  // Iniciando sessão do usuário (resources) através dos dados do token decodificados!
        acessToken: token.acessToken,
        email: decodedToken.sub, 
        name: decodedToken.name,
        expiration: decodedToken.exp
        
    }
    this.setUserSession(userSessionToken) // chamando o método para salvar o usuário na sessão e passando a sessão do usuário com o token decodificado.
    }
    
  }
  setUserSession(userSessionToken: UserSessionToken) { // Método para salvar o usuário na sessão através do localSorage (método global)
    try {
        localStorage.setItem(UserService.AUTH_PARAM, JSON.stringify(userSessionToken))

    } catch{}
    
  }

  getUserSession() : UserSessionToken | null {
    try {
        const authString = localStorage.getItem(UserService.AUTH_PARAM);
        if(!authString){
            return null
        }
        const token: UserSessionToken = JSON.parse(authString);
        return token;
    } catch(error){
        return null;
    }
  
  }

  isSessionValid(): boolean { // Método para verificar se a sessão do usuário ainda esta válida
    const userSession: UserSessionToken | null = this.getUserSession(); // Acessando a sessão do usuário
    if(!userSession){ // Se a sessão do usuário não existir, retorna false
        return false
    }
    const expiration: number | undefined  = userSession.expiration; // Se a sessão do usuário existir, acessamos a data de expiração do token
    if(expiration) {
        const expirationDateInMillies = expiration * 1000; // Passando a data de expiração para 60 minutos a partir da data atual
       return new Date < new Date(expirationDateInMillies); // Vai retornar a data apenas quando a data atual for menor que a data de expiração 
    }
    return false; // Se a data atual for maior que a data de expiração, retorna falso.
  }
  inavidateSession(): void {
    try {
        localStorage.removeItem(UserService.AUTH_PARAM);
    } catch{}
  }
}
export const useUserService = () => new UserService(); // Dizendo que no useImageService representa a classe ImageService