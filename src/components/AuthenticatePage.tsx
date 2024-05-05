import Login from "@/app/login/page";
import { useUserService } from "@/resources/image/user/user.service";

interface authenticatedPageProps {
    children: React.ReactNode
}
export const AuthenticatePage: React.FC<authenticatedPageProps> = ({
    children
}) => {

    const service = useUserService(); // Instaciando a classe de serviço
    if(!service.isSessionValid()){ // Se a verificação de sessão válida for false, encaminha para página de Login
        return <Login></Login>
    }
    
    return( // Caso contrário, executa o children (conteúdo das páginas)
        <>
        {children}
        </>
    )
}