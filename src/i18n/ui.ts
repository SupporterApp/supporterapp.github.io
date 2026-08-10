// src/i18n/ui.ts
export const languages = {
  ca: 'Català',
  es: 'Castellà',
  en: 'English',
};

export const defaultLang = 'ca';

export const ui = {
  ca: {
    'nav.home': 'Inici',
    'nav.blog': 'Blog',
    'nav.about': 'Sobre nosaltres',
    'nav.legal': 'Legal',
    'nav.help': 'Ajuda',
    'legal.privacy': 'Privacitat',
    'legal.notice': 'Avís Legal',
    'legal.terms': 'Termes',
    'help.home': 'Inici',
    'help.attend': 'Assistència',
    'help.progress': 'Progrés',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.blog': 'Blog',
    'nav.about': 'Sobre nosotros',
    'nav.legal': 'Legal',
    'nav.help': 'Ayuda',
    'legal.privacy': 'Privacidad',
    'legal.notice': 'Aviso Legal',
    'legal.terms': 'Términos',
    'help.home': 'Inicio',
    'help.attend': 'Asistencia',
    'help.progress': 'Progreso',
  },
  en: {
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.about': 'About us',
    'nav.legal': 'Legal',
    'nav.help': 'Help',
    'legal.privacy': 'Privacy',
    'legal.notice': 'Legal Notice',
    'legal.terms': 'Terms',
    'help.home': 'Home',
    'help.attend': 'Attendance',
    'help.progress': 'Progress',
  },
} as const;

// Funció per obtenir la traducció segons l'idioma
export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui.ca) {
    return ui[lang]?.[key] ?? ui[defaultLang][key];
  };
}