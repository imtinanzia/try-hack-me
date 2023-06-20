import { useContext } from 'react';
import { SettingsContext } from '../context';
import type { SettingsContextValue } from '../context';

const useSettings = (): SettingsContextValue => useContext(SettingsContext);

export default useSettings;
