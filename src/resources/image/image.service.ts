
import { url } from "inspector";
import { Image } from "./image.resources";
import { METHODS } from "http";
import { Header } from "next/dist/lib/load-custom-routes";
import { resolve } from "path";
import { json } from "stream/consumers";
import { useNotification } from '@/components'
import { useUserService } from "./user/user.service";
import { use } from "react";

class ImageService {
    baseUrl: string = process.env.NODE_ENV + '/vi/images'; // Api para buscar imagens no banco de dados
    user = useUserService();
   

    async buscar(query: string = "", extension: string = "") : Promise<Image[]> { // método que promete uma lista de image (O que o fetch irá retornar). Image está no resources, aonde tem a representação dos dados.
        const userSession = this.user.getUserSession(); // Buscando os dados da sessão do usuário (token)
        const url = `${this.baseUrl}?query=${query}&extension=${extension}`; // Criando a url da pesquisa com adicionais: Query e extension (Que podem ou não serem passadas no parametro da busca)
        const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${userSession?.acessToken}` // Definindo autorização dos headers passando o Beader e o token na requisição.
        }

        }); // o fetch faz a busca em rede com base na url fornecida. Quando colocamos apenas o fetch sozinho, ele faz um get (uma busca)
        return await response.json(); // retornando o a busca do fetch em json.
        // resumindo: O fetch fará um get com base na url fornecida. Essa url é a api do back end que irá retornar pra nós o que está no banco de dados!
    }
    async salvar(dados: FormData) : Promise<String>{
        const userSession = this.user.getUserSession(); // Buscando os dados da sessão do usuário (token)
        const Response = await fetch(this.baseUrl, {
            method: 'POST',
            body: dados,
             headers: {
            "Authorization": `Bearer ${userSession?.acessToken}` // Definindo autorização dos headers passando o Beader e o token na requisição.
        }
        })

        return Response.headers.get('location') ?? '' // ?? serve para caso a string for fazia ou nula
    }
    
    }
export const useImageService = () => new ImageService(); // Dizendo que no useImageService representa a classe ImageService