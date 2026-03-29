const express = require("express");
const fetch = require("node-fetch");
const app = express();

const API_KEY = process.env.RIOT_API_KEY;
const GAME_NAME = "Balanced"; // Riot ID’in gameName kısmı
const TAG_LINE = "TR1";       // Riot ID’in tagLine kısmı

app.get("/", async (req, res) => {
  try {
    // TR server kullanıyoruz
    const summoner = await fetch(
      `https://tr1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${GAME_NAME}?api_key=${API_KEY}`
    ).then(r => r.json());

    // Ranked bilgisi çek
    const ranked = await fetch(
      `https://tr1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}?api_key=${API_KEY}`
    ).then(r => r.json());

    const solo = ranked.find(q => q.queueType === "RANKED_SOLO_5x5");

    if (!solo) return res.send("Unranked");

    res.send(`${solo.tier} ${solo.rank} - ${solo.leaguePoints} LP`);
  } catch (err) {
    console.log(err); // Hata detayını görmek için
    res.send("Hata");
  }
});

app.listen(3000, () => console.log("Server çalışıyor"));
