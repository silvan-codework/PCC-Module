Installationsanleitung für die Webanwendung
Diese Anleitung beschreibt die Schritte zur Installation und Einrichtung der Webanwendung für Artikelverwaltung auf einem Windows 11 Notebook im spezifischen Verzeichnis C:\Users\u219854\OneDrive - SBB\09_DEV\VS Code Workspaces\PCC-Module.
Voraussetzungen

Windows 11 Betriebssystem
Internetverbindung
Administratorrechte für die Installation von Software
Zielverzeichnis: C:\Users\u219854\OneDrive - SBB\09_DEV\VS Code Workspaces\PCC-Module

Schritt-für-Schritt-Anleitung
1. Node.js installieren
Node.js ist erforderlich, um den Server der Webanwendung auszuführen.

Öffne einen Webbrowser und gehe zu nodejs.org.
Lade die LTS-Version (Long Term Support) für Windows herunter (z. B. 20.x.x LTS).
Führe die heruntergeladene Installationsdatei (z. B. node-v20.x.x-x64.msi) aus.
Folge dem Installationsassistenten:
Akzeptiere die Lizenzvereinbarung.
Wähle den Standardinstallationspfad (z. B. C:\Program Files\nodejs\).
Stelle sicher, dass die Option „Add to PATH“ aktiviert ist.
Installiere die zusätzlichen Tools (z. B. npm), wenn gefragt.


Klicke auf „Installieren“ und warte, bis die Installation abgeschlossen ist.
Überprüfe die Installation:
Öffne die Eingabeaufforderung (Windows-Taste + R, dann cmd eingeben und Enter drücken).
Gib node -v ein und drücke Enter. Die Version (z. B. v20.x.x) sollte angezeigt werden.
Gib npm -v ein und drücke Enter. Die npm-Version (z. B. 10.x.x) sollte angezeigt werden.



2. Projekt-Repository klonen
Das Projekt wird von einem Git-Repository in das angegebene Verzeichnis heruntergeladen.

Installiere Git, falls noch nicht vorhanden:
Gehe zu git-scm.com.
Lade die Windows-Version herunter und führe die Installationsdatei aus.
Folge dem Installationsassistenten mit den Standardeinstellungen.


Öffne die Eingabeaufforderung oder ein Terminal (z. B. Windows Terminal).
Navigiere zu dem Zielverzeichnis:cd "C:\Users\u219854\OneDrive - SBB\09_DEV\VS Code Workspaces\PCC-Module"


Klone das Repository (ersetze <repository-url> durch die tatsächliche URL des GitHub-Repositories):git clone <repository-url>

Beispiel: git clone https://github.com/dein-benutzername/artikelverwaltung.git
Navigiere in das Projektverzeichnis (angenommen, der Repository-Name ist artikelverwaltung):cd artikelverwaltung



3. Abhängigkeiten installieren
Die Webanwendung benötigt Node.js-Pakete, die über npm installiert werden.

Stelle sicher, dass du im Projektverzeichnis bist (z. B. C:\Users\u219854\OneDrive - SBB\09_DEV\VS Code Workspaces\PCC-Module\artikelverwaltung).
Führe den folgenden Befehl in der Eingabeaufforderung aus:npm install


Warte, bis alle Abhängigkeiten (z. B. express, sqlite3) installiert sind. Dies kann einige Minuten dauern.
Überprüfe, ob die Installation erfolgreich war, indem du den Ordner node_modules im Projektverzeichnis siehst.

4. Datenbank initialisieren
Die Anwendung verwendet SQLite als Datenbank, die automatisch beim Start des Servers erstellt wird.

Stelle sicher, dass die Datei server.js im Projektverzeichnis (C:\Users\u219854\OneDrive - SBB\09_DEV\VS Code Workspaces\PCC-Module\artikelverwaltung) vorhanden ist.
Die Datenbank (database.db) wird beim ersten Start des Servers automatisch im Projektverzeichnis erstellt und mit den erforderlichen Tabellen (Plattformen, Anlagenklassen, Artikel, Artikelgruppen) initialisiert.

5. Server starten
Der Server wird mit Node.js gestartet.

Führe im Projektverzeichnis den folgenden Befehl aus:node server.js


Warte, bis die Meldung Server running on port 3000 in der Eingabeaufforderung erscheint.
Halte die Eingabeaufforderung geöffnet, da der Server im Hintergrund läuft.

6. Anwendung im Browser öffnen
Die Webanwendung ist nun über den Browser zugänglich.

Öffne einen Webbrowser (z. B. Google Chrome, Microsoft Edge).
Gib in der Adressleiste ein: http://localhost:3000
Drücke Enter. Die Hauptseite der Artikelverwaltung sollte angezeigt werden.
Optional: Öffne den CSS-Editor unter http://localhost:3000/css-editor.html, um das Design anzupassen.

7. Anwendung testen

Navigiere zu den Abschnitten „Artikel“, „Anlagenklassen“, „Plattformen“ und „Artikelgruppen“ über die Buttons auf der Hauptseite.
Füge Testdaten hinzu (z. B. eine Plattform, eine Anlagenklasse, einen Artikel).
Überprüfe, ob die Daten in den Tabellen korrekt angezeigt werden.
Teste das Hinzufügen und Entfernen von Artikeln in Artikelgruppen.

Fehlerbehebung

Fehler: „node: command not found“
Stelle sicher, dass Node.js korrekt installiert ist und zum PATH hinzugefügt wurde.
Starte die Eingabeaufforderung oder deinen Computer neu.


Fehler: Port 3000 ist bereits belegt
Beende andere Anwendungen, die Port 3000 verwenden, oder ändere den Port in server.js (z. B. zu 3001).


Fehler: Abhängigkeiten fehlen
Lösche den Ordner node_modules und die Datei package-lock.json im Projektverzeichnis und führe npm install erneut aus.


Datenbankfehler
Überprüfe, ob die Datei database.db im Projektverzeichnis erstellt wurde. Lösche sie und starte den Server neu, um die Datenbank neu zu initialisieren.


Fehler: Zugriff auf OneDrive-Verzeichnis
Stelle sicher, dass OneDrive synchronisiert ist und du Schreibrechte im Verzeichnis C:\Users\u219854\OneDrive - SBB\09_DEV\VS Code Workspaces\PCC-Module hast.



Zusätzliche Hinweise

Die Anwendung benötigt keine externe Datenbank-Software, da SQLite verwendet wird.
Stelle sicher, dass du die neueste Version des Repositories verwendest, indem du git pull im Projektverzeichnis ausführst.
Für die Entwicklung kannst du Visual Studio Code verwenden, das bereits im Verzeichnis VS Code Workspaces impliziert ist. Öffne das Projekt in VS Code mit:code .


Beachte, dass OneDrive die Dateien synchronisiert. Stelle sicher, dass keine Synchronisationskonflikte auftreten, indem du OneDrive während der Entwicklung überwachst.
