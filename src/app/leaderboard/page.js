"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

function calculatePoints(pred, match) {

  if (
    pred.home_score_pred ===
      match.home_score_real &&

    pred.away_score_pred ===
      match.away_score_real
  ) {
    return 5
  }

  const predDiff =
pred.home_score_pred -
pred.away_score_pred

const realDiff =
match.home_score_real -
match.away_score_real

const predWinner =
Math.sign(
predDiff
)

const realWinner =
Math.sign(
realDiff
)

if (

predWinner
===

realWinner

) {

if (

predWinner
!==

0

&&

predDiff
===

realDiff

) {

return 3

}

return 1

}

  return 0
}

function isExact(pred, match) {

  return (
    pred.home_score_pred ===
      match.home_score_real &&

    pred.away_score_pred ===
      match.away_score_real
  )

}

export default function Leaderboard() {
  const [players, setPlayers] = useState([])

  useEffect(() => {
    loadPlayers()
  }, [])

  async function loadPlayers() {

  const { data: participants } =
    await supabase
      .from("participants")
      .select("*")

  const { data: predictions } =
    await supabase
      .from("predictions")
      .select("*")

  const { data: matches } =
    await supabase
      .from("matches")
      .select("*")

const { data: bonusPredictions } =
await supabase
.from(
"bonus_predictions"
)
.select("*")

const {
data:
tournament

} =
await supabase
.from(
"tournament_results"
)
.select("*")
.single()

  const leaderboard =
    (participants || []).map(
      (player) => {

        const playerPredictions =
          (predictions || [])
            .filter(
              (p) =>
                p.participant_name ===
                player.name
            )

        let total = 0
        let exacts = 0

        playerPredictions.forEach(
          (pred) => {

            const match =
              matches.find(
                (m) =>
                  m.id ===
                    pred.match_id &&
                  m.played
              )

            if (!match) return

            const pts =
                calculatePoints(
                    pred,
                    match
                )

            total += pts

            if (
                isExact(
                    pred,
                    match
                )
            ) {
                exacts++
            }

          }
        )

        const bonus = bonusPredictions?.find(
  (b) =>
    b.participant_name ===
    player.name
)

if (bonus) {

  if (
    bonus.winner_prediction ===
    tournament?.winner
  ) {
    total += 5
  }

  if (
    bonus.top_scorer_prediction ===
    tournament?.top_scorer
  ) {
    total += 3
  }

}

return {
  ...player,
  points: total,
  exacts
}

      }
    )

  leaderboard.sort(
  (a, b) => {

    if (
      b.points !==
      a.points
    ) {
      return (
        b.points -
        a.points
      )
    }

    return (
      b.exacts -
      a.exacts
    )

    }
    )

  setPlayers(
    leaderboard
  )
    }

  return (
    <main className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        🏆 Clasificación
      </h1>

      {players.map((player, index) => (
        <div
          key={player.id}
          className="border p-4 rounded mb-3"
        >
        {index + 1}. {player.name}
          — 
        {player.points} pts
        ({player.exacts} exactos)
        </div>
      ))}

    </main>
  )
}