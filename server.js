const app = require("./src/app/app");
// making app to run on the env port no 
app.listen(process.env.APP_PORT, () => {
    console.log(`App is running on ${process.env.APP_BASE_URL}`)
})
