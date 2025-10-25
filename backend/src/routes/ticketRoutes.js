import express from "express";
import {ticketController} from "../controllers/ticketController.js";
import { expressjwt } from "express-jwt";
import jwks from "jwks-rsa";
import dotenv from "dotenv";


dotenv.config();
const router = express.Router();

// router.post("/", (req, res) => {
//   res.json({ message: "Ruta radi!", body: req.body });
// });


router.post("/createTicket", ticketController.createTicket);

router.get("/count", ticketController.getCount);

router.get("/activeRound", ticketController.getActiveRoundId);

router.get("/lastDrawnNumbers", ticketController.getLastDrawnNumbers);

router.get("/ticket/:id", ticketController.getTicket);

const checkM2MJwt = expressjwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://dev-48knub1ve523umrc.us.auth0.com/.well-known/jwks.json`,
    }),
    audience: 'https://loto-api',
    issuer: `https://dev-48knub1ve523umrc.us.auth0.com/`,
    algorithms: ["RS256"],
});

router.post("/new-round", checkM2MJwt, ticketController.newRound);
router.post("/close", checkM2MJwt, ticketController.closeRound);
router.post("/store-results", checkM2MJwt, ticketController.storeResults);


export default router;

