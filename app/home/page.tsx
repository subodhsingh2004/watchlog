import Home from "@/components/Home";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function HomePage() {
    const response = await prisma.watchlog.findMany({
        where: { status: "watched" },
        include: { content: true },
    })

    let data = response.map(item => item.content.name);

    return (
        <div className="flex flex-col w-full h-full text-sm p-5">

            {
                data.length === 0 && <span className="text-[#212121]">No watched content yet</span>
            }

            <div className="w-full h-full flex overflow-y-scroll">
                <Home watchlogs={data} />
            </div>

        </div>
    )
}