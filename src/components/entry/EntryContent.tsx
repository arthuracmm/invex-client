import { Divider } from "@mui/material";

export default function EntryContent() {
    return (
        <div className="flex h-full flex-col ">
            <div className="flex p-4 px-8 my-5 w-full justify-between items-center ">
                <h1 className="text-4xl font-extrabold text-zinc-700">Entrada</h1>
            </div>
            <Divider />
        </div>
    )
}