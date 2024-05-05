
import * as Yup from 'yup'

export interface formProps{ // Criando as propriedades do formik (formulario)
    name: string;
    tags: string;
    file: string | Blob ;
}
export const FormScheme: formProps = {name: '', tags: '', file: '' } // Valores iniciais do formulário

export const formValidationScheme = Yup.object().shape({ // Criando validações pro formik 
    name: Yup.string().trim()
    .required('Name is required')
    .max(50, 'Name have limited of 50 characters'),

    tags: Yup.string().trim()
    .required('Tags is required')
    .max(20, 'Tags have limited of 20 characters'),

    file: Yup.mixed<Blob>().required('Select an image to upload!')
                           .test('size', 'File size cannot be higher than 4MB', (file)=> {
                           return file.size < 4000000;
                           })
                           .test('type', 'Accepted formats: jpeg, gif or png', (file) => {
                           return file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif';

  })
})
