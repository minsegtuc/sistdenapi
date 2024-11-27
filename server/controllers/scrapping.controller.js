import axios from "axios"
import * as cheerio from "cheerio"
import https from 'https'
import fs from 'fs';

const getScrapping = async (req, res) => {
    const { datosMPF } = req.body
    console.log("DatosMPF: ", datosMPF)

    let agent;

    if (process.env.NODE_ENV === 'production') {
        agent = new https.Agent({
            ca: [
                fs.readFileSync('/etc/letsencrypt/live/srv555183.hstgr.cloud/fullchain.pem'), 
                fs.readFileSync('/etc/letsencrypt/live/srv555183.hstgr.cloud/privkey.pem')
            ],
            rejectUnauthorized: true
        });
    } else {
        agent = new https.Agent({
            rejectUnauthorized: false
        });
    }


    try {
        const { data } = await axios.get(datosMPF.url, { httpsAgent: agent, headers: { Cookie: `PHPSESSID=${datosMPF.cookie}` } });
        const $ = cheerio.load(data)

        const items = [];

        const texto = $($('.content')).text()

        items.push(texto);

        console.log("Informacion: ", items)

        res.status(200).json(items)
    } catch (error) {
        console.log(error)
    }
}

export { getScrapping }