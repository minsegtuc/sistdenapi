import axios from "axios"
import * as cheerio from "cheerio"
import https from 'https'

const getScrapping = async (req, res) => {
    const { datosMPF } = req.body
    console.log("DatosMPF: ", datosMPF)

    const agent = new https.Agent({
        rejectUnauthorized: false
    });
    try {
        const { data } = await axios.get(datosMPF.url, { httpsAgent: agent, headers: { Cookie: `PHPSESSID=${datosMPF.cookie}` } });
        const $ = cheerio.load(data)

        const items = [];

        const texto = $($('.content')).text()

        items.push(texto);

        res.status(200).json(items)
    } catch (error) {
        console.log(error)
    }
}

export { getScrapping }