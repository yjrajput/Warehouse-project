import { useState } from "react";
import {useInventory} from '../contextAPI/InventoryContext'
import { Settings as SettingsIcon, Bell, Palette, Save } from 'lucide-react';
import SettingCard from "../components/SettingCard";
const Settings = () => {
  const { settings, updateSettings } = useInventory();
  const [localSettings, setLocalSettings] = useState(settings);

  // const handleSave = () => {
  //   updateSettings(localSettings);
  // };

  // const handleReset = () => {
  //   setLocalSettings(settings);
  //   toast.info('Settings reset to saved values');
  // };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-600">
          Customize your warehouse tracking preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SettingCard heading="Alert Notifications" paragraph={"Configure how you receive low stock alerts"} alertmessage={"Sound Alerts"} alertPara={"Play a sound when low stock alerts are triggered"} localSettings={localSettings} setLocalSettings={setLocalSettings} inputText={"Default Reorder Threshold"} inputPara={"Default threshold for new products"} icon = {Bell}/>


          <SettingCard heading="Appearance" paragraph={"Customize the look and feel of your dashboard"} alertmessage={"Dark Mode"} alertPara={"Switch between light and dark theme"} localSettings={localSettings} setLocalSettings={setLocalSettings} inputText={"Default Reorder Threshold"} inputPara={"Default threshold for new products"} icon = {SettingsIcon}/>


          
      </div>
    </div>
  )
}

export default Settings