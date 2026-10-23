/* ============================================================
   app.js — interactions de la galerie SlowSite
   Révélation des vignettes au scroll + nuage de mots-clés.
   Plus de dépendance : les 4 helpers de UIKit sont remplacés par du JS natif.
   ============================================================ */
(function () {
  'use strict';

  /* Remplace js/vendor/ui-kit.min.js (une requête de moins). */
  function qs(sel) { return document.querySelector(sel); }
  function qsa(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  /* Vocabulaire d'indexation de la photothèque. */
  var TAGS = [
    'portrait', 'paysage', 'nature morte', 'macro', 'architecture', 'photo de rue',
    'reportage', 'documentaire', 'animalier', 'sport', 'mode', 'culinaire', 'spectacle',
    'concert', 'mariage', 'corporate', 'packshot', 'astrophotographie', 'sous-marine',
    'aérienne', 'urbex', 'industrielle', 'scolaire', 'studio', 'autoportrait', 'street art',
    'botanique', 'ornithologie', 'minéralogie', 'scène de genre', 'pose longue', 'filé',
    'bokeh', 'contre-jour', 'panoramique', 'focus stacking', 'light painting',
    'surimpression', 'sténopé', 'lomographie', 'time-lapse', 'hyperlapse', 'photogramme',
    'solarisation', 'bracketing', 'rafale', 'mise au point manuelle', 'hyperfocale',
    'profondeur de champ', 'flou de bougé', 'zoom burst', 'réflexion', 'silhouette',
    'ombre portée', 'symétrie miroir', 'levée de voile', 'prise de vue au flash',
    'seconde synchro', 'multi-exposition', 'vue éclatée', 'heure dorée', 'heure bleue',
    'lumière rasante', 'lumière diffuse', 'clair-obscur', 'éclairage Rembrandt',
    'éclairage papillon', 'lumière naturelle', 'flash déporté', 'boîte à lumière',
    'réflecteur', 'nid d\'abeille', 'gélatine colorée', 'stroboscope', 'low key',
    'high key', 'halo', 'contre-jour partiel', 'lumière d\'appoint', 'fond lumineux',
    'ombre douce', 'ombre dure', 'lumière zénithale', 'lumière latérale',
    'lumière frontale', 'pénombre', 'rétroéclairage', 'faisceau', 'diffuseur', 'snoot',
    'grand angle', 'téléobjectif', 'focale fixe', 'zoom transstandard', 'fisheye',
    'tilt-shift', 'trépied', 'monopode', 'rotule ball', 'filtre polarisant', 'filtre ND',
    'filtre dégradé', 'pare-soleil', 'télémètre', 'reflex', 'hybride', 'moyen format',
    'grand format', 'chambre photographique', 'flash cobra', 'bague allonge', 'soufflet',
    'doubleur de focale', 'déclencheur souple', 'viseur optique', 'viseur électronique',
    'carte mémoire', 'batterie de secours', 'sac photo', 'courroie', 'pellicule',
    'format 35 mm', 'format 120', 'négatif', 'diapositive', 'tirage argentique',
    'laboratoire', 'révélateur', 'fixateur', 'agrandisseur', 'planche contact',
    'papier baryté', 'papier RC', 'virage sépia', 'cyanotype', 'platinotypie',
    'gomme bichromatée', 'collodion humide', 'daguerréotype', 'sels d\'argent',
    'grain argentique', 'poussée de développement', 'bain d\'arrêt', 'séchage', 'spire',
    'cuve de développement', 'chambre noire', 'inactinique', 'chimie', 'archivage',
    'monochrome', 'sépia', 'désaturé', 'couleurs saturées', 'teintes froides',
    'teintes chaudes', 'balance des blancs', 'colorimétrie', 'étalonnage', 'courbe tonale',
    'niveaux', 'dominante bleue', 'dominante verte', 'duotone', 'trichromie', 'pastel',
    'contraste élevé', 'contraste doux', 'noir profond', 'blanc pur', 'gris neutre',
    'palette restreinte', 'complémentaires', 'camaïeu', 'teinte unique', 'virage croisé',
    'rendu cinéma', 'rendu neutre', 'rendu chaud', 'aplat', 'règle des tiers',
    'nombre d\'or', 'lignes de fuite', 'symétrie', 'cadre dans le cadre', 'point de fuite',
    'diagonale dominante', 'premier plan', 'arrière-plan', 'perspective forcée',
    'contre-plongée', 'plongée', 'hauteur d\'homme', 'cadrage serré', 'plan large',
    'plan d\'ensemble', 'gros plan', 'plan américain', 'format carré', 'format panoramique',
    'orientation portrait', 'orientation paysage', 'espace négatif', 'répétition',
    'rythme visuel', 'point focal', 'ligne d\'horizon', 'décentrage',
    'remplissage du cadre', 'hors-champ', 'montagne', 'littoral', 'forêt', 'désert',
    'ville', 'village', 'ruelle', 'marché', 'port', 'gare', 'friche', 'chantier', 'champ',
    'vignoble', 'rivière', 'cascade', 'lac', 'falaise', 'dune', 'marais', 'sentier', 'pont',
    'phare', 'moulin', 'ruines', 'cloître', 'verrière', 'escalier', 'façade', 'toiture',
    'aube', 'crépuscule', 'nuit étoilée', 'brume', 'brouillard', 'pluie', 'orage', 'neige',
    'givre', 'vent', 'ciel dégagé', 'arc-en-ciel', 'nuages bas', 'cumulus', 'éclaircie',
    'averse', 'gel matinal', 'canicule', 'embruns', 'rosée', 'halo lunaire', 'voie lactée',
    'aurore', 'éclipse', 'mirage', 'poussière', 'sable soulevé', 'reflet mouillé', 'flaque',
    'vapeur', 'recadrage', 'retouche', 'densité', 'masque de fusion', 'calque de réglage',
    'accentuation', 'réduction de bruit', 'correction optique', 'redressement', 'détourage',
    'tampon', 'correcteur localisé', 'dématriçage', 'fichier brut', 'export web',
    'profil colorimétrique', 'netteté de sortie', 'vignetage', 'aberration chromatique',
    'distorsion', 'moiré', 'clarté', 'texture', 'suppression de poussières', 'fusion HDR',
    'assemblage panoramique', 'upscaling', 'compression', 'métadonnées', 'mots-clés',
    'tirage d\'exposition', 'accrochage', 'encadrement', 'passe-partout', 'portfolio',
    'série', 'diptyque', 'triptyque', 'édition limitée', 'numérotation', 'vernissage',
    'résidence', 'commande', 'cession de droits', 'droit à l\'image', 'légende',
    'fonds photographique', 'inventaire', 'numérisation', 'conservation'
  ];

  /* Alimente les suggestions du champ de filtrage avec le vocabulaire
     d'indexation de la photothèque. */
  function buildKeywordIndex() {
    var list = qs('#motscles');
    if (!list) return;

    // On construit toutes les options hors du DOM, puis une seule insertion
    // (avant : innerHTML += dans la boucle, la liste était re-parsée à chaque tour).
    var frag = document.createDocumentFragment();
    for (var i = 0; i < TAGS.length; i++) {
      var opt = document.createElement('option');
      opt.value = TAGS[i];
      frag.appendChild(opt);
    }
    list.textContent = '';
    list.appendChild(frag);
  }

  /* Construit le calendrier d'activité : 53 semaines de 7 jours, la teinte de
     chaque case reflétant le nombre de prises de vue archivées ce jour-là. */
  function buildActivityCalendar() {
    var host = qs('#calendrier');
    if (!host) return;

    var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
                'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    var fin = new Date(Date.UTC(2026, 8, 30));
    var frag = document.createDocumentFragment();

    for (var i = 370; i >= 0; i--) {
      var jour = new Date(fin.getTime() - i * 86400000);
      var n = activite(jour);
      var cell = document.createElement('div');
      cell.className = 'cal-day';
      cell.setAttribute('data-n', String(n));
      cell.title = n === 0
        ? 'Aucune prise de vue le ' + jour.getUTCDate() + ' ' + MOIS[jour.getUTCMonth()]
        : n + ' prise' + (n > 1 ? 's' : '') + ' de vue le ' + jour.getUTCDate() +
          ' ' + MOIS[jour.getUTCMonth()];
      frag.appendChild(cell);
    }
    host.appendChild(frag);
  }

  /* Niveau d'activité d'une journée, de 0 à 4. Les sorties sont plus
     nombreuses le week-end et à la belle saison. */
  function activite(jour) {
    var j = jour.getUTCDay();
    var mois = jour.getUTCMonth();
    var graine = (jour.getUTCFullYear() * 372 + mois * 31 + jour.getUTCDate()) * 2654435761;
    var bruit = ((graine >>> 13) % 100) / 100;
    var poids = (j === 0 || j === 6 ? 0.45 : 0.12) +
                (mois >= 4 && mois <= 8 ? 0.28 : 0.05) + bruit * 0.45;
    if (poids < 0.35) return 0;
    if (poids < 0.6) return 1;
    if (poids < 0.8) return 2;
    if (poids < 0.95) return 3;
    return 4;
  }

  /* Filtre la galerie sur les mots-clés associés à chaque visuel. */
  function filterGallery() {
    var champ = qs('#q');
    var info = qs('#filter-info');
    if (!champ) return;

    var q = champ.value.trim().toLowerCase();
    var cards = qsa('.card');
    var visibles = 0;

    for (var i = 0; i < cards.length; i++) {
      var mots = (cards[i].getAttribute('data-mots') || '').toLowerCase();
      var match = !q || mots.indexOf(q) !== -1;
      cards[i].style.display = match ? '' : 'none';
      if (match) visibles++;
    }

    if (info) {
      if (!q) {
        info.textContent = '';
      } else if (!visibles) {
        // Le vocabulaire couvre tout le fonds, pas seulement cette sélection.
        info.textContent = 'Aucun visuel de la sélection pour « ' + champ.value.trim() + ' »';
      } else {
        info.textContent = visibles + ' visuel' + (visibles > 1 ? 's' : '') +
                           ' sur ' + cards.length;
      }
    }
  }

  var cards = [];
  var jours = [];
  var lastOpacity = [];

  /* Hauteur de la plus grande carte, pour garder une grille régulière.
     Toutes les lectures d'abord, puis toutes les écritures : un seul reflow.
     Appelée au démarrage, au chargement des images et au redimensionnement,
     et non plus à chaque événement scroll. */
  function alignCards() {
    var tallest = 0;
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].offsetHeight > tallest) tallest = cards[i].offsetHeight;
    }
    for (var j = 0; j < cards.length; j++) {
      cards[j].style.minHeight = tallest + 'px';
    }
  }

  /* Animation des cartes et du calendrier, mêmes règles qu'avant :
     - une carte est révélée dès que son haut passe au-dessus de (fenêtre - 40 px) ;
     - l'opacité d'une case du calendrier dépend de sa distance au milieu de l'écran.
     Différence : on fait TOUTES les lectures de position d'abord (6 cartes + les 7
     cases de la 1re colonne, car les cases sont rangées en colonnes de 7), puis
     toutes les écritures. Avant, lectures et écritures alternaient sur 377
     éléments, ce qui forçait un recalcul de la mise en page à chaque fois. */
  function updateReveal() {
    var vh = window.innerHeight;

    // 1. Lectures
    var tops = cards.map(function (c) { return c.getBoundingClientRect().top; });
    var rows = [];
    for (var r = 0; r < 7 && r < jours.length; r++) {
      var d = Math.abs(jours[r].getBoundingClientRect().top - vh / 2);
      rows.push(Math.max(0.15, 1 - d / vh));
    }

    // 2. Écritures
    for (var i = 0; i < cards.length; i++) {
      if (tops[i] < vh - 40) {
        cards[i].classList.add('visible');
        cards[i].style.transform = 'translateY(0px)';
      } else {
        cards[i].style.transform = 'translateY(24px)';
      }
    }
    for (var k = 0; k < jours.length; k++) {
      var o = rows[k % 7];
      if (lastOpacity[k] !== o) {   // on n'écrit que si la valeur change
        jours[k].style.opacity = o;
        lastOpacity[k] = o;
      }
    }
  }

  /* Au scroll : au plus un calcul par image affichée (requestAnimationFrame),
     et écoute passive pour ne pas retarder le défilement. */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateReveal();
      ticking = false;
    });
  }

  /* Affiche les images une fois chargées. */
  function watchImages() {
    qsa('.card img').forEach(function (img) {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', function () {
          img.classList.add('loaded');
          alignCards();
        });
      }
    });
  }

  // app.js est chargé en defer : le DOM est déjà prêt quand il s'exécute.
  (function init() {
    buildKeywordIndex();
    buildActivityCalendar();
    jours = qsa('.cal-day');
    watchImages();
    cards = qsa('.card');
    alignCards();
    updateReveal();
    var champ = qs('#q');
    if (champ) champ.addEventListener('input', filterGallery);
  })();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { alignCards(); onScroll(); });
  window.addEventListener('load', function () { alignCards(); updateReveal(); });
})();
