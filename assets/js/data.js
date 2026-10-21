/* ============================================
   DONNÉES DU PORTFOLIO — contenu des skills, projets et stages
   (séparé du code d'animation pour être facile à mettre à jour)
   ============================================ */

const SKILLS = [
  // ─── DÉVELOPPEMENT WEB & LOGICIEL ───
  {
    name: "HTML/CSS",
    level: "90%",
    category: "Front",
    desc: "Mise en forme web",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  {
    name: "C#",
    level: "75%",
    category: "Langage",
    desc: "Back-end .NET (stage Angular)",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
  },
  {
    name: "Java",
    level: "75%",
    category: "Langage",
    desc: "POO & Android",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  },
  {
    name: "PHP",
    level: "80%",
    category: "Langage",
    desc: "Back-end web (BTS)",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
  },
  {
    name: "Angular",
    level: "75%",
    category: "Framework",
    desc: "App web Hygiene Expert",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg",
  },
  {
    name: "TypeScript",
    level: "75%",
    category: "Langage",
    desc: "Front Angular (stage)",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    name: "Symfony",
    level: "75%",
    category: "Framework",
    desc: "API REST & MVC",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/symfony/symfony-original.svg",
  },
  {
    name: "Android",
    level: "75%",
    category: "Mobile",
    desc: "Java + Android Studio",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg",
  },

  // ─── SCRIPTING ───
  {
    name: "Python",
    level: "85%",
    category: "Langage",
    desc: "Scripting · Data · ML",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "PowerShell",
    level: "70%",
    category: "Scripting",
    desc: "Automatisation (stage BlackFox)",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/powershell/powershell-original.svg",
  },
  {
    name: "Google Apps",
    level: "70%",
    category: "Scripting",
    desc: "Google Apps Script",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
  },

  // ─── BASES DE DONNÉES ───
  {
    name: "MySQL",
    level: "80%",
    category: "Base",
    desc: "SGBD relationnel",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },
  {
    name: "SQL Server",
    level: "75%",
    category: "Base",
    desc: "Vues, ETL → A3PDM",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg",
  },
  {
    name: "MongoDB",
    level: "60%",
    category: "NoSQL",
    desc: "Base de données NoSQL",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
  {
    name: "MCD",
    level: "85%",
    category: "Modélisation",
    desc: "Conception base de données",
    image: null,
  },

  // ─── OUTILS & MÉTHODES ───
  {
    name: "Git",
    level: "85%",
    category: "Outil",
    desc: "Versioning & GitHub",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  {
    name: "GitHub",
    level: "85%",
    category: "Outil",
    desc: "Collaboration de code",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  },
  {
    name: "Trello",
    level: "80%",
    category: "Outil",
    desc: "Gestion de projet Agile",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/trello/trello-plain.svg",
  },
  {
    name: "Figma",
    level: "75%",
    category: "Design",
    desc: "Maquettage UI/UX",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  },
  {
    name: "Agile",
    level: "75%",
    category: "Méthode",
    desc: "Scrum & Kanban",
    image: null,
  },

  // ─── DIVERS ───
  {
    name: "VS Code",
    level: "95%",
    category: "IDE",
    desc: "Éditeur principal",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
  },
  {
    name: "REST API",
    level: "80%",
    category: "Architecture",
    desc: "Conception API",
    image: null,
  },
  {
    name: "WSO2",
    level: "60%",
    category: "Middleware",
    desc: "Stage BlackFox",
    image: null,
  },
  {
    name: "Talend",
    level: "60%",
    category: "ETL",
    desc: "Stage BlackFox",
    image: null,
  },
  {
    name: "Linux",
    level: "65%",
    category: "OS",
    desc: "Environnement serveur",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  },
];

const PROJECTS = {
  ap11: {
    tag: "/ AP — 1.1 · SISR",
    title: "Infrastructure réseau",
    content: `
      <div class="proj-modal-meta">
        <div class="proj-modal-meta-item">
          <span>Spécialité</span>
          <strong>SISR</strong>
        </div>
        <div class="proj-modal-meta-item">
          <span>Période</span>
          <strong>Oct — Nov 2024</strong>
        </div>
        <div class="proj-modal-meta-item">
          <span>Équipe</span>
          <strong>Binôme</strong>
        </div>
        <div class="proj-modal-meta-item">
          <span>Type</span>
          <strong>Atelier pro.</strong>
        </div>
      </div>

      <h4>Contexte du projet</h4>
      <p>
        Mise en place d'une administration réseau complète comprenant
        <strong>1 serveur Windows Server 2019</strong>,
        <strong>2 stations clientes Windows 10</strong> et
        <strong>1 station Debian</strong>. L'objectif est de simuler un
        environnement d'entreprise (medoclab.local) avec gestion centralisée
        des utilisateurs, accès web interne et politiques de sécurité.
      </p>

      <h4>Technologies utilisées</h4>
      <div class="proj-modal-tags">
        <span>Windows Server 2019</span>
        <span>Debian 12</span>
        <span>VMware</span>
        <span>Active Directory</span>
        <span>GPO</span>
        <span>Apache</span>
        <span>DNS</span>
      </div>

      <h4>Missions réalisées</h4>
      <ul>
        <li>Création et configuration du serveur Windows Server 2019</li>
        <li>Mise en place de GPO (politique de mots de passe, restriction horaire de connexion, désactivation des commandes et antivirus)</li>
        <li>Création et configuration des clients Windows 10, clonage</li>
        <li>Installation et configuration d'Apache sur Debian</li>
        <li>Création du site web interne <strong>www.medoclab.local</strong></li>
        <li>Mise en relation serveur 2019 ↔ clients Windows ↔ serveur Debian</li>
        <li>Déploiement de LibreOffice via GPO sur les postes clients</li>
      </ul>

      <h4>Journal de bord</h4>
      <div class="proj-modal-log">
        <div class="proj-modal-log-entry">
          <div class="proj-modal-log-date">10 / 10</div>
          <p>
            Problèmes initiaux : copies de VM, version de VMware, mises à
            jour PC (≈3h perdues). Création du Server 2019, GPO mot de
            passe, répertoires et scripts d'ouverture de session.
          </p>
          <p>
            Découverte de Debian : installation d'Apache (problème résolu
            en cours de séance après recherche). Début de configuration
            de medoclab.local.
          </p>
        </div>

        <div class="proj-modal-log-entry">
          <div class="proj-modal-log-date">7 / 11</div>
          <p>
            Restriction de l'accès en fonction de l'heure de connexion.
            Création de GPO par UO (désactivation commandes, antivirus).
            Recherche pour déployer LibreOffice via GPO sur tous les
            clients.
          </p>
          <p>
            Avancement de la page web : création du "hello world" via
            <strong>sudo nano /var/www/html/medoclab.html</strong>,
            suppression de la page Apache par défaut, configuration du
            nom de domaine et activation du site.
          </p>
        </div>

        <div class="proj-modal-log-entry">
          <div class="proj-modal-log-date">14 / 11</div>
          <p>
            Problèmes d'accès internet sur client 1 (serveur DNS à
            changer). Installation d'Avast et LibreOffice, clonage du
            client 1 pour avoir un 2e client préconfiguré.
          </p>
          <p>
            Configuration du fichier <strong>hosts</strong> Windows pour
            associer 192.168.102.128 à www.medoclab.local. Tests d'accès
            à la page web — résolution des problèmes liés au DNS et au
            domaine.
          </p>
        </div>
      </div>

      <h4>Compétences mises en œuvre</h4>
      <ul>
        <li><strong>Gérer le patrimoine informatique</strong> — administration AD, GPO</li>
        <li><strong>Répondre aux incidents</strong> — résolution problèmes VM, DNS</li>
        <li><strong>Travailler en mode projet</strong> — cahier de bord, planification</li>
      </ul>
    `,
  },

  ap12: {
    tag: "/ AP — 1.2 · SLAM",
    title: "Site dynamique — Service à la personne",
    content: `
      <div class="proj-modal-meta">
        <div class="proj-modal-meta-item">
          <span>Spécialité</span>
          <strong>SLAM</strong>
        </div>
        <div class="proj-modal-meta-item">
          <span>Période</span>
          <strong>Nov — Déc 2025</strong>
        </div>
        <div class="proj-modal-meta-item">
          <span>Équipe</span>
          <strong>Projet groupe</strong>
        </div>
        <div class="proj-modal-meta-item">
          <span>Oral</span>
          <strong>08 / 01 / 2026</strong>
        </div>
      </div>

      <h4>Contexte du projet</h4>
      <p>
        Réalisation d'un <strong>site web dynamique</strong> gérant un
        service à la personne (parmi les 26 services officiels :
        livraison de repas, jardinage, garde d'enfants, etc.). L'objectif
        est de mettre en pratique les compétences en développement web
        dynamique acquises en cours : HTML, CSS, PHP, JavaScript et bases
        de données relationnelles.
      </p>

      <h4>Technologies utilisées</h4>
      <div class="proj-modal-tags">
        <span>PHP</span>
        <span>HTML5</span>
        <span>CSS3</span>
        <span>JavaScript</span>
        <span>Bootstrap</span>
        <span>MySQL</span>
        <span>Responsive</span>
      </div>

      <h4>Fonctionnalités du site</h4>
      <p>
        Le portail propose trois fonctionnalités majeures avec une
        gestion de la connexion selon le profil utilisateur :
      </p>
      <ul>
        <li><strong>Page d'accueil</strong> — présentation du service proposé</li>
        <li><strong>Côté gestionnaire</strong> — gestion des paramètres du service (créneaux, tarifs, etc.) et suivi des demandes</li>
        <li><strong>Côté client</strong> — saisie d'une demande de service (nom, prénom, adresse, créneau, etc.)</li>
        <li>Pages complémentaires : contact &amp; mentions légales</li>
      </ul>

      <h4>Architecture technique</h4>
      <ul>
        <li>Base de données relationnelle MySQL — <strong>3 tables maximum</strong></li>
        <li>Bootstrap pour le CSS (responsive natif)</li>
        <li>Maquette unifiée (header, footer, nav) sur toutes les pages</li>
        <li>Un fichier CSS global + un CSS par page</li>
        <li>Authentification multi-rôle (client / gestionnaire)</li>
      </ul>

      <h4>Documentation produite</h4>
      <ul>
        <li>Présentation du projet &amp; analyse du problème</li>
        <li>Schéma de navigation &amp; schéma de base de données</li>
        <li>Maquettes des différentes pages</li>
        <li>Suivi des tâches par étudiant (Trello / diagramme de Gantt)</li>
        <li>Description des fonctions clés du code + captures d'écran</li>
      </ul>

      <h4>Compétences mises en œuvre</h4>
      <ul>
        <li><strong>Concevoir une solution applicative</strong> — modélisation BDD, maquettes</li>
        <li><strong>Développer la présence en ligne</strong> — site dynamique complet</li>
        <li><strong>Travailler en mode projet</strong> — Trello, répartition des tâches, oral final</li>
      </ul>
    `,
  },

  ap2: {
    tag: "/ AP — 2 · SLAM",
    title: "TELLIS — Collecte des déchets",
    content: `
      <div class="proj-modal-meta">
        <div class="proj-modal-meta-item">
          <span>Spécialité</span>
          <strong>SLAM</strong>
        </div>
        <div class="proj-modal-meta-item">
          <span>Période</span>
          <strong>Janv — Avril 2025</strong>
        </div>
        <div class="proj-modal-meta-item">
          <span>Équipe</span>
          <strong>4 personnes</strong>
        </div>
        <div class="proj-modal-meta-item">
          <span>Oral</span>
          <strong>24 / 04 / 2025</strong>
        </div>
      </div>

      <h4>Contexte du projet</h4>
      <p>
        Embauché dans la société de services <strong>TELLIS</strong>
        (prestataire de services en ingénierie informatique basée à
        Nantes), mission de réalisation d'un site web pour gérer la
        <strong>collecte des déchets</strong> dans une commune. Projet
        réalisé en équipe de 4 (Thibault + 3 camarades) sur
        7 séances.
      </p>

      <h4>Technologies utilisées</h4>
      <div class="proj-modal-tags">
        <span>PHP</span>
        <span>MySQL</span>
        <span>Laragon</span>
        <span>Bootstrap</span>
        <span>HTML5 / CSS3</span>
        <span>IONOS</span>
        <span>FileZilla</span>
        <span>Trello</span>
      </div>

      <h4>Fonctionnalités</h4>
      <p><strong>Côté résident :</strong></p>
      <ul>
        <li>Inscription à une collecte avec volume de déchets</li>
        <li>Saisie de l'adresse et de la semaine disponible</li>
        <li>Authentification dédiée</li>
      </ul>
      <p><strong>Côté gestionnaire :</strong></p>
      <ul>
        <li>Gestion des tournées par jour (liste de rues successives, 6 jours/semaine)</li>
        <li>Définition du volume maximum par tournée</li>
        <li>Authentification administrateur</li>
      </ul>

      <h4>Contraintes techniques</h4>
      <ul>
        <li>Site réalisé <strong>sans CMS</strong> (pas de WordPress, PrestaShop…)</li>
        <li>Stack PHP / MySQL sous Laragon</li>
        <li>Design responsive avec navigation par menu</li>
        <li>Publication sur espace IONOS dédié au groupe</li>
        <li>Mises à jour via FileZilla Client</li>
      </ul>

      <h4>Livrables</h4>
      <ul>
        <li>Cahier des charges détaillé (validé professeur)</li>
        <li>MCD de la base de données (validé professeur)</li>
        <li>Diagramme de cas d'utilisation</li>
        <li>Maquettes de l'application</li>
        <li>Schéma de navigation</li>
        <li>Plan de tests et planning Trello</li>
      </ul>

      <h4>Compétences mises en œuvre</h4>
      <ul>
        <li><strong>Concevoir une solution applicative</strong> — MCD, maquettes, cahier des charges</li>
        <li><strong>Développer la présence en ligne</strong> — site PHP/MySQL responsive</li>
        <li><strong>Travailler en mode projet</strong> — pilote de projet, Trello, points d'avancement</li>
        <li><strong>Mettre à disposition un service</strong> — déploiement IONOS</li>
      </ul>
    `,
  },

  ap3: {
    tag: "/ AP — 3 · SLAM",
    title: "OXAM — Gestion d'escales portuaires",
    content: `
      <div class="proj-modal-meta">
        <div class="proj-modal-meta-item">
          <span>Spécialité</span>
          <strong>SLAM</strong>
        </div>
        <div class="proj-modal-meta-item">
          <span>Période</span>
          <strong>Oct — Nov 2025</strong>
        </div>
        <div class="proj-modal-meta-item">
          <span>Client</span>
          <strong>Port de La Rochelle</strong>
        </div>
        <div class="proj-modal-meta-item">
          <span>Oral</span>
          <strong>28 / 11 / 2025</strong>
        </div>
      </div>

      <h4>Contexte du projet</h4>
      <p>
        Mission au sein du groupe <strong>OXAM</strong>, affecté au client
        <strong>Port de La Rochelle</strong>. Le port souhaite mettre à
        disposition de la Capitainerie une application Web sécurisée
        permettant la <strong>gestion des escales des navires</strong>
        dans son port.
      </p>

      <h4>Technologies utilisées</h4>
      <div class="proj-modal-tags">
        <span>PHP</span>
        <span>MySQL</span>
        <span>Laragon</span>
        <span>Architecture MVC</span>
        <span>Git</span>
        <span>Agile / Scrum</span>
        <span>Trello</span>
      </div>

      <h4>Définition de l'application</h4>
      <p>
        La Capitainerie supervise la circulation des navires (entrées /
        sorties), les opérations de manutention (chargement / déchargement
        du fret) et l'infrastructure d'accostage (quais, hangars). Elle
        interagit avec la <strong>Direction des Affaires Maritimes</strong>
        (registre Lloyds) et les <strong>agents consignataires</strong>
        mandatés par les armateurs.
      </p>

      <h4>Périmètre fonctionnel</h4>
      <ul>
        <li>Réception et traitement des demandes d'escale</li>
        <li>Attribution d'un numéro d'escale et d'un poste d'accostage</li>
        <li>Affectation d'un pilote (entrée / sortie) et d'un docker</li>
        <li>Gestion CRUD : employés du port, navires, armateurs, quais</li>
        <li>Suivi des escales : durée, fret transporté, prochaine destination</li>
        <li>Gestion des remorqueurs (si pas de propulseur d'étrave)</li>
      </ul>

      <h4>Architecture &amp; contraintes</h4>
      <ul>
        <li>Architecture <strong>MVC</strong> respectée</li>
        <li>BDD modélisée en <strong>MCD selon les normes Merise</strong></li>
        <li>Authentification préalable obligatoire (accès personnel port uniquement)</li>
        <li>Application hébergée et accessible via navigateur</li>
        <li>Versioning Git pour échange et synchronisation des travaux</li>
        <li>Méthode <strong>Scrum / Kanban</strong> pour la conduite de projet</li>
        <li>Tests métier, fonctionnel et unitaire avant déploiement</li>
      </ul>

      <h4>Documentation produite</h4>
      <ul>
        <li>Tableau Trello avec détail des tâches par étudiant</li>
        <li>Diagrammes de cas d'utilisation</li>
        <li>Schéma de navigation (variables d'aiguillage et contrôleurs)</li>
        <li>Maquettage des interfaces</li>
        <li>MCD et règles de gestion</li>
        <li>Plans de tests avec données cohérentes</li>
        <li>Documentation utilisateur structurée</li>
      </ul>

      <h4>Compétences mises en œuvre</h4>
      <ul>
        <li><strong>Concevoir une solution applicative</strong> — MCD complexe, architecture MVC</li>
        <li><strong>Développer la présence en ligne</strong> — application sécurisée</li>
        <li><strong>Travailler en mode projet</strong> — Scrum / Trello, normes de développement</li>
        <li><strong>Mettre à disposition un service</strong> — hébergement, tests, livraison</li>
      </ul>
    `,
  },

  ap4: {
    tag: "/ AP — 4 · SLAM",
    title: "Zoucolis — Applicatif Mondial Relay",
    content: `
      <div class="proj-modal-meta">
        <div class="proj-modal-meta-item">
          <span>Spécialité</span>
          <strong>SLAM</strong>
        </div>
        <div class="proj-modal-meta-item">
          <span>Période</span>
          <strong>Déc 2025 — Avr 2026</strong>
        </div>
        <div class="proj-modal-meta-item">
          <span>Type</span>
          <strong>Web + Mobile</strong>
        </div>
        <div class="proj-modal-meta-item">
          <span>Oral</span>
          <strong>10 / 04 / 2026</strong>
        </div>
      </div>

      <h4>Le projet</h4>
      <p>
        Développement d'un applicatif de type <strong>Mondial Relay</strong>
        regroupant les expéditeurs, destinataires, transporteurs et
        points relais. Un suivi en temps réel du colis est accessible
        <strong>sur le web et sur smartphone</strong>. Projet phare du
        BTS SIO, qui combine développement back-end, front-end web et
        application mobile.
      </p>

      <h4>Stack technique</h4>
      <div class="proj-modal-tags">
        <span>Symfony 7</span>
        <span>Java</span>
        <span>Android Studio</span>
        <span>API REST</span>
        <span>MySQL</span>
        <span>IONOS</span>
        <span>Git / GitHub</span>
        <span>Agile</span>
      </div>

      <h4>Architecture applicative</h4>
      <p>
        Architecture trois-tiers avec séparation stricte des
        responsabilités :
      </p>
      <ul>
        <li><strong>Back-office</strong> : application Symfony 7 hébergée sur IONOS</li>
        <li><strong>API REST</strong> : exposée sur serveur distant IONOS avec base MySQL</li>
        <li><strong>Application mobile</strong> : Android natif (Java + Android Studio)</li>
        <li><strong>Persistance</strong> : base MySQL centralisée pour tout l'applicatif</li>
      </ul>

      <h4>Fonctionnalités</h4>
      <p><strong>Back-office :</strong></p>
      <ul>
        <li>Gestion des transporteurs et des points relais</li>
        <li>Administration générale de la plateforme</li>
      </ul>
      <p><strong>Site web (expéditeurs &amp; transporteurs) :</strong></p>
      <ul>
        <li>Côté expéditeur : création d'envois, choix du transporteur et du point relais, suivi</li>
        <li>Côté transporteur : suivi des demandes assignées</li>
      </ul>
      <p><strong>Application mobile Android (destinataires) :</strong></p>
      <ul>
        <li>Suivi en temps réel des livraisons</li>
        <li>Consommation de l'API REST</li>
      </ul>

      <h4>Cahier des charges</h4>
      <ul>
        <li>Une livraison ↔ un seul colis</li>
        <li>Chaque livraison a un point relais de départ et un point relais d'arrivée</li>
        <li>4 types d'utilisateurs : transporteurs, destinataires, expéditeurs, points relais</li>
        <li>Authentification multi-rôle</li>
      </ul>

      <h4>Livrables &amp; documentation</h4>
      <ul>
        <li>Application Android déployable sur smartphone</li>
        <li>Back-office Symfony en ligne (IONOS)</li>
        <li>API REST en ligne avec base MySQL</li>
        <li>MOT (modèle organisationnel de traitement) ou diagramme de séquence</li>
        <li>MCD et diagramme de classes</li>
        <li>Spécification complète de l'API REST</li>
        <li>Maquettage des deux applicatifs (web + mobile)</li>
        <li>Plans de tests avec données cohérentes</li>
        <li>Planning détaillé et documentation utilisateur</li>
      </ul>

      <h4>Compétences mises en œuvre</h4>
      <ul>
        <li><strong>Concevoir une solution applicative</strong> — architecture 3-tiers, API REST</li>
        <li><strong>Développer la présence en ligne</strong> — Symfony + Android</li>
        <li><strong>Travailler en mode projet</strong> — équipe pluridisciplinaire, Trello/JIRA</li>
        <li><strong>Mettre à disposition un service</strong> — déploiement IONOS, mobile</li>
        <li><strong>Organiser son développement</strong> — Symfony 7, Android moderne</li>
      </ul>
    `,
  },
};

const STAGES = {
  "hygiene-expert": {
    num: "01",
    name: "Hygiène Expert",
    hero: {
      metaLeft: "STAGE · BTS SIO SLAM",
      metaRight: "Mai — Juin 2025 · 6 semaines",
      title: `Hygiène<br /><em>Expert.</em>`,
      subtitle:
        "Stage de 6 semaines au sein d'un éditeur d'applications web pour la gestion de l'hygiène. Implémentation complète de fonctionnalités sur une application Angular en méthode Scrum.",
    },
    overview: [
      { label: "Entreprise", value: "Hygiène Expert SAS" },
      { label: "Lieu", value: "Les Herbiers (85500)" },
      { label: "Stack", value: "Angular · C#" },
      { label: "Méthode", value: "Scrum / Agile" },
    ],
    nav: [
      { id: "contexte", label: "Contexte" },
      { id: "mission", label: "Mission" },
      { id: "missions", label: "Réalisations" },
      { id: "bilan", label: "Bilan" },
    ],
    sections: [
      {
        id: "contexte",
        tag: "/ 01 — CONTEXTE",
        title: "L'entreprise &amp; le projet",
        html: `
          <p>
            Hygiène Expert SAS est un éditeur d'applications web spécialisé
            dans la <strong>gestion de l'hygiène</strong> pour les
            professionnels (restauration, agences, etc.). L'entreprise
            développe plusieurs produits dont une plateforme Support, une
            application MPH (commandes HACCP), et un container regroupant
            les modules clients.
          </p>
          <p>
            L'équipe technique fonctionne selon la <strong>méthode Scrum</strong>
            avec un Scrum quotidien le matin, des tickets organisés sur
            Linear et un workflow Git via GitLab. L'hébergement applicatif
            est géré sur Microsoft Azure, la base de données via Docker.
          </p>
        `,
      },
      {
        id: "mission",
        tag: "/ 02 — MISSION",
        title: "Gestion des agences &amp; session technicien",
        html: `
          <p>
            La mission principale du stage portait sur la
            <strong>refonte de la gestion des agences</strong> dans
            l'application Support et MPH. Initialement, le nom de l'agence
            était stocké en tant que chaîne de caractères (champ
            <strong>validateur</strong>) directement dans les commandes —
            pratique non maintenable et source d'erreurs.
          </p>
          <p>
            L'objectif était de migrer vers une <strong>structure
            relationnelle propre</strong> avec une table dédiée
            <code>agency</code> et une clé étrangère <code>agency_id</code>,
            accompagnée d'une table de liaison <code>user_agency</code> pour
            gérer les associations utilisateurs ↔ agences. En parallèle, une
            seconde mission portait sur le <strong>remplacement du droit
            access_support</strong> par des habilitations plus précises
            (support_admin, support_ctn).
          </p>
          <p>
            Travail réalisé en autonomie avec encadrement de mon référent
            de stage et d'un second développeur sur la création des tickets, le
            déblocage technique et la validation des choix d'architecture.
          </p>
        `,
      },
      {
        id: "missions",
        tag: "/ 03 — MISSIONS RÉALISÉES",
        title: "Les grandes étapes",
        html: `
          <div class="stage-activities" data-activities-target></div>
        `,
        activities: [
          {
            num: "01",
            title: "Prise en main &amp; environnement",
            period: "Semaine 1 · 12 → 16 mai",
            tags: ["Angular", "PostgreSQL", "Git", "GitLab", "Docker"],
            description:
              "Découverte de l'entreprise et de son écosystème technique : Linear pour la gestion de projet, GitLab pour le versioning, Docker pour la BDD, Microsoft Azure pour l'hébergement. Mise en place complète de l'environnement de développement (VS Code, droits administrateur, configuration NVM/Node) et formation au framework Angular via OpenClassrooms et Stackblitz.",
            bullets: [
              "Clonage et compilation des 5 projets : API C#, ButtonHec, He-Container, MPH, Support",
              "Création et restauration de la base de données <code>hygiene_expert</code> via scripts SQL",
              "Correction des variables d'environnement de l'API pour pointer vers la bonne base",
              "Rédaction de la documentation prévisionnelle de mission (validée par mon référent de stage)",
            ],
            difficulty: {
              title: "Difficulté principale",
              text: "Plusieurs jours sans droits administrateur sur le poste de travail, empêchant l'installation des outils. Travail temporaire via Stackblitz en attendant la configuration définitive avec mon référent (NVM, NPM, Node).",
            },
          },
          {
            num: "02",
            title: "Refonte de la gestion des agences",
            period: "Semaines 2 → 3 · 19 mai → 26 mai",
            tags: ["SQL", "C# / .NET", "Angular", "TypeScript", "MCD"],
            description:
              "Mission technique principale du stage : migration d'une structure de données legacy vers un modèle relationnel propre. Initialement, le nom des agences était stocké en chaîne de caractères dans un champ <strong>validateur</strong> directement sur les commandes. Refonte vers une table dédiée <code>agency</code> avec clé étrangère <code>agency_id</code> et table de liaison <code>user_agency</code>.",
            bullets: [
              "Modélisation MCD avec 3 nouvelles tables : <code>agency</code>, <code>user_agency</code>, adaptations sur les tables existantes",
              "Création des tables via scripts SQL et insertion des données (HAXE DIRECT, JDC, HYGIENE EXPERT, etc.)",
              "Migration automatique via jointure sur le nom puis ajout de la clé étrangère <code>fk_agency</code>",
              "Création du service <strong>AgencyService</strong> en C# avec méthode <code>getAgencyById()</code>",
              "Adaptation du back-end Angular et de l'application Support pour utiliser <code>getListAgency()</code>",
              "Suppression de l'affichage en dur des agences (côté Angular et côté Support)",
              "Correction du bug d'enregistrement dans le formulaire de modification d'entreprise",
            ],
            difficulty: {
              title: "Difficulté principale",
              text: "Le champ <code>validateur</code> était une <strong>string</strong> (nom de l'agence) alors que <code>agency_id</code> est un <strong>int</strong> (clé étrangère). Impossible de simplement remplacer un champ par l'autre sans casser le code. Solution : création d'un modèle structuré <code>mph_agency</code> côté C# pour gérer la correspondance proprement.",
            },
          },
          {
            num: "03",
            title: "Refonte du système d'habilitations",
            period: "Semaine 3 · 27 → 30 mai",
            tags: ["Authentification", "C#", "Angular", "Debug"],
            description:
              "Seconde mission : <strong>supprimer le droit générique <code>access_support</code></strong> et le remplacer par des habilitations plus précises (<code>support_admin</code>, <code>support_ctn</code>) afin d'affiner les permissions des utilisateurs sur l'application Support.",
            bullets: [
              "Analyse du comportement via l'onglet <strong>Network</strong> du navigateur",
              "Utilisation de <strong>points d'arrêt (breakpoints)</strong> pour suivre l'exécution pas à pas",
              "Tests systématiques avec différents profils utilisateurs",
              "Modification de plus de <strong>20 fichiers</strong> dans le projet he-container",
              "Tests de validation finaux avec des comptes support_admin et support_ctn",
            ],
            difficulty: {
              title: "Difficulté principale",
              text: "Localisation des fichiers à modifier dans une architecture complexe. Plusieurs heures de recherche infructueuse avant de débloquer la situation avec l'aide de mon référent qui a indiqué les zones précises du code à adapter.",
            },
          },
          {
            num: "04",
            title: "Restriction des droits &amp; filtrage par agence",
            period: "Semaine 4 · 02 → 06 juin",
            tags: ["Angular", "SQL", "Permissions", "Figma"],
            description:
              "Affinage de la mission précédente : limiter les fonctionnalités accessibles aux utilisateurs ayant uniquement le droit <code>access_support</code>, et restreindre l'affichage des entreprises à celles rattachées à leur agence.",
            bullets: [
              "Suppression de l'accès à la modification des entreprises",
              "Retrait du bouton HACCP et masquage des onglets Statistique/Température",
              "Suppression des modules HACCP et Audit pour ce profil",
              "Ajout d'utilisateurs dans la table <code>user_agency</code>",
              "Création de la méthode <code>getHaccpEntrepriseByAgencies()</code> avec INNER JOIN sur <code>user_agency</code>",
              "Filtrage conditionnel : actif uniquement pour les utilisateurs ayant <strong>seulement</strong> access_support",
              "3 scénarios de tests validés (access_support seul / support_admin seul / les deux combinés)",
              "Maquettage Figma de la nouvelle vue techniciens (validée par le responsable technique)",
            ],
            difficulty: {
              title: "Difficulté principale",
              text: "Premières modifications non optimisées qui créaient des bugs pour les autres profils utilisateurs. Refactoring vers une approche conditionnelle robuste pour ne déclencher le filtrage qu'au bon profil.",
            },
          },
          {
            num: "05",
            title: "Développement de la vue Techniciens",
            period: "Semaine 5 · 10 → 13 juin",
            tags: ["Angular", "C#", "SQL", "JSON_AGG"],
            description:
              "Implémentation concrète de la maquette Figma validée : création d'une nouvelle page Angular permettant de visualiser, modifier et supprimer les techniciens (utilisateurs <code>access_support</code>) avec leurs agences associées.",
            bullets: [
              "Création du composant <code>techniciens.components</code> avec route dédiée",
              "Développement du controller <code>GetTechnicien()</code> côté API",
              "Méthode service <code>getTechnicien()</code> avec requête SQL filtrant les utilisateurs <code>access_support = true</code>",
              "Affichage en tableau avec colonnes Nom / Email / Agences associées",
              "Correction de l'en-tête via le fichier de traduction JSON",
              "Création des boutons <strong>Modifier les agences</strong> et <strong>Supprimer le technicien</strong>",
              "Création du composant <code>modal-update-technicien-agency</code>",
            ],
            difficulty: {
              title: "Difficulté principale",
              text: "Les techniciens associés à plusieurs agences apparaissaient en <strong>doublon</strong> dans le tableau (une ligne par agence). Solution : utilisation de <code>JSON_AGG(ag.nom) as agency</code> côté backend pour agréger les agences d'un même technicien en une seule ligne, puis <code>*ngFor</code> côté Angular pour les afficher en badges.",
            },
          },
          {
            num: "06",
            title: "Gestion complète des techniciens &amp; finalisation",
            period: "Semaine 6 · 16 → 20 juin",
            tags: ["Angular", "C#", "SQL", "Dapper"],
            description:
              "Dernière semaine consacrée à la finalisation de la fonctionnalité de gestion des techniciens : suppression d'un technicien, suppression et ajout d'agences associées. Adaptation du code aux mises à jour de structure de tables et clôture du stage.",
            bullets: [
              "Suppression <strong>logique</strong> d'un technicien : passage de <code>access_support</code> à <code>false</code> via Dapper et nettoyage de <code>user_agency</code>",
              "Bouton avec croix cliquable pour supprimer une agence : requête SQL avec sous-requête sur le nom de l'agence",
              "Formulaire multiselect pour ajouter une ou plusieurs agences à un technicien",
              "Adaptation du code aux nouveaux noms de tables (recherche et remplacement systématique)",
              "Collecte de captures d'écran pour la soutenance orale",
              "Remplissage des documents administratifs de fin de stage avec mon référent",
              "Commit final regroupant l'ensemble des travaux réalisés",
            ],
            difficulty: {
              title: "Difficulté principale",
              text: "Certains morceaux de code référençaient encore les anciens noms de tables après la mise à jour de la structure, créant un risque de bugs. Solution : recherche systématique par mots-clés dans le projet et commit de sauvegarde avant chaque modification.",
            },
          },
        ],
      },
      {
        id: "bilan",
        tag: "/ 04 — BILAN",
        title: "Compétences acquises",
        html: `
          <p>
            Stage de <strong>6 semaines complètes</strong> chez un éditeur
            d'applications web, qui m'a permis de mettre en pratique de
            nombreuses compétences du référentiel BTS SIO SLAM dans un
            cadre professionnel réel.
          </p>

          <h4 class="stage-subhead">Compétences techniques</h4>
          <p>
            <strong>Back-end (C# / .NET)</strong> — création de controllers,
            services métiers, requêtes SQL complexes (JOIN, agrégation
            <code>JSON_AGG</code>), utilisation de Dapper pour la
            persistance.
          </p>
          <p>
            <strong>Front-end (Angular / TypeScript)</strong> — création de
            composants, routing, formulaires multiselect, modales,
            directives <code>*ngFor</code> et <code>*ngIf</code>,
            consommation d'APIs REST.
          </p>
          <p>
            <strong>Base de données (PostgreSQL)</strong> — modélisation
            MCD, tables de liaison, migration de schéma, requêtes
            relationnelles avec agrégation.
          </p>
          <p>
            <strong>Design</strong> — maquettage Figma de nouvelles
            interfaces, reproduction d'écrans existants pour cohérence
            visuelle.
          </p>

          <h4 class="stage-subhead">Compétences méthodologiques</h4>
          <p>
            <strong>Méthode Scrum</strong> — participation quotidienne aux
            Scrums du matin, organisation des tâches en tickets et
            sous-tickets sur Linear, points d'étape réguliers.
          </p>
          <p>
            <strong>Démarche professionnelle</strong> — analyse de code
            existant pour s'en inspirer, tests utilisateurs systématiques
            (jusqu'à 3 scénarios par fonctionnalité), demande d'aide ciblée
            aux collègues lors de blocages, rédaction de rapports
            hebdomadaires.
          </p>
          <p>
            <strong>Versioning</strong> — utilisation de Git/GitLab avec
            commits réguliers, commits de sauvegarde avant grosses
            modifications, recherche systématique par mots-clés pour
            garantir la cohérence du code.
          </p>

          <h4 class="stage-subhead">Résultat final</h4>
          <p>
            Le stage s'est conclu avec un <strong>projet fonctionnel
            complet</strong> de gestion des techniciens, incluant
            l'affichage filtré, le filtrage conditionnel par agence, la
            suppression logique d'un technicien, et la gestion fine
            (ajout/suppression) des agences associées. L'ensemble a été
            proprement intégré dans l'écosystème existant d'Hygiène Expert.
          </p>
          <p>
            Le projet a été livré avec une documentation complète des
            fonctionnalités, des captures d'écran pour la soutenance orale,
            et un transfert de connaissances structuré avec mon référent
            de stage pour assurer la continuité après mon départ.
          </p>
        `,
      },
    ],
  },

  // Stage 2 — BlackFox
  blackfox: {
    num: "02",
    name: "BlackFox",
    hero: {
      metaLeft: "STAGE · BTS SIO SLAM",
      metaRight: "Janv — Fév 2026 · 6 semaines",
      title: `Black<br /><em>Fox.</em>`,
      subtitle:
        "Stage de 6 semaines chez un grossiste en bottes caoutchouc. Automatisation des flux de données entre l'ERP Divalto et la plateforme PDM (A3PDM) via scripts ETL Python, requêtage SQL Server, et analyse de middleware (WSO2 → Talend).",
    },
    overview: [
      { label: "Entreprise", value: "BlackFox" },
      { label: "Lieu", value: "Sèvremoine (49230)" },
      { label: "Stack", value: "Python · SQL Server" },
      { label: "Méthode", value: "Data Engineering" },
    ],
    nav: [
      { id: "contexte", label: "Contexte" },
      { id: "mission", label: "Mission" },
      { id: "missions", label: "Réalisations" },
      { id: "bilan", label: "Bilan" },
    ],
    sections: [
      {
        id: "contexte",
        tag: "/ 01 — CONTEXTE",
        title: "L'entreprise &amp; le projet",
        html: `
          <p>
            BlackFox est un <strong>grossiste en bottes caoutchouc et
            accessoires</strong> basé à Sèvremoine, qui possède plusieurs
            entités sœurs (Atelier Insolite, Oxygen). L'entreprise utilise
            un écosystème complexe : ERP <strong>Divalto</strong>, CRM
            <strong>Divalto Weavy</strong>, logiciel d'océrisation
            <strong>OpenBee</strong>, et plateforme de gestion d'articles
            <strong>A3PDM</strong> développée par AGENA3000.
          </p>
          <p>
            Le projet phare en cours, <strong>PimpMyPim</strong>, vise à
            moderniser l'architecture data de l'entreprise — notamment en
            remplaçant le middleware historique <strong>WSO2</strong> par
            <strong>Talend Cloud Data Integration</strong>, plus moderne
            et maintenable, en collaboration avec le cabinet
            <strong>NextDecision</strong>.
          </p>
        `,
      },
      {
        id: "mission",
        tag: "/ 02 — MISSION",
        title: "Automatisation des flux Divalto → A3PDM",
        html: `
          <p>
            La mission principale du stage portait sur
            <strong>l'automatisation de la synchronisation des articles</strong>
            entre l'ERP Divalto (base SQL Server) et la nouvelle plateforme
            de gestion produit A3PDM. Avant mon arrivée, les articles
            devaient être créés manuellement dans A3PDM, ce qui était
            source d'erreurs et de perte de temps.
          </p>
          <p>
            L'objectif : concevoir un <strong>pipeline ETL complet</strong>
            permettant d'extraire les articles depuis la BDD Divalto, de
            les formater selon les exigences d'A3PDM, et de gérer un
            historique pour éviter les doublons lors des imports
            récurrents.
          </p>
          <p>
            En parallèle, je suis intervenu sur plusieurs <strong>missions
            annexes</strong> : analyse du middleware WSO2 existant en vue
            de la migration vers Talend, scripts utilitaires PowerShell et
            Google Apps Script pour différents besoins internes, et tests
            de la plateforme A3PDM (cahier de recette).
          </p>
        `,
      },
      {
        id: "missions",
        tag: "/ 03 — MISSIONS RÉALISÉES",
        title: "Les grandes étapes",
        html: `
          <div class="stage-activities" data-activities-target></div>
        `,
        activities: [
          {
            num: "01",
            title: "Immersion &amp; analyse de l'existant",
            period: "Semaine 1 · Janvier 2026",
            tags: ["WSO2", "Talend", "OpenBee", "Documentation"],
            description:
              "Première semaine consacrée à la compréhension de l'écosystème technique de BlackFox et à la prise en main des outils du projet PimpMyPim. Analyse approfondie du middleware <strong>WSO2</strong> existant (séquences, endpoints, flux de code) en vue de sa future migration vers <strong>Talend Cloud Data Integration</strong>.",
            bullets: [
              "Documentation complète sur le projet PimpMyPim et l'architecture data de l'entreprise",
              "Découverte et prise en main de <strong>Talend Cloud Data Integration</strong> (videos, essais)",
              "Analyse des flux WSO2 en production : séquences, endpoints, code",
              "Formation au CRM <strong>Divalto Weavy</strong> utilisé par les commerciaux",
              "Étude du logiciel <strong>OpenBee</strong> (océrisation des factures clients) — schéma du backoffice et flux d'envoi des données",
            ],
            difficulty: {
              title: "Particularité",
              text: "Deux jours de télétravail imposés en raison des conditions météo (neige) — adaptation au travail à distance avec autonomie totale sur l'apprentissage et la documentation des outils.",
            },
          },
          {
            num: "02",
            title: "Scripts utilitaires &amp; prise en main A3PDM",
            period: "Semaine 2 · Janvier 2026",
            tags: ["PowerShell", "Google Apps Script", "A3PDM", "HTML"],
            description:
              "Avant de démarrer le projet principal, plusieurs <strong>scripts utilitaires</strong> ont été développés pour répondre à des besoins immédiats de l'équipe. Cela m'a permis de monter en compétence sur différents environnements (PowerShell, Apps Script) tout en livrant rapidement de la valeur.",
            bullets: [
              "<strong>Script PowerShell d'audit ACL</strong> : lecture des droits sur des milliers de dossiers/sous-dossiers et génération d'un fichier HTML avec arborescence interactive pour l'équipe infrastructure",
              "<strong>Script Google Apps Script</strong> de synchronisation des contacts utilisateurs vers un fichier Drive, avec <strong>triggers automatiques</strong> (lundi et vendredi)",
              "Accès complet à <strong>A3PDM</strong> (plateforme de gestion d'articles AGENA3000) et début des tests de la plateforme",
              "Remplissage d'un <strong>cahier de recette</strong> pour recenser les bugs et erreurs identifiés sur A3PDM",
              "Réunions de cadrage : architecture Talend, tickets Weavy CRM, démarrage Blackfox Talend",
            ],
            difficulty: {
              title: "Difficulté principale",
              text: "Sur A3PDM, je n'avais pas initialement les droits de création de nouveaux produits qui m'avaient été promis. Solution temporaire : modification des produits existants pour découvrir l'outil en attendant l'obtention des droits complets.",
            },
          },
          {
            num: "03",
            title: "Conception de l'ETL Divalto → A3PDM",
            period: "Semaine 3 · Janvier 2026",
            tags: ["Python", "SQL Server", "ETL", "Excel"],
            description:
              "Démarrage du projet principal : créer un <strong>pipeline ETL</strong> capable d'extraire les articles depuis la base SQL Server de Divalto, de les transformer pour correspondre au format attendu par A3PDM, et de les charger via un fichier Excel modèle.",
            bullets: [
              "Analyse complète des mécanismes d'export/import d'A3PDM (Excel, JSON, XML, GDSN)",
              "Export d'un <strong>fichier Excel modèle</strong> pour identifier les colonnes cibles",
              "Connexion à SQL Server Management pour exploration de la table <strong>SART</strong> (sous-articles)",
              "Première version du script Python : connexion BDD + correspondance des champs + insertion dans le fichier Excel",
              "Réunions stratégiques : <em>Piloter un projet S.I. de A à Z</em> et passage en revue semestriel des projets",
            ],
            difficulty: {
              title: "Difficulté principale",
              text: "Les noms des colonnes du fichier Excel d'A3PDM ne correspondaient pas aux noms des champs de la BDD SQL Server. Solution : mise en place d'une logique de mapping (ETL) gérée d'abord directement dans le script Python.",
            },
          },
          {
            num: "04",
            title: "Refonte ETL via vue SQL &amp; premiers imports",
            period: "Semaine 4 · Janvier 2026",
            tags: ["SQL Server", "Vues SQL", "Python", "ETL"],
            description:
              "Refonte architecturale du pipeline ETL pour <strong>déporter la logique métier en SQL</strong> plutôt que dans Python. L'objectif : faciliter la maintenance et l'évolution du système — l'ajout d'un nouveau champ ne nécessite plus de toucher au code Python, juste à modifier la vue SQL.",
            bullets: [
              "Création d'une <strong>vue SQL Server</strong> qui fait l'agencement entre les champs Divalto et les colonnes du modèle A3PDM",
              "Simplification du script Python : il ne fait plus que lire la vue et remplir le fichier Excel",
              "<strong>Script de déduplication</strong> pour l'équipe infrastructure : scan automatique d'un serveur de fichiers et conservation d'un seul fichier par client",
              "Ajout du statut <strong>'Inactif'</strong> automatique à l'import (demandé par mon maître de stage)",
              "<strong>Premier import en production</strong> de ~12 000 articles invalidés dans A3PDM (durée ~20 min)",
              "Correction d'un bug de TRIM : espaces parasites en fin de champ provenant de la table Sous-article Divalto",
            ],
            difficulty: {
              title: "Difficulté principale",
              text: "L'approche initiale (script Python gérant tout l'ETL) rendait la maintenance compliquée. Solution : refonte en architecture <strong>SQL-first</strong> — la vue SQL fait la transformation, le script Python ne fait que le chargement. Plus maintenable, plus évolutif.",
            },
          },
          {
            num: "05",
            title: "Imports articles validés &amp; correction des écarts",
            period: "Semaine 5 · Janvier-Février 2026",
            tags: ["SQL", "A3PDM", "Tests", "Production"],
            description:
              "Phase de fiabilisation : correction des écarts de comptage, purge et réimport des données, puis passage à l'import des <strong>articles validés</strong> (~40 000 articles) sur la base de production.",
            bullets: [
              "Détection d'un <strong>écart de 6 300 articles</strong> entre la vue (11 700) et la BDD réelle (18 000) — analyse comparative via Excel",
              "Cause identifiée : conditions trop restrictives dans la vue (articles sans famille ni taille exclus)",
              "Purge complète des articles importés, ajustement des conditions de la vue",
              "Migration de l'environnement <strong>Test → Production</strong>",
              "Import des articles validés : modification du filtre sur le champ <code>UDT_HSDT</code> (date de validité)",
              "Mise à jour du statut des articles validés à <strong>'Commercialisé'</strong> dans A3PDM",
            ],
            difficulty: {
              title: "Difficulté principale",
              text: "Lors de l'import des articles validés, le statut <strong>'Actif'</strong> attendu n'était pas appliqué automatiquement — A3PDM ne dispose pas de statut Actif prédéfini, les articles se mettaient par défaut en <em>'En développement'</em>. Solution : mise à jour manuelle du statut après import.",
            },
          },
          {
            num: "06",
            title: "Industrialisation &amp; déploiement serveur",
            period: "Semaine 6 · Février 2026",
            tags: ["Python", "PyInstaller", "VM", "Planificateur"],
            description:
              "Dernière semaine consacrée à <strong>l'industrialisation du pipeline</strong> pour qu'il fonctionne en autonomie sur le serveur de production, sans intervention humaine. Transformation du script en exécutable autonome et mise en place de l'automatisation quotidienne.",
            bullets: [
              "Analyse du middleware WSO2 pour comprendre le cheminement des commandes OCRisées (avec schéma à l'appui)",
              "Conception d'une <strong>table d'historique</strong> <code>A3PDM_HISTORIQUE</code> pour éviter les doublons d'import (logique delta)",
              "Implémentation du <strong>mode Append</strong> : ajout des nouveaux articles à la suite dans un fichier Excel unique",
              "Transformation du script Python en <strong>exécutable .exe</strong> via PyInstaller + WinPython (contournement de l'absence de Python sur la VM)",
              "Déploiement sur une <strong>VM de production</strong> (disque E:) avec gestion fine des droits d'accès",
              "Configuration du <strong>Planificateur de tâches Windows</strong> : lancement quotidien à 6h00 du matin",
              "Création d'un <strong>kit de livraison utilisateur</strong> : lanceur manuel <code>.bat</code> + mode d'emploi pour forcer un export ponctuel",
            ],
            difficulty: {
              title: "Difficulté principale",
              text: "La VM de production n'avait pas Python installé et les <strong>GPO</strong> bloquaient toute installation logicielle. Solution : transformation du script en <strong>exécutable autonome (.exe)</strong> via PyInstaller et WinPython portable — aucune dépendance externe, aucune installation requise.",
            },
          },
        ],
      },
      {
        id: "bilan",
        tag: "/ 04 — BILAN",
        title: "Compétences acquises",
        html: `
          <p>
            Stage de <strong>6 semaines complètes</strong> chez un
            grossiste industriel, qui m'a permis de développer un projet
            ETL complet de bout en bout (conception, développement,
            tests, industrialisation, déploiement) tout en touchant à de
            multiples technologies du data engineering.
          </p>

          <h4 class="stage-subhead">Compétences techniques</h4>
          <p>
            <strong>Data engineering &amp; ETL</strong> — conception et
            développement d'un pipeline ETL complet (extraction SQL,
            transformation via vues, chargement Excel), architecture
            <strong>SQL-first</strong> pour faciliter la maintenance,
            gestion d'historique pour éviter les doublons.
          </p>
          <p>
            <strong>SQL Server</strong> — exploration de bases complexes,
            création de vues, requêtes avec jointures et agrégations,
            migration test → production, gestion des écarts de comptage.
          </p>
          <p>
            <strong>Python</strong> — scripts ETL, connexion BDD,
            manipulation de fichiers Excel, comparaison de jeux de
            données, transformation en exécutable autonome via
            <strong>PyInstaller</strong> + WinPython.
          </p>
          <p>
            <strong>Scripting système</strong> — PowerShell (audit ACL et
            génération HTML), Google Apps Script (synchronisation Drive
            avec triggers automatiques), fichiers <code>.bat</code> pour
            les lanceurs utilisateurs.
          </p>
          <p>
            <strong>Middleware</strong> — analyse approfondie de WSO2
            (séquences, endpoints, code) et prise en main de Talend Cloud
            Data Integration en vue d'une migration.
          </p>

          <h4 class="stage-subhead">Compétences méthodologiques</h4>
          <p>
            <strong>Conduite de projet</strong> — participation à la
            planification (réunions de cadrage, comités projet), passage
            en revue semestriel des projets, points réguliers avec le
            maître de stage et l'éditeur externe (NextDecision).
          </p>
          <p>
            <strong>Approche itérative</strong> — première version du
            script en Python pur, refactoring en architecture SQL-first
            pour la maintenabilité, puis industrialisation finale. Chaque
            version validée avec mon maître de stage avant de passer à la suivante.
          </p>
          <p>
            <strong>Documentation</strong> — rédaction de tutoriels pour
            les collègues, kit de livraison utilisateur avec mode
            d'emploi, schémas d'architecture (cheminement des données),
            cahier de recette pour A3PDM.
          </p>

          <h4 class="stage-subhead">Résultat final</h4>
          <p>
            Le stage s'est conclu avec un <strong>pipeline ETL
            100% autonome</strong> en production : extraction quotidienne
            automatique à 6h00 des nouveaux articles Divalto, gestion
            d'historique pour éviter les doublons, et fichier Excel prêt
            à l'import dans A3PDM dès le début de la journée. Plus de
            50 000 articles importés au total (12 000 invalidés +
            40 000 validés), et plusieurs scripts utilitaires
            supplémentaires déployés en interne.
          </p>
        `,
      },
    ],
  },
};
