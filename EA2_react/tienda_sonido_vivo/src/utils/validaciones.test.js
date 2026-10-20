import { describe, test, expect } from 'vitest'
import { validarEmail, validarPassword, validarNombre } from './validaciones'

describe('validarEmail', () => {
    test('acepta un correo válido', () => {
        expect(validarEmail('demo@sonidovivo.cl')).toBe(true)
    })

    test('rechaza un correo sin @', () => {
        expect(validarEmail('demo.sonidovivo.cl')).toBe(false)
    })

    test('rechaza un correo sin dominio', () => {
        expect(validarEmail('demo@')).toBe(false)
    })
})

describe('validarPassword', () => {
    test('acepta una contraseña con letras y números', () => {
        expect(validarPassword('Demo123')).toBe(true)
    })

    test('rechaza una contraseña demasiado corta', () => {
        expect(validarPassword('a1')).toBe(false)
    })

    test('rechaza una contraseña sin números', () => {
        expect(validarPassword('abcdefgh')).toBe(false)
    })

    test('rechaza una contraseña sin letras', () => {
        expect(validarPassword('123456')).toBe(false)
    })
})

describe('validarNombre', () => {
    test('acepta un nombre con letras y espacios', () => {
        expect(validarNombre('Juan Pérez')).toBe(true)
    })

    test('rechaza un nombre con números', () => {
        expect(validarNombre('Juan123')).toBe(false)
    })

    test('rechaza un nombre demasiado corto', () => {
        expect(validarNombre('Jo')).toBe(false)
    })
})