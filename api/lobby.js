let lobbies = {};

const sentences = [
    "scrie asta rapid",
    "cine e cel mai rapid",
    "tasteaza asta acum",
    "viteza conteaza",
];

export default function handler(req, res) {
    const { action, code, name, text } = req.query;

    if (action === "create") {
        const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        lobbies[newCode] = {
            players: [],
            sentence: null,
            winner: null
        };
        return res.json({ code: newCode });
    }

    if (action === "join") {
        if (!lobbies[code]) return res.json({ error: "No lobby" });

        if (!lobbies[code].players.includes(name)) {
            lobbies[code].players.push(name);
        }

        return res.json({ ok: true });
    }

    if (action === "start") {
        const random = sentences[Math.floor(Math.random() * sentences.length)];
        lobbies[code].sentence = random;
        lobbies[code].winner = null;
        return res.json({ ok: true });
    }

    if (action === "answer") {
        const lobby = lobbies[code];

        if (lobby.winner) return res.json({ ok: true });

        if (text === lobby.sentence) {
            lobby.winner = name;
        }

        return res.json({ ok: true });
    }

    if (action === "get") {
        return res.json(lobbies[code] || {});
    }

    res.json({ error: "invalid" });
}
