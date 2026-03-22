let lobbies = {};

export default function handler(req, res) {
    const { action, code } = req.query;

    if (action === "create") {
        const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        lobbies[newCode] = [];
        return res.status(200).json({ code: newCode });
    }

    if (action === "join") {
        if (!lobbies[code]) {
            return res.status(200).json({ error: "Lobby nu există" });
        }

        lobbies[code].push("player");
        return res.status(200).json({ players: lobbies[code].length });
    }

    if (action === "get") {
        return res.status(200).json({
            players: lobbies[code]?.length || 0
        });
    }

    res.status(400).json({ error: "Invalid action" });
}