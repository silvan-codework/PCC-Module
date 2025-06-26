const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('database.db');

app.use(express.json());
app.use(express.static('.'));

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Plattformen (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Bezeichnung TEXT NOT NULL,
        Kuerzel TEXT NOT NULL UNIQUE
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS Anlagenklassen (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        AnlagenklassenNummer TEXT NOT NULL UNIQUE,
        Bezeichnung TEXT NOT NULL,
        Beschreibung TEXT,
        Plattform TEXT,
        FOREIGN KEY (Plattform) REFERENCES Plattformen(Kuerzel)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS Artikel (
        Artikelnummer TEXT PRIMARY KEY,
        SAPNummer TEXT NOT NULL,
        Bezeichnung TEXT NOT NULL,
        Plattform TEXT,
        Anlagenklasse TEXT,
        Materialpreis REAL NOT NULL,
        Planungsaufwand REAL NOT NULL,
        Realisationsaufwand REAL NOT NULL,
        Kosten REAL GENERATED ALWAYS AS (
            Materialpreis + (Planungsaufwand * 50) + (Realisationsaufwand * 70)
        ) STORED,
        FOREIGN KEY (Plattform) REFERENCES Plattformen(Kuerzel),
        FOREIGN KEY (Anlagenklasse) REFERENCES Anlagenklassen(Bezeichnung)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS Artikelgruppen (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Anlagengruppennummer TEXT NOT NULL UNIQUE,
        Bezeichnung TEXT NOT NULL,
        Beschreibung TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS Artikelgruppen_Artikel (
        ArtikelgruppenID INTEGER,
        Artikelnummer TEXT,
        PRIMARY KEY (ArtikelgruppenID, Artikelnummer),
        FOREIGN KEY (ArtikelgruppenID) REFERENCES Artikelgruppen(ID),
        FOREIGN KEY (Artikelnummer) REFERENCES Artikel(Artikelnummer)
    )`);
});

app.get('/api/articles', (req, res) => {
    db.all('SELECT * FROM Artikel', [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

app.post('/api/articles', (req, res) => {
    const { Artikelnummer, SAPNummer, Bezeichnung, Plattform, Anlagenklasse, Materialpreis, Planungsaufwand, Realisationsaufwand } = req.body;
    db.run(`INSERT INTO Artikel (Artikelnummer, SAPNummer, Bezeichnung, Plattform, Anlagenklasse, Materialpreis, Planungsaufwand, Realisationsaufwand)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [Artikelnummer, SAPNummer, Bezeichnung, Plattform, Anlagenklasse, Materialpreis, Planungsaufwand, Realisationsaufwand], (err) => {
            if (err) return res.status(500).send(err.message);
            res.status(201).send('Article created');
        });
});

app.delete('/api/articles/:artikelnummer', (req, res) => {
    db.run('DELETE FROM Artikel WHERE Artikelnummer = ?', [req.params.artikelnummer], (err) => {
        if (err) return res.status(500).send(err.message);
        res.status(200).send('Article deleted');
    });
});

app.get('/api/plattformen', (req, res) => {
    db.all('SELECT * FROM Plattformen', [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

app.get('/api/anlagenklassen', (req, res) => {
    db.all('SELECT * FROM Anlagenklassen', [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

app.get('/api/artikelgruppen', (req, res) => {
    db.all(`
        SELECT g.*, 
               SUM(a.Materialpreis) as Materialpreis,
               SUM(a.Planungsaufwand) as Planungsaufwand,
               SUM(a.Kosten) as Kosten
        FROM Artikelgruppen g
        LEFT JOIN Artikelgruppen_Artikel ga ON g.ID = ga.ArtikelgruppenID
        LEFT JOIN Artikel a ON ga.Artikelnummer = a.Artikelnummer
        GROUP BY g.ID
    `, [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

app.post('/api/artikelgruppen', (req, res) => {
    const { Anlagengruppennummer, Bezeichnung, Beschreibung } = req.body;
    db.run(`INSERT INTO Artikelgruppen (Anlagengruppennummer, Bezeichnung, Beschreibung)
            VALUES (?, ?, ?)`,
        [Anlagengruppennummer, Bezeichnung, Beschreibung], (err) => {
            if (err) return res.status(500).send(err.message);
            res.status(201).send('Artikelgruppe created');
        });
});

app.delete('/api/artikelgruppen/:id', (req, res) => {
    db.run('DELETE FROM Artikelgruppen WHERE ID = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err.message);
        res.status(200).send('Artikelgruppe deleted');
    });
});

app.get('/api/artikelgruppen/:id/artikel', (req, res) => {
    db.all(`
        SELECT a.*
        FROM Artikel a
        JOIN Artikelgruppen_Artikel ga ON a.Artikelnummer = ga.Artikelnummer
        WHERE ga.ArtikelgruppenID = ?
    `, [req.params.id], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

app.post('/api/artikelgruppen/:id/artikel', (req, res) => {
    const { Artikelnummer } = req.body;
    db.run(`INSERT INTO Artikelgruppen_Artikel (ArtikelgruppenID, Artikelnummer)
            VALUES (?, ?)`,
        [req.params.id, Artikelnummer], (err) => {
            if (err) return res.status(500).send(err.message);
            res.status(201).send('Artikel added to Gruppe');
        });
});

app.delete('/api/artikelgruppen/:id/artikel/:artikelnummer', (req, res) => {
    db.run(`DELETE FROM Artikelgruppen_Artikel
            WHERE ArtikelgruppenID = ? AND Artikelnummer = ?`,
        [req.params.id, req.params.artikelnummer], (err) => {
            if (err) return res.status(500).send(err.message);
            res.status(200).send('Artikel removed from Gruppe');
        });
});

app.listen(3000, () => console.log('Server running on port 3000'));