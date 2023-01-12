export default function ChatDisplayHeader({ name }: { name: string }) {
    return (
        <div className="flex items-center p-3 bg-cyan-500 text-white h-[52px]">
            {name}
        </div>
    );
}
