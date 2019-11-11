let ipp = require("ipp");
let PDFDocument = require("pdfkit");
let fs = require('fs');
let doc = new PDFDocument;
const remote_printer_host = "http://13.233.201.124:3000"
doc.text("Hello World");
let buffers = [];

doc.on('data', buffers.push.bind(buffers));
doc.on('end', function () {
    console.log('file buffurs: ', Buffer.concat(buffers));

    let printer = ipp.Printer(remote_printer_host, {version:'1.0'});

    let print_file_job = {
        "operation-attributes-tag":{
            "requesting-user-name": "User",
        "job-name": "Print Job",
        // "document-format": "application/octet-stream"
        "document-format": "application/octet-stream"        
        },
        data: Buffer.concat(buffers)
    };

    // let get_atr_job = {
    //     "operation":"Get-Printer-Attributes",
    //     "operation-attributes-tag": {
    //         "attributes-charset": "utf-8",
    //         "attributes-natural-language": "en",
    //         "printer-uri": 'my_printer'
    //    }
    // }

    printer.execute("Print-Job", print_file_job, function (err, res) {
        console.dir(res);
    });

    fs.writeFile("test.pdf", Buffer.concat(buffers) , (err) => {
        console.log(err)
    })
});
doc.end();