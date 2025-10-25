import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function TicketInfo() {
    const { id } = useParams(); 
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTicket = async () => {
        try {
            const res = await fetch(`https://loto-app-b6qy.onrender.com/ticket/${id}`);
            if (!res.ok) throw new Error("Listić nije pronađen");
            const data = await res.json();
            setTicket(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchTicket();
    }, [id]);

    if (loading) return <p>Učitavanje...</p>;
    if (error) return <p>Pogreška: {error}</p>;

    return (
        <div>
        <h1>Listić {ticket.uuid}</h1>
        <p><strong>Osobna iskaznica:</strong> {ticket.personalId}</p>
        <p><strong>Brojevi listića:</strong> {ticket.numbers}</p>
        <p>
            <strong>Izvučeni brojevi:</strong>{" "}
            {ticket.drawNumbers.length > 0 ? ticket.drawNumbers : "Brojevi ovog kola još nisu izvučeni"}
        </p>
        </div>
    );
};

export default TicketInfo;