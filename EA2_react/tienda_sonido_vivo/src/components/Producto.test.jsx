import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Producto from './Producto'
import { AuthProvider } from '../context/AuthContext'
import { InventarioProvider } from '../context/InventarioContext'
import { CartProvider } from '../context/CartContext'

// Producto de prueba. El id no existe en el catálogo real, así que
// el stock que vale es el que le pasamos aquí (3 unidades).
const productoBase = {
    id: 'TEST01',
    nombre: 'Guitarra de Prueba',
    marca: 'Yamaha',
    modelo: 'X1',
    categoria: 'Guitarras Acústicas',
    descripcion: 'Descripción de prueba',
    precio: 150000,
    stock: 3,
}

// Producto necesita Router (por el Link) y los contextos (por el carrito)
const renderProducto = (props = {}) => {
    render(
        <MemoryRouter>
            <AuthProvider>
                <InventarioProvider>
                    <CartProvider>
                        <Producto {...productoBase} {...props} />
                    </CartProvider>
                </InventarioProvider>
            </AuthProvider>
        </MemoryRouter>
    )
}

// Cada prueba parte con el almacenamiento vacío (carrito, sesión, stock)
beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
})

describe('Componente Producto', () => {
    test('muestra el nombre del producto', () => {
        renderProducto()
        expect(screen.getByText('Guitarra de Prueba')).toBeInTheDocument()
    })

    test('muestra el precio del producto', () => {
        renderProducto()
        expect(screen.getByText('$150.000')).toBeInTheDocument()
    })

    test('muestra el stock disponible', () => {
        renderProducto()
        expect(screen.getByText('Stock: 3')).toBeInTheDocument()
    })

    test('muestra "Agotado" y bloquea el botón si no hay stock', () => {
        renderProducto({ stock: 0 })
        expect(screen.getByText('Agotado')).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: /agregar al carrito/i })
        ).toBeDisabled()
    })

    test('muestra un mensaje de éxito al agregar al carrito', async () => {
        const user = userEvent.setup()
        renderProducto()

        await user.click(screen.getByRole('button', { name: /agregar al carrito/i }))

        expect(
            screen.getByText('¡Se han agregado 1 unidad(es) al carrito!')
        ).toBeInTheDocument()
    })

    test('no permite agregar más unidades que el stock', async () => {
        const user = userEvent.setup()
        renderProducto()

        const boton = screen.getByRole('button', { name: /agregar al carrito/i })

        // Con stock 3, los tres primeros clics funcionan y el cuarto se rechaza
        await user.click(boton)
        await user.click(boton)
        await user.click(boton)
        await user.click(boton)

        expect(
            screen.getByText(
                '¡No puedes agregar más! El stock máximo disponible es de 3 unidades.'
            )
        ).toBeInTheDocument()
    })
})