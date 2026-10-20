import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import InicioSesionpage from './InicioSesion'
import { AuthProvider } from '../context/AuthContext'
import { ToastProvider } from '../context/ToastContext'

// Función auxiliar para renderizar envolviendo en Router y Providers (igual que hiciste en Producto.test.jsx)
const renderInicioSesion = () => {
    render(
        <MemoryRouter>
            <ToastProvider>
                <AuthProvider>
                    <InicioSesionpage />
                </AuthProvider>
            </ToastProvider>
        </MemoryRouter>
    )
}

// Limpiar el almacenamiento local antes de cada test (Paso 18 de la guía)
beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
})

describe('Página de Inicio de Sesión', () => {

    // Paso 26 y 28 del PDF: Comprobar que existen el formulario y sus campos
    test('muestra el título y los campos del formulario', () => {
        renderInicioSesion()

        expect(screen.getByText('¡Hola de nuevo!')).toBeInTheDocument()
        expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument()
        expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument()
    })

    // Paso 30 del PDF: Probar escritura en el correo
    test('permite escribir el correo electrónico', async () => {
        const user = userEvent.setup()
        renderInicioSesion()

        const inputEmail = screen.getByLabelText('Correo Electrónico')
        await user.type(inputEmail, 'usuario@ejemplo.com')

        expect(inputEmail).toHaveValue('usuario@ejemplo.com')
    })

    // Paso 31 del PDF: Probar escritura en la contraseña
    test('permite escribir la contraseña', async () => {
        const user = userEvent.setup()
        renderInicioSesion()

        const inputPassword = screen.getByLabelText('Contraseña')
        await user.type(inputPassword, '123456')

        expect(inputPassword).toHaveValue('123456')
    })

    // Paso 32 del PDF: Probar un correo inválido
    test('muestra error cuando el correo no es válido', async () => {
        const user = userEvent.setup()
        renderInicioSesion()

        await user.type(screen.getByLabelText('Correo Electrónico'), 'correoinvalido')
        await user.type(screen.getByLabelText('Contraseña'), '123456')
        await user.click(screen.getByRole('button', { name: /Iniciar Sesión/i }))

        expect(
            screen.getByText('Ingresa un correo electrónico válido (ej. usuario@dominio.com).')
        ).toBeInTheDocument()
    })

    // Paso 33 del PDF: Probar validación de contraseña no ingresada
    test('muestra error cuando no se ingresa la contraseña', async () => {
        const user = userEvent.setup()
        renderInicioSesion()

        await user.type(screen.getByLabelText('Correo Electrónico'), 'usuario@ejemplo.com')
        await user.click(screen.getByRole('button', { name: /Iniciar Sesión/i }))

        expect(screen.getByText('Por favor ingresa tu contraseña.')).toBeInTheDocument()
    })

    // Paso 34 del PDF: Probar que no muestra errores cuando los campos son válidos
    test('no muestra errores de validación con datos válidos', async () => {
        const user = userEvent.setup()
        renderInicioSesion()

        await user.type(screen.getByLabelText('Correo Electrónico'), 'admin@sonidovivo.cl')
        await user.type(screen.getByLabelText('Contraseña'), 'admin123')
        await user.click(screen.getByRole('button', { name: /Iniciar Sesión/i }))

        // queryByText para verificar que los mensajes de error NO están presentes
        expect(
            screen.queryByText('Ingresa un correo electrónico válido (ej. usuario@dominio.com).')
        ).not.toBeInTheDocument()
        expect(
            screen.queryByText('Por favor ingresa tu contraseña.')
        ).not.toBeInTheDocument()
    })
})