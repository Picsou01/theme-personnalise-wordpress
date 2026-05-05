# Guide de rendu - Virealys

Projet : Virealys, restaurant slow food holographique adaptatif.
Mention obligatoire : le site doit afficher clairement qu'il s'agit d'un site pedagogique et fictif.

## 1. Creation

- Site CMS actif : WordPress avec front-office et back-office.
- Page d'accueil : montrer la mention "site pedagogique et fictif".
- Hydratation : creer plusieurs pages et au moins 3 articles complets.
- Sujet unique : restaurant slow food holographique adaptatif, pas un restaurant slow food generique.

Pages a avoir :
- Accueil
- Concept
- Menus
- Zones
- Pays du mois
- Passeport
- Reservation
- Jeu bonus
- Partenariat HoLazyV
- Dossier TP

Articles a avoir :
- Slow Food holographique : garder le gout au centre
- Pays du mois : Japon nocturne
- Campagne emailing : faire revenir les clients

## 2. Objectif, USP, KPI, SWOT

Objectif du site :
- Presenter un concept fictif credible.
- Inciter a reserver.
- Prouver l'USP par le contenu, les visuels, les menus, le passeport et le jeu bonus.

USP a expliquer :
- Restaurant slow food adaptatif.
- Repas normal jusqu'a experience gastronomique plus premium.
- Decoration holographique.
- Sections inspirees de plusieurs pays.
- Option VR pour manger dans l'environnement de son choix.
- Bouchees d'air aromatique et hologrammes comestibles comme experience sensorielle fictive.

KPI recommandes :
- Taux de clic vers la reservation.
- Nombre d'inscriptions newsletter / demandes de passeport.

SWOT a mettre dans le dossier :
- Forces : concept original, differenciation, experience memorable, contenu renouvelable.
- Faiblesses : concept fictif complexe, besoin d'expliquer simplement, cout technique eleve.
- Opportunites : reseaux sociaux, tourisme local, reservations thematiques, partenariats producteurs.
- Menaces : concurrents immersifs, scepticisme sur la VR, problemes de performance si le site est trop lourd.

## 3. Referencement SEO

Extension conseillee :
- Rank Math SEO ou Yoast SEO.

Actions a montrer :
- Titre SEO de l'accueil avec "restaurant slow food holographique".
- Meta-description claire.
- Schema LocalBusiness / Restaurant.
- Sitemap XML actif.
- Mots-cles dans les pages : slow food holographique, restaurant immersif, restaurant VR, passeport gastronomique.

Captures a fournir :
- Ecran du plugin SEO.
- Apercu du titre/meta-description.
- Score ou analyse SEO d'une page.

## 4. Referencement local

A faire :
- Creer une fiche Google Business Profile fictive ou pedagogique si autorise.
- Ajouter nom, categorie, adresse, horaires, telephone, site web, photos.
- Ajouter la meme adresse dans le footer et la page Reservation.

Champs geographiques :
- Ville / quartier.
- Zone desservie.
- Acces transport.
- Parking / accessibilite.

Captures a fournir :
- Vue administrateur de la fiche.
- Vue client de la fiche.
- Footer ou page Reservation avec adresse coherente.

## 5. Site web, ergonomie, netlinking, benchmark

UI/UX a expliquer :
- Navigation classique par pages.
- Roue de navigation conservee sur desktop par clic droit.
- Parcours simple : decouvrir, choisir un menu, reserver.
- Mobile : lecture verticale et boutons larges.

Elements d'ergonomie a montrer :
- Cartes de menus avec prix visibles.
- Zones par intensite.
- Bouton reservation toujours facile a trouver.
- Images compressees en WebP.

Backlink :
- Le backlink retenu est une cooperation mutuelle avec HoLazyV : https://www.holazyv.labo.infochartreux.fr/
- La page Virealys dediee est `partenariat-holazyv`.
- Ajouter en retour un lien depuis HoLazyV vers Virealys.
- Expliquer que le backlink aide l'autorite SEO, la decouverte locale et le maillage entre projets pedagogiques.

Benchmark local / distant :
- Local : comparer le site en localhost ou environnement de test.
- Distant : comparer le site deploye.
- Outils possibles : PageSpeed Insights, Lighthouse, GTmetrix, WebPageTest.
- Mesurer : performance, accessibilite, bonnes pratiques, SEO, poids des images, temps de chargement.

## 6. Presence responsable sans reseaux sociaux commerciaux

