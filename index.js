const express = require("express");
const fetch = require("node-fetch");
const app = express();

const API_KEY = process.env.RIOT_API_KEY;
const GAME_NAME = "Balanced";
const TAG_LINE = "TR1";

app.get("/", async (req, res) => {
  try {
    // Riot ID → PUUID al
    const account = await fetch(
      `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${GAME_NAME}/${TAG_LINE}?api_key=${API_KEY}`
    ).then(r => r.json());

    // PUUID → Summoner al
    const summoner = await fetch(
      `https://tr1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${account.puuid}?api_key=${API_KEY}`
    ).then(r => r.json());

    // Rank çek
    const ranked = await fetch(
      `https://tr1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}?api_key=${API_KEY}`
    ).then(r => r.json());

    const solo = ranked.find(q => q.queueType === "RANKED_SOLO_5x5");

    if (!solo) return res.send("Unranked");

    res.send(`${solo.tier} ${solo.rank} - ${solo.leaguePoints} LP`);
  } catch (err) {
    res.send("Hata");
  }
});

app.listen(3000);
