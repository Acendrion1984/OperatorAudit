// FRAGENSTRUKTUR
const STANDARD_QUESTIONS = {
    wirbelstrom: [
        {
            title: "1. Qualifikation & Dokumentation",
            short: "Qualifikation",
            questions: [
                { 
                    id: "ET-1.1", 
                    text: "Sehtest gültig (≤12 Monate) und Zertifikat vorgelegt",
                    english: "Eye test valid (≤12 months) and certificate presented"
                },
                { 
                    id: "ET-1.2", 
                    text: "ET Level 2 Zertifikat ISO/ASNT-konform vorhanden",
                    english: "ET Level 2 certificate ISO/ASNT compliant available"
                },
                { 
                    id: "ET-1.3", 
                    text: "Kenntnis der Norm S285066 und Arbeitsanweisung INFSW_17005 nachgewiesen",
                    english: "Knowledge of standard S285066 and work instruction INFSW_17005 demonstrated"
                }
            ]
        },
        {
            title: "2. Geräteeinrichtung & Kalibrierung",
            short: "Geräteprüfung",
            questions: [
                { 
                    id: "ET-2.1", 
                    text: "Tägliche Plausibilitätsprüfung korrekt durchgeführt und dokumentiert",
                    english: "Daily plausibility check correctly performed and documented"
                },
                { 
                    id: "ET-2.2", 
                    text: "Referenzteile gemäß Norm vorhanden und korrekt gelagert",
                    english: "Reference parts according to standard available and correctly stored"
                },
                { 
                    id: "ET-2.3", 
                    text: "Geräteparameter entsprechend Prüfanweisung eingestellt",
                    english: "Device parameters set according to inspection instruction"
                }
            ]
        },
        {
            title: "3. Prüfdurchführung & Bewertung",
            short: "Prüfung",
            questions: [
                { 
                    id: "ET-3.1", 
                    text: "Systematische Prüfung aller definierten Bereiche",
                    english: "Systematic inspection of all defined areas"
                },
                { 
                    id: "ET-3.2", 
                    text: "Korrekte Erkennung und Bewertung von Fehleranzeigen",
                    english: "Correct detection and evaluation of defect indications"
                },
                { 
                    id: "ET-3.3", 
                    text: "n.i.O.-Teile korrekt erkannt und als 'nicht i.O.' deklariert",
                    english: "Rejected parts correctly identified and declared as 'not OK'"
                },
                { 
                    id: "ET-3.4", 
                    text: "Keine Fehlbewertungen (gute Teile als n.i.O. deklariert)",
                    english: "No false rejections (good parts declared as not OK)"
                }
            ]
        },
        {
            title: "4. Dokumentation & Qualitätssicherung",
            short: "Dokumentation",
            questions: [
                { 
                    id: "ET-4.1", 
                    text: "Vollständige und lesbare Dokumentation aller Prüfergebnisse",
                    english: "Complete and legible documentation of all test results"
                },
                { 
                    id: "ET-4.2", 
                    text: "Korrekte Anwendung des Zwischenbehälter-Prinzips (Trennung i.O./n.i.O.)",
                    english: "Correct application of intermediate container principle (separation OK/not OK)"
                },
                { 
                    id: "ET-4.3", 
                    text: "Entmagnetisierung bei Bedarf durchgeführt und Grenzwerte kontrolliert",
                    english: "Demagnetization performed when required and limit values controlled"
                },
                { 
                    id: "ET-4.4", 
                    text: "Tätigkeitsnachweis vorhanden und vollständig dokumentiert",
                    english: "Activity proof available and fully documented",
                    isActivityProof: true
                }
            ]
        }
    ],
    magnetpulver: [
        {
            title: "1. Qualifikation & Normenkenntnis",
            short: "Qualifikation",
            questions: [
                { 
                    id: "MT-1.1", 
                    text: "Sehtest gültig (≤12 Monate) und dokumentiert",
                    english: "Eye test valid (≤12 months) and documented"
                },
                { 
                    id: "MT-1.2", 
                    text: "MT Level 2 Zertifikat ISO/IASNT-konform vorhanden",
                    english: "MT Level 2 certificate ISO/IASNT compliant available"
                },
                { 
                    id: "MT-1.3", 
                    text: "Kenntnis Normen (DIN EN ISO 9934, S24000-8) und Arbeitsanweisung INFSW01044",
                    english: "Knowledge of standards (DIN EN ISO 9934, S24000-8) and work instruction INFSW01044"
                }
            ]
        },
        {
            title: "2. Geräteprüfung & Kalibrierung",
            short: "Geräteprüfung",
            questions: [
                { 
                    id: "MT-2.1", 
                    text: "UV-Lampe überprüft (Intensität, Filter) und dokumentiert",
                    english: "UV lamp checked (intensity, filter) and documented"
                },
                { 
                    id: "MT-2.2", 
                    text: "UV- und Belichtungsmesser gemäß Vorgabe kalibriert",
                    english: "UV and lux meter calibrated according to specification"
                },
                { 
                    id: "MT-2.3", 
                    text: "Magnetisierung für alle Ausrichtungen geprüft, Grenzwerte eingehalten",
                    english: "Magnetization checked for all orientations, limit values maintained"
                },
                { 
                    id: "MT-2.4", 
                    text: "MTU-Prüfkörper 3 Kontrolle durchgeführt",
                    english: "MTU test body 3 control performed"
                }
            ]
        },
        {
            title: "3. Prüfdurchführung & Fehlererkennung",
            short: "Prüfung",
            questions: [
                { 
                    id: "MT-3.1", 
                    text: "Vollständige Inspektion aller relevanten Oberflächen",
                    english: "Complete inspection of all relevant surfaces"
                },
                { 
                    id: "MT-3.2", 
                    text: "Korrekte Interpretation von Rissanzeigen",
                    english: "Correct interpretation of crack indications"
                },
                { 
                    id: "MT-3.3", 
                    text: "n.i.O.-Teile korrekt erkannt und als 'nicht i.O.' deklariert",
                    english: "Rejected parts correctly identified and declared as 'not OK'"
                },
                { 
                    id: "MT-3.4", 
                    text: "Keine Fehlbewertungen (falsche Interpretationen)",
                    english: "No mis-evaluations (false interpretations)"
                }
            ]
        },
        {
            title: "4. Dokumentation & Qualitätssicherung",
            short: "Dokumentation",
            questions: [
                { 
                    id: "MT-4.1", 
                    text: "Korrekte Verwendung der Dokumentationsvorlage",
                    english: "Correct use of documentation template"
                },
                { 
                    id: "MT-4.2", 
                    text: "Lesbare Dokumentation aller Indikationen und Maßnahmen",
                    english: "Legible documentation of all indications and measures"
                },
                { 
                    id: "MT-4.3", 
                    text: "Entmagnetisierung korrekt durchgeführt und dokumentiert",
                    english: "Demagnetization correctly performed and documented"
                },
                { 
                    id: "MT-4.4", 
                    text: "Tätigkeitsnachweis vorhanden und vollständig dokumentiert",
                    english: "Activity proof available and fully documented",
                    isActivityProof: true
                }
            ]
        }
    ],
    ultraschall: [
        {
            title: "1. Qualifikation & Normenkenntnis",
            short: "Qualifikation",
            questions: [
                { 
                    id: "UT-1.1", 
                    text: "Sehtest gültig (≤12 Monate) und dokumentiert",
                    english: "Eye test valid (≤12 months) and documented"
                },
                { 
                    id: "UT-1.2", 
                    text: "UT Level 2 Zertifikat ISO/ASNT-konform vorhanden",
                    english: "UT Level 2 certificate ISO/ASNT compliant available"
                },
                { 
                    id: "UT-1.3", 
                    text: "Kenntnis Normen (DIN EN ISO 22232, S231202-5) und Arbeitsanweisungen",
                    english: "Knowledge of standards (DIN EN ISO 22232, S231202-5) and work instructions"
                }
            ]
        },
        {
            title: "2. Kalibrierung & Geräteeinstellung",
            short: "Kalibrierung",
            questions: [
                { 
                    id: "UT-2.1", 
                    text: "Sensitivitätskalibrierung gemäß Norm durchgeführt",
                    english: "Sensitivity calibration performed according to standard"
                },
                { 
                    id: "UT-2.2", 
                    text: "Distanzkalibrierung gemäß Norm durchgeführt",
                    english: "Distance calibration performed according to standard"
                },
                { 
                    id: "UT-2.3", 
                    text: "Geräteeinrichtung korrekt demonstriert",
                    english: "Device setup correctly demonstrated"
                }
            ]
        },
        {
            title: "3. Prüfdurchführung & Defekterkennung",
            short: "Prüfung",
            questions: [
                { 
                    id: "UT-3.1", 
                    text: "Systematische Prüfung aller vorgegebenen Bereiche",
                    english: "Systematic inspection of all specified areas"
                },
                { 
                    id: "UT-3.2", 
                    text: "Korrekte Rückkehr zum größten Defekt für Messung",
                    english: "Correct return to largest defect for measurement"
                },
                { 
                    id: "UT-3.3", 
                    text: "Genauigkeit der Tiefenmessung und Dimensionierung",
                    english: "Accuracy of depth measurement and dimensioning"
                },
                { 
                    id: "UT-3.4", 
                    text: "n.i.O.-Teile korrekt erkannt und als 'nicht i.O.' deklariert",
                    english: "Rejected parts correctly identified and declared as 'not OK'"
                }
            ]
        },
        {
            title: "4. Dokumentation & Qualitätssicherung",
            short: "Dokumentation",
            questions: [
                { 
                    id: "UT-4.1", 
                    text: "Dokumentation gemäß Arbeitsanweisung korrekt durchgeführt",
                    english: "Documentation according to work instruction correctly performed"
                },
                { 
                    id: "UT-4.2", 
                    text: "Vollständige Aufzeichnung aller Prüfergebnisse",
                    english: "Complete recording of all test results"
                },
                { 
                    id: "UT-4.3", 
                    text: "Klare Kennzeichnung und Trennung von n.i.O.-Teilen",
                    english: "Clear marking and separation of rejected parts"
                },
                { 
                    id: "UT-4.4", 
                    text: "Tätigkeitsnachweis vorhanden und vollständig dokumentiert",
                    english: "Activity proof available and fully documented",
                    isActivityProof: true
                }
            ]
        }
    ],
    nital: [
        {
            title: "1. Qualifikation & Sicherheit",
            short: "Qualifikation",
            questions: [
                { 
                    id: "NE-1.1", 
                    text: "Sehtest gültig (≤12 Monate) und dokumentiert",
                    english: "Eye test valid (≤12 months) and documented"
                },
                { 
                    id: "NE-1.2", 
                    text: "NE Level 2 Zertifikat vorhanden",
                    english: "NE Level 2 certificate available"
                },
                { 
                    id: "NE-1.3", 
                    text: "Sicherheitsunterweisung für Säurehandhabung nachgewiesen",
                    english: "Safety training for acid handling demonstrated"
                }
            ]
        },
        {
            title: "2. Prozesskontrolle & Chemikalien",
            short: "Prozesskontrolle",
            questions: [
                { 
                    id: "NE-2.1", 
                    text: "Reinigungsprozess entspricht Norm (Parameter, Ultraschall)",
                    english: "Cleaning process complies with standard (parameters, ultrasonic)"
                },
                { 
                    id: "NE-2.2", 
                    text: "Ätzmittel korrekt gelagert und überwacht (chemische Analyse)",
                    english: "Etching agent correctly stored and monitored (chemical analysis)"
                },
                { 
                    id: "NE-2.3", 
                    text: "Ätzparameter entsprechend Arbeitsanweisung eingehalten",
                    english: "Etching parameters maintained according to work instruction"
                }
            ]
        },
        {
            title: "3. Prüfung & Bewertung",
            short: "Prüfung",
            questions: [
                { 
                    id: "NE-3.1", 
                    text: "Systematische Inspektion der geätzten Flächen",
                    english: "Systematic inspection of etched surfaces"
                },
                { 
                    id: "NE-3.2", 
                    text: "Korrekte Bewertung von Gefügestrukturen und Anomalien",
                    english: "Correct evaluation of microstructure and anomalies"
                },
                { 
                    id: "NE-3.3", 
                    text: "n.i.O.-Teile korrekt erkannt und als 'nicht i.O.' deklariert",
                    english: "Rejected parts correctly identified and declared as 'not OK'"
                },
                { 
                    id: "NE-3.4", 
                    text: "Unterscheidung zwischen relevanten und nicht relevanten Anzeigen",
                    english: "Differentiation between relevant and non-relevant indications"
                }
            ]
        },
        {
            title: "4. Dokumentation & Nachverfolgbarkeit",
            short: "Dokumentation",
            questions: [
                { 
                    id: "NE-4.1", 
                    text: "Vollständige Dokumentation aller Prozessparameter",
                    english: "Complete documentation of all process parameters"
                },
                { 
                    id: "NE-4.2", 
                    text: "Nachweis der korrekten Ätzung (Bilder/Dokumentation)",
                    english: "Proof of correct etching (pictures/documentation)"
                },
                { 
                    id: "NE-4.3", 
                    text: "Trennung von i.O. und n.i.O. Teilen gewährleistet",
                    english: "Separation of OK and not OK parts ensured"
                },
                { 
                    id: "NE-4.4", 
                    text: "Tätigkeitsnachweis vorhanden und vollständig dokumentiert",
                    english: "Activity proof available and fully documented",
                    isActivityProof: true
                }
            ]
        }
    ]
};