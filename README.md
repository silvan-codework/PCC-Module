Webanwendung für Artikelverwaltung
Beschreibung
Diese Webanwendung ermöglicht die Pflege von Artikeln, Anlagenklassen, Plattformen und Artikelgruppen. Sie verwendet Standardtechnologien und bietet eine benutzerfreundliche Oberfläche zur Verwaltung der Daten.
Eingesetzte Produkte/Technologien

HTML5: Struktur der Webseiten
CSS3: Styling der Oberfläche
JavaScript (ES6): Interaktivität und Logik
SQLite: Datenbank zur Speicherung der Daten
Node.js: Serverumgebung für API
Express.js: Framework für REST-API
Tailwind CSS: Utility-first CSS-Framework für responsives Design

Installation

Installiere Node.js: Node.js Download
Klone das Repository: git clone <repository-url>
Navigiere in das Projektverzeichnis: cd <project-directory>
Installiere Abhängigkeiten: npm install
Starte den Server: node server.js
Öffne die Anwendung im Browser: http://localhost:3000

Datenbankstruktur
Die Datenbank besteht aus den folgenden Tabellen:
Plattformen
CREATE TABLE Plattformen (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Bezeichnung TEXT NOT NULL,
    Kuerzel TEXT NOT NULL UNIQUE
);

Anlagenklassen
CREATE TABLE Anlagenklassen (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    AnlagenklassenNummer TEXT NOT NULL UNIQUE,
    Bezeichnung TEXT NOT NULL,
    Beschreibung TEXT,
    Plattform TEXT,
    FOREIGN KEY (Plattform) REFERENCES Plattformen(Kuerzel)
);

Artikel
CREATE TABLE Artikel (
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
);

Artikelgruppen
CREATE TABLE Artikelgruppen (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Anlagengruppennummer TEXT NOT NULL UNIQUE,
    Bezeichnung TEXT NOT NULL,
    Beschreibung TEXT
);

Artikelgruppen_Artikel (Verknüpfungstabelle)
CREATE TABLE Artikelgruppen_Artikel (
    ArtikelgruppenID INTEGER,
    Artikelnummer TEXT,
    PRIMARY KEY (ArtikelgruppenID, Artikelnummer),
    FOREIGN KEY (ArtikelgruppenID) REFERENCES Artikelgruppen(ID),
    FOREIGN KEY (Artikelnummer) REFERENCES Artikel(Artikelnummer)
);

CSS-Design
Das Design ist in styles.css definiert und wird für alle Webseiten verwendet. Die Attribute können in einer separaten Webseite (css-editor.html) über ein GUI angepasst werden.
styles.css
body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f9;
    margin: 0;
    padding: 20px;
}

h1, h2 {
    color: #333;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #4CAF50;
    color: white;
}

tr:hover {
    background-color: #f5f5f5;
}

button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 5px;
}

button:hover {
    background-color: #45a049;
}

input, select, textarea {
    width: 100%;
    padding: 8px;
    margin: 5px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
}

