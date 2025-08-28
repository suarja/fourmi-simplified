# Architecture Interface - Fourmi
## Interface d'Inversion avec Système de Quêtes

### Principe Directeur

**L'utilisateur reste fixe, l'application évolue sous ses interactions**. L'interface combine un **espace principal dynamique** avec un **système de tabs** et des **overlays contextuels**, créant une expérience guidée où l'app mène l'utilisateur vers ses objectifs financiers.

## Architecture Globale

### Layout Principal

```ascii
┌─────────────────────────────────────────────────────────────┐
│ FOURMI - Copilote Financier                                 │
├─────────────────────────────────────────────────────────────┤
│ [🏠 Accueil] [👤 Profil] [🎯 Quêtes] [📊 Analyses]         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                  CONTENU DYNAMIQUE                          │
│                  (change selon tab active)                  │
│                                                             │
│                                                             │
│                                                             │
│                                                    [💬]     │
│                                                 (flottant)  │
└─────────────────────────────────────────────────────────────┘
```

### Navigation Responsive

**Desktop (largeur > 768px)** :
- Tabs horizontaux permanents
- Overlay chat en position fixe
- Contenu principal utilise pleine largeur

**Mobile (largeur ≤ 768px)** :
- Tabs en bottom navigation
- Overlay chat full-screen modal
- Swipe entre contenus

## Détail des Tabs

### Tab 1: 🏠 Accueil - Scène Principale

**Fonction** : Espace guidé où l'application mène l'utilisateur étape par étape selon sa progression.

#### État 1: Utilisateur Nouveau

```ascii
┌─ ACCUEIL - Bienvenue ─────────────────────────────────────┐
│                                                           │
│  🎬 ONBOARDING QUESTIONNAIRE                              │
│  ┌─────────────────────────────────────────────────┐     │
│  │ 👋 Bienvenue dans Fourmi !                       │     │
│  │                                                 │     │
│  │ Que souhaitez-vous accomplir ?                  │     │
│  │                                                 │     │
│  │ ┌─────────────────────────────────────────────┐ │     │
│  │ │ [💰] Sortir du découvert / gérer mes dettes │ │     │
│  │ │ [🏠] Préparer un projet immobilier          │ │     │
│  │ │ [📊] Faire le point sur mes finances        │ │     │
│  │ └─────────────────────────────────────────────┘ │     │
│  │                                                 │     │
│  │            [Continuer] [🎤 Plutôt parler]       │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  📈 PROGRESSION: ▒▒▒▒▒▒ 0% - Première visite             │
└───────────────────────────────────────────────────────────┘
```

#### État 2: Quête Budget Active

```ascii
┌─ ACCUEIL - Quête Budget ──────────────────────────────────┐
│                                                           │
│  🎬 ÉTAPE ACTIVE                                          │
│  ┌─────────────────────────────────────────────────┐     │
│  │ 📋 "Construisons votre budget mensuel"           │     │
│  │                                                 │     │
│  │ Pour une bonne gestion financière, nous         │     │
│  │ devons connaître vos revenus et dépenses.       │     │
│  │                                                 │     │
│  │ ┌─ FORMULAIRE ACTUEL ─────────────────────────┐ │     │
│  │ │ 💰 Revenus mensuels                         │ │     │
│  │ │ Salaire principal: [____] €                 │ │     │
│  │ │ Autres revenus: [____] €                    │ │     │
│  │ │                                             │ │     │
│  │ │ 💸 Dépenses principales                     │ │     │
│  │ │ Loyer/Crédit: [____] €                      │ │     │
│  │ │ Alimentation: [____] €                      │ │     │
│  │ │ Transport: [____] €                         │ │     │
│  │ │                                             │ │     │
│  │ │ [Précédent] [Valider] [🎤 Plutôt dicter]    │ │     │
│  │ └─────────────────────────────────────────────┘ │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  📈 PROGRESSION: ████▒▒ 60% - Quête Budget               │
└───────────────────────────────────────────────────────────┘
```

#### État 3: Utilisateur Autonome - Feed Personnalisé

