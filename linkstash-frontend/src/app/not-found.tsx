import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='columns-1 border-2 justify-center '>
      <div>
          <h2>Kennot find ler....</h2>
          <p>Could not find requested resource</p>
          <Link href="/">Return Home</Link>
      </div>
    </div>
  )
}