form {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

CSS-Editor
Die Webseite css-editor.html ermöglicht die Mutation der CSS-Attribute:
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Editor</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>CSS Attribute Editor</h1>
    <form id="cssForm">
        <label for="bodyBg">Body Background Color:</label>
        <input type="color" id="bodyBg" name="bodyBg" value="#f4f4f9"><br>
        <label for="buttonBg">Button Background Color:</label>
        <input type="color" id="buttonBg" name="buttonBg" value="#4CAF50"><br>
        <label for="buttonHoverBg">Button Hover Background Color:</label>
        <input type="color" id="buttonHoverBg" name="buttonHoverBg" value="#45a049"><br>
        <button type="button" onclick="updateCSS()">Apply Changes</button>
    </form>
    <script>
        function updateCSS() {
            const bodyBg = document.getElementById('bodyBg').value;
            const buttonBg = document.getElementById('buttonBg').value;
            const buttonHoverBg = document.getElementById('buttonHoverBg').value;

            const styleSheet = document.styleSheets[0];
            styleSheet.cssRules[0].style.backgroundColor = bodyBg;
            styleSheet.cssRules[4].style.backgroundColor = buttonBg;
            styleSheet.cssRules[5].style.backgroundColor = buttonHoverBg;
        }
    </script>
</body>
</html>

Hauptanwendung
Die Hauptseite index.html bietet Zugriff auf die Verwaltung der Artikel, Anlagenklassen, Plattformen und Artikelgruppen:
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Artikelverwaltung</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Artikelverwaltung</h1>
    <nav>
        <button onclick="loadSection('articles')">Artikel</button>
        <button onclick="loadSection('anlagenklassen')">Anlagenklassen</button>
        <button onclick="loadSection('plattformen')">Plattformen</button>
        <button onclick="loadSection('artikelgruppen')">Artikelgruppen</button>
    </nav>
    <div id="content"></div>
    <script src="app.js"></script>
</body>
</html>

app.js
async function loadSection(section) {
    const content = document.getElementById('content');
    if (section === 'articles') {
        content.innerHTML = await fetchArticles();
    } else if (section === 'anlagenklassen') {
        content.innerHTML = await fetchAnlagenklassen();
    } else if (section === 'plattformen') {
        content.innerHTML = await fetchPlattformen();
    } else if (section === 'artikelgruppen') {
        content.innerHTML = await fetchArtikelgruppen();
    }
}

async function fetchArticles() {
    const response = await fetch('/api/articles');
    const articles = await response.json();
    let html = `
        <h2>Artikel</h2>
        <form id="articleForm">
            <input type="text" id="artikelnummer" placeholder="Artikelnummer" required>
            <input type="text" id="sapNummer" placeholder="SAP Nummer" required>
            <input type="text" id="bezeichnung" placeholder="Bezeichnung" required>
            <select id="plattform" required>
                <option value="">Plattform wählen</option>
            </select>
            <select id="anlagenklasse" required>
                <option value="">Anlagenklasse wählen</option>
            </select>
            <input type="number" id="materialpreis" placeholder="Materialpreis" required>
            <input type="number" id="planungsaufwand" placeholder="Planungsaufwand (h)" required>
            <input type="number" id="realisationsaufwand" placeholder="Realisationsaufwand (h)" required>
            <button type="button" onclick="saveArticle()">Speichern</button>
        </form>
        <table>
            <tr><th>Artikelnummer</th><th>SAP Nummer</th><th>Bezeichnung</th><th>Plattform</th><th>Anlagenklasse</th><th>Materialpreis</th><th>Planungsaufwand</th><th>Realisationsaufwand</th><th>Kosten</th><th>Aktionen</th></tr>
    `;
    articles.forEach(article => {
        html += `
            <tr>
                <td>${article.Artikelnummer}</td>
                <td>${article.SAPNummer}</td>
                <td>${article.Bezeichnung}</td>
                <td>${article.Plattform}</td>
                <td>${article.Anlagenklasse}</td>
                <td>${article.Materialpreis}</td>
                <td>${article.Planungsaufwand}</td>
                <td>${article.Realisationsaufwand}</td>
                <td>${article.Kosten}</td>
                <td><button onclick="deleteArticle('${article.Artikelnummer}')">Löschen</button></td>
            </tr>`;
    });
    html += '</table>';
    await populateSelects();
    return html;
}

async function populateSelects() {
    const plattformSelect = document.getElementById('plattform');
    const anlagenklasseSelect = document.getElementById('anlagenklasse');
    const plattformen = await (await fetch('/api/plattformen')).json();
    const anlagenklassen = await (await fetch('/api/anlagenklassen')).json();
    plattformSelect.innerHTML = '<option value="">Plattform wählen</option>' + plattformen.map(p => `<option value="${p.Kuerzel}">${p.Bezeichnung}</option>`).join('');
    anlagenklasseSelect.innerHTML = '<option value="">Anlagenklasse wählen</option>' + anlagenklassen.map(a => `<option value="${a.Bezeichnung}">${a.Bezeichnung}</option>`).join('');
}

async function saveArticle() {
    const article = {
        Artikelnummer: document.getElementById('artikelnummer').value,
        SAPNummer: document.getElementById('sapNummer').value,
        Bezeichnung: document.getElementById('bezeichnung').value,
        Plattform: document.getElementById('plattform').value,
        Anlagenklasse: document.getElementById('anlagenklasse').value,
        Materialpreis: parseFloat(document.getElementById('materialpreis').value),
        Planungsaufwand: parseFloat(document.getElementById('planungsaufwand').value),
        Realisationsaufwand: parseFloat(document.getElementById('realisationsaufwand').value)
    };
    await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
    });
    loadSection('articles');
}

