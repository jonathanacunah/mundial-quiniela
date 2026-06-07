"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Predict() {
  const [name, setName] = useState("")
  const [matches, setMatches] = useState([])
  const [predictions, setPredictions] = useState({})
  const [winner, setWinner] = useState("")
  const [topScorer, setTopScorer] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [checking, setChecking] = useState(false)
  const [phase, setPhase] = useState(1)

  useEffect(() => {

  loadPhase()

}, [])

useEffect(() => {

  loadMatches()

}, [phase])

async function loadPhase() {

  const { data } =
    await supabase
      .from("app_config")
      .select("current_phase")
      .single()

  if (data) {
    setPhase(
      data.current_phase
    )
  }

}

function updatePrediction(matchId, side, value) {
  setPredictions((prev) => ({
    ...prev,
    [matchId]: {
      ...prev[matchId],
      [side]: value
    }
  }))
}

  async function checkExistingPlayer(playerName) {

  if (!playerName.trim()) {
    return
  }

  setChecking(true)

  const { data } =
    await supabase
      .from("predictions")
      .select("id")
      .eq(
        "participant_name",
        playerName
      )
      .limit(1)

  if (
    data?.length > 0
  ) {
    setSubmitted(true)
  }

  setChecking(false)

}

async function loadMatches() {

  const { data, error } =
    await supabase
      .from("matches")
      .select("*")

  if (error) {
    console.error(error)
    return
  }

  if (phase === 1) {

    setMatches(

      data.filter(
        (m) =>
          m.round === "groups"
      )

    )

  } else {

    setMatches(

      data.filter(
        (m) =>
          m.round !== "groups"
      )

    )

  }

}

  console.log(predictions)

async function savePredictions() {

  const completedMatches =

Object
.values(
predictions
)

.filter(
p=>

p.home
!==

undefined

&&

p.away
!==

undefined

)

.length

if (

completedMatches
<

matches.length

) {

alert(

`Te faltan ${
matches.length
-
completedMatches
} partidos`

)

return

}

  if (!name.trim()) {
    alert("Introduce tu nombre")
    return
  }

  if (

!winner.trim()

||

!topScorer.trim()

) {

alert(

"Completa campeón y goleador"

)

return

}

const confirmed =

confirm(

"¿Seguro que quieres enviar la quiniela? Después no podrás modificarla."

)

if (

!confirmed

) {

return

}

  const { data: existing } = await supabase
  .from("predictions")
  .select("id")
  .eq("participant_name", name)
  .limit(1)

  if (existing?.length > 0) {
   alert("Ya existe una quiniela para este participante")
   return
  }

await supabase
  .from("participants")
  .insert([
    {
      name: name
    }
  ])

  const rows = Object.entries(predictions).map(
    ([matchId, prediction]) => ({
      participant_name: name,
      match_id: Number(matchId),
      home_score_pred: Number(prediction.home),
      away_score_pred: Number(prediction.away),
      phase: phase
    })
  )

  const { error: predictionError } =
    await supabase
      .from("predictions")
      .insert(rows)

  if (predictionError) {
    console.error(predictionError)
    alert("Error al guardar quiniela")
    return
  }

  const { error: bonusError } =
    await supabase
      .from("bonus_predictions")
      .insert([
        {
          participant_name: name,
          winner_prediction: winner,
          top_scorer_prediction: topScorer,
          phase: phase
        }
      ])

  if (bonusError) {
    console.error(bonusError)
    alert("Error guardando bonus")
    return
  }

  alert("Quiniela completa guardada 🏆")
  setSubmitted(true)
}

if (submitted) {
  return (
    <main className="p-10">

      <h1 className="text-4xl font-bold mb-4">
        🏆 Fase 1 completada
      </h1>

      <p className="text-lg">
        Gracias {name} por participar, tqm.
      </p>

      <p>
        {submitted
  ? "Ya existe una quiniela para este participante."
  : "Tu predicción quedó registrada."
}
      </p>

      <p className="mt-4">
        Nos vemos en eliminatorias mi pana 🏆
      </p>

    </main>
  )
}

function getSectionTitle(
  round
) {

  const map = {

    groups:
      "⚽ Fase de grupos",

    round_of_32:
      "🏆 Cruces",

    round_of_16:
      "🏆 Octavos",

    quarterfinal:
      "🏆 Cuartos",

    semifinal:
      "🏆 Semifinales",

    third_place:
      "🥉 Tercer puesto",

    final:
      "🏆 Final"

  }

  return (
    map[
      round
    ] ||
    round
  )

}

const groupedMatches =
Object.groupBy(
  matches,
  (
    match
  ) =>
    match.round
)

