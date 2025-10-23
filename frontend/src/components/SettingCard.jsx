import React from 'react'

const SettingCard = ({heading, paragraph, alertmessage, alertPara, localSettings, setLocalSettings, inputText, inputPara , icon : Icon}) => {
  return (
    <div className="rounded-xl  bg-white shadow-sm p-5 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          { Icon && <Icon className="h-5 w-5 text-orange-500" />}
          <h2 className="text-lg font-semibold text-gray-900">{heading}</h2>
        </div>
        <p className="text-sm text-gray-500">
          {paragraph}
        </p>
      </div>

      {/* Sound Alerts */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-sm font-medium text-gray-700">{alertmessage}</label>
          <p className="text-sm text-gray-500">
            {alertPara}
          </p>
        </div>
        <input
          type="checkbox"
          checked={localSettings.alertSound}
          onChange={(e) =>
            setLocalSettings({ ...localSettings, alertSound: e.target.checked })
          }
          className="h-5 w-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="threshold" className="text-sm font-medium text-gray-700">
          {inputText}
        </label>
        <input
          id="threshold"
          type="number"
          min="0"
          value={localSettings.defaultThreshold}
          onChange={(e) =>
            setLocalSettings({
              ...localSettings,
              defaultThreshold: parseInt(e.target.value) || 0,
            })
          }
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
        />
        <p className="text-sm text-gray-500">
          {inputPara}
        </p>
      </div>
    </div>
  )
}

export default SettingCard