import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SectionHeader,
  SettingRow,
  SettingsNote,
  BACKEND_NOTE,
  useSettings,
} from './settingsComponents';

export function PrivacySettings() {
  const navigate = useNavigate();
  const { showToast } = useSettings();
  const [privateAccount, setPrivateAccount] = useState(false);
  const [showActivity, setShowActivity] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);
  const [showPredictions, setShowPredictions] = useState(true);

  const handleToggle = (setter: (v: boolean) => void, value: boolean, label: string) => {
    setter(value);
    showToast(`${label} updated locally — server sync pending`);
  };

  return (
    <div>
      <SettingsNote>{BACKEND_NOTE}</SettingsNote>

      <SectionHeader title="Account Privacy" />
      <SettingRow
        label="Private Account"
        desc="Only approved followers can see your posts"
        toggle
        value={privateAccount}
        onChange={(v) => handleToggle(setPrivateAccount, v, 'Private account')}
      />
      <SettingRow
        label="Show Activity Status"
        desc="Let others see when you were last active"
        toggle
        value={showActivity}
        onChange={(v) => handleToggle(setShowActivity, v, 'Activity status')}
      />

      <SectionHeader title="Interactions" />
      <SettingRow
        label="Allow Direct Messages"
        desc="Anyone can send you messages"
        toggle
        value={allowMessages}
        onChange={(v) => handleToggle(setAllowMessages, v, 'Direct messages')}
      />
      <SettingRow
        label="Show Predictions Publicly"
        desc="Others can see your prediction history"
        toggle
        value={showPredictions}
        onChange={(v) => handleToggle(setShowPredictions, v, 'Prediction visibility')}
      />

      <SectionHeader title="Manage Lists" />
      <SettingRow
        label="Blocked Accounts"
        desc="Manage blocked users"
        onClick={() => navigate('/settings/privacy/blocked')}
      />
      <SettingRow
        label="Muted Accounts"
        desc="Manage muted users"
        onClick={() => navigate('/settings/privacy/muted')}
      />
    </div>
  );
}
