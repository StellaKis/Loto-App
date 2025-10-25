import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";


function TicketForm() {
    const navigate = useNavigate();
    const [personalId, setPersonalId] = useState("");
    const [numbers, setNumbers] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(null);

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [activeRound, setActiveRound] = useState(null); 
    const [roundError, setRoundError] = useState(""); 

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const res = await axios.get("http://localhost:4000/profile", { withCredentials: true });
          setUser(res.data);
        } catch (err) {
          setUser(null);
        } finally {
          setLoading(false); 
        }
      };
      fetchUser();
    }, []);

    useEffect(() => {
      const fetchActiveRound = async () => {
        try {
          const res = await axios.get("http://localhost:4000/activeRound", { withCredentials: true });
          setActiveRound(res.data.roundId); 
        } catch (err) {
          if (err.response && err.response.data && err.response.data.message) {
            setRoundError(err.response.data.message); 
          } else {
            setRoundError("Greška pri dohvaćanju aktivne runde");
          }
        }
      };
      fetchActiveRound();
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setSuccess(null);

      try {
        const res = await axios.post(
          "http://localhost:4000/createTicket",
          { personalId, numbers }
        );
        setSuccess(res.data);
      } catch (err) {
        if (err.response && err.response.data) {
          setError(err.response.data.error);
        } else {
          setError("Greška pri slanju podataka");
        }
      }
    };

      useEffect(() => {
        if (!loading && !user) {
          navigate('/');
        }
      }, [user, loading, navigate]);

    if (!user) {
      return null;
    }

    return (
      <div>
        <h2>Loto 6/45</h2>
        <a href="http://localhost:3000/">Povratak</a>
        <p>Prijavljen korisnik: {user.name}</p>
        <a href="http://localhost:4000/logout">
          <button>Logout</button>
        </a>

        {roundError && <p style={{ color: "red" }}>{roundError}</p>}

        {activeRound && (
          <div>
            <p>Unos loto listića</p>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Broj osobne iskaznice / putovnice:</label><br />
                <input
                  type="text"
                  value={personalId}
                  maxLength={20}
                  onChange={(e) => setPersonalId(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Brojevi (6-10, odvojeni zarezom):</label><br />
                <input
                  type="text"
                  value={numbers}
                  onChange={(e) => setNumbers(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Pošalji listić</button>
            </form>
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && (
          <div style={{ color: "green" }}>
            <p>Listić uspješno poslan!</p>
            <p>Ticket ID: {success.ticketId}</p>
            <a href={success.ticketUrl} target="_blank" rel="noopener noreferrer">
              <QRCodeCanvas
                value={success.ticketUrl}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={true}
              />
            </a>
          </div>
        )}
      </div>
    );
}

export default TicketForm;