let lobbies = {};

const sentences = [
    "scrie asta rapid",
    "cine e cel mai rapid",
    "tasteaza asta acum",
    "viteza conteaza",
];

function generateCode() {
    let code;
    do {
        code = Math.random().toString(36).substring(2, 8).toUpperCase();
    } while (lobbies[code]);
    return code;
}

export default function handler(req, res) {
    const { action, code, name, text } = req.query;

    // CREATE
    if (action === "create") {
        const newCode = generateCode();

        lobbies[newCode] = {
            players: [],
            sentence: null,
            winner: null
        };

        return res.json({ code: newCode });
    }

    // JOIN
    if (action === "join") {
        if (!lobbies[code]) {
            return res.json({ error: "Lobby nu există" });
        }

        if (!name) {
            return res.json({ error: "No username" });
        }

        if (!lobbies[code].players.includes(name)) {
            lobbies[code].players.push(name);
        }

        return res.json({ ok: true });
    }

    // START GAME
    if (action === "start") {
        if (!lobbies[code]) return res.json({ error: "No lobby" });

        const random = sentences[Math.floor(Math.random() * sentences.length)];

        lobbies[code].sentence = random;
        lobbies[code].winner = null;

        return res.json({ ok: true });
    }

    // ANSWER
    if (action === "answer") {
        const lobby = lobbies[code];
        if (!lobby) return res.json({ error: "No lobby" });

        if (lobby.winner) return res.json({ ok: true });

        if (text === lobby.sentence) {
            lobby.winner = name;
        }

        return res.json({ ok: true });
    }

    // GET
    if (action === "get") {
        if (!lobbies[code]) return res.json({ error: "No lobby" });
        return res.json(lobbies[code]);
    }

    res.json({ error: "Invalid action" });
}
