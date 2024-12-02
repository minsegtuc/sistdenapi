import axios from "axios"
import * as cheerio from "cheerio"
import https from 'https'
import fs from 'fs';
import puppeteer from 'puppeteer'

const getScrapping = async (req, res) => {

    const { datosMPF } = req.body;
    console.log("DatosMPF: ", datosMPF);

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    try {
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        );

        if (datosMPF.cookie) {
            await page.setCookie({
                name: 'PHPSESSID',
                value: datosMPF.cookie,
                domain: new URL(datosMPF.url).hostname
            });
        }

        await page.goto(datosMPF.url, { waitUntil: 'networkidle0' });

        const extractedText = await page.evaluate(() => {
            const fullText = document.body.innerText;

            const start = fullText.indexOf("RELATO DEL HECHO");
            const end = fullText.indexOf("DATOS TESTIGO/S");

            if (start !== -1 && end !== -1) {
                return fullText.slice(start, end).trim(); 
            }
            return "No se encontró el fragmento especificado.";
        });

        console.log("Texto extraído: ", extractedText);

        await browser.close();

        res.status(200).json({ texto: extractedText });
    } catch (error) {
        console.error("Error en el scraping: ", error);
        await browser.close();
        res.status(500).json({ error: "Error al realizar el scraping" });
    }

    // const agent = new https.Agent({
    //     family: 4,
    //     rejectUnauthorized: process.env.NODE_ENV === 'production',
    //     ...(process.env.NODE_ENV === 'production' && {
    //         ca: [
    //             fs.readFileSync('/etc/letsencrypt/live/srv555183.hstgr.cloud/fullchain.pem'), 
    //             fs.readFileSync('/etc/letsencrypt/live/srv555183.hstgr.cloud/privkey.pem')
    //         ]
    //     })
    // });


    // try {
    //     const { data } = await axios.get(datosMPF.url, { httpsAgent: agent, headers: { Cookie: `PHPSESSID=${datosMPF.cookie}`,'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36' } });
    //     const $ = cheerio.load(data)

    //     console.log("Data: " , data)
    //     const items = [];

    //     const texto = $($('.content')).text()

    //     items.push(texto);

    //     console.log("Informacion: ", items)

    //     res.status(200).json(items)
    // } catch (error) {
    //     console.log(error)
    // }
}

export { getScrapping }