Position Virealys :
- L'entreprise assume de ne pas utiliser les reseaux sociaux commerciaux.
- Justification : refus de l'economie de l'attention, de la collecte massive de donnees et de l'enrichissement de plateformes publicitaires fondees sur le temps disponible des utilisateurs.
- Coherence avec le slow food : Virealys defend le temps long, la presence, le gout, la relation directe et la sobriete.

Canaux de remplacement :
- Site WordPress proprietaire.
- SEO naturel.
- Google Business Profile.
- Newsletter opt-in.
- Backlinks partenaires.
- Evenements en salle et bouche-a-oreille reel.

Captures a fournir :
- Page du dossier expliquant le refus assume des reseaux sociaux.
- Backlink HoLazyV + lien retour.
- Fiche Google Business Profile.
- Statistiques emailing / Analytics / Site Kit.
- Si le professeur exige absolument un reseau social : creer une page minimale pedagogique, sans publicite payante, avec redirection vers le site officiel.

## 7. Marketing emailing

Logiciel conseille :
- MailPoet si tu veux tout faire dans WordPress.
- Brevo si tu veux un outil emailing/CRM externe plus complet.

Objectif de campagne :
- Faire revenir les visiteurs pour le "Pays du mois : Japon nocturne".
- Convertir l'interet pour le passeport ou le jeu bonus en reservation.

Base CSV :
- Utilise le fichier `docs/emailing/base_clients_virealys.csv`.
- Champs importants : email, prenom, age, sexe, segment, zone_interet, pays_prefere, consentement, niveau_passeport.
- Source actuelle : fichier `Dev presence en ligne.xlsx`, adapte en base emailing pour le TP.

Segmentation :
- Curieux : n'ont pas encore reserve.
- Clients : deja venus au moins une fois.
- Passeport : interesses par recompenses et jeu bonus.

Mailing smart mailing :
- Objet personnalise.
- Contenu adapte au segment.
- CTA vers reservation.
- Mention du passeport.

Captures a fournir :
- Base CSV.
- Import dans le logiciel.
- Template du mail.
- Mail recu par un client.
- Statistiques : envoyes, ouvertures, clics.

## Extensions WordPress a installer

Prioritaires pour les points :
- Rank Math SEO : SEO, meta, sitemap, schema. Lien officiel : https://wordpress.org/plugins/seo-by-rank-math/
- Site Kit by Google : Analytics, Search Console, PageSpeed dans WordPress. Lien officiel : https://wordpress.org/plugins/google-site-kit/
- MailPoet ou Brevo : emailing, import CSV, campagne, statistiques. Liens officiels : https://wordpress.org/plugins/mailpoet/ et https://wordpress.org/plugins/mailin/
- Fluent Forms : formulaire de contact/reservation pedagogique. Lien officiel : https://wordpress.org/plugins/fluentform/

Utiles :
- GamiPress : points, badges, recompenses si tu veux relier le passeport a WordPress. Lien officiel : https://wordpress.org/plugins/gamipress/
- Complianz : bandeau cookies et politique RGPD. Lien officiel : https://wordpress.org/plugins/complianz-gdpr/
- LiteSpeed Cache : performance, seulement si l'hebergement le supporte correctement. Lien officiel : https://wordpress.org/plugins/litespeed-cache/

## Captures finales a preparer

- Accueil avec mention site pedagogique et fictif.
- Liste des pages WordPress.
- Liste des articles WordPress.
- Front-office et back-office.
- Configuration SEO.
- Fiche Google Business Profile admin + client.
- Adresse dans le site.
- Mobile + desktop.
- Roue de navigation desktop.
- Jeu bonus.
- Backlink : page Partenariat HoLazyV + lien retour HoLazyV.
- Benchmark local et distant.
- Justification du refus des reseaux sociaux commerciaux.
- Preuves alternatives : SEO, backlink, fiche locale, newsletter, statistiques site/emailing.
- CSV clients.
- Template email.
- Import emailing.
- Statistiques emailing.

## DM2 - Rendu reflexif

Le PDF DM2 est separe du site. Il demande un rendu PDF d'environ deux pages de texte brut, avec entete, sommaire, titre, nom, pagination et une reflexion personnelle.

Contenu a traiter :
- Evolution depuis le debut d'annee.
- Experiences et apprentissages.
- Lien avec ton projet professionnel.
- Certifications qui peuvent soutenir ce projet.
- Conclusion affirmative ou infirmative, mais argumentee.
