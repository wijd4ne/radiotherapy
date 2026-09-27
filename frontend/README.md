# RadioSurveil — Télésurveillance des effets secondaires de la radiothérapie pelvienne

Plateforme web de télésurveillance à distance pour les patient·e·s traité·e·s par
radiothérapie pelvienne (cancers du col de l'utérus, de la prostate, du rectum, de la
vessie). Les patient·e·s signalent leurs symptômes depuis chez eux ; les médecins
détectent rapidement les complications nécessitant une intervention.

## Stack technique

- **React + Vite + TypeScript**
- **Tailwind CSS** (thème personnalisé : palette patient teal, palette médecin navy, rampe de grade CTCAE 0–4)
- **React Router** pour la navigation
- **Recharts** pour les courbes d'évolution
- **lucide-react** pour les icônes
- **i18n maison** (FR + Darija marocaine en graphie arabe, RTL automatique)
- **Données mock** isolées derrière `src/lib/api.ts` — prêtes à être remplacées par des appels `fetch` vers Django/PostgreSQL

## Démarrage

```bash
npm install
npm run dev      # serveur de développement
npm run build    # build de production
npm run typecheck
```

## Comptes de démonstration

| Rôle    | Email             | Mot de passe |
|---------|-------------------|--------------|
| Patient | `patient@demo.fr` | `demo`       |
| Médecin | `medecin@demo.fr` | `demo`       |

## Structure du projet

```
src/
├── components/         # Composants réutilisables
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── GradeBar.tsx        # signature visuelle : barre de grade CTCAE 0–4
│   └── LanguageToggle.tsx
├── layouts/
│   ├── PatientLayout.tsx   # header + nav patient (teal, chaleureux)
│   └── DoctorLayout.tsx    # header + nav médecin (navy, clinique)
├── pages/
│   ├── Home.tsx            # sélecteur d'espace
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── patient/
│   │   ├── PatientHome.tsx
│   │   ├── Discovery.tsx       # module éducatif
│   │   ├── Questionnaire.tsx    # 19 items PRO-CTCAE
│   │   ├── Result.tsx          # grade + conseils + action
│   │   ├── PatientDashboard.tsx# historique + courbe Recharts
│   │   ├── Profile.tsx         # profil + paramètres + notifications
│   │   └── Help.tsx            # FAQ + support technique
│   └── doctor/
│       ├── DoctorDashboard.tsx # alertes 3/4 + liste patients
│       ├── PatientDetail.tsx   # fiche patient : timeline, courbes multicourbes,
│       │                       #   inspecteur de réponses, journal, ajustement du grade
│       ├── Cohort.tsx          # cohorte filtrable + export CSV
│       └── DoctorConfig.tsx    # règles de calcul + préférences d'alerte
├── lib/
│   ├── api.ts            # couche d'API isolée (mock aujourd'hui, fetch demain)
│   ├── auth.tsx          # contexte d'authentification mock
│   └── scoring.ts        # moteur de grade CTCAE (règles déterministes)
├── mock/
│   ├── data.ts           # utilisateurs, patients, historiques mock
│   └── questionnaire.ts  # définition des 19 items PRO-CTCAE
├── i18n/
│   ├── translations.ts   # dictionnaires FR + Darija
│   └── I18nContext.tsx   # provider + hook useI18n
├── App.tsx               # routing
├── main.tsx
└── index.css             # Tailwind + polices (Fraunces, Inter, Noto Naskh Arabic)
```

## Questionnaire — référentiel PRO-CTCAE

19 items sélectionnés pour la radiothérapie pelvienne, groupés en 5 domaines :

