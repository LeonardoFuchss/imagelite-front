'use client'
import { Template, RenderIf, useNotification } from "@/components"
import { useState } from "react"
import { LoginForm, formScheme, validationScheme } from "./formScheme";
import { useFormik } from "formik";
import { useUserService } from "@/resources/image/user/user.service";
import { Credentials, AcessToken, User } from "@/resources/image/user/user.resources";
import { useRouter } from "next/navigation";



export default function Login() {

    const [loading, setLoading] = useState<boolean>(false);
    const [newUserState, setNewUserState] = useState<boolean>(false)
    const service = useUserService();
    const notification = useNotification();
    const router = useRouter();

    const formik = useFormik<LoginForm>({
        initialValues: formScheme,
        validationSchema: validationScheme,
        onSubmit: Submit,
    })

    async function Submit(values: LoginForm) {

        if (!newUserState) {
            const credentials: Credentials = { email: values.email, password: values.password };
            try {
                const acessToken: AcessToken = await service.authenticate(credentials);
                service.initSession(acessToken) // Passando o token gerado para o método de iniciar sessão!
                console.log("Sessão está válida? ", service.isSessionValid())
                router.push("/galeria")
            } catch (error: any) {
                const message = error?.message;
                notification.notify(message, "error")
            }
        } else {
            const user: User = { name: values.name, email: values.email, password: values.password }
            try {
                await service.save(user);
                notification.notify("Sucess on saving user!", "success")
                setNewUserState(false)
                formik.resetForm();
            } catch (error: any) {
                const message = error?.message;
                notification.notify(message, "error")
            }

        }
    }
   
    return (
        <Template >
            
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8" >
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <RenderIf condition={newUserState}>
                        <h2 className="mt-10 text-center text-1x1 font-bould leading-9 tracking-tight text-gray-900">
                            Create new user
                        </h2>
                    </RenderIf>
                    <RenderIf condition={!newUserState}>
                        <h2 className="mt-10 text-center text-1x1 font-bould leading-9 tracking-tight text-gray-900">
                            Login to your account
                        </h2>
                    </RenderIf>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

                    <form onSubmit={formik.handleSubmit} className="space-y-3">

                        <RenderIf condition={newUserState}>

                            <label className="block text-sm font-medium leading-6 text-gray-900">Name:</label>
                            <input id='name' type="text" value={formik.values.name} onChange={formik.handleChange} style={{ borderWidth: "2px" }} className="w-full border rounded-lg px-2 py-1 bg-indigo-600" placeholder="Name" />
                            <span className='text-red-500'> {formik.errors.name} </span>

                        </RenderIf>

                        <label className="block text-sm font-medium leading-6 text-gray-900">Email:</label>
                        <input id='email' type="text" value={formik.values.email} onChange={formik.handleChange} style={{ borderWidth: "2px" }} className="w-full border rounded-lg px-2 py-1 bg-indigo-600" placeholder="Email" />
                        <span className='text-red-500'> {formik.errors.email} </span>

                        <label className="block text-sm font-medium leading-6 text-gray-900">Password:</label>
                        <input id='password' type="Password" value={formik.values.password} onChange={formik.handleChange} style={{ borderWidth: "2px" }} className="w-full border rounded-lg px-2 py-1 bg-indigo-600" placeholder="Password" />
                        
                        <span className='text-red-500'> {formik.errors.password} </span>

                        <RenderIf condition={newUserState}>

                            <label className="block text-sm font-medium leading-6 text-gray-900">Repeat password:</label>
                            <input id='passwordMatch' value={formik.values.passwordMatch} onChange={formik.handleChange} style={{ borderWidth: "2px" }} type="Password" className="w-full border rounded-lg px-2 py-1 bg-indigo-600" placeholder="Password" />
                            <span className='text-red-500'> {formik.errors.passwordMatch} </span>

                        </RenderIf>

                        <div>
                            <RenderIf condition={newUserState}>
                                <button type="submit" className='bg-indigo-950 hover:bg-indigo-600 border rounded-lg px-2 py-1' >Save</button>
                                <button className='mx-2 bg-indigo-950 hover:bg-indigo-600 border rounded-lg px-2 py-1' onClick={event => setNewUserState(false)}>Cancel</button>
                            </RenderIf>
                            <RenderIf condition={!newUserState}>
                                <button type="submit" className='bg-indigo-950 hover:bg-indigo-600 border rounded-lg px-2 py-1' onChange={event => formik.resetForm()} >Login</button>
                                <button className='mx-2 bg-indigo-950 hover:bg-indigo-600 border rounded-lg px-2 py-1' onClick={event => setNewUserState(true)}>Sign Up</button>

                            </RenderIf>

                        </div>
                    </form>
                </div>
            </div>
        </Template>

    )
}