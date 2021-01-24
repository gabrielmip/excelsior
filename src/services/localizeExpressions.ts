import type { UserConfig, Separator } from '../components/stores';

const parserLocalizationSettings: UserConfig = {
  thousandSeparator: ',',
  decimalSeparator: '.',
  locale: 'en'
};

function charToRegexString (char: Separator): string {
  if (char === '.') return '\\.';
  else return char;
}

export function removeLocalization (stringifiedExpression: string, localizationSettings: UserConfig) {
  return stringifiedExpression
    .replace(new RegExp(charToRegexString(localizationSettings.thousandSeparator), 'g'), '')
    .replace(new RegExp(charToRegexString(localizationSettings.decimalSeparator), 'g'), parserLocalizationSettings.decimalSeparator);
}

export function addLocalization (stringifiedExpression: string, localizationSettings: UserConfig) {
  return stringifiedExpression
    .replace(new RegExp(charToRegexString(parserLocalizationSettings.decimalSeparator), 'g'), localizationSettings.decimalSeparator);
}
