import Link from "next/link";

export default function Home() {
    return (<>
        <Link href={"/users"} className="">Manage users</Link>
        <Link href={"/import"} className="">Import</Link>
    </>)
}