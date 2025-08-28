# Event Storming - Domaine Métier Fourmi
## Système de Quêtes Éducatives

### Vision Domaine

**Fourmi** transforme la gestion financière en **parcours éducatif guidé** où chaque **Quête** combine collecte de données, scénarisation pédagogique et analyse IA dans un cycle uniforme et répétable.

**Innovation** : La scénarisation et l'interface d'inversion (l'app guide l'utilisateur), pas la complexité métier.

## Concept Central : QUÊTE

### Définition
Une **Quête** est l'unité de base qui encapsule :
- **Contenu Éducatif/Informatif** : Messages, explications contextuelles
- **Collecte de Données** : Formulaire OU conversation audio avec IA  
- **Analyse IA** : Traitement intelligent des inputs utilisateur
- **Mise à jour Profil** : Nouvelles données, changement de statut

### Cycle de Vie Uniforme

```ascii
🎬 SCÉNARISATION ──→ 📝 INPUT ──→ 🤖 ANALYSE ──→ 👤 PROFIL MàJ ──→ 🎯 PROGRESSION
   
   Messages éducatifs   Form/Audio    Validation     Données         Prochaine étape
   Explication besoin   IA dialogue   Calculs        Nouveau statut  Règles déblocage
```

### Exemples Concrets

#### Quête "Budget Mensuel" (MVP)
```ascii
📋 ÉTAPES :
1. Scénario : "Pour une bonne gestion, nous devons connaître vos revenus..."
2. Input : Formulaire (salaire, loyer, dépenses) OU audio "Je gagne 2800€/mois..."
3. Analyse : IA valide cohérence, calcule solde mensuel
4. Profil : Statut → "Budget complété", données financières sauvées
5. Déblocage : Quête "Habitudes financières" devient disponible
```

#### Future Quête "Projet Immobilier"
```ascii
🏠 ÉTAPES :
1. Scénario : "Comparons rent vs buy pour votre situation..."
2. Input : Critères (localisation, budget) OU conversation guidée IA
3. Analyse : Simulation PMT, break-even, recommandations
4. Profil : Nouveau projet actif, statut → "Investisseur"
5. Déblocage : Fonctionnalités comparaison multi-projets
```

## Événements du Domaine

### Timeline Utilisateur Type

```ascii
ARRIVÉE UTILISATEUR
    │
    ├─ UtilisateurInscrit
    ├─ ProfilInitialisé (statut: "Nouveau")
    └─ QuêteBaseDébloquée ("Budget")
    
PROGRESSION DANS QUÊTE
    │
    ├─ QuêteDémarrée (quêteId, timestamp)
    ├─ ÉtapeComplétée (données, méthode: form/audio)
    ├─ AnalyseIAEffectuée (résultats, recommandations)
    ├─ ProfilMisÀJour (anciennesDonnées → nouvelles)
    └─ QuêteTerminée (nouvelles quêtes débloquées)

NAVIGATION LIBRE
    │
    ├─ ÉcranChangé (accueil → profil → quêtes)
    ├─ DonnéesÉditées (modification manuelle profil)
    └─ ConversationIAInitiée (chat overlay)
```

### Événements Critiques

**QuêteTerminée** déclenche :
- Calcul nouvelles quêtes disponibles
- Mise à jour statut utilisateur  
- Recommandations personnalisées

**ProfilMisÀJour** déclenche :
- Recalcul analyses existantes
- Adaptation contenu écran principal
- Suggestions IA contextuelles

## Commandes (Actions Utilisateur)

### Commandes Principales

```ascii
GESTION QUÊTES :
- DémarrerQuête(quêteId)
- SoumettreFormulaire(étapeId, données)
- EnregistrerAudio(message, contexte)
- ValiderAnalyseIA(accepter/modifier)
- Reprendre(quêteId) // pour brouillons

NAVIGATION :
- ChangerEcran(écranId)
- OuvrirOverlay(type: chat/résumé)
- ÉditerProfil(champId, nouvelleValeur)

IA INTERACTIONS :
- DemanderConseil(contexte)
- GénérerBloc(type: projet/analyse)
- CorrigerExtraction(donnéesOriginales, corrections)
```

### Commandes Spéciales MVP

**DémarrerQuête("budget")** :
- Vérifie prérequis (nouveau utilisateur)
- Initialise état quête
- Affiche première étape scénarisée

**SoumettreFormulaire("budget", données)** :
- Valide formats (montants positifs, cohérence)
- Déclenche analyse IA
- Sauvegarde en profil utilisateur

## Acteurs du Système

### 1. **Utilisateur**
**Responsabilités** :
- Fournit inputs (formulaires/audio)
- Navigate entre écrans
- Valide/corrige analyses IA
- Édite son profil

**États** : Nouveau → Guidé → Semi-autonome → Autonome

### 2. **IA (Agent Conversationnel)**
**Responsabilités** :
- Pose questions contextuelles dans quêtes
- Analyse et valide inputs utilisateur
- Génère blocs pré-remplis (projets, analyses)
- Fournit recommandations personnalisées

**Capacités** : Fact extraction, structured output, conversational UI

### 3. **Système de Règles**
**Responsabilités** :
- Applique progression logique (prérequis quêtes)
- Gère états et transitions
- Déclenche événements automatiques
- Maintient cohérence données

## Agrégats

### UTILISATEUR (Racine d'agrégat)