```ascii
┌─ ACCUEIL - Dashboard Personnalisé ───────────────────────┐
│                                                           │
│  🎯 RECOMMANDATIONS POUR VOUS                             │
│  ┌─────────────────────────────────────────────────┐     │
│  │ 🏠 Projet Las Terrenas (75% complété)            │     │
│  │ "Comparez avec Paris pour finaliser"             │     │
│  │                                        [Ouvrir] │     │
│  ├─────────────────────────────────────────────────┤     │
│  │ ✨ Nouvelle analyse disponible                   │     │
│  │ "Votre capacité d'emprunt a augmenté"            │     │
│  │                                         [Voir]  │     │
│  ├─────────────────────────────────────────────────┤     │
│  │ 🚀 Action suggérée                               │     │
│  │ [+ Créer nouveau projet immobilier]              │     │
│  │ [📊 Comparer mes 3 projets]                      │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  🎲 QUÊTES OPTIONNELLES DISPONIBLES                       │
│  • Stratégie épargne avancée • Optimisation fiscale      │
└───────────────────────────────────────────────────────────┘
```

### Tab 2: 👤 Profil - Données Éditables

**Fonction** : Vue consolidée et éditable de toutes les données utilisateur collectées via les quêtes.

```ascii
┌─ PROFIL UTILISATEUR ──────────────────────────────────────┐
│                                                           │
│  📊 VUE D'ENSEMBLE                                        │
│  ┌─────────────────────────────────────────────────┐     │
│  │ Solde mensuel: +1,170€    Dernière MàJ: Hier   │     │
│  │ Statut: Semi-autonome     Quêtes: 3/5 terminées │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  💰 FINANCES                                              │
│  ┌─────────────────────────────────────────────────┐     │
│  │ REVENUS                                   [📝]   │     │
│  │ ├ Salaire: 2,800€/mois                          │     │
│  │ ├ Prime annuelle: 3,600€ (300€/mois)            │     │
│  │ └ Freelance: 200€/mois                          │     │
│  │                                                 │     │
│  │ DÉPENSES                                  [📝]   │     │
│  │ ├ Loyer: 950€                                   │     │
│  │ ├ Alimentation: 400€                            │     │
│  │ ├ Transport: 180€                               │     │
│  │ ├ Loisirs: 300€                                 │     │
│  │ └ Divers: 200€                                  │     │
│  │                                                 │     │
│  │ PRÊTS                                     [📝]   │     │
│  │ └ Crédit auto: 280€ (18 mois restants)          │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  🎯 HABITUDES & OBJECTIFS                                 │
│  ┌─────────────────────────────────────────────────┐     │
│  │ Découvert: "Rarement" (2-3 fois/an)     [📝]   │     │
│  │ Épargne actuelle: 1,200€                 [📝]   │     │
│  │ Objectif principal: "Achat résidence"    [📝]   │     │
│  │ Tolérance risque: "Modérée"              [📝]   │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  [💾 Sauvegarder modifications] [🤖 Demander analyse]     │
└───────────────────────────────────────────────────────────┘
```

#### Sous-onglets Adaptatifs (selon profil)

**Si Profil = "Investisseur"** :

```ascii
┌─ PROFIL - PROJETS ACTIFS ─────────────────────────────────┐
│                                                           │
│  🏘️ MES PROJETS IMMOBILIERS                               │
│  ┌─────────────────────────────────────────────────┐     │
│  │ 🏖️ Las Terrenas Beach House (75%)              │     │
│  │ │  Budget: 165k€ | Crédit: 25 ans | ROI: 12%  │     │
│  │ │  Status: Analyse terminée     [Finaliser] ▶  │     │
│  │ │                                              │     │
│  │ 🏛️ Paris 15ème Appartement (45%)               │     │
│  │ │  Budget: 420k€ | Crédit: 25 ans | ROI: 4%   │     │
│  │ │  Status: En cours d'analyse   [Continuer] ▶  │     │
│  │                                                 │     │
│  │ [+ Nouveau projet] [📊 Comparer tous]          │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  💼 ALLOCATIONS PATRIMONIALES                             │
│  ┌─────────────────────────────────────────────────┐     │
│  │ Répartition recommandée par l'IA:              │     │
│  │ ████████▒▒ 80% Immobilier (Las Terrenas)       │     │
│  │ ██▒▒▒▒▒▒▒▒ 20% Épargne sécurisée               │     │
│  │                                                 │     │
│  │ [Appliquer suggestion] [Personnaliser]          │     │
│  └─────────────────────────────────────────────────┘     │
└───────────────────────────────────────────────────────────┘
```

