import content from "@/content.json"

export default function ProfilePage() {
    return (
        <div className="flex flex-col w-full h-full text-sm p-5 overflow-y-scroll">
            <h2>User Profile</h2>

            <div className="mt-3 flex flex-col">
                <span className="text-sky-400">Name</span>
                <span className="text-[#d9d9d9]"> &gt; alpha</span>

                <span className="text-sky-400 mt-2">Joined on</span>
                <span className="text-[#d9d9d9]"> &gt; 16 June</span>

                <span className="text-sky-400 mt-2">Watch count</span>
                <span className="text-[#d9d9d9]"> &gt; 50</span>
            </div>

            <div className="mt-3">
                <span className="text-[#606060]">Available commands</span>
                <ul>
                    <li>- logout</li>
                    <li>- twc</li>
                    <span className="ml-4 text-[#b0b0b0]">to get your total watch count</span>
                </ul>
            </div>

            <div className="mt-3">
                <span className="text-green-500">watchlog#alpha:</span>
            </div>

            <div className="flex flex-col">
                {
                    content.map(c => (
                        <span key={c.name}>{c.name}</span>
                    ))
                }
            </div>

        </div>
    )
}