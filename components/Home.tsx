'use client'

import { addContent, getDetailsOfTheContent } from "@/actions/action";
import { useEffect, useRef, useState } from "react";
import content from "@/content.json";
import { ContentType } from "@/app/generated/prisma/enums";
import { useIsMobile } from "@/hooks/useIsMobile";

const initialLogs = [
    { text: " ", style: "" },
]
const availabeCommands = ['count', 'clear', 'save']
const terminalPrompt = "watchlog:~$"

const regex = /^(?<action>add)\s+(?<type>kmovie|anime|kdrama)\s+"(?<name>[^"]+)"\s+(?<year>\d{4})\s+ep(?<episode>\d+)s(?<season>\d+)$/;

export default function Home({ watchlogs }: { watchlogs: string[] }) {

    const isMobile = useIsMobile();

    const inputRef = useRef<HTMLInputElement | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLSpanElement | null>(null);

    const [cursorPos, setCursorPos] = useState(0);
    const [input, setInput] = useState("");
    const [logs, setLogs] = useState(initialLogs);


    // A utility function to append the logs 
    const appendLog = (...lines: { text: string, style: string }[]) => {
        setLogs(prev => [...prev, ...lines])
    }

    // this hanldes all the commands, and which output to display
    const handleSubmit = async () => {

        const userCommand = input.trim().toLowerCase();
        if (!userCommand) return;

        // for unknown commands
        if (!availabeCommands.includes(userCommand) && !watchlogs.includes(userCommand) && !userCommand.match(regex)) {
            appendLog(
                { text: `${terminalPrompt} ${userCommand}`, style: "" },
                { text: "x invalid command", style: "text-red-500" }
            )
            setInput("");
            return;
        }

        if (userCommand === 'clear') {
            setLogs([]);
            appendLog(
                { text: " ", style: "" }
            )
            setInput("");
            return;
        }

        else if (userCommand === "count") {
            appendLog(
                { text: `${terminalPrompt} ${userCommand}`, style: "" },
                { text: `${watchlogs.length}`, style: "text-[#606060]" }
            )
            setInput("");
            return;
        }

        else if (watchlogs.includes(userCommand)) {

            const response = await getDetailsOfTheContent(userCommand)
            if (!response) {
                appendLog(
                    { text: `${terminalPrompt} ${userCommand}`, style: "" },
                    { text: "something went wrong :(", style: "text-red-500" }
                )
                setInput("");
                return;
            }

            appendLog(
                { text: `${terminalPrompt} ${userCommand}`, style: "" },
                { text: `${response.content.type}`, style: "uppercase bg-sky-400 w-fit text-xs text-black font-semibold px-1 py-0.5" },
                { text: `${response.content.year} • ${response.content.episodes} episodes ${response.content.seasons ? `• ${response.content.seasons} seasons` : ""}`, style: "" },
                { text: `${response.content.description}`, style: "text-[#808080]" }
            )
            setInput("");
            return;

        }

        else if (userCommand.match(regex)) {

            appendLog(
                { text: `${terminalPrompt} ${userCommand}`, style: "" },
                { text: "adding...", style: "text-[606060]" }
            )

            const match = userCommand.match(regex);
            if (match?.groups) {
                const { action, type, name, year, season, episode } = match.groups;

                const response = await addContent({
                    name,
                    type: type as ContentType,
                    year: Number(year),
                    seasons: Number(season),
                    episodes: Number(episode),
                    description: "abc"
                });

                if (response) {
                    appendLog({ text: "✔ added successfully", style: "text-green-500" })
                }
            }

            setInput("");
            return;
        }
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs])

    useEffect(() => {
        cursorRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
        });
    }, [input, cursorPos]);


    if (isMobile === null) return null;

    return (

        isMobile ?
            <span className="text-red-300">  This terminal is designed for larger screens. Please switch to a desktop or tablet for the best experience.
            </span> :

            <div style={{ fontFamily: "var(--font-geist-mono)" }} className="w-full h-full flex flex-col">

                {/* All the Watchlogs will display here */}
                <div className="w-full h-auto">
                    <div className="grid md:grid-cols-5 grid-cols-2 gap-0">
                        {watchlogs.map((item) => (
                            <div key={item} className="border border-[#282828] py-1.5 px-2 text-white truncate">
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* All the command and their output will display here */}
                <div className="flex flex-col gap-1 max-h-max">
                    {
                        logs.map((line, index) => (
                            <span key={index} className={`${line.style} text-sm whitespace-pre-wrap wrap-break-words`}>
                                {line.text}
                            </span>
                        ))
                    }
                </div>

                {/* Input field for the command */}
                <div className="text-sm flex mt-1 gap-1 w-full">

                    <span className="text-green-500">{terminalPrompt}</span>

                    <div className="flex flex-row items-center relative whitespace-pre overflow-x-auto pr-5" onClick={() => inputRef.current?.focus()}>

                        {/* <span className="ml-1 wrap-anywhere">{
                        terminalPrompt !== "password" ? input :
                            "•".repeat(input.length)
                    }</span> */}

                        <span className="">{input.slice(0, cursorPos)}</span>
                        <span ref={cursorRef} className="inline-block w-1.5 h-4 bg-white animate-pulse align-middle shrink-0" />
                        <span className="">{input.slice(cursorPos)}</span>

                        <input
                            autoFocus
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "ArrowLeft") {
                                    e.preventDefault();
                                    setCursorPos((pos) => Math.max(0, pos - 1));
                                }

                                else if (e.key === "ArrowRight") {
                                    e.preventDefault();
                                    setCursorPos((pos) => Math.min(input.length, pos + 1));
                                }

                                else if (e.key === "Backspace") {
                                    e.preventDefault();

                                    if (cursorPos > 0) {
                                        setInput(
                                            input.slice(0, cursorPos - 1) +
                                            input.slice(cursorPos)
                                        );
                                        setCursorPos(cursorPos - 1);
                                    }
                                }

                                else if (e.key.length === 1) {
                                    e.preventDefault();

                                    const newInput =
                                        input.slice(0, cursorPos) +
                                        e.key +
                                        input.slice(cursorPos);

                                    setInput(newInput);
                                    setCursorPos(cursorPos + 1);
                                }

                                else if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                            className="absolute opacity-0 pointer-events-none"
                        />

                    </div>

                </div>


                <div ref={bottomRef} />

            </div>
    );
}
