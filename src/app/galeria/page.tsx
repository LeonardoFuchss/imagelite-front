'use client'
import { Template, ImageCard, useNotification, AuthenticatePage } from "@/components";
import { useState } from "react"; // useState é um react hook que faz executar algo
import { useImageService } from '@/resources/image/image.service'
import { Image } from "@/resources/image/image.resources";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import Link from "next/link";
import { useEffect } from "react";
import { useUserService } from "@/resources/image/user/user.service";


export default function GaleriaPage() {
  
    const useService = useImageService(); // Instanciando a classe de serviço.
    const notifications = useNotification()
    const [image, setImage] = useState<Image[]>([]); // Valores que serão modificados quando setados
    const [query, setQuery] = useState<string>('') // Valores que serão modificados quando setados
    const [extension, setExtension] = useState<string>('') // Valores que serão modificados quando setados
    const [loading, setLoading] = useState<Boolean>(false)
    
    

    async function searchImage() { // Busca de imagem
        setLoading(true); // Ao clicar na busca vai exibir a mensagem do loading
        const result = await useService.buscar(query, extension) // Chama o método que retorna a api do banco de dados e armazena em result. Caso a query tenha valor, irá buscar com a query digitada no input.
        setImage(result); // setando as images do resource com o resultado da busca na Api!
        setLoading(false); // Ao carregar a busca vai finalizar o loading

        if(!result.length){
            notifications.notify('No result found', 'warning')
        } else {
            notifications.notify('Images found!', 'success')
        }
    }

    function renderImageCard(image: Image) { // Está buscando as images do resources e retornando dentro do componente imageCard
        return (<ImageCard nome={image.name} src={image.url} tamanho={image.size} extension={image.extension} dataUpload={image.uploadDate}>
        </ImageCard>
        )
    }
    function renderImageCards() { // Renderizando images e chamando método que possui o componente image card
       return image.map(renderImageCard)
    }

    useEffect(() => {
        searchImage();
    }, [])
    

    return ( // Conteudo do template
    <AuthenticatePage>
        
        <Template loading={loading}>
        
            <section className="flex-flex-col justify-center text-center text-indigo-600  font-bould p-3 rounded-lg shadow-md ">
               <h1 style={{  fontSize: '30px', fontWeight: 'bold', color: '#4C51BF' }}>
                IMAGE GALERY
                </h1>
            </section>
            

            <section className="flex flex-col justify-center items-center my-5">

                <div className="flex space-x-4 my-4">
                    <input type="text"
                        placeholder="Search Image"
                        style={{ color: '#A9A9A9' }}
                        onChange={event => setQuery(event.target.value)} // o valor digitado será setado na Query
                        className="bg-indigo-600 border px-2 py-1 rounded-lg text-gray-900 hover:bg-indigo-950" />

                    <select onChange={event => setExtension(event.target.value)} style={{ color: '#ffffff' }} className="color-indigo-950 bg-indigo-600 border py-1 rounded-lg hover:bg-indigo-950">
                        <option value="">Formats</option>
                        <option value="PNG">png</option>
                        <option value="JPEG">jpeg</option>
                        <option value="GIF">gif</option>
                    </select>

                    <button className="border px-3 py-1 bg-indigo-600 rounded-lg text-gray-700 hover:bg-indigo-950" onClick={searchImage}>
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                    <Link href={"/formulario"}>
                    <button className="border px-2 py-1 bg-indigo text-gray-700 bg-indigo-600 rounded-lg hover:bg-indigo-950">
                    New
                    </button>
                    </Link>
                    <Link href={"/login"}>
                    <button className="border px-2 py-1 bg-indigo text-gray-700 bg-indigo-600 rounded-lg hover:bg-indigo-950">
                        Close
                    </button>
                    </Link>
                  </div>
                  
                  <section className="grid grid-cols-4 gap-8">
                {
                    renderImageCards()
                }
                  </section>
                  
            </section>
        </Template>
        </AuthenticatePage>    
    )
}