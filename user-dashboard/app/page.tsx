import ReviewForm from "../components/ReviewForm";

export default function Home() {
    return (
        <main className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] text-white selection:bg-purple-500/30">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none"></div>
            <ReviewForm />
        </main>
    );
}
