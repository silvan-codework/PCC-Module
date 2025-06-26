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