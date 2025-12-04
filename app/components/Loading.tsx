import GradientCircularProgress from "../ui/GradientCircularProgress"

export default function Loading() {
    return (
        <div className="flex flex-col gap-2 flex-1 h-full items-center justify-center">
            <GradientCircularProgress />
        </div>
    )
}