import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";
import { ticketRepository } from "../repositories/ticketRepository.js";

export const ticketService = {
    async getActiveRoundId() {
        return await ticketRepository.getActiveRoundId();
    },

    validateInput(personalId, numbers) {
        if (!personalId || typeof personalId !== "string" || personalId.length > 20) {
        throw new Error("Neispravan broj osobne iskaznice (broj osobne iskaznice sadrži maksimalno 20 znakova)");
        }

        if (!numbers || typeof numbers !== "string") {
        throw new Error("Neispravan unos brojeva");
        }

        const nums = numbers.split(",").map(n => parseInt(n.trim(), 10));

        if (nums.some(n => isNaN(n) || n < 1 || n > 45)) {
        throw new Error("Pažnja! Brojevi moraju biti između 1 i 45");
        }

        const uniqueNums = new Set(nums);
        if (uniqueNums.size !== nums.length) {
        throw new Error("Brojevi se ne smiju ponavljati!");
        }

        if (nums.length < 6 || nums.length > 10) {
        throw new Error("Pažnja! Potrebno je unjeti minimalno 6, a maksimalno 10 brojeva");
        }

        return nums;
    },

    async createTicket(personalId, numbers) {
        const validNumbers = this.validateInput(personalId, numbers);
        const ticketId = uuidv4();

        const savedTicket = await ticketRepository.saveTicket(
        ticketId,
        personalId,
        validNumbers.join(",") 
        );

        const ticketUrl = `http://localhost:3000/ticket/${ticketId}`;

        return { ticketId, ticketUrl };
    },

    async getTicketById(ticketId) {
        return await ticketRepository.getTicketById(ticketId);
    },

    async getCount() {
        return await ticketRepository.getCount();
    },

    async getLastDrawnNumbers() {
        return await ticketRepository.getLastDrawnNumbers();
    },

    async getDrawnNumbersForRound(roundId) {
        return await ticketRepository.getDrawnNumbersForRound(roundId);
    },

    async createNewRound() {
        return await ticketRepository.createNewRound();
    },

    async closeCurrentRound() {
        return await ticketRepository.closeCurrentRound();
    },

    async storeResults(numbers) {
        return await ticketRepository.storeResults(numbers);
    }
};
