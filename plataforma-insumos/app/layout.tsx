import type { Metadata } from 'next'
// 1. Importamos Roboto desde el optimizador de Google Fonts de Next.js
import { Roboto } from 'next/font/google'
import './globals.css'

// 2. Configuramos la fuente con los grosores que necesitamos (regular, medio, negrita)
const roboto = Roboto({ 
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Catálogo de Insumos Impresión - DAEM San Antonio',
  description: 'Plataforma de solicitud de insumos de impresión.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      {/* 3. Le inyectamos la clase de Roboto directamente a la etiqueta body */}
      <body className={`${roboto.className} bg-gray-50 text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  )
}