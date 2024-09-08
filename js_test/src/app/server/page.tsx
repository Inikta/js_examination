import { options } from "../api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth/next"
import UserCard from "../components/UserCard"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await getServerSession(options)
  
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/server')
  }

  return (
    <>
    {
      session ? (
        <UserCard user = {session?.user} pagetype = {"Home"} />
      ) : (
        <h1 className="text-4xl">Access denied.</h1>
      )
    }
    </> 
  );
}
