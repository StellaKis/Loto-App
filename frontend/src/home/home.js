import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home(){
    const [ticketCount, setTicketCount] = useState(null);

    const [user, setUser] = useState(null);

    const [lastDrawnNumbers, setLastDrawnNumbers] = useState(null);

    const [isRoundOpen, setIsRoundOpen] = useState(false);

    useEffect(() => {
    //   const fetchUser = async () => {
    //     try {
    //       const res = await axios.get("https://loto-app-b6qy.onrender.com/profile", { withCredentials: true });
    //       console.log(res.data);
    //       setUser(res.data);
    //     } catch (err) {
    //       setUser(null);
    //     }
    //   };
    //   fetchUser();
        const fetchUser = async () => {
            try {
                const res = await axios.get("https://loto-app-b6qy.onrender.com/profile", {
                withCredentials: true,
                maxRedirects: 0 // Vrlo važno! Sprječava automatsko praćenje redirecta
                });
                console.log("User data:", res.data);
                setUser(res.data);
            } catch (err) {
                setUser(null);
                if (err.response && err.response.status === 302) {
                const redirectUrl = err.response.headers['location'];
                console.log("Redirect to:", redirectUrl);

                // Ako želiš, možeš preusmjeriti browser direktno
                window.location.href = redirectUrl;
                } else {
                console.error("Greška prilikom dohvaćanja profila:", err);
                }
            }
            }
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchTicketCount = async () => {
        try {
            const res = await axios.get("https://loto-app-b6qy.onrender.com/count", {
            withCredentials: true 
            });
            setTicketCount(res.data);
        } catch (err) {
            console.error(err);
            setTicketCount(null);
        }
        };
        fetchTicketCount();
    }, []);

    useEffect(() => {
        const fetchLastDrawnNumbers = async () => {
            try {
                const res = await axios.get(
                    "https://loto-app-b6qy.onrender.com/lastDrawnNumbers",
                    { withCredentials: true }
                );
                setLastDrawnNumbers(res.data.numbers);
            } catch (err) {
                console.error(err);
                setLastDrawnNumbers(null);
            }
        };
        fetchLastDrawnNumbers();
    }, []);

      useEffect(() => {
    const fetchRoundStatus = async () => {
      try {
        const res = await axios.get("https://loto-app-b6qy.onrender.com/activeRound", {
          withCredentials: true,
        });
        setIsRoundOpen(!!res.data.roundId);
      } catch (err) {
        setIsRoundOpen(false);
      }
    };
    fetchRoundStatus();
  }, []);

    if (!user) {
        return (
        <div>
            <h2>Loto 6/45</h2>
            <p>Prijavi se:</p>
            <a href="https://loto-app-b6qy.onrender.com/login">
            <button>Prijava</button>
            </a>
        </div>
        );
    }

    return (
        <div>
            <h2>Loto 6/45</h2>
            <p>Prijavljen korisnik: {user.name}</p>
            <a href="https://loto-app-b6qy.onrender.com/logout">
                <button>Logout</button>
            </a>

            <p>
                Broj uplaćenih listića u trenutnom kolu:{" "}
                {ticketCount !== null ? ticketCount : "prazno"}
            </p>

            {lastDrawnNumbers ? (
                <p>Izvučeni brojevi iz posljednjeg kola: {lastDrawnNumbers}</p>
            ) : (
                <p>Brojevi za prethodno kolo još nisu izvučeni</p>
            )}

            {/* {user && (
                <a href="/TicketForm">
                <button>Uplata listića</button>
                </a>
        )} */}
            {isRoundOpen ? (
                <Link to="/TicketForm">
                <button>Uplata listića</button>
                </Link>
            ) : (
                <p>Uplate trenutno nisu omogućene.</p>
            )}
        </div>
    );
}

export default Home;
