import { toast } from 'react-toastify'

export const useNotification = () => {

    function notify(message: string, level: "success" | "info" | "error" | "warning") {
        toast(message, {
            type: level
        })
    }
    return {
        notify
    }
}
