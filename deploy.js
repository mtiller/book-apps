var path = require('path');
var fs = require('fs');

if (process.argv.length !== 3) {
    console.error("Usage: deploy.js <bundle-location>");
}
let assetFile = path.join(__dirname, "build", "asset-manifest.json");

/* Simple script to deploy the built JS */
function deploy(dest) {
    fs.readFile(assetFile, (err, data) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        let assets = JSON.parse(data.toString());
        let bundleFile = path.join("build", assets["main.js"]);
        fs.readFile(bundleFile, (err, bundle) => {
            if (err) {
                console.error("Error reading " + bundleFile + ": ", err);
                process.exit(2);
            }
            fs.writeFile(dest, bundle, (err) => {
                if (err) {
                    console.error("Error writing " + dest + ": ", err);
                    process.exit(1);
                }
                console.log("Copied file " + bundleFile + " to " + dest);
            })
        })
    });
}

deploy(process.argv[2]);