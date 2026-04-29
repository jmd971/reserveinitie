import Navbar from '@/components/navigation/Navbar'

export default function MembersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-24">{children}</main>
    </>
  )
}
