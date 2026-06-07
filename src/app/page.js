export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">
        🏆 Quiniela Mundial 2026
      </h1>

      <p className="mt-2 text-gray-600">
        Bienvenido a tu quiniela de gente seria
      </p>

      <div className="mt-6 space-y-3">
        <a className="block p-3 border rounded" href="/predict">
          👉 Hacer mis predicciones
        </a>

        <a className="block p-3 border rounded" href="/admin">
          ⚙️ Panel admin
        </a>

        <a
          className="block p-3 border rounded"
          href="/leaderboard"
        >
          🏆 Clasificación
        </a>

      </div>
    </main>
  )
}