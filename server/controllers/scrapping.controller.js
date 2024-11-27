import axios from "axios"
import * as cheerio from "cheerio"
import https from 'https'
import fs from 'fs';

const getScrapping = async (req, res) => {
    const { datosMPF } = req.body
    console.log("DatosMPF: ", datosMPF)

    const agent = new https.Agent({
        family: 4,
        rejectUnauthorized: process.env.NODE_ENV === 'production',
        ...(process.env.NODE_ENV === 'production' && {
            ca: [
                fs.readFileSync('/etc/letsencrypt/live/srv555183.hstgr.cloud/fullchain.pem'), 
                fs.readFileSync('/etc/letsencrypt/live/srv555183.hstgr.cloud/privkey.pem')
            ]
        })
    });


    try {
        const { data } = await axios.get(datosMPF.url, { httpsAgent: agent, headers: { Cookie: `PHPSESSID=${datosMPF.cookie}`,'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36' } });
        const $ = cheerio.load(data)

        console.log("Data: " , data)
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