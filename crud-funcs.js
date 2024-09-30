const parser = require("csv-parser");
const writer = require("csv-writer");
const fs = require("fs");
const path = require("path");

let dataPath = path.join(__dirname, "data.csv");

exports.readCsv = async () => {
    return new Promise((resolve, reject) => {
        let results = []
        fs.createReadStream(dataPath)
        .pipe(parser())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", (error) => reject(`Error Occured: ${error}`))
    })
}