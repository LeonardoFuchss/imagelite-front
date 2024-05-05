'use client'
import { Template } from "@/components";
import { useUserService } from "@/resources/image/user/user.service";
import Login from "./login/page";
import GaleriaPage from "./galeria/page";
import { useRouter } from "next/router";

export default function home(){

    const useService = useUserService();
    const userValid = useService.getUserSession();
    
    

        if(!userValid){
            return <Login></Login>
        }

       return <GaleriaPage></GaleriaPage>
}