### Tab 3: 🎯 Quêtes - Parcours Disponibles

**Fonction** : Vue d'ensemble des parcours éducatifs avec progression et déblocage conditionnel.

```ascii
┌─ MES QUÊTES ──────────────────────────────────────────────┐
│                                                           │
│  🎮 PROGRESSION GLOBALE                                   │
│  ┌─────────────────────────────────────────────────┐     │
│  │ Niveau: Semi-autonome ████████▒▒ 80%            │     │
│  │ XP: 1,250 points | Prochaine récompense: 200 XP │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  ✅ QUÊTES COMPLÉTÉES                                      │
│  ┌─────────────────────────────────────────────────┐     │
│  │ ✅ Budget mensuel (100%) - 3j                   │     │
│  │    └ Récompense: "Maître du budget" 🏆          │     │
│  │ ✅ Situation financière (100%) - 2j             │     │
│  │    └ Déblocage: Quêtes habitudes & projets      │     │
│  │ ✅ Habitudes financières (100%) - 4j            │     │
│  │    └ Déblocage: Analyses avancées               │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  🔄 QUÊTE ACTIVE                                           │
│  ┌─────────────────────────────────────────────────┐     │
│  │ 🏠 Projet immobilier (60%)                      │     │
│  │    Étape: "Critères de recherche"               │     │
│  │    Temps restant estimé: ~15 min                │     │
│  │    [Continuer] [🎤 Mode vocal]                   │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  🔒 PROCHAINES QUÊTES                                      │
│  ┌─────────────────────────────────────────────────┐     │
│  │ 🔓 Stratégie épargne (débloqué)                 │     │
│  │    Prérequis: ✓ Complétés                       │     │
│  │    [Démarrer] (~20 min)                         │     │
│  │                                                 │     │
│  │ 🔒 Optimisation fiscale                         │     │
│  │    Prérequis: Profil "Autonome" requis          │     │
│  │    Progress: ████▒▒ 75% vers déblocage          │     │
│  │                                                 │     │
│  │ 🔒 Investissement avancé                        │     │
│  │    Prérequis: 2 projets immobiliers complétés   │     │
│  └─────────────────────────────────────────────────┘     │
└───────────────────────────────────────────────────────────┘
```

### Tab 4: 📊 Analyses - Dashboard Adaptatif

**Fonction** : Contenu généré par l'IA selon le profil utilisateur et les données collectées.

#### Version Débutant

```ascii
┌─ ANALYSES - Situation Financière ─────────────────────────┐
│                                                           │
│  💡 CONSEILS PERSONNALISÉS                                │
│  ┌─────────────────────────────────────────────────┐     │
│  │ 🎯 Actions prioritaires cette semaine:          │     │
│  │                                                 │     │
│  │ 1. ✅ Ouvrir compte épargne (100€/mois)         │     │
│  │    "Avec vos 1170€ de reste, c'est possible"    │     │
│  │                                        [Guide] │     │
│  │                                                 │     │
│  │ 2. 📋 Réduire dépenses loisirs (300€→200€)      │     │
│  │    "Gain potentiel: +100€/mois d'épargne"       │     │
│  │                                      [Conseils] │     │
│  │                                                 │     │
│  │ 3. 🎯 Anticiper fin crédit auto (18 mois)       │     │
│  │    "+280€/mois disponibles dès juillet 2026"    │     │
│  │                                    [Planifier] │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  📈 ÉVOLUTION BUDGET                                       │
│  ┌─────────────────────────────────────────────────┐     │
│  │     Solde mensuel: +1,170€                      │     │
│  │                                                 │     │
│  │  2000€ ┤                                        │     │
│  │  1500€ ┤     ████ Revenus (3,300€)              │     │
│  │  1000€ ┤     ████                                │     │
│  │   500€ ┤     ████ ████ Dépenses (2,030€)        │     │
│  │     0€ └─────████─████─────────────────────      │     │
│  │         Janv  Févr Mars                         │     │
│  │                                                 │     │
│  │  [Voir détails] [Projections 12 mois]          │     │
│  └─────────────────────────────────────────────────┘     │
└───────────────────────────────────────────────────────────┘
```

