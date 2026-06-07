"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Admin() {

  const [matches, setMatches] = useState([])
  const [winner, setWinner] = useState("")
  const [topScorer, setTopScorer] = useState("")
  const [password, setPassword] = useState("")
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    loadMatches()
  }, [])

function unlockAdmin() {

console.log(
process.env
.NEXT_PUBLIC_ADMIN_PASSWORD
)

if (

password
===

process.env
.NEXT_PUBLIC_ADMIN_PASSWORD

) {

setAuthorized(
true
)

}

else {

alert(
"Contraseña incorrecta"
)

}

}

  async function loadMatches() {
    const { data } =
      await supabase
.from("matches")
.select("*")
.eq(
"round",
"groups"
)
.order(
"match_number"
)

    setMatches(data || [])
  }

  async function updateScore(
    id,
    field,
    value
  ) {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              [field]: value
            }
          : m
      )
    )
  }

  async function saveResult(match) {

    const { error } =
      await supabase
        .from("matches")
        .update({
          home_score_real:
            Number(match.home_score_real),

          away_score_real:
            Number(match.away_score_real),

          played: true
        })
        .eq("id", match.id)

    if (error) {
      alert("Error")
      return
    }

    alert("Resultado guardado")
  }

  async function saveBonus() {

  const { error } =
    await supabase
      .from(
        "tournament_results"
      )
      .update({
        winner,
        top_scorer:
          topScorer
      })
      .eq(
        "id",
        1
      )

  if (error) {
    alert(
      "Error"
    )

    return
  }

  alert(
    "Bonus guardado"
  )

  }

if (

!authorized

) {

return (

<main
className="
p-10
max-w-md
mx-auto
"
>

<h1
className="
text-3xl
font-bold
mb-6
"
>

🔒 Admin

</h1>

<input

type="password"

value={
password
}

onChange={
(e)=>
setPassword(
e.target.value
)
}

placeholder="Contraseña"

className="
border
p-3
rounded
w-full
mb-4
"
/>

<button

onClick={
unlockAdmin
}

className="
bg-green-600
text-white
px-4
py-2
rounded
"

>

Entrar

</button>

</main>

)

}

  return (
    <main className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        ⚙️ Admin Resultados
      </h1>

      {matches.map((match) => (

        <div
          key={match.id}
          className="border p-4 rounded mb-4"
        >

          <p className="mb-3">

            {match.home_team}

            {" vs "}

            {match.away_team}

          </p>

          <div className="flex gap-2">

            <input
              type="number"
              value={
              match.home_score_real
              ?? ""
              }
              className="border p-2 w-16"
              onChange={(e) =>
                updateScore(
                  match.id,
                  "home_score_real",
                  e.target.value
                )
              }
            />

            <input
              type="number"
              value={
              match.away_score_real
              ?? ""
              }
              className="border p-2 w-16"
              onChange={(e) =>
                updateScore(
                  match.id,
                  "away_score_real",
                  e.target.value
                )
              }
            />

            <button

disabled={
match.played
}

className="
bg-green-600
text-white
px-4
disabled:opacity-50
"

onClick={() =>
saveResult(match)
}

>

{

match.played

?

"✓ Guardado"

:

"Guardar"

}

</button>

          </div>

        </div>

      ))}

<div className="mt-10">

<h2 className="text-2xl mb-4">

🏆 Resultado Final

</h2>

<input
type="text"
placeholder="Ganador"

value={winner}

onChange={(e)=>
setWinner(
e.target.value
)}

className="
border
p-2
mr-2"
/>

<input
type="text"
placeholder="Máximo goleador"

value={topScorer}

onChange={(e)=>
setTopScorer(
e.target.value
)}

className="
border
p-2
mr-2"
/>

<button
className="
bg-blue-600
text-white
px-4
py-2
"

onClick={
saveBonus
}

>

Guardar Bonus

</button>

</div>


    </main>
  )
}