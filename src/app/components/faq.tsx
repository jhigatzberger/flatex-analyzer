"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReactPlayer from "react-player";

function FAQListItem({ children }: { children: React.ReactNode }) {
  return (
    <ListItem
      disableGutters
      disablePadding
      sx={{ display: "list-item", pl: 2, mb: 0.5 }}
    >
      <Typography component="span">– {children}</Typography>
    </ListItem>
  );
}

export default function FAQ() {
  return (
    <Box sx={{ width: "100%", mt: 6, textAlign: "left" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        FAQ
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="medium">
            Wie bekomme ich die Daten aus Flatex in das Tool?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <FAQListItem>
              Logge dich in der Webversion von Flatex ein.
            </FAQListItem>
            <FAQListItem>
              Stelle sicher, dass du Flatex <b>Classic</b> verwendest.
            </FAQListItem>
            <FAQListItem>
              Gehe auf <i>"Konto & Depot"</i> und dann auf <i>"Depotumsätze"</i>
              .
            </FAQListItem>
            <FAQListItem>
              Wähle den Zeitraum aus, für den du die Daten exportieren möchtest.
            </FAQListItem>
            <FAQListItem>
              Vergiss nicht auf <i>"Übernehmen"</i> zu klicken.
            </FAQListItem>
            <FAQListItem>
              Klicke auf die drei Punkte auf der rechten Seite und wähle{" "}
              <i>"Export CSV"</i>.
            </FAQListItem>
            <FAQListItem>
              Falls notwendig, kannst du mehrere CSV-Dateien exportieren.
            </FAQListItem>
            <FAQListItem>
              Wiederhole den Vorgang für <i>"Kontoumsätze"</i>.
            </FAQListItem>
            <FAQListItem>
              Lade die CSV-Dateien in das Tool hinein.
            </FAQListItem>
          </List>
          <Box sx={{ aspectRatio: "16 / 9", width: "100%", mt: 2 }}>
            <ReactPlayer
              width="100%"
              height="100%"
              url="https://www.youtube.com/watch?v=AlZtmcSHVLA"
              controls
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="medium">
            Was passiert mit meinen Daten?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            Deine Daten werden <b>nicht gespeichert</b> oder an Dritte
            weitergegeben. Das Tool verarbeitet die CSV-Dateien{" "}
            <b>lokal im Browser</b>.
          </Typography>
          <Typography paragraph>Die einzigen Serverabfragen sind:</Typography>
          <List>
            <FAQListItem>
              Aktuelle und historische Kurse der ISINs via Yahoo Finance
            </FAQListItem>
            <FAQListItem>
              Unternehmensdetails (Branche, Land, Währung) via Yahoo Finance
            </FAQListItem>
            <FAQListItem>
              GitHub API für die Anzahl der Repository-Sterne
            </FAQListItem>
            <FAQListItem>Aktuelle Währungskurse</FAQListItem>
          </List>
          <Typography>
            Diese Abfragen werden aus Performance-Gründen für kurze Zeit
            zwischengespeichert ("caching"). Dabei werden nur ISINs und der
            Zeitraum für die historischen Kurse gespeichert.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="medium">
            "Keine gültigen Transaktionsdaten in der CSV gefunden."
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <FAQListItem>
              Stelle sicher, dass du die CSV aus Flatex <b>Classic</b>{" "}
              exportierst, nicht aus Flatex Next.
            </FAQListItem>
            <FAQListItem>Wähle die richtige Zeitspanne aus.</FAQListItem>
            <FAQListItem>
              Bei mehreren Depots oder Konten kann es zu Problemen kommen.
            </FAQListItem>
            <FAQListItem>
              Bei Fehlern gerne ein Issue auf GitHub öffnen.
            </FAQListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="medium">
            Wie kann ich das Tool lokal nutzen?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lade das Projekt von GitHub herunter und folge den Anweisungen in
            der README, um es lokal zu starten.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="medium">
            Wie kann ich das Tool unterstützen?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Du kannst das Projekt auf GitHub mit einem Stern markieren, Feedback
            geben oder ein Issue mit Verbesserungsvorschlägen erstellen.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="medium">
            Ich habe einen anderen Fehler oder einen Wunsch
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Bitte öffne ein Issue auf GitHub mit einer möglichst genauen
            Beschreibung des Problems/Wunsch. Ich schaue mir das gerne an und helfe
            weiter.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