#### Version Investisseur

```ascii
┌─ ANALYSES - Portfolio & Projets ──────────────────────────┐
│                                                           │
│  🏘️ COMPARAISON PROJETS                                   │
│  ┌─────────────────────────────────────────────────┐     │
│  │        Las Terrenas  vs  Paris 15ème           │     │
│  │                                                 │     │
│  │ Budget:     165k€         420k€                 │     │
│  │ Mensuel:    1,247€        2,890€                │     │
│  │ ROI/an:     12%           4%                    │     │
│  │ Break-even: 4.2 ans       8.1 ans              │     │
│  │                                                 │     │
│  │ 🏆 Recommandation IA: "Las Terrenas"           │     │
│  │ Économies sur 10 ans: +235,000€                │     │
│  │                                                 │     │
│  │ [Simulation complète] [Ajouter 3ème option]     │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  📊 SIMULATIONS AVANCÉES                                  │
│  ┌─────────────────────────────────────────────────┐     │
│  │ Scenarios Las Terrenas:                         │     │
│  │                                                 │     │
│  │ PESSIMISTE  │ RÉALISTE   │ OPTIMISTE           │     │
│  │ ────────────┼────────────┼──────────           │     │
│  │ ROI: 8%/an  │ ROI: 12%   │ ROI: 16%/an         │     │
│  │ Total: 185k │ Total: 165k│ Total: 142k         │     │
│  │ Rentable    │ ⭐Recommandé│ Très rentable       │     │
│  │                                                 │     │
│  │ [Détails scenarios] [Export PDF]                │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  [🤖 Nouvelle analyse] [📤 Partager résultats]            │
└───────────────────────────────────────────────────────────┘
```

## Overlay Chat Flottant [💬]

**Fonction** : Interface conversationnelle contextuelle accessible depuis n'importe quel écran.

### État Repos

```ascii
Position: Bottom-right fixe
┌────┐
│ 💬 │ ← Bouton flottant
│ IA │   (pulse animation)
└────┘
```

### État Ouvert

```ascii
┌─ CHAT ASSISTANT ───────────────────────┐
│                                        │
│ 🤖 Fourmi IA                    [✕]   │
│ ──────────────────────────────────────  │
│                                        │
│ 🤖 Bonjour ! Je vois que vous         │
│    consultez votre profil.            │
│    Comment puis-je vous aider ?        │
│                                        │
│ 👤 Peux-tu m'expliquer pourquoi        │
│    mon projet Las Terrenas est         │
│    plus rentable ?                     │
│                                        │
│ 🤖 Excellente question ! Las Terrenas  │
│    présente 3 avantages majeurs:      │
│    • ROI 12% vs 4% Paris              │
│    • Coût d'entrée 165k vs 420k       │
│    • Break-even 4.2 ans vs 8.1 ans    │
│                                        │
│    [Voir simulation détaillée]         │
│                                        │
│ ──────────────────────────────────────  │
│ 💬 [Écrivez votre message...]          │
│ 🎤 [Parler] [📎] [🔧Outils] [📤]        │
└────────────────────────────────────────┘
```

### Fonctionnalités Chat Contextuelles

**Détection automatique du contexte** :
```ascii
SI écran = Profil + onglet Finances:
  Suggestions = ["Optimiser mon budget", "Analyser mes dépenses", "Projections épargne"]

SI écran = Quête active:
  Suggestions = ["Remplir via vocal", "Expliquer cette étape", "Passer à la suite"]

SI écran = Analyses + projet sélectionné:
  Suggestions = ["Pourquoi ce choix?", "Autres options?", "Risques identifiés?"]
```

