import { createContext, useState, useEffect } from "react";
import clienteAxios from "../config/axios"
import useAuth from "../hooks/useAuth"

const PacientesContext = createContext()

export const PacientesProvider = ({ children }) => {

    const [pacientes, setPacientes] = useState([])
    const [paciente, setPaciente] = useState({})
    const { auth } = useAuth

    useEffect(() => {
        const obtenerPacientes = async () => {
            try {
                const apv_token = localStorage.getItem("apv_token")
                if (!apv_token) return;
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${apv_token}`
                    }
                }
                const { data } = await clienteAxios("/pacientes", config)
                setPacientes(data)
            } catch (error) {
                console.log(error);
            }
        }
        obtenerPacientes()
    }, [auth])

    // Guarda los pacientes en la BD
    const guardarPaciente = async (paciente) => {

        const apv_token = localStorage.getItem("apv_token")
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apv_token}`
            }
        }

        if (paciente.id) {
            try {
                const { data } = await clienteAxios.put(`/pacientes/${paciente.id}`, paciente, config)

                const pacientesActualizado = pacientes.map(pacienteState => paciente._id === data._id ? data : pacienteState)

                setPacientes(pacientesActualizado)
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                const { data } = await clienteAxios.post("/pacientes", paciente, config)
                const { createdAt, updatedAt, __v, ...pacienteAlmacenado } = data
                setPacientes([pacienteAlmacenado, ...pacientes])
            } catch (error) {
                console.log(error.response.data.msg);
            }
        }

    }

    const setEdicion = (paciente) => {
        setPaciente(paciente)
    }

    const eliminarPaciente = async (id) => {
        const confirmar = confirm("¿Realmente queres eliminar el registro?")
        if (confirmar) {
            try {
                const apv_token = localStorage.getItem("apv_token")
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${apv_token}`
                    }
                }
                const { data } = await clienteAxios.delete(`/pacientes/${id}`, config)

                const pacientesActualizado = pacientes.filter( pacientesState => pacientesState._id !== id)
                
                setPacientes(pacientesActualizado)
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <PacientesContext.Provider
            value={{
                pacientes,
                guardarPaciente,
                setEdicion,
                paciente,
                eliminarPaciente
            }}
        >
            {children}
        </PacientesContext.Provider>
    )

}

export default PacientesContext;