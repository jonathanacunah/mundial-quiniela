import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function createMatch(
  home,
  away,
  number
) {

  return {

    home_team:
      home,

    away_team:
      away,

    stage:
      "groups",

    round:
      "groups",

    match_number:
      number

  }

}

function createKnockout(
  displayName,
  home,
  away,
  number,
  round
) {

  return {

    display_name:
      displayName,

    home_team:
      home,

    away_team:
      away,

    stage:
      "knockout",

    round,

    match_number:
      number

  }

}

const matches = []

const groups = {

A: [

{
name: "México",
flag: "🇲🇽"
},

{
name: "Sudáfrica",
flag: "🇿🇦"
},

{
name: "Corea del Sur",
flag: "🇰🇷"
},

{
name: "República Checa",
flag: "🇨🇿"
}

],

B: [
"Canadá",
"Bosnia y Herzegovina",
"Qatar",
"Suiza"
],

C: [
"Brasil",
"Marruecos",
"Haití",
"Escocia"
],

D: [
"Estados Unidos",
"Paraguay",
"Australia",
"Turquía"
],

E: [
"Alemania",
"Curazao",
"Costa de Marfil",
"Ecuador"
],

F: [
"Países Bajos",
"Japón",
"Suecia",
"Túnez"
],

G: [
"Bélgica",
"Egipto",
"Irán",
"Nueva Zelanda"
],

H: [
"España",
"Cabo Verde",
"Arabia Saudí",
"Uruguay"
],

I: [
"Francia",
"Senegal",
"Irak",
"Noruega"
],

J: [
"Argentina",
"Argelia",
"Austria",
"Jordania"
],

K: [
"Portugal",
"RD Congo",
"Uzbekistán",
"Colombia"
],

L: [
"Inglaterra",
"Croacia",
"Ghana",
"Panamá"
]

}

let number = 1

Object.entries(
groups
).forEach(
(
[
group,
teams
]
)=>{

const fixtures=[

[0,1],
[2,3],

[0,2],
[1,3],

[0,3],
[1,2]

]

fixtures.forEach(
(
[
home,
away
]
)=>{

matches.push(

createMatch(

typeof teams[home] === "string"
? teams[home]
: teams[home].name,

typeof teams[away] === "string"
? teams[away]
: teams[away].name,

number

)

)

number++

}

)

}
)

const knockout = []

let match = 73

for (
  let i = 1;
  i <= 16;
  i++
) {

  knockout.push(

    createKnockout(
`Cruce ${i}`,
`1º Grupo ${
String.fromCharCode(
64+i
)
}`,
`2º Grupo ${
String.fromCharCode(
65+i
)
}`,
      match,
      "round_of_32"
    )

  )

  match++

}

for (
  let i = 1;
  i <= 8;
  i++
) {

  knockout.push(

    createKnockout(
      `Octavos ${i}`,
      `Ganador Cruce ${
        i*2-1
      }`,
      `Ganador Cruce ${
        i*2
      }`,
      match,
      "round_of_16"
    )

  )

  match++

}

for (
  let i = 1;
  i <= 4;
  i++
) {

  knockout.push(

    createKnockout(
      `Cuartos ${i}`,
      `Ganador Octavos ${
        i*2-1
      }`,
      `Ganador Octavos ${
        i*2
      }`,
      match,
      "quarterfinal"
    )

  )

  match++

}

for (
  let i = 1;
  i <= 2;
  i++
) {

  knockout.push(

    createKnockout(
      `Semifinal ${i}`,
      `Ganador Cuartos ${
        i*2-1
      }`,
      `Ganador Cuartos ${
        i*2
      }`,
      match,
      "semifinal"
    )

  )

  match++

}

knockout.push(

createKnockout(
"3er Puesto",
"Perdedor Semi 1",
"Perdedor Semi 2",
match++,
"third_place"
)

)

knockout.push(

createKnockout(
"Final",
"Ganador Semi 1",
"Ganador Semi 2",
match++,
"final"
)

)

matches.push(
...knockout
)

async function run() {

  console.log(
    "Limpiando partidos..."
  )

  await supabase
    .from("matches")
    .delete()
    .neq(
      "id",
      0
    )

  console.log(
    "Insertando..."
  )

  const {
    error
  } =
  await supabase
    .from("matches")
    .insert(
      matches
    )

  if (
    error
  ) {

    console.log(
      error
    )

    return

  }

  console.log(
    `Cargados ${matches.length} partidos`
  )

}

run()