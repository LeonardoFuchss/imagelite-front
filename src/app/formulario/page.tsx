'use client'
import { Template, RenderIf, useNotification, AuthenticatePage} from '@/components'
import Link from 'next/link'
import React, { useState } from 'react'
import { useImageService } from '@/resources/image/image.service'
import { useFormik } from 'formik'
import { formProps, FormScheme, formValidationScheme } from './formScheme'

export default function FormularioPage() {

    const service = useImageService(); // Instanciando service
    const [imagePreview, setImagePreview] = useState(''); // Imagem para preview
    const [loading, setLoading] = useState<Boolean>(false) // Carregamento do send
    const notifications = useNotification();


    const formik = useFormik<formProps>({ // criando o formik com os dados da propriedade formProps // todos os arquivos setados no formik serão setados no formProps
        initialValues: FormScheme, onSubmit: handleSubmit, validationSchema: formValidationScheme // No submit do formik, chamar o handleSubmit para acessar a api
    })

    async function handleSubmit(props: formProps) { // chamando os dados setados(através do formik) localizados na propriedade e setando eles no formData.
        setLoading(true)

        const formData = new FormData; // Setando os dados do formProps no formData para enviar para a api
        formData.append("file", props.file)
        formData.append("tags", props.tags)
        formData.append("name", props.name)

        await service.salvar(formData) // Enviando para api

        // Depois da execução:
        formik.resetForm();
        setImagePreview("")
        setLoading(false)
        notifications.notify('Upload sent sucessfully!', 'success')

    }

    function onFileUpload(event: React.ChangeEvent<HTMLInputElement>) { // Upload da imagem através do arquivo passado no botão "click to upload"
        if (event.target.files) {
            const file = event.target.files[0]
            formik.setFieldValue("file", file) // seta o arquivo encontrado no formik
            const imageUrl = URL.createObjectURL(file) // Cria uma url
            setImagePreview(imageUrl) // seta a url criada no imagePreview
        }

    }

    return (
       <AuthenticatePage>
            <Template loading={loading}>
                <section className='flex flex-col items-center justify-center my-5'>
                    <h5 className='mt-3 mb-10 text-3x1 font-extrabold tracking-tight text-gray-900'>NEW IMAGE</h5>

                    <form onSubmit={formik.handleSubmit} >

                        <div className='grid grid-cols-1'>

                            <label>Name: </label>
                            <input id='name' onChange={formik.handleChange} value={formik.values.name} type="text" className='rounded-lg bg-indigo-200 border px-2 py-1' placeholder="Enter the name of the image" />
                            <span className='text-red-500'> {formik.errors.name} </span>

                            <label className='mt-4'>Tags: </label>
                            <input id='tags' onChange={formik.handleChange} value={formik.values.tags} type="text" className='rounded-lg bg-indigo-200 border px-2 py-1' placeholder="Enter the comma-separated tag" />
                            <span className='text-red-500'>{formik.errors.tags}</span>

                            <label className='mt-4'>Image: </label>
                            <div className='mt-2 flex justify-center rounded-lg border border-dashed border-indigo-900 px-6 py-10'>
                                <div className='text-center'>

                                    <RenderIf condition={!imagePreview}>
                                        <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd"></path>
                                        </svg>
                                    </RenderIf>

                                    <div className='mt-4 flex text-sm leading-6 text-gray-600'>
                                        <label className='relative cursor-pointer rounded-md bg-white font-semibold text-indigo-950'>
                                            <RenderIf condition={!imagePreview}>
                                                <span>Click to upload </span>
                                            </RenderIf>

                                            <input onChange={onFileUpload} type="file" className='sr-only' />
                                            <RenderIf condition={!!imagePreview}>
                                                <img src={imagePreview} width={150} className='rounded-md' />
                                            </RenderIf>
                                            <span className='text-red-500'>{formik.errors.file}</span>

                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-5 flex items-center justify-end gap-x-24'>
                            <Link href={"/galeria"}>
                                <button type='button' className='mx-1 border px-2 py-1 bg-indigo text-gray-700 bg-indigo-600 rounded-lg hover:bg-indigo-950'>
                                    BACK
                                </button>
                            </Link>

                            <button type='submit' className='mx-1 border px-2 py-1 bg-indigo text-gray-700 bg-indigo-600 rounded-lg hover:bg-indigo-950'>
                                SAVE
                            </button>

                        </div>
                        {

                        }
                    </form>
                </section>
            </Template>
        </AuthenticatePage>    
    )
}