async function deleteArticle(artikelnummer) {
    await fetch(`/api/articles/${artikelnummer}`, { method: 'DELETE' });
    loadSection('articles');
}

async function fetchArtikelgruppen() {
    const response = await fetch('/api/artikelgruppen');
    const artikelgruppen = await response.json();
    let html = `
        <h2>Artikelgruppen</h2>
        <form id="artikelgruppeForm">
            <input type="text" id="anlagengruppennummer" placeholder="Anlagengruppennummer" required>
            <input type="text" id="bezeichnung" placeholder="Bezeichnung" required>
            <textarea id="beschreibung" placeholder="Beschreibung"></textarea>
            <button type="button" onclick="saveArtikelgruppe()">Speichern</button>
        </form>
        <table>
            <tr><th>Anlagengruppennummer</th><th>Bezeichnung</th><th>Beschreibung</th><th>Materialpreis</th><th>Planungsaufwand</th><th>Kosten</th><th>Artikel</th><th>Aktionen</th></tr>
    `;
    for (const gruppe of artikelgruppen) {
        const artikelResponse = await fetch(`/api/artikelgruppen/${gruppe.ID}/artikel`);
        const artikel = await artikelResponse.json();
        html += `
            <tr>
                <td>${gruppe.Anlagengruppennummer}</td>
                <td>${gruppe.Bezeichnung}</td>
                <td>${gruppe.Beschreibung}</td>
                <td>${gruppe.Materialpreis}</td>
                <td>${gruppe.Planungsaufwand}</td>
                <td>${gruppe.Kosten}</td>
                <td>
                    <ul>${artikel.map(a => `<li>${a.Artikelnummer} <button onclick="removeArtikelFromGruppe(${gruppe.ID}, '${a.Artikelnummer}')">Entfernen</button></li>`).join('')}</ul>
                    <select id="artikelSelect${gruppe.ID}">
                        <option value="">Artikel wählen</option>
                        ${(await (await fetch('/api/articles')).json()).map(a => `<option value="${a.Artikelnummer}">${a.Artikelnummer}</option>`).join('')}
                    </select>
                    <button onclick="addArtikelToGruppe(${gruppe.ID})">Hinzufügen</button>
                </td>
                <td><button onclick="deleteArtikelgruppe(${gruppe.ID})">Löschen</button></td>
            </tr>`;
    }
    html += '</table>';
    return html;
}

async function addArtikelToGruppe(gruppeID) {
    const artikelnummer = document.getElementById(`artikelSelect${gruppeID}`).value;
    await fetch(`/api/artikelgruppen/${gruppeID}/artikel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Artikelnummer: artikelnummer })
    });
    loadSection('artikelgruppen');
}

async function removeArtikelFromGruppe(gruppeID, artikelnummer) {
    await fetch(`/api/artikelgruppen/${gruppeID}/artikel/${artikelnummer}`, { method: 'DELETE' });
    loadSection('artikelgruppen');
}

async function saveArtikelgruppe() {
    const artikelgruppe = {
        Anlagengruppennummer: document.getElementById('anlagengruppennummer').value,
        Bezeichnung: document.getElementById('bezeichnung').value,
        Beschreibung: document.getElementById('beschreibung').value
    };
    await fetch('/api/artikelgruppen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(artikelgruppe)
    });
    loadSection('artikelgruppen');
}

async function deleteArtikelgruppe(id) {
    await fetch(`/api/artikelgruppen/${id}`, { method: 'DELETE' });
    loadSection('artikelgruppen');
}

server.js
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
        if err) return res.status(500).send(err.message);
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

Verwendung

Starte den Server mit node server.js.
Öffne http://localhost:3000 im Browser.
Navigiere zu den Abschnitten für Artikel, Anlagenklassen, Plattformen oder Artikelgruppen.
Verwende die Formulare, um Daten hinzuzufügen, und die Tabellen, um Daten zu löschen oder Artikel zu Artikelgruppen hinzuzufügen/entfernen.
Passe das Design über http://localhost:3000/css-editor.html an.

Hinweise

Die Kostenberechnung in der Artikel-Tabelle verwendet feste Stundensätze (50 € für Planungsaufwand, 70 € für Realisationsaufwand).
Die Summen für Materialpreis, Planungsaufwand und Kosten in Artikelgruppen werden automatisch über die verknüpften Artikel berechnet.
Die Anwendung ist responsiv und verwendet Tailwind CSS für ein modernes Design.
