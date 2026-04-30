import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../../shared/components/navbar.component';

@Component({
  selector: 'app-privacy-policy-page',
  templateUrl: './privacy-policy-page.component.html',
  styleUrl: './privacy-policy-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavbarComponent],
})
export class PrivacyPolicyPageComponent {
  private readonly router = inject(Router);

  goBack(): void {
    void this.router.navigate(['/']);
  }

  readonly lastUpdated = '29 avril 2026';

  readonly dataCategories = [
    {
      title: '3.1 Données d\'identification et de contact',
      items: ['Nom et prénom', 'Adresse électronique', 'Numéro de téléphone (optionnel)', 'Photographie de profil (optionnel)'],
    },
    {
      title: '3.2 Données de connexion et d\'authentification',
      items: [
        'Identifiant unique (UUID)',
        'Mot de passe (stocké sous forme hachée avec sel - jamais en clair)',
        'Jetons d\'authentification (session, refresh token)',
        'Date et heure de la dernière connexion',
        'Adresse IP lors de la connexion',
      ],
    },
    {
      title: '3.3 Données de navigation et d\'usage',
      items: [
        'Adresse IP',
        'Type et version du navigateur',
        'Système d\'exploitation',
        'Pages consultées et durée de consultation',
        'Actions effectuées sur la Plateforme (clics, recherches, interactions)',
        'Journaux d\'événements techniques (logs applicatifs)',
      ],
    },
    {
      title: '3.4 Données de contenu et d\'usage de la plateforme',
      items: [
        'Publications, commentaires et contributions soumis par l\'Utilisateur',
        'Paramètres et préférences enregistrés',
        'Historique d\'activité sur la Plateforme',
      ],
    },
    {
      title: '3.5 Données collectées automatiquement',
      items: ['Cookies fonctionnels et analytiques (voir section 8)', 'Données issues des outils d\'analyse d\'audience'],
    },
  ];

  readonly purposesTable = [
    { purpose: 'Création et gestion du compte utilisateur', basis: 'Exécution du contrat (art. 6.1.b)', duration: 'Durée de vie du compte + 3 ans après clôture' },
    { purpose: 'Authentification et sécurité des accès', basis: 'Intérêt légitime (art. 6.1.f)', duration: '12 mois glissants (logs de connexion)' },
    { purpose: 'Fourniture des fonctionnalités de la Plateforme', basis: 'Exécution du contrat (art. 6.1.b)', duration: 'Durée de vie du compte' },
    { purpose: 'Amélioration de la Plateforme et analyse d\'usage', basis: 'Intérêt légitime (art. 6.1.f)', duration: '25 mois (données analytiques agrégées)' },
    { purpose: 'Communication par courriel (notifications transactionnelles)', basis: 'Exécution du contrat (art. 6.1.b)', duration: 'Durée de vie du compte' },
    { purpose: 'Communication marketing (newsletters, offres)', basis: 'Consentement (art. 6.1.a)', duration: '3 ans à compter du dernier consentement actif' },
    { purpose: 'Respect des obligations légales et comptables', basis: 'Obligation légale (art. 6.1.c)', duration: '10 ans (pièces comptables) - art. L. 123-22 C. com.' },
    { purpose: 'Gestion des demandes et réclamations', basis: 'Intérêt légitime (art. 6.1.f)', duration: '5 ans à compter de la clôture du dossier' },
    { purpose: 'Lutte contre la fraude et la sécurité informatique', basis: 'Intérêt légitime (art. 6.1.f)', duration: '12 mois (logs) - 5 ans en cas d\'incident avéré' },
    { purpose: 'Cookies analytiques (avec consentement)', basis: 'Consentement (art. 6.1.a)', duration: '13 mois maximum' },
    { purpose: 'Conservation des publications après suppression logique (modération, litiges)', basis: 'Intérêt légitime (art. 6.1.f)', duration: '1 an après suppression logique, puis destruction physique' },
  ];

