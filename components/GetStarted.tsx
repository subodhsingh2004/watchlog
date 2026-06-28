"use client"

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyPassword } from "@/actions/action";

const initialLogs = [
    { text: "~ log what you've watched and manage your watchlist", style: "text-[#d9d9d9]" },
    { text: " ", style: "" },
    { text: "~ not a recommendation engine", style: "text-[#606060]" },
    { text: "~ not a social network", style: "text-[#606060]" },
    { text: "~ just a place to remember what you watched", style: "text-[#606060]" },
    { text: " ", style: "" },
    // { text: "Already have an account? Type 'login'", style: "text-sky-400" },
    // { text: "New here? Type 'signup'", style: "text-sky-400" },
    { text: "Enter your password", style: "text-[#606060]" }
]

export default function GetStarted() {

    const router = useRouter();

    const [logs, setLogs] = useState(initialLogs)
    const [input, setInput] = useState("");
    const [terminalPrompt, setTerminalPrompt] = useState("watchlog:~$")

    const inputRef = useRef<HTMLInputElement | null>(null);

    const appendLog = (...lines: { text: string, style: string }[]) => {
        setLogs(prev => [...prev, ...lines])
    }

    const handleSubmit = async () => {

        let userCommand = input.trim().toLowerCase();

        if (!userCommand) return;

        appendLog({ text: `${terminalPrompt} ${"•".repeat(input.length)}`, style: "" })
        appendLog({ text: `authenticating...`, style: "text-[#606060]" })
        setTerminalPrompt("")

        const isPasswordValid = await verifyPassword(userCommand);

        if (!isPasswordValid) {
            appendLog({ text: `incorrect password`, style: "text-red-500" })
            setInput("");
            setTerminalPrompt("watchlog:~$")
            return;
        }

        appendLog({ text: `✔ verified`, style: "text-green-500" })
        appendLog({ text: `redirecting...`, style: "text-[#606060]" })
        setInput("");

        setTimeout(() => {
            router.push('/home')
        }, 1000);

    }

    return (

        <div style={{ fontFamily: "var(--font-geist-mono)" }} className="w-full h-full flex flex-col relative">

            <div className="flex flex-col gap-1">
                {
                    logs.map((line, index) => (
                        <span key={index} className={`${line.style} text-sm whitespace-pre-wrap wrap-break-words`}>
                            {line.text}
                        </span>
                    ))
                }
            </div>

            {
                terminalPrompt &&
                <div className="text-sm flex gap-1 mt-1">

                    <span className="text-green-500">{terminalPrompt}</span>

                    <div className="flex flex-row items-center" onClick={() => inputRef.current?.focus()}>

                        <span className="whitespace-pre ml-1">{
                            "•".repeat(input.length)
                        }</span>

                        <span className="inline-block w-1.5 h-4 bg-white animate-pulse align-middle" />

                        <input
                            autoFocus
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                            className="absolute opacity-0 pointer-events-none"
                        />

                    </div>

                </div>
            }

            <p className="absolute bottom-0 right-0 text-sm text-[#303030]">v1.0.0</p>

        </div>
    );
}
