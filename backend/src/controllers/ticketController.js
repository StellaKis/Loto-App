import { ticketService } from "../services/ticketService.js";

export const ticketController = {
    async getActiveRoundId(req, res) {
        try {
            const roundId = await ticketService.getActiveRoundId();
            if (roundId === null) {
                return res.status(404).json({ message: "Trenutno nema otvorene runde" });
            }
            res.json({ roundId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async createTicket(req, res) {
        try {
            const { personalId, numbers } = req.body;
            const ticket = await ticketService.createTicket(personalId, numbers);
            res.status(201).json(ticket);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async getCount(req, res) {
        try {
            const count = await ticketService.getCount();
            res.json(count);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }, 

    async getLastDrawnNumbers(req, res) {
        try {
            const numbers = await ticketService.getLastDrawnNumbers();
            if (!numbers) {
                return res.status(404).json({ error: "Brojevi za prethodno kolo još nisu izvučeni" });
            }
            res.json({ numbers });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async newRound(req, res) {
        try {
            await ticketService.createNewRound();
            res.sendStatus(204); 
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async closeRound(req, res) {
        try {
            await ticketService.closeCurrentRound();
            res.sendStatus(204); 
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async storeResults(req, res) {
        try {
            const { numbers } = req.body;
            if (!numbers) return res.status(400).json({ error: "Nisu poslani brojevi" });

            await ticketService.storeResults(numbers);
            res.sendStatus(204); 
        } catch (err) {
            if (err.message.includes("Brojevi su već pohranjeni") || err.message.includes("Uplate su još aktivne") || err.message.includes("Nema kola")) {
                res.status(400).json({ error: err.message });
            } else {
                res.status(500).json({ error: err.message });
            }
        }
    }, 
  
    async  getTicket(req, res, next) {
        try {
            const ticketId = req.params.id;
            const ticket = await ticketService.getTicketById(ticketId);

            const drawNumbers = await ticketService.getDrawnNumbersForRound(ticket.round_id);

            res.json({
            uuid: ticket.ticket_id,
            personalId: ticket.personal_id,
            numbers: ticket.numbers,
            drawNumbers: drawNumbers || [],
            });
        } catch (err) {
            next(err);
        }
    }

};
