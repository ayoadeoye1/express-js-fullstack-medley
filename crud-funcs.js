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

exports.writeCsv = async (data) => {
    const writeData = writer.createObjectCsvWriter({
        path: dataPath,
        header: [
            { id: 'Id', title: 'Id' },
            { id: 'Names', title: 'Names' },
            { id: 'Contact', title: 'Contact' },
            { id: 'Image', title: 'Image' },
            { id: 'DOB', title: 'DOB' },
            { id: 'Address', title: 'Address' },
            { id: 'Favourite_Quote', title: 'Favourite_Quote' }
        ]
    });
    
    return writeData.writeRecords(data)
}

exports.uploadFile = async (req) => {
    const fileUpload = req.files["Image"]
    
    const fileName = Date.now() + fileUpload.name
    const filePath = path.join(__dirname, "public", fileName)

    fileUpload.mv(filePath, (err) =>{
        if(err){ 
            console.log(`Couldn't the upload file: ${err}`)
        }else {
            console.log("file uploaded successfully")
        }
    })
    
    return fileName
}