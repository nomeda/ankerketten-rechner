# ⚓ Ankerketten- und Ankerleinen-Rechner

Eine offlinefähige Webanwendung zur statischen Berechnung von
Ankergeschirren für Segelboote.

Die Anwendung unterstützt:

- eine reine Ankerkette,
- einen festen Kettenvorlauf mit elastischer Ankerleine,
- die direkte Eingabe einer horizontalen Zugkraft,
- die Abschätzung der Zugkraft aus der Windgeschwindigkeit,
- gemessene Kraft-Dehnungs-Kennlinien verschiedener Leinen,
- sowie die grafische Darstellung des Ankergeschirrs.

Alle Berechnungen erfolgen lokal im Browser. Nach der Installation
kann die Anwendung auch ohne Internetverbindung verwendet werden.

---

## 1. Zweck der Anwendung

Der Ankerrechner untersucht die statische Form und Belastung eines
Ankergeschirrs zwischen Anker und Bugrolle:

```text
Anker → Ankergeschirr → Bugrolle
Die Anwendung beantwortet insbesondere folgende Fragen:

Wie viel Ankerkette wird bei einer bestimmten Wassertiefe und horizontalen Belastung benötigt?
Reicht eine vorhandene Kettenlänge aus?
Liegt noch ein Teil der Kette auf dem Meeresboden?
Verläuft die Kette am Anker horizontal?
Hebt sich die Kette vollständig vom Meeresboden ab?
Welcher Winkel entsteht bei einer abgehobenen Kette am Anker?
Welche Zugkräfte wirken am Anker und an der Bugrolle?
Wie lang muss bei einem festen Kettenvorlauf die Ankerleine sein?
Wie stark verlängert sich eine elastische Ankerleine?
Wie hoch ist die Auslastung der Leine im Verhältnis zu ihrer gemessenen Bruchlast?
Die Berechnung verwendet ein vereinfachtes statisches Modell. Die
Ergebnisse dienen der technischen Abschätzung und sind keine
garantierte sichere Ankerauslegung.

2. Auswahl des Ankergeschirrs
Die Anwendung bietet zwei Arten von Ankergeschirr.

2.1 Nur Kette
Die gesamte Verbindung zwischen Anker und Bugrolle besteht aus
Ankerkette:

text
Anker → Ankerkette → Bugrolle
Die Kette wird als undehnbare Kettenlinie berechnet.

Je nach Kettenlänge und Belastung kann:

ein Teil der Kette auf dem Meeresboden liegen,
die Kette den Boden gerade noch horizontal verlassen,
oder die gesamte Kette vom Meeresboden abgehoben sein.
2.2 Kettenvorlauf und Ankerleine
Das Ankergeschirr besteht aus einem festen Kettenvorlauf und einer
elastischen Ankerleine:

text
Anker → Kettenvorlauf → Ankerleine → Bugrolle
Dabei gilt:

Die Gesamtlänge des Kettenvorlaufs wird vorgegeben.
Die Länge des Kettenvorlaufs wird nicht verändert.
Im Modus „Benötigte Länge“ wird nur die erforderliche Ankerleinenlänge berechnet.
Im Modus „Vorhandene Länge prüfen“ werden die vorhandene Kettenlänge und die vorhandene Leinenlänge gemeinsam untersucht.
Die Dehnung der Leine wird anhand einer gemessenen Kraft-Dehnungs-Kennlinie berechnet.
3. Berechnungsarten
Für beide Arten des Ankergeschirrs stehen zwei Berechnungsarten zur
Verfügung.

3.1 Benötigte Länge berechnen
Bei reiner Kette
Die Anwendung berechnet die Kettenlänge, die bei der angegebenen
Belastung erforderlich ist, damit die Kette am Ablösepunkt vom
Meeresboden horizontal verläuft.

Zusätzlich wird angegeben, wie viel Kette als Reserve auf dem
Meeresboden liegen soll.

Die ausgegebene Gesamtlänge besteht aus:

text
Gesamtlänge =
frei hängende Kette + gewünschte Bodenreserve
Bei Kettenvorlauf und Ankerleine
Die Gesamtlänge des Kettenvorlaufs bleibt fest.

Angegeben werden:

die Länge des Kettenvorlaufs,
die Kettenstärke,
der gewünschte Kettenanteil auf dem Meeresboden,
und die verwendete Ankerleine.
Die Anwendung berechnet daraus:

den frei hängenden Teil der Kette,
die Position des Übergangs zwischen Kette und Leine,
die Zugkraft in der Leine,
die prozentuale Leinendehnung,
die Leinenlänge unter Last,
die Verlängerung der Leine,
und die erforderliche unbelastete Leinenlänge.
3.2 Vorhandene Länge prüfen
Bei reiner Kette
Die vorhandene beziehungsweise ausgebrachte Kettenlänge wird
eingegeben.

Die Anwendung prüft, ob:

noch Kette auf dem Meeresboden liegt,
die Kette den Boden gerade noch horizontal verlässt,
oder die gesamte Kette abgehoben ist.
Ist die Kette vollständig abgehoben, berechnet die Anwendung den
Winkel der Kette am Anker.

Bei Kettenvorlauf und Ankerleine
Angegeben werden:

die feste Länge des Kettenvorlaufs,
die unbelastete Länge der vorhandenen Ankerleine,
die Kettenstärke,
und der verwendete Leinentyp.
Die Anwendung berechnet:

die Leinenlänge unter Last,
die Verlängerung der Leine,
den frei hängenden Kettenanteil,
den Kettenanteil auf dem Meeresboden,
den Übergang zwischen Kette und Leine,
den horizontalen Abstand zwischen Anker und Bugrolle,
und gegebenenfalls den Winkel am Anker.
4. Eingabedaten
4.1 Wassertiefe
Die für die Berechnung verwendete Höhe über dem Meeresboden setzt
sich aus drei Eingaben zusammen:

text
Höhe über Grund =
Wassertiefe
+ zusätzlicher Wasserstand
+ Höhe der Bugrolle über dem Wasser
Wassertiefe
Aktuelle oder erwartete Wassertiefe am Ankerplatz.

Zusätzlicher Wasserstand
Optionaler Zuschlag, beispielsweise für:

Tidenhub,
Hochwasser,
Pegelschwankungen,
oder eine zusätzliche Wasserstandsreserve.
Höhe der Bugrolle
Vertikaler Abstand zwischen der Wasseroberfläche und dem Punkt, an
dem Kette oder Leine das Boot erreicht.

4.2 Kettenauswahl
Folgende typische Kettengewichte sind hinterlegt:

Kettendurchmesser	Trockenmasse
6 mm	ca. 0,80 kg/m
8 mm	ca. 1,40 kg/m
10 mm	ca. 2,30 kg/m
Zusätzlich kann ein benutzerdefiniertes Kettengewicht eingegeben
werden.

Die hinterlegten Werte sind Näherungswerte für kurzgliedrige
Ankerketten. Die Herstellerangaben der tatsächlich verwendeten
Kette haben Vorrang.

Aus der Trockenmasse berechnet die Anwendung das wirksame
Kettengewicht unter Wasser. Dabei wird der Auftrieb der Stahlkette
im Meerwasser berücksichtigt.

4.3 Kettenvorlauf
Im kombinierten Modus wird die gesamte Länge des Kettenvorlaufs
eingegeben.

Diese Länge bleibt während der Berechnung unverändert.

Im Modus „Benötigte Länge“ wird zusätzlich festgelegt, wie viel
Kette auf dem Meeresboden liegen soll. Der restliche Teil des
Kettenvorlaufs hängt frei.

Im Modus „Vorhandene Länge prüfen“ bestimmt die Anwendung selbst,
wie viel Kette unter der angegebenen Belastung noch auf dem Boden
liegt.

4.4 Ankerleine
Im kombinierten Modus kann eine Leine aus der integrierten
Leinenbibliothek ausgewählt werden.

Zu jeder Leine sind hinterlegt:

Hersteller,
Produktbezeichnung,
Material,
Konstruktion,
Durchmesser,
gemessene Masse pro Meter,
mittlere gemessene Bruchlast,
maximaler Messbereich der Dehnungskennlinie,
Prüfbedingungen,
und die Kraft-Dehnungs-Kennlinie.
Die Dehnung zwischen den hinterlegten Messpunkten wird linear
interpoliert.

Oberhalb des gemessenen Kennlinienbereichs wird nicht
extrapoliert. Die Anwendung beendet die Berechnung stattdessen mit
einer Warnung.

5. Leinenbibliothek
Die Anwendung enthält derzeit zwei gemessene Polyamid-Leinen mit
14 mm Durchmesser.

5.1 Robline 8-Plait, 14 mm
Eigenschaft	Wert
Hersteller	Robline
Produkt	8-Plait
Material	Polyamid
Konstruktion	8-fach geflochten
Durchmesser	14 mm
gemessene Trockenmasse	109,61 g/m
mittlere gemessene Bruchlast	4.169 daN
mittlere gemessene Bruchlast	41,69 kN
Kennlinie gemessen bis	4.056 daN
Kennlinie gemessen bis	40,56 kN
5.2 Liros Handy Elastic, 14 mm
Eigenschaft	Wert
Hersteller	Liros
Produkt	Handy Elastic
Material	Polyamid
Durchmesser	14 mm
gemessene Trockenmasse	103,27 g/m
mittlere gemessene Bruchlast	4.363 daN
mittlere gemessene Bruchlast	43,63 kN
Kennlinie gemessen bis	3.974 daN
Kennlinie gemessen bis	39,74 kN
Die beiden Leinen besitzen unterschiedliche
Kraft-Dehnungs-Kennlinien. Dadurch ergeben sich bei gleicher
Zugkraft unterschiedliche Verlängerungen.

Die Robline 8-Plait dehnt sich innerhalb der gemessenen Kennlinien
bei gleicher Kraft stärker als die Liros Handy Elastic.

6. Prüfverfahren der Leinen
Beide Leinen wurden nach demselben standardisierten Verfahren
untersucht.

Prüfbedingungen:

neues Tauwerk,
trockener Zustand,
drei Vorbelastungszyklen,
Vorbelastung jeweils bis 50 % der Bruchlast,
anschließende Entlastung,
neue Nullung der Dehnung nach der Vorbelastung,
Belastung bis in den Bereich der Bruchlast,
Mittelwertbildung aus drei Messungen.
Die Vorbelastung soll das anfängliche Setzen des Geflechts
weitgehend aus der eigentlichen Dehnungsmessung entfernen.

Die Kennlinien beschreiben daher neues, trockenes und
vorkonditioniertes Tauwerk.

Sie beschreiben nicht unmittelbar das Verhalten:

einer nassen Leine,
einer gealterten Leine,
einer beschädigten Leine,
oder einer neuen Leine bei der ersten Belastung ohne Vorkonditionierung.
7. Ermittlung der horizontalen Belastung
Die horizontale Belastung kann auf zwei Arten vorgegeben werden.

7.1 Kraft direkt eingeben
Ist die horizontale Belastung bereits bekannt, kann sie direkt in
Kilonewton eingegeben werden.

Diese Eingabemöglichkeit eignet sich beispielsweise für:

gemessene Lasten,
Ergebnisse anderer Berechnungen,
Vergleichsrechnungen,
oder vorgegebene Auslegungslasten.
7.2 Belastung aus der Windgeschwindigkeit berechnen
Alternativ schätzt die Anwendung die statische Windkraft des Boots
ab.

Verwendet wird:

text
F = 0,5 · ρLuft · V² · CdA
Dabei bedeuten:

F: statische Windkraft,
ρLuft: Luftdichte,
V: Windgeschwindigkeit in m/s,
CdA: effektive Windangriffsfläche in m².
Die Windgeschwindigkeit wird in Knoten eingegeben und intern in
Meter pro Sekunde umgerechnet.

Die effektive Windangriffsfläche CdA ist nicht nur die
geometrische Fläche des Boots. Sie enthält bereits die
Widerstandsbeiwerte von beispielsweise:

Rumpf,
Decksaufbau,
Mast,
stehendem Gut,
Sprayhood,
Bimini,
Rollsegeln,
Solarmodulen,
Radar,
Beiboot,
und sonstiger Ausrüstung.
Für die Berechnung sollte möglichst die erwartete maximale
Böengeschwindigkeit verwendet werden.

8. Zusätzlicher Lastfaktor
Die berechnete oder direkt eingegebene Horizontallast kann mit
einem zusätzlichen Faktor multipliziert werden:

text
verwendete Horizontallast =
Grundlast × Lastfaktor
Der Faktor kann Unsicherheiten berücksichtigen, beispielsweise bei:

der Windangriffsfläche,
den Widerstandsbeiwerten,
der Bootsstellung,
oder der statischen Modellierung.
Wenn bereits die Böengeschwindigkeit eingegeben wurde, sollte
derselbe Böeneffekt nicht zusätzlich ein zweites Mal über den
Lastfaktor angesetzt werden.

Der Lastfaktor ist kein Ersatz für eine dynamische Berechnung von
Wellen-, Gier- und Ruckbelastungen.

9. Berechnung der reinen Kette
Für die Kette wird das klassische statische Kettenlinienmodell
verwendet.

Es gelten:

text
H = horizontale Zugkraft
w = Kettengewicht unter Wasser pro Meter
a = H / w
h = Höhe der Bugrolle über dem Meeresboden
Für den Fall, dass die Kette den Meeresboden horizontal verlässt,
lautet die Kettenlinie:

text
z(x) = a · (cosh(x / a) − 1)
Die benötigte frei hängende Kettenlänge ist:

text
s = √(h² + 2 · H · h / w)
Die horizontale Ausdehnung des frei hängenden Kettenabschnitts ist:

text
x = a · arcosh(1 + h / a)
Am Ablösepunkt vom Meeresboden gilt:

text
Winkel = 0°
vertikale Kraft = 0
Ist die vorhandene Kette zu kurz, um diese Randbedingung zu
erfüllen, wird die gesamte Kette als frei hängend berechnet. Dabei
entsteht am Anker ein positiver Winkel und damit ein vertikaler
Kraftanteil.

10. Berechnung von Kettenvorlauf und Ankerleine
Im kombinierten Modell wird der Kettenvorlauf als Kettenlinie
berechnet.

Am oberen Ende des Kettenvorlaufs werden bestimmt:

horizontaler Kraftanteil,
vertikaler Kraftanteil,
gesamte Zugkraft,
Höhe über dem Meeresboden,
horizontale Position,
und Winkel des Kettenendes.
Die Ankerleine wird anschließend als gerade elastische Verbindung
zwischen dem oberen Ende des Kettenvorlaufs und der Bugrolle
behandelt.

Da die Leine in der aktuellen Modellversion als gewichtslos
angenähert wird, ist ihre Zugkraft entlang der gesamten Leine
gleich.

Die belastete Leinenlänge ergibt sich aus:

text
Lbelastet =
Lunbelastet · (1 + Dehnung / 100)
Die Dehnung wird aus der gemessenen Kennlinie der ausgewählten
Leine interpoliert.

11. Ergebnisse der Anwendung
11.1 Allgemeine Ergebnisse
Die Anwendung zeigt unter anderem:

verwendete Horizontallast,
Höhe der Bugrolle über dem Meeresboden,
horizontalen Abstand zwischen Anker und Bugrolle,
gesamte Kettenlänge,
frei hängende Kettenlänge,
Kettenlänge auf dem Meeresboden,
Winkel am Anker,
Zugkraft am Anker,
Zugkraft am oberen Ende des Ankergeschirrs,
und Kettengewicht unter Wasser.
11.2 Zusätzliche Ergebnisse bei Ankerleine
Im kombinierten Modus werden zusätzlich angezeigt:

ausgewählter Leinentyp,
unbelastete Leinenlänge,
Leinenlänge unter Last,
absolute Leinenverlängerung,
prozentuale Leinendehnung,
Zugkraft in der Leine,
und Auslastung relativ zur mittleren gemessenen Bruchlast.
Die mittlere Bruchlast darf nicht mit einer zulässigen
Arbeitslast gleichgesetzt werden.

12. Grafische Darstellung
Die Anwendung zeichnet das berechnete Ankergeschirr in einem
Diagramm.

Verwendete Farben:

dunkelgrau: Ankerkette,
orange: Ankerleine,
braun: Meeresboden,
orangefarbener Punkt: Ablösepunkt der Kette vom Boden,
roter Punkt: Anker,
blauer Punkt: Bugrolle.
Die Darstellung zeigt:

den Kettenanteil auf dem Boden,
den frei hängenden Kettenabschnitt,
den Übergang zwischen Kette und Leine,
den Verlauf der Ankerleine,
die Wasseroberfläche,
die Höhe über Grund,
und den horizontalen Abstand.
Die Zeichnung wird automatisch auf den verfügbaren Bereich
skaliert. Sie besitzt daher keinen festen Kartenmaßstab.

13. Festigkeitsanzeigen
13.1 Kette
Optional kann die zulässige Arbeitslast der Kette eingegeben
werden.

Die Anwendung vergleicht die größte berechnete Kettenzugkraft mit
dieser Arbeitslast.

Wird keine Arbeitslast eingegeben, erfolgt keine
Kettenfestigkeitsprüfung.

13.2 Ankerleine
Bei der Leine wird die berechnete Zugkraft mit der mittleren
gemessenen Bruchlast verglichen:

text
Leinenauslastung =
Leinenzug / mittlere Bruchlast × 100 %
Diese Auslastung ist nur eine technische Vergleichsgröße.

Die Anwendung legt damit keine verbindliche zulässige Arbeitslast
der Leine fest.

14. Fehlermeldungen und Grenzfälle
Die Anwendung beendet eine Berechnung mit einer Fehlermeldung,
wenn beispielsweise:

Eingabewerte fehlen oder ungültig sind,
eine Länge negativ oder null ist,
die Kette kürzer als der notwendige vertikale Abstand ist,
die Bodenreserve länger als der Kettenvorlauf ist,
Kette und Leine die Bugrolle geometrisch nicht erreichen,
die Leinenkraft oberhalb des gemessenen Kennlinienbereichs liegt,
oder innerhalb des Messbereichs keine statische Lösung gefunden werden kann.
Die Leinenkennlinien werden oberhalb ihrer gemessenen Bereiche
nicht extrapoliert.

15. Bedienung
Reine Kette berechnen
„Nur Kette“ auswählen.
„Benötigte Länge“ oder „Vorhandene Länge prüfen“ auswählen.
Wassertiefe, zusätzlichen Wasserstand und Bugrollenhöhe eingeben.
Kettenstärke auswählen.
Bodenreserve oder vorhandene Kettenlänge eingeben.
Windlast oder direkte Horizontalkraft festlegen.
Optional einen Lastfaktor und die Arbeitslast der Kette eingeben.
„Berechnung durchführen“ auswählen.
Kettenvorlauf mit Ankerleine berechnen
„Kettenvorlauf + Leine“ auswählen.
„Benötigte Länge“ oder „Vorhandene Länge prüfen“ auswählen.
Wassertiefe, zusätzlichen Wasserstand und Bugrollenhöhe eingeben.
Kettenstärke und feste Länge des Kettenvorlaufs eingeben.
Gewünschte Bodenreserve oder vorhandene unbelastete Leinenlänge eingeben.
Leinentyp aus der Bibliothek auswählen.
Windlast oder direkte Horizontalkraft festlegen.
Optional einen Lastfaktor und die Arbeitslast der Kette eingeben.
„Berechnung durchführen“ auswählen.
Die Berechnung wird bei Änderungen an den Eingabefeldern außerdem
automatisch aktualisiert.

16. Offlinebetrieb
Die Anwendung ist als Progressive Web App ausgeführt.

Nach dem ersten erfolgreichen Online-Aufruf werden die benötigten
Programmdateien lokal gespeichert. Danach kann der Rechner ohne
Internetverbindung verwendet werden.

Alle Berechnungen erfolgen lokal im Browser. Die eingegebenen
Berechnungsdaten werden nicht an einen Server übertragen.

17. Installation auf dem iPhone
Die Webadresse der Anwendung in Safari öffnen.
Die Seite vollständig laden lassen.
Auf das Teilen-Symbol tippen.
„Zum Home-Bildschirm“ auswählen.
Die Anwendung hinzufügen.
Die App über das neue Symbol starten.
Den Offlinebetrieb bei Bedarf im Flugmodus testen.
Beim ersten Aufruf und bei der Installation muss eine
Internetverbindung vorhanden sein.

18. Modellgrenzen
Die Anwendung verwendet ein vereinfachtes statisches Modell.

Nicht oder nicht vollständig berücksichtigt werden:

Wellen,
Stampfen und Rollen des Boots,
Gieren beziehungsweise Schwojen am Anker,
dynamische Ruckbelastungen,
Beschleunigung des Boots,
Strömung auf Boot, Kette und Leine,
Bodenreibung,
geneigter oder unebener Meeresboden,
elastische Dehnung der Kette,
Eigengewicht und Durchhang der Ankerleine,
Wasseraufnahme der Leine,
Unterschiede zwischen trockener und nasser Leine,
Hysterese bei Be- und Entlastung,
zeitabhängiges Kriechen,
Alterung,
UV-Schädigung,
Abrieb,
Scheuerstellen,
Knoten,
Spleiße,
Festigkeit von Schäkeln und Verbindungsteilen,
Ankertyp und Ankergeometrie,
Beschaffenheit des Ankergrundes,
Haltekraft des Ankers,
Pflügen oder Ausbrechen des Ankers.
Die berechnete Windkraft ist ebenfalls nur eine statische
Abschätzung.

19. Sicherheitshinweis
Die Ergebnisse dienen:

der technischen Abschätzung,
dem Vergleich verschiedener Konfigurationen,
und dem Verständnis des statischen Verhaltens von Kette und Leine.
Die Ergebnisse stellen keine garantierte sichere Ankerauslegung
dar und ersetzen nicht:

Herstellerangaben,
ausreichende Sicherheitsfaktoren,
die Kontrolle aller Komponenten,
seemännische Erfahrung,
Wetterbeobachtung,
Ankerwache,
und eine professionelle technische Auslegung.
Insbesondere darf eine gemessene oder angegebene Bruchlast nicht
direkt als zulässige dauerhafte Arbeitslast verwendet werden.
