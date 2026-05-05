import './globals.css'

export const metadata = {
  title: 'PG Manager Dashboard',
  description: 'Professional Property Management System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  )
}
