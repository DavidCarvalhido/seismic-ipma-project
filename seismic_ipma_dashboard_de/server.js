const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

// Configuração do pool de conexões com PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

const app = express();
const port = 3000;

// Rota para obter os dados dos sismos
app.get('/earthquakes', async (req, res) => {
    try {
        // Fetch all the necessary earthquakes data from enr.seismic_events_transformed
        const dataQuery = await pool.query("SELECT event_id, obsRegion, lat, lon, magnitud, depth, TO_CHAR(time, 'DD-MM-YYYY') AS date, to_char(time, 'HH24:MI') AS time, classification FROM enr.seismic_events_transformed ORDER BY event_id");

        // Get the total count of earthquakes
        const totalQuery = await pool.query('SELECT COUNT("event_id") FROM enr.seismic_events_transformed');

        // Get the total count of earthquakes from today
        const totalTodayQuery = await pool.query('SELECT COUNT("event_id") FROM enr.seismic_events_transformed WHERE time::date = now()::date');

        //Get the magnitude average
        const avgMagQuery = await pool.query('SELECT ROUND(AVG(magnitud),2) FROM enr.seismic_events_transformed');

        //Get the interval of magnitude
        const minMaxMagQuery = await pool.query("SELECT CONCAT(MIN(magnitud), ' - ', MAX(magnitud)) FROM enr.seismic_events_transformed");

        // Get the latest earthquake
        const latestQuery = await pool.query("SELECT obsRegion, depth, magnitud, TO_CHAR(time, 'DD-MM-YYYY') AS date, classification FROM enr.seismic_events_transformed ORDER BY time DESC LIMIT 1");

        // Get the COUNT for each CLASSIFICATION
        //const classificationQuery = await pool.query("SELECT classification, COUNT(*) AS classification_count FROM enr.seismic_events_transformed WHERE classification IN ('Minor', 'Light', 'Moderate', 'Strong', 'Major', 'Extreme') GROUP BY classification ORDER BY classification");
        const classificationQuery = await pool.query(`
            WITH AllClassifications AS (
                SELECT 'Minor' AS Classification
                    UNION SELECT 'Light'
                    UNION SELECT 'Moderate'
                    UNION SELECT 'Strong'
                    UNION SELECT 'Major'
                    UNION SELECT 'Great'
                    UNION SELECT 'Extreme'
            )
            SELECT
                ac.Classification,
                COALESCE(COUNT(e.Classification), 0) AS Count
            FROM
                AllClassifications ac
            LEFT JOIN
                enr.seismic_events_transformed e
            ON
                ac.Classification = e.Classification
            GROUP BY
                ac.Classification
            ORDER BY
                CASE ac.Classification
                    WHEN 'Minor' THEN 1
                    WHEN 'Light' THEN 2
                    WHEN 'Moderate' THEN 3
                    WHEN 'Strong' THEN 4
                    WHEN 'Major' THEN 5
                    WHEN 'Great' THEN 6
                    WHEN 'Extreme' THEN 7
                    ELSE 8 -- In case there are unexpected classifications
                END;
        `);

        // get...
        const classificationPercentageQuery = await pool.query(`
            SELECT
                classification,
                (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM enr.seismic_events_transformed)) AS percentage
            FROM
                enr.seismic_events_transformed
            GROUP BY
                classification;
        `);

        // get ...
        const seismicScatterQuery = await pool.query('SELECT depth, magnitud FROM enr.seismic_events_transformed');

        //get
        const countByMagnitudQuery = await pool.query('SELECT COUNT(*), magnitud FROM enr.seismic_events_transformed GROUP BY magnitud ORDER BY magnitud DESC');

        // Wait for all queries to complete
        const [dataResult, totalResult, totalTodayResult,
                    avgMagResult, minMaxMagResult, latestResult,
                    classificationResult, classificationPercentageResult,
                    seismicScatterResult, countByMagnitudResult
                ] = await Promise.all([
                dataQuery,
                totalQuery,
                totalTodayQuery,
                avgMagQuery,
                minMaxMagQuery,
                latestQuery,
                classificationQuery,
                classificationPercentageQuery,
                seismicScatterQuery,
                countByMagnitudQuery,
            ]);

        //res.json(result.rows);
        res.json({
            data: dataResult.rows,
            total: parseInt(totalResult.rows[0].count, 10),
            totalToday: parseInt(totalTodayResult.rows[0].count, 10),
            avgMag: parseFloat(avgMagResult.rows[0].round),
            minMaxMag: minMaxMagResult.rows[0],
            latest: latestResult.rows[0],
            classification: classificationResult.rows,
            classificationPercentage: classificationPercentageResult.rows,
            seismicScatter: seismicScatterResult.rows,
            countByMagnitud: countByMagnitudResult.rows,
        });
    } catch (err) {
        console.error('Erro ao buscar dados', err);
        res.status(500).send('Erro ao buscar dados');
    }
});

// Servir arquivos estáticos para o front-end
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
