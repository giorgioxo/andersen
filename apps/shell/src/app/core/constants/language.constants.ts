import { ILanguageOption, Language } from '../models/language.model';

export const DEFAULT_LANGUAGE = Language.English;

export const LANGUAGE_OPTIONS: ILanguageOption[] = [
  {
    value: Language.English,
    label: 'English',
  },
  {
    value: Language.Russian,
    label: 'Русский',
  },
  {
    value: Language.Georgian,
    label: 'ქართული',
  },
];