- **Digestif** : 8 (perte d'appétit), 9 (nausées), 10 (vomissements), 16 (diarrhée), 17 (douleur abdominale)
- **Peau** : 36 (réaction cutanée)
- **État général** : 48 (douleur), 53 (fatigue), 54 (anxiété)
- **Urinaire & gynécologique** : 59, 60, 61, 62, 63, 64, 65
- **Sexuel** : 66, 67, 68 (avec option « non concerné·e »)

Quatre échelles à 5 niveaux (0–4) : Fréquence, Sévérité, Interférence, plus Présence (oui/non).

## Calcul du grade CTCAE — `lib/scoring.ts`

Logique 100 % déterministe, à base de `Math.max()` et de seuils :

- **Grade par symptôme** = valeur la plus élevée parmi ses sous-questions (l'attribut le plus sévère domine).
- **Grade par domaine** = max des grades des symptômes de ce domaine.
- **Grade global** = max des grades de tous les domaines.
- **Domaine dominant** = domaine dont le grade est le plus élevé.
- **Conseils** = sélectionnés selon le domaine dominant et le grade global.
- **Résumé automatique** = phrase générée à partir du grade et du domaine dominant.

Aucune machine learning : mêmes réponses en entrée → même grade en sortie, toujours.

Une fonction `checkAlertThreshold(grade)` est également exposée : elle déclenche une
alerte système pour tout grade ≥ 3 (seuil `ALERT_THRESHOLD = 3`). Elle est utilisée
par le tableau de bord médecin pour peupler le bandeau d'alertes.

## Endpoints API prévus (Django/PostgreSQL)

Toutes les fonctions de `src/lib/api.ts` sont écrites comme des appels HTTP réels,
avec un commentaire indiquant l'endpoint Django attendu. Aujourd'hui elles renvoient
des données mock ; demain elles feront de vrais `fetch`.

| Fonction                       | Endpoint futur                              |
|--------------------------------|---------------------------------------------|
| `login()`                      | `POST /api/auth/login`                      |
| `register()`                   | `POST /api/auth/register`                   |
| `getQuestionnaireItems()`      | `GET  /api/questionnaires/items`            |
| `submitQuestionnaire()`        | `POST /api/questionnaires/{id}/reponses`    |
| `validateQuestionnaireGrade()` | `PATCH /api/questionnaires/{id}/validate`    |
| `getPatient()`                 | `GET  /api/patients/{id}`                   |
| `getPatientHistory()`          | `GET  /api/patients/{id}/historique`        |
| `getLatestPatientResult()`    | `GET  /api/patients/{id}/latest`            |
| `getPatientProfile()`         | `GET  /api/patients/{id}/profile`           |
| `updatePatientProfile()`      | `PUT  /api/patients/{id}/profile`           |
| `getPatientProtocol()`        | `GET  /api/patients/{id}/protocol`          |
| `getPatientNotes()`            | `GET  /api/patients/{id}/notes`             |
| `addPatientNote()`             | `POST /api/patients/{id}/notes`            |
| `getPatientActions()`          | `GET  /api/patients/{id}/actions`           |
| `logPatientAction()`           | `POST /api/patients/{id}/actions`          |
| `getDoctorPatients()`          | `GET  /api/medecin/patients`                |
| `getDoctorCohort()`            | `GET  /api/medecin/patients?with=protocol`  |
| `exportCohortCSV()`            | `GET  /api/medecin/patients/export`        |
| `getDoctorConfig()`            | `GET  /api/medecin/config`                  |
| `updateDoctorConfig()`         | `PUT  /api/medecin/config`                  |
| `getFAQ()`                     | `GET  /api/faq`                             |
| `submitSupportRequest()`       | `POST /api/support`                         |

### Réponse attendue pour `submitQuestionnaire`

```json
{
  "overallGrade": 2,
  "domainGrades": { "digestif": 2, "peau": 1, "general": 2, "urinaire": 1, "sexuel": 0 },
  "symptomResults": [
    { "itemId": 8, "domain": "digestif", "grade": 2, "dominantScale": "severity" }
  ],
  "advice": {
    "level": 2,
    "titleKey": "result.action.2.title",
    "textKey": "result.action.2.text",
    "tips": ["…", "…"]
  },
  "summary": "Le patient présente une toxicité digestif modérée, compatible avec un Grade 2.",
  "dominantDomain": "digestif"
}
```

## Internationalisation

- **Français** (LTR, polices Fraunces + Inter)
- **Darija marocaine** (RTL, police Noto Naskh Arabic, registre oral accessible)
- Le toggle est visible sur toutes les pages, avec un accent visuel différent selon l'espace (patient/medecin).
- La direction `dir="rtl"` et la police arabe sont appliquées automatiquement au `<body>` quand la Darija est sélectionnée.

## Évolutions prévues

- Branchement du backend Django/PostgreSQL (remplacer le contenu de `lib/api.ts` par des `fetch`).
- Rôle Admin (gestion des utilisateurs, des référentiels).
- Notifications push / e-mail pour les alertes grade 3/4 (la configuration est déjà en place côté médecin dans `/medecin/config`).
- Authentification réelle (JWT, sessions) — aujourd'hui mockée dans `lib/auth.tsx`.
