'use client'
import { useSession,signOut } from 'next-auth/react'
import { User } from 'next-auth'
import React from 'react'
import Link from 'next/link'

const Navbar = () => {
    const {data: session}=useSession();
    const user = session?.user as User;//this is known as Assertion, where we assign the data according to session.user 
  return (
    <nav className='p-4 md:p-6 shadow-md'>
      <div className='container mx-auto flex justify-between items-center flex-col md:flex-row'>
        <Link href='/' className='text-xl font-bold mb-4 md:mb-0'>Mystery Message</Link>
        {session? (<><span className='mr-4'>Welcome, {user?.username || user?.email}</span> 
        <button className='w-full md:w-auto border py-2 px-4 border-black rounded-md hover:bg-slate-700 hover:text-white' onClick={()=>signOut()}>Logout</button></>):
        (<Link href='/sign-in'><button className='w-full md:w-auto border py-2 px-4 border-black rounded-md hover:bg-slate-700 hover:text-white'>Login</button></Link>) }
      </div>
    </nav>
  )
}

export default Navbar
