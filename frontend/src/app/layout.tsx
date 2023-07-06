import '@fontsource/raleway/600.css'
import '@fontsource/open-sans/400.css'
import Body from './Body'
import Header from '@/components/Header'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Typebout',
  description: 'Compete against your friends in typing'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Body>{children}</Body>
      </body>
    </html>
  )
}
