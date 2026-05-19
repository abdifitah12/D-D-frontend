export default function LivePage() {
  return (
    <section className="min-h-screen bg-black px-4 py-10">
      <div className="mx-auto max-w-6xl">

        <h1 className="mb-6 text-center text-5xl font-bold text-white">
          🔴 D&D Café Live
        </h1>

        <iframe
          className="w-full h-[700px] rounded-3xl"
          src="https://www.youtube.com/embed?listType=user_uploads&list=abdihaashin1350"
          title="D&D Café Live"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

      </div>
    </section>
  );
}