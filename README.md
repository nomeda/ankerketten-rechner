# ⚓ Ankerketten- und Ankerleinen-Rechner

Eine offlinefähige Progressive Web App zur statischen Berechnung
eines Ankergeschirrs für Segelboote.

Die Anwendung unterstützt:

- eine reine Ankerkette
- einen festen Kettenvorlauf mit elastischer Ankerleine
- die Abschätzung der horizontalen Belastung aus der
  Windgeschwindigkeit
- gemessene Kraft-Dehnungs-Kennlinien verschiedener Ankerleinen

Die Berechnungen laufen vollständig lokal im Browser. Nach der
Installation kann die Anwendung auch ohne Internetverbindung
verwendet werden.

---

## Funktionen

### Reine Ankerkette

Die Anwendung kann:

- die benötigte Kettenlänge berechnen
- eine vorhandene Kettenlänge prüfen
- den frei hängenden Kettenanteil berechnen
- die auf dem Meeresboden liegende Kettenlänge bestimmen
- den horizontalen Abstand zwischen Anker und Bugrolle berechnen
- den Winkel der Kette am Anker bestimmen
- die Zugkräfte am Anker und an der Bugrolle berechnen
- die Kettenlinie grafisch darstellen

Für den Grenzfall eines horizontalen Kettenverlaufs am Anker wird
die klassische Kettenliniengleichung verwendet.

### Kettenvorlauf und Ankerleine

Bei einem kombinierten Ankergeschirr gilt:

```text
Anker → fester Kettenvorlauf → elastische Ankerleine → Bugrolle
