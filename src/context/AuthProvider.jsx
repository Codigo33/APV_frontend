import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/axios";

const AuthContext = createContext()

const AuthProvider = ({children}) => {

    const [ cargando, setCargando ] = useState(true)
    const [ auth, setAuth ] = useState({})

    // Comprobando sesion a traves de token
    useEffect(() => {
        const autenticarUsuario = async () => {
            const apv_token = localStorage.getItem("apv_token")
            if (!apv_token) {
                setCargando(false)
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apv_token}`
                }
            }

            try {
                const { data } = await clienteAxios("/veterinarios/perfil", config)
                setAuth(data)
            } catch (error) {
                setAuth({})
            }

            setCargando(false)
        }
        autenticarUsuario()
    }, [])

    const cerrarSesion = () => {
        localStorage.removeItem("apv_token")
        setAuth({})
    }

    const actualizarPerfil = async datos => {
        const apv_token = localStorage.getItem("apv_token")
        if(!apv_token) {
            setCargando(false)
            return
        }
        const config = {
            headers: {
                "Content-Type": "application/json", 
                Authorization: `Bearer ${apv_token}`
            }
        }

        try {
            const url = `/veterinarios/perfil/${datos._id}`
            await clienteAxios.put(url, datos, config)

            return {
                msg: 'Almacenado Correctamente'
            }
        } catch (error) {
            return {
                msg: error.response.data.msg,
                error: true
            }
        }
    }

    const guardarPassword = async (datos) => {
        const apv_token = localStorage.getItem("apv_token")
        if(!apv_token) {
            setCargando(false)
            return
        }
        const config = {
            headers: {
                "Content-Type": "application/json", 
                Authorization: `Bearer ${apv_token}`
            }
        }

        try {
            const url = '/veterinarios/actualizar-password'

            const { data } = await clienteAxios.put(url, datos, config)
            console.log(data) 

            return {
                msg: data.msg
            }
        } catch (error) {
            return {
                msg: error.response.data.msg,
                error: true
            }
        }

    }

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesion,
                actualizarPerfil,
                guardarPassword
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext