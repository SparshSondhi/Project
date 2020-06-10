let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let puppeteer = require("puppeteer");
let credentialsFile = process.argv[2];
let dataset = [];
function parseHTML(data, userName) {
    let $ = cheerio.load(data);
    let data1 = $("meta[name='description']").attr("content");
    let info = data1.split(" ");
    // fixData(info); Used to convert 1.1k to 1100. Erroneous with 2,123 format, so has been excluded.
    let followers = info[0];
    let following = info[2];
    let noofposts = info[4];
    let pObj = {
        User_Name: userName,
        Followers: followers,
        Following: following,
        Posts: noofposts
    }
    dataset.push(pObj);
    console.log("Profile Details:\n\nUser Name:\t" + userName + "\tPosts: " + noofposts + "\tFollowers: " + followers + "\tFollowing: " + following);
}
//----------------Address Copied---------------
//----------------Write to credentials---------
function loginP() {
    (async function () {
        let data = await fs.promises.readFile(credentialsFile, "utf-8");
        let credentials = JSON.parse(data);
        login = credentials.login;
        let email = credentials.email;
        let pwd = credentials.password;
        name1 = credentials.name1;
        name2 = credentials.name2;
        name3 = credentials.name3;
        name4 = credentials.name4;
        let browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized", "--incognito"]
        });
        let numberofPages = await browser.pages();
        let tab = numberofPages[0];

        await tab.goto(login, {
            waitUntil: "networkidle2"
        });

        await tab.waitForSelector("input[aria-label='Phone number, username, or email']");
        await tab.click("input[aria-label='Phone number, username, or email']");
        await tab.type("input[aria-label='Phone number, username, or email']", email, { delay: 100 });

        await tab.waitForSelector("input[aria-label='Password']");
        await tab.click("input[aria-label='Password']");
        await tab.type("input[aria-label='Password']", pwd, { delay: 100 });

        await Promise.all([tab.click(".sqdOP.L3NKy.y3zKF", tab.waitForNavigation({ waitUntil: "networkidle2" }))]);//Login page passed

        await tab.waitForSelector("input[placeholder='Search']");
        await tab.click("input[placeholder='Search']");
        await tab.type("input[placeholder='Search']", name1, { delay: 100 });
        await tab.waitFor(2000);
        await tab.keyboard.press('Enter');
        await tab.keyboard.press('Enter');
        await tab.waitFor(2000);
        //Scraping URLs
        let url1 = `https://www.instagram.com/${name1}/?hl=en`;
        let url2 = `https://www.instagram.com/${name2}/?hl=en`;
        let url3 = `https://www.instagram.com/${name3}/?hl=en`;
        let url4 = `https://www.instagram.com/${name4}/?hl=en`;
        //Scrape Data
        request(url1, function (err, response, data) {
            console.log("\nScanning ID");
            if (err === null && response.statusCode === 200) {
                fs.writeFileSync("Profile1.html", data);
                parseHTML(data, name1);
                console.log("\nFirst ID Scanned");
            } else if (response.statusCode === 404) {
                console.log("Page Not found");
            } else {
                console.log(err);
                console.log(response.statusCode)
            }
        })
        //Data Scraped
        await tab.waitForSelector("input[placeholder='Search']");
        await tab.click("input[placeholder='Search']");
        await tab.type("input[placeholder='Search']", name2, { delay: 100 });
        await tab.waitFor(2000);
        await tab.keyboard.press('Enter');
        await tab.keyboard.press('Enter');
        await tab.waitFor(2000);
        //Scrape data
        request(url2, function (err, response, data) {
            console.log("\nScanning ID");
            if (err === null && response.statusCode === 200) {
                fs.writeFileSync("Profile2.html", data);
                parseHTML(data, name2);
                console.log("\nSecond ID Scanned");
            } else if (response.statusCode === 404) {
                console.log("Page Not found");
            } else {
                console.log(err);
                console.log(response.statusCode)
            }
        })
        //Data Scraped
        await tab.waitForSelector("input[placeholder='Search']");
        await tab.click("input[placeholder='Search']");
        await tab.type("input[placeholder='Search']", name3, { delay: 100 });
        await tab.waitFor(2000);
        await tab.keyboard.press('Enter');
        await tab.keyboard.press('Enter');
        await tab.waitFor(2000);
        //Scrape Data
        request(url3, function (err, response, data) {
            console.log("\nScanning ID");
            if (err === null && response.statusCode === 200) {
                fs.writeFileSync("Profile3.html", data);
                parseHTML(data, name3);
                console.log("\nThird ID Scanned");
            } else if (response.statusCode === 404) {
                console.log("Page Not found");
            } else {
                console.log(err);
                console.log(response.statusCode)
            }
        })
        
        await tab.waitForSelector("input[placeholder='Search']");
        await tab.click("input[placeholder='Search']");
        await tab.type("input[placeholder='Search']", name4, { delay: 100 });
        await tab.waitFor(2000);
        await tab.keyboard.press('Enter');
        await tab.keyboard.press('Enter');
        await tab.waitFor(2000);
        
        request(url4, function (err, response, data) {
            console.log("\nScanning ID");
            if (err === null && response.statusCode === 200) {
                fs.writeFileSync("Profile4.html", data);
                parseHTML(data, name4);
                console.log("\nFourth ID Scanned");
            } else if (response.statusCode === 404) {
                console.log("Page Not found");
            } else {
                console.log(err);
                console.log(response.statusCode)
            }
            console.table(dataset);
            tab.waitFor(5000);
            console.log("\nAll Data Scanned");
            tab.close();
        })
    })()
}
loginP();
// function fixData(arr){
//     for(let i=0;i<arr.length;i++){
//         let c = arr[i].charAt(arr[i].length - 1)
//         switch(c){
//             case 'k': arr[i].substr(0,arr[i].length-2); arr[i] = parseFloat(arr[i]); arr[i] *= 1000; break;
//             case 'm': arr[i].substr(0,arr[i].length-2); arr[i] = parseFloat(arr[i]); arr[i] *= 1000000; break;
//             default: arr[i] = parseFloat(arr[i]);
//         }
//     }
//     return arr;
// } 