function getFlag(team) {

const flags = {

"México":"🇲🇽",
"Sudáfrica":"🇿🇦",
"Corea del Sur":"🇰🇷",
"República Checa":"🇨🇿",

"Canadá":"🇨🇦",
"Bosnia y Herzegovina":"🇧🇦",
"Qatar":"🇶🇦",
"Suiza":"🇨🇭",

"Brasil":"🇧🇷",
"Marruecos":"🇲🇦",
"Haití":"🇭🇹",
"Escocia":"🏴",

"Estados Unidos":"🇺🇸",
"Paraguay":"🇵🇾",
"Australia":"🇦🇺",
"Turquía":"🇹🇷",

"Alemania":"🇩🇪",
"Curazao":"🇨🇼",
"Costa de Marfil":"🇨🇮",
"Ecuador":"🇪🇨",

"Países Bajos":"🇳🇱",
"Japón":"🇯🇵",
"Suecia":"🇸🇪",
"Túnez":"🇹🇳",

"Bélgica":"🇧🇪",
"Egipto":"🇪🇬",
"Irán":"🇮🇷",
"Nueva Zelanda":"🇳🇿",

"España":"🇪🇸",
"Cabo Verde":"🇨🇻",
"Arabia Saudí":"🇸🇦",
"Uruguay":"🇺🇾",

"Francia":"🇫🇷",
"Senegal":"🇸🇳",
"Irak":"🇮🇶",
"Noruega":"🇳🇴",

"Argentina":"🇦🇷",
"Argelia":"🇩🇿",
"Austria":"🇦🇹",
"Jordania":"🇯🇴",

"Portugal":"🇵🇹",
"RD Congo":"🇨🇩",
"Uzbekistán":"🇺🇿",
"Colombia":"🇨🇴",

"Inglaterra":"🏴",
"Croacia":"🇭🇷",
"Ghana":"🇬🇭",
"Panamá":"🇵🇦",

}

return flags[
team
] || "🏳️"

}

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        ⚽ Quiniela Mundial
      </h1>

      <div className="mb-6">
        <label className="block mb-2 font-semibold">
          Nombre participante
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => {

  setName(
    e.target.value
  )

  checkExistingPlayer(
    e.target.value
  )

}}
          placeholder="Tu nombre"
          className="border p-2 rounded w-64"
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">
        Partidos
      </h2>

{
Object.entries(groupedMatches).map(
([round, roundMatches]) => (

<div key={round}>

<h2 className="text-3xl font-bold mt-10 mb-5">

{getSectionTitle(round)}

</h2>

{roundMatches.map((match, index) => (

<div key={match.id}>

{index % 6 === 0 && (

<h3
className="
text-2xl
font-bold
mt-10
mb-5
"
>

🏆 Grupo {

match.group

}

</h3>

)}

<div
className="
bg-zinc-900
rounded-2xl
shadow-lg
p-6
mb-5
border
border-zinc-700
hover:border-zinc-500
transition
max-w-md
"
>

<div className="mb-3">

{match.display_name && (

<p className="font-bold text-lg">

🏆 {match.display_name}

</p>

)}

<div
className="
text-center
space-y-3
"
>

<div
className="
text-2xl
font-bold
text-white
"
>

{getFlag(match.home_team)}

{" "}

{match.home_team}

</div>

<div
className="
text-sm
font-semibold
text-zinc-500
tracking-widest
"
>

VS

</div>

<div
className="
text-2xl
font-bold
text-white
"
>

{getFlag(match.away_team)}

{" "}

{match.away_team}

</div>

</div>

</div>

<div
className="
flex
justify-center
items-center
gap-4
mt-6
"
>

<input
type="number"
min="0"
max="20"
step="1"
className="
bg-zinc-800
border
border-zinc-600
rounded-xl
p-3
w-20
text-center
text-xl
text-white
"
onChange={(e)=>
updatePrediction(
match.id,
"home",
e.target.value
)
}
/>

<span>-</span>

<input
type="number"
min="0"
max="20"
step="1"
className="
bg-zinc-800
border
border-zinc-600
rounded-xl
p-3
w-20
text-center
text-xl
text-white
"
onChange={(e)=>
updatePrediction(
match.id,
"away",
e.target.value
)
}
/>

</div>

</div>

</div>

))}

</div>

))
}


<div className="mt-8">
  <label className="block font-semibold mb-2">
    🏆 Campeón del Mundial
  </label>

  <input
    type="text"
    value={winner}
    onChange={(e) => setWinner(e.target.value)}
    placeholder="Ej: Argentina"
    className="border p-2 rounded w-64"
  />
</div>

<div className="mt-4 mb-8">
  <label className="block font-semibold mb-2">
    ⚽ Máximo goleador
  </label>

  <input
    type="text"
    value={topScorer}
    onChange={(e) => setTopScorer(e.target.value)}
    placeholder="Ej: Mbappé"
    className="border p-2 rounded w-64"
  />
</div>

<button
  onClick={savePredictions}
  className="bg-green-600 text-white px-4 py-2 rounded mt-4"
>
  Guardar Quiniela
</button>

    </main>
  )
}