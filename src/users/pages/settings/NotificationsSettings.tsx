import { useState } from 'react';
import {
  SectionHeader,
  SettingRow,
  SettingsNote,
  BACKEND_NOTE,
  useSettings,
} from './settingsComponents';

export function NotificationsSettings() {
  const { showToast } = useSettings();
  const [pushNotifs, setPushNotifs] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [predictionResults, setPredictionResults] = useState(true);
  const [newFollowers, setNewFollowers] = useState(true);
  const [mentions, setMentions] = useState(true);
  const [messages, setMessages] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);

  const handleToggle = (setter: (v: boolean) => void, value: boolean, label: string) => {
    setter(value);
    showToast(`${label} updated locally — server sync pending`);
  };

  return (
    <div>
      <SettingsNote>{BACKEND_NOTE}</SettingsNote>

      <SectionHeader title="Push Notifications" />
      <SettingRow
        label="Enable Push Notifications"
        desc="Receive notifications on your device"
        toggle
        value={pushNotifs}
        onChange={(v) => handleToggle(setPushNotifs, v, 'Push notifications')}
      />

      <SectionHeader title="Notification Types" />
      <SettingRow
        label="Match Alerts"
        desc="Goals, results, and live updates"
        toggle
        value={matchAlerts}
        onChange={(v) => handleToggle(setMatchAlerts, v, 'Match alerts')}
      />
      <SettingRow
        label="Prediction Results"
        desc="When tipsters post results"
        toggle
        value={predictionResults}
        onChange={(v) => handleToggle(setPredictionResults, v, 'Prediction results')}
      />
      <SettingRow
        label="New Followers"
        desc="When someone follows you"
        toggle
        value={newFollowers}
        onChange={(v) => handleToggle(setNewFollowers, v, 'New followers')}
      />
      <SettingRow
        label="Mentions & Replies"
        desc="When someone mentions or replies to you"
        toggle
        value={mentions}
        onChange={(v) => handleToggle(setMentions, v, 'Mentions')}
      />
      <SettingRow
        label="Messages"
        desc="New direct messages"
        toggle
        value={messages}
        onChange={(v) => handleToggle(setMessages, v, 'Messages')}
      />

      <SectionHeader title="Email" />
      <SettingRow
        label="Email Notifications"
        desc="Receive updates via email"
        toggle
        value={emailNotifs}
        onChange={(v) => handleToggle(setEmailNotifs, v, 'Email notifications')}
      />
    </div>
  );
}
