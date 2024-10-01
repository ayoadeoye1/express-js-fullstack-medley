const express = require("express");
const path = require("path");
const { readCsv, writeCsv } = require("./crud-funcs");

const app = express();
const port = 5000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "views")));

app.get("/", async (req, res) => {
   try {
        let data = await readCsv();
        res.render("index", { data });
   } catch (error) {
        console.log("Failed Request:", error.message);
        res.status(500).send("An error occurred while fetching data.");
   }
});

app.get("/add", async (req, res) => {
   try {
        res.render("add");
   } catch (error) {
        console.log("Failed Request:", error.message);
        res.status(500).send("An error occurred while fetching data.");
   }
});

app.post("/add", async (req, res) => {
   try {
        const { Names,Contact,Image,DOB,Address,Favourite_Quote } = req.body

        let data = await readCsv();
        let nextId = Number(data.slice(-1)[0]?.Id)+1

        const newData = {
            Id: nextId,
            Names,
            Contact,
            Image,
            DOB,
            Address,
            Favourite_Quote
        }
        data.push(newData)

        await writeCsv(data)
        res.redirect("/")
   } catch (error) {
        console.log("Failed Request:", error.message);
        res.status(500).send("An error occurred while fetching data.");
   }
});

// Start the server
app.listen(port, () => {
    console.log(`<=====> App is live on: http://localhost:${port} <=====>`);
});