```ascii
Utilisateur {
    id: UserId
    profil: {
        statut: "Nouveau" | "Guidé" | "Semi-autonome" | "Autonome"
        préférences: { langue, notifications... }
        créé: timestamp
        dernièreActivité: timestamp
    }
    
    donnéesFinancières: {
        revenus: [{ source, montant, fréquence }]
        dépenses: [{ catégorie, montant, récurrence }]  
        prêts: [{ type, montant, mensualité, écheance }]
        soldeCalculé: montant
        dernièreMàJ: timestamp
    }
    
    progression: {
        quêtesComplétées: [quêteId]
        quêteActive: quêteId | null
        étapeEnCours: étapeId | null
        débuts: { [quêteId]: timestamp }
    }
}
```

### QUÊTE (Racine d'agrégat)

```ascii
Quête {
    id: QuêteId
    métadonnées: {
        nom: string
        description: string
        prérequis: [QuêteId]
        estiméeDurée: minutes
    }
    
    contenu: {
        étapes: [Étape]
        messagesÉducatifs: [Message]
        formulaires: [Formulaire]
        analysesIA: [AnalyseSpec]
    }
    
    règles: {
        validationInputs: Rules
        conditionsDéblocage: Rules
        profilRequis: StatutMinimal
    }
    
    état: {
        disponible: boolean
        utilisateursActifs: [UserId]
        statistiques: { complétions, durées, abandons }
    }
}
```

### PROJET (Racine d'agrégat - Future)

```ascii
Projet {
    id: ProjetId
    utilisateur: UserId
    type: "immobilier" | "épargne" | "consolidation"
    
    données: {
        spécifiquesType: variant par type
        paramètres: [{ clé, valeur, source }]
        calculés: { résultats analyses IA }
    }
    
    état: "brouillon" | "actif" | "archivé" | "partagé"
    historique: [{ modification, timestamp, source }]
}
```

## Règles Métier

### Progression et Prérequis

```ascii
RÈGLE 1: Quête Budget = Point d'entrée obligatoire
- Tous les utilisateurs commencent par là
- Bloque accès autres quêtes jusqu'à complétion
- Données minimales : 1 revenu + 3 dépenses principales

RÈGLE 2: Déblocage conditionnel
- Quête "Habitudes" requires Budget complété
- Quête "Projets" requires Habitudes + statut ≥ "Semi-autonome"
- Quête "Investissement" requires profil "Autonome"

RÈGLE 3: États de continuation
- Quête interrompue = sauvegarde automatique
- Retour possible à tout moment avec contexte
- Modification données = recalcul analyses impactées
```

### Cohérence des Données

```ascii
INVARIANT 1: Solde mensuel cohérent
- Revenus - Dépenses - Mensualités prêts = Solde
- Recalculé à chaque modification
- Alertes si incohérences détectées

INVARIANT 2: Prérequis respectés  
- Quête non débloquée = pas d'accès direct
- Données manquantes = étapes bloquées
- Profil insuffisant = fonctionnalités grisées
```

### Interactions IA

```ascii
RÈGLE IA 1: Contextualisation
- Questions adaptées aux données existantes
- Évite répétitions (ne redemande pas info connue)
- Référence toujours profil utilisateur actuel

RÈGLE IA 2: Validation humaine
- Extractions IA = toujours proposées, jamais imposées
- Utilisateur peut corriger/refuser
- Historique des corrections pour amélioration
```

## Vues de Lecture (Query Models)

### EcranPrincipal

```ascii
VueAccueil {
    utilisateur: { id, statut, progression% }
    quêteActive: {
        nom, étapeActuelle, prochaine action
        formulaireÀAfficher | messageÉducatif
    }
    recommandations: [Action suggérée par IA]
    raccourcis: [Vers profil, chat, quêtes disponibles]
}
```

### TabProfil

```ascii
VueProfil {
    données: DonnéesFinancières (avec édition inline)
    résumé: { solde, tendances, alertes }
    historique: [Modifications récentes avec timestamps]
    projets: [Projets actifs/archivés] // Future
}
```

### TabQuêtes

```ascii
VueQuêtes {
    disponibles: [{ id, nom, estiméeDurée, prérequis satisfied }]
    enCours: [{ id, progression%, dernièreActivité }]
    complétées: [{ id, complétion date, résultats }]
    bloquées: [{ id, prérequis manquants, estimation déblocage }]
}
```

### OverlayChat

```ascii
VueChat {
    contexte: { écran actuel, données pertinentes }
    conversation: [Message avec rôles et timestamps]
    suggestionsPrédéfinies: [Réponses rapides contextuelles]
    capacitésIA: { extraction, analyse, génération blocs }
}
```

## MVP - Focus Quête Budget

### Implémentation Prioritaire

**Phase 1** : Quête Budget uniquement
- Formulaire revenus/dépenses/prêts
- Validation IA basique  
- Profil utilisateur éditable
- Interface tabs basique

**Phase 2** : Intégration IA conversationnelle
- Audio input avec transcription
- Chat overlay contextuel
- Structured output pour extraction

**Phase 3** : Système quêtes généralisé
- Multiple quêtes disponibles
- Prérequis et déblocage
- Gamification et progression

### Mesures de Succès MVP

- **Complétion** : 85% utilisateurs finissent Quête Budget  
- **Données qualité** : <5% corrections nécessaires post-extraction IA
- **Engagement** : Utilisateur revisite profil dans 48h
- **Progression** : 60% passent à quête suivante quand disponible

Cette approche DDD simplifiée mais structurée nous donne une base solide pour l'implémentation tout en gardant la flexibilité pour l'évolution vers un système de quêtes plus riche.