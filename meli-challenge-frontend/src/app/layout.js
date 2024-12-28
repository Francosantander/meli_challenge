import '@/styles/globals.scss'

export const metadata = {
  title: 'Mercado Libre Challenge',
  description: 'Challenge de Frontend para Mercado Libre',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  )
}