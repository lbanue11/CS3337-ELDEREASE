import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, Select, MenuItem } from '@mui/material';

// Map language codes to their display names
const languageMap = {
  'en': 'English',
  'es': 'Español',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'vi': 'Tiếng Việt',
  'ja': '日本語',
  'ko': '한국어',
  'tl': 'Tagalog',
  'hy': 'Հայերեն', // Armenian
  'fa': 'فارسی',   // Persian (Farsi)
  'ru': 'Русский', // Russian
  'th': 'ไทย'      // Thai
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (event) => {
    const selectedLanguageCode = event.target.value;
    i18n.changeLanguage(selectedLanguageCode);
  };

  // Get the list of supported language codes from i18next config
  // Filter out 'cimode' which is a special i18next development language code
  const supportedLngs = (i18n.options.supportedLngs || []).filter(
    (lng) => lng !== 'cimode'
  );

  // Determine the current value for the Select component
  const fallbackLng = i18n.options.fallbackLng || 'en'; // Get fallback from config
  // Check if the current language is directly supported. If not, use the fallback.
  const currentValue = supportedLngs.includes(i18n.language) ? i18n.language : fallbackLng;

  return (
    <FormControl
        size="small"
        variant="outlined"
        className="language-switcher"
        sx={{ minWidth: 100, backgroundColor: 'transparent' }}
     >
      <Select
        value={currentValue}
        onChange={handleLanguageChange}
        MenuProps={{
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
          transformOrigin: { vertical: "top", horizontal: "left" },
        }}
        sx={{
           color: 'inherit',
           '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.23)' },
           '.MuiSvgIcon-root': { color: 'action.active' }
        }}
      >
        {/* Dynamically generate MenuItems from supported languages */}
        {supportedLngs.map((lngCode) => (
          <MenuItem key={lngCode} value={lngCode}>
            {/* Use the display name from languageMap, or the code itself as fallback */}
            {languageMap[lngCode] || lngCode}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;