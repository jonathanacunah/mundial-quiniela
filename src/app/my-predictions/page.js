"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function MyPredictions() {

const [name,setName]=
useState("")

const [matches,setMatches]=
useState([])

const [bonus,setBonus]=
useState(null)

async function loadPredictions() {

const {
data:
predictions

} =
await supabase

.from(
"predictions"
)

.select("*")

.eq(
"participant_name",
name
)

const {
data:
allMatches

} =
await supabase

.from(
"matches"
)

.select("*")

const {
data:
bonusData

} =
await supabase

.from(
"bonus_predictions"
)

.select("*")

.eq(
"participant_name",
name
)

.single()

setBonus(
bonusData
)

const merged =

(
predictions
||

[]

)

.map(
(pred)=>{

const match =

allMatches
?.find(
m=>
m.id
===
pred.match_id
)

return {

...pred,

home_team:
match
?.home_team,

away_team:
match
?.away_team

}

}

)

setMatches(
merged
)

}

return (

<main
className="
p-6
"
>

<h1
className="
text-3xl
font-bold
mb-6
"
>

📋 Mi Quiniela

</h1>

<input

type="text"

value={
name
}

onChange={
(e)=>

setName(
e.target.value
)

}

placeholder="Tu nombre"

className="
border
p-2
rounded
mr-3
"
/>

<button

onClick={
loadPredictions
}

className="
bg-green-600
text-white
px-4
py-2
rounded
"

>

Buscar

</button>

<div
className="
mt-8
"
>

{

matches.map(
(match)=>(

<div

key={
match.id
}

className="
border
rounded
p-4
mb-3
"
>

<p>

{

match.home_team

}

{" "}

{

match.home_score_pred

}

—

{

match.away_score_pred

}

{" "}

{

match.away_team

}

</p>

</div>

)

)

}

</div>

{

bonus

&&

(

<div
className="
mt-8
"
>

<p>

🏆 Campeón:

{" "}

{

bonus
.winner_prediction

}

</p>

<p>

⚽ Goleador:

{" "}

{

bonus
.top_scorer_prediction

}

</p>

</div>

)

}

</main>

)

}