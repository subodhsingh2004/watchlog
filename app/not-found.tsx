import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col">
            <p className="text-red-500">404 This page doesn't exists</p>
            <Link href={"/home"} className="text-sm mt-2 hover:underline underline-offset-2">Go back</Link>
        </div>
    )
}