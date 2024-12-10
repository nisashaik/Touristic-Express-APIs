
const corsOriginsList = [
    "http://localhost:5000",
    "http://127.1.1:5000",
    "localhost:5000",
    "http://localhost:5173",
    "http://localhost:5174"
]

const corsOptions = {
    origin: (origin, callback) => {
        if (corsOriginsList.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("request from this origin not allowed"));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true,
    optionsSuccessStatus: 200
}
module.exports = corsOptions;