**Outils IA disponibles** :
- **Extraction données** : Analyse documents uploadés
- **Génération blocs** : Crée projets pré-remplis 
- **Calculs financiers** : PMT, ROI, break-even
- **Recherche web** : Données marché immobilier
- **Export** : PDF, partage social

## États Responsive Mobile

### Navigation Mobile

```ascii
PORTRAIT MODE (< 768px width):

┌─────────────────────────┐
│ FOURMI                  │ ← Header fixe
├─────────────────────────┤
│                         │
│    CONTENU PRINCIPAL    │
│    (swipe horizontal    │
│     entre tabs)        │
│                         │
│                         │ ← Chat overlay
│                    [💬] │   full-screen
├─────────────────────────┤
│[🏠][👤][🎯][📊][💬]    │ ← Bottom nav
└─────────────────────────┘
```

### Chat Mobile Full-Screen

```ascii
MOBILE CHAT OVERLAY:

┌─────────────────────────┐
│ 🤖 Fourmi IA      [✕]  │ ← Header avec fermeture
├─────────────────────────┤
│                         │
│    CONVERSATION         │
│    (scroll vertical)    │
│                         │
│                         │
│                         │
├─────────────────────────┤
│ [Message...] [🎤] [📤]  │ ← Input zone
└─────────────────────────┘
```

## Animations et Transitions

### Transitions entre États

```ascii
ÉCRAN PRINCIPAL - Changement d'étape:
Message actuel → Fade out (300ms) → Nouveau contenu Fade in (300ms)

OVERLAY CHAT:
Bouton flottant → Scale up (200ms) → Slide up from bottom (400ms)

TAB NAVIGATION:
Slide horizontal (250ms) + content fade (150ms offset)
```

### Feedback Visuel

**Quête en cours** :
- Progress bar animée
- Pulse sur bouton "Continuer"
- Checkmarks avec animation

**IA en réflexion** :
- Typing indicator (...)
- Shimmer loading sur analyses
- Progressive reveal des résultats

**Validation utilisateur** :
- Success animation (checkmark)
- Error shake + highlight rouge
- Toast notifications

## États d'Erreur et Edge Cases

### Connexion Perdue

```ascii
┌─ ACCUEIL - Mode Hors Ligne ───────────────────────────────┐
│                                                           │
│  ⚠️  CONNEXION LIMITÉE                                    │
│  ┌─────────────────────────────────────────────────┐     │
│  │ Certaines fonctionnalités sont indisponibles:   │     │
│  │ • Chat IA (nécessite internet)                  │     │
│  │ • Données marché immobilier                     │     │
│  │ • Synchronisation cloud                         │     │
│  │                                                 │     │
│  │ Vous pouvez continuer à:                        │     │
│  │ • Consulter votre profil                        │     │
│  │ • Modifier vos données                          │     │
│  │ • Voir analyses locales                         │     │
│  │                                                 │     │
│  │ [🔄 Réessayer connexion]                        │     │
│  └─────────────────────────────────────────────────┘     │
└───────────────────────────────────────────────────────────┘
```

### Données Manquantes

```ascii
┌─ ANALYSES - Données Insuffisantes ────────────────────────┐
│                                                           │
│  📊 ANALYSES PARTIELLES                                   │
│  ┌─────────────────────────────────────────────────┐     │
│  │ ⚠️  Pour analyses complètes, il manque:         │     │
│  │                                                 │     │
│  │ • 3 catégories de dépenses minimum              │     │
│  │ • Informations sur vos objectifs               │     │
│  │ • Historique sur 3 mois minimum                │     │
│  │                                                 │     │
│  │ Analyses disponibles avec données actuelles:    │     │
│  │ ✅ Solde mensuel                               │     │
│  │ ✅ Capacité épargne de base                    │     │
│  │ ❌ Projections long terme                      │     │
│  │ ❌ Recommandations personnalisées              │     │
│  │                                                 │     │
│  │ [Compléter mon profil] [🎤 Faire le point]      │     │
│  └─────────────────────────────────────────────────┘     │
└───────────────────────────────────────────────────────────┘
```

Cette architecture d'interface offre une expérience utilisateur progressive et adaptative, où chaque composant sert la mission de Fourmi : transformer la gestion financière complexe en parcours guidé et personnalisé.