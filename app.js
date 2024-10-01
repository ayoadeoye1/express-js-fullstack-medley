const express = require("express");
const path = require("path");
const fileUpload = require("express-fileupload");
const { readCsv, writeCsv, uploadFile } = require("./crud-funcs");

const app = express();
const port = 5000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json({ limit: 10*1024*1024 }));
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
    limits: {
        fileSize: 10*1024*1024
    },
    useTempFiles: true,
    tempFileDir: "/tmp/"
}))


app.use(express.static(path.join(__dirname, "views")));
app.use("/files", express.static(path.join(__dirname, "public")));

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

        let pix = ""
        if(req.files && req.files["Image"]){
            pix = await uploadFile(req)
        }

        const newData = {
            Id: nextId,
            Names,
            Contact,
            Image: pix,
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

app.get("/edit/:id", async (req, res) => {
   try {
        const data = await readCsv();
        const entry = data.find((ele) => ele.Id == req.params.id);

        res.render("edit", {entry});
   } catch (error) {
        console.log("Failed Request:", error.message);
        res.status(500).send("An error occurred while fetching data.");
   }
});

app.post("/edit/:id", async (req, res) => {
   try {
        const { Names,Contact,Image,DOB,Address,Favourite_Quote } = req.body

        let pix = ""
        if(req.files && req.files["Image"]){
            pix = await uploadFile(req)
        }

        const data = await readCsv();
        const entry = data.map((ele) =>
            ele.Id == req.params.id ? 
                {
                    Id: req.params.id,
                    Names,
                    Contact,
                    Image: req.files["Image"] ? pix : Image,
                    DOB,
                    Address,
                    Favourite_Quote
                } : ele
        );

        await writeCsv(entry)
        res.redirect("/")
   } catch (error) {
        console.log("Failed Request:", error.message);
        res.status(500).send("An error occurred while fetching data.");
   }
});

app.listen(port, () => {
    console.log(`<=====> App is live on: http://localhost:${port} <=====>`);
});
