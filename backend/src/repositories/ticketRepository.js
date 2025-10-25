import pool from "../db.js";

export const ticketRepository = {
    async getActiveRoundId() {
        try {
            const result = await pool.query(
                "SELECT round_id FROM rounds WHERE open = TRUE LIMIT 1"
            );

            if (result.rows.length === 0) {
                return null;
            }

            return result.rows[0].round_id;

        } catch (err) {
            console.error("Greška pri dohvaćanju aktivne runde:", err);
            throw err;
        }
    },

    async saveTicket(ticketId, personalId, numbers) {
        try {
            const activeRoundId = await this.getActiveRoundId();

            if (!activeRoundId) {
                throw new Error("Trenutno nema otvorene runde za uplatu listića");
            }

            const result = await pool.query(
                "INSERT INTO tickets (ticket_id, personal_id, numbers, round_id) VALUES ($1, $2, $3, $4) RETURNING *",
                [ticketId, personalId, numbers, activeRoundId]
            );

            return result.rows[0];

        } catch (err) {
            console.error("Greška pri spremanju listića:", err);
            throw err;
        }
    },

    async getTicketById (ticketId) {
        try {
            const result = await pool.query(
                "SELECT * FROM tickets WHERE ticket_id = $1",
                [ticketId]
            );
            return result.rows[0] || null;
        } catch (err) {
            console.error("Greška pri dohvaćanju listića:", err);
            throw err; 
        }
    },

    async getCount() {
        try {
            const activeRoundId = await this.getActiveRoundId();

            if (!activeRoundId) {
                return 0; // 
            }

            const ticketCountResult = await pool.query(
            "SELECT COUNT(*) FROM tickets WHERE round_id = $1",
            [activeRoundId]
            );

            const count = parseInt(ticketCountResult.rows[0].count, 10);
            return count;
        } catch (err) {
            console.error("Greška pri dohvaćanju broja listića:", err);
            throw new Error("Greška pri dohvaćanju broja listića"); // 
        }
    },

    async getLastDrawnNumbers() {
        try {
            const result = await pool.query(
                `SELECT numbers FROM rounds 
                WHERE open = FALSE 
                ORDER BY created_at DESC 
                LIMIT 1`
            );

            if (result.rows.length === 0) {
                return null; 
            }

            return result.rows[0].numbers; 
        } catch (err) {
            console.error("Greška pri dohvaćanju izvučenih brojeva:", err);
            throw new Error("Greška pri dohvaćanju izvučenih brojeva");
        }
    },

    async getDrawnNumbersForRound(roundId) {
        try {
            const result = await pool.query(
                "SELECT numbers FROM rounds WHERE round_id = $1",
                [roundId]
            );
            if (!result.rows[0]) return null; 
            return result.rows[0].numbers;
        } catch (err) {
            console.error("Greška pri dohvaćanju izvučenih brojeva:", err);
            throw err; 
        }
    },

    async createNewRound() {
        try {
            await pool.query("UPDATE rounds SET open = FALSE WHERE open = TRUE");

            const result = await pool.query(
                "INSERT INTO rounds (open, created_at) VALUES (TRUE, NOW()) RETURNING *"
            );
            return result.rows[0];
        } catch (err) {
            console.error("Greška pri kreiranju novog kola:", err);
            throw err;
        }
    },

    async closeCurrentRound() {
        try {
            await pool.query("UPDATE rounds SET open = FALSE WHERE open = TRUE");
        } catch (err) {
            console.error("Greška pri zatvaranju kola:", err);
            throw err;
        }
    },

    async storeResults(numbers) {
        try {
            const roundResult = await pool.query(
                "SELECT round_id, numbers FROM rounds WHERE open = FALSE ORDER BY created_at DESC LIMIT 1"
            );

            if (roundResult.rows.length === 0) {
                throw new Error("Nema kola za pohranu rezultata");
            }

            const round = roundResult.rows[0];

            if (round.numbers) {
                throw new Error("Brojevi su već pohranjeni za ovo kolo");
            }

            await pool.query(
                "UPDATE rounds SET numbers = $1 WHERE round_id = $2",
                [numbers, round.round_id]
            );
        } catch (err) {
            console.error("Greška pri pohrani rezultata:", err);
            throw err;
        }
    },

};