  readonly retentionItems = [
    { label: 'Données de facturation et contractuelles', duration: '10 ans (art. L. 123-22 du Code de commerce)' },
    { label: 'Données relatives à un litige', duration: 'jusqu\'à l\'expiration des délais de prescription (5 ans - art. 2224 du Code civil)' },
    { label: 'Journaux de connexion', duration: '12 mois, puis suppression automatique' },
    { label: 'Journaux d\'incidents de sécurité', duration: '12 mois, ou 5 ans en cas d\'incident avéré' },
  ];

  readonly userRights = [
    { article: '15', title: 'Droit d\'accès', description: 'Obtenir la confirmation que nous traitons vos données ainsi qu\'une copie des données vous concernant.' },
    { article: '16', title: 'Droit de rectification', description: 'Demander la correction de données inexactes ou incomplètes.' },
    { article: '17', title: 'Droit à l\'effacement', description: 'Demander la suppression de vos données lorsque leur traitement n\'est plus nécessaire ou est illicite.' },
    { article: '18', title: 'Droit à la limitation', description: 'Demander la limitation du traitement en cas de contestation d\'exactitude ou d\'opposition en cours.' },
    { article: '20', title: 'Droit à la portabilité', description: 'Recevoir vos données dans un format structuré et lisible par machine pour les transmettre à un autre responsable.' },
    { article: '21', title: 'Droit d\'opposition', description: 'Vous opposer à tout moment aux traitements fondés sur l\'intérêt légitime, notamment à des fins de prospection.' },
    { article: '7', title: 'Retrait du consentement', description: 'Retirer votre consentement à tout moment sans remettre en cause la licéité des traitements antérieurs.' },
    { article: '↗', title: 'Directives post-mortem', description: 'Définir des directives relatives à la conservation, l\'effacement et la communication de vos données après votre décès.' },
  ];

  readonly sharingItems = [
    {
      title: '7.1 Sous-traitants techniques',
      content: 'Nous faisons appel à des prestataires techniques (hébergement, envoi de courriels, analyse d\'audience) liés par des clauses contractuelles garantissant la protection de vos données. Ils n\'ont pas le droit de les utiliser à d\'autres fins.',
    },
    {
      title: '7.2 Obligations légales',
      content: 'Nous pouvons divulguer vos données aux autorités compétentes lorsque la loi nous y oblige, notamment en réponse à une réquisition judiciaire.',
    },
    {
      title: '7.3 Protection des droits',
      content: 'En cas de fraude, de menace pour la sécurité ou de violation de nos Conditions Générales d\'Utilisation, nous pouvons communiquer les données nécessaires à l\'exercice ou à la défense de nos droits légaux.',
    },
    {
      title: '7.4 Transferts hors Union européenne',
      content: 'Certains sous-traitants peuvent être établis hors de l\'UE. Les transferts sont encadrés par des garanties appropriées : clauses contractuelles types, décision d\'adéquation ou certification reconnue (ex. Data Privacy Framework). La liste est disponible sur demande auprès de notre DPO.',
    },
  ];

  readonly cookiesTable = [
    { category: 'Strictement nécessaires', name: 'session_id', purpose: 'Gestion de la session utilisateur', duration: 'Session', consent: false },
    { category: 'Sécurité', name: 'csrf_token', purpose: 'Protection contre les attaques CSRF', duration: 'Session', consent: false },
    { category: 'Préférences', name: 'ui_prefs', purpose: 'Mémorisation des préférences d\'affichage (thème, langue)', duration: '12 mois', consent: false },
    { category: 'Analytiques', name: '_ga, _gid', purpose: 'Mesure d\'audience anonymisée', duration: '13 mois', consent: true },
  ];

  readonly securityMeasures = [
    'Chiffrement des communications via HTTPS/TLS',
    'Hachage des mots de passe avec sel (algorithme bcrypt ou équivalent)',
    'Contrôle d\'accès strict aux données par rôle (principe du moindre privilège)',
    'Journalisation des accès aux données sensibles',
    'Sauvegardes chiffrées avec rotation automatique tous les 90 jours',
    'Tests de pénétration et audits de sécurité réguliers',
    'Formation des équipes aux bonnes pratiques de protection des données',
  ];
}
