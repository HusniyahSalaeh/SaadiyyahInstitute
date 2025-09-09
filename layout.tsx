export const metadata = {
  title: "EduCartoon — Storefront",
  description: "แหล่งรวมใบงาน คอร์สออนไลน์ และหนังสือการ์ตูนเพื่อการเรียนรู้สนุก ๆ",
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  )
}
