Prompting

Ich möchte eine Webanwendung entwickeln.

Artikel Tabelle
Als erstes Modul möchte ich Artikel pflegen können.
Artikel haben folgende Attribute
- Artikelnummer
- SAP Nummer
- Bezeichnung
- Plattformzugehörigkeit (Lookup Tabelle Anlagenklasse Spalte Plattform abfragen)
- Anlagenklasse (Auswahlliste Tabelle Anlagenklasse Bezeichnung)
- Materialpreis
- Planungsaufwand (h)
- Realisationsaufwand (h)
- Kosten (Materialpreis+(Planungsaufwand*Stundensatz Planung)+(Realisationsaufwand*Stundensatz Realisation))

Anlagenklassen Tabelle
Anlagenklassen haben folgende Attribute
- ID
- Anlagenklassen Nummer
- Bezeichnung
- Beschreibung (Mehrzeilig)
- Plattform (Auswahlliste Tabelle Plattformen Spalte Kürzel)

Plattform Tabelle
Plattformen haben folgende Attribute
- ID
- Bezeichnung
- Kürzel

Artikelgruppen
Artikelgruppen ermöglichen ein Zusammenfassen mehrerer Artikel.
Dabei werden folgende Attribute summiert
- Materialpreis (Summe des Materialpreis aller enthaltener Artikel)
- Planungsaufwand (Summe des Planungsaufwand aller enthaltener Artikel)
- Kosten (Summe der Kosten aller enthaltener Artikel)

Artikelgruppen haben folgende Attribute zusätzlich
- ID
- Anlagengruppennummer
- Bezeichnung
- Beschreibung (Mehrzeilig)

In Artikelgruppen müssen die enthaltenen Artikel in Listenform aufgeführt sein und in der Webseite geändert werden können. In Tabelle -> Artikel hinzufügen und Artikel löschen.