'use client';
import {
	AdjustmentsHorizontalIcon,
	XMarkIcon,
} from '@heroicons/react/24/solid';
import { useState } from 'react';
import { RecordingStatus } from './VoiceRecorder';
import { useAudioDevices } from './useAudioDevices';

export default function RecorderSettings({
	currentDeviceId,
	setCurrentDeviceId,
	disabled = false,
	recordingStatus,
}: {
	currentDeviceId: string | undefined;
	setCurrentDeviceId: (deviceId: string) => void;
	disabled?: boolean;
	recordingStatus: RecordingStatus;
}) {
	const { deviceList } = useAudioDevices(recordingStatus);
	const [showRecordingSettings, setShowRecordingSettings] = useState(false);

	return (
		<>
			{showRecordingSettings && (
				<select
					value={currentDeviceId}
					onChange={(e) => {
						setCurrentDeviceId(e.target.value);
						setTimeout(() => {
							setShowRecordingSettings(false);
						}, 200); //delay to
					}}
					className='max-w-[200px] animate-fadeIn-slow rounded border-none bg-elevation-light-3 ring-1 placeholder:text-text-light-disable focus:outline-0 focus:ring-1 dark:bg-elevation-dark-3 dark:text-text-dark-steel placeholder:dark:text-text-dark-dim xs:max-w-[290px] sm:max-w-none'
				>
					{deviceList.map((device) => (
						<option key={device.deviceId} value={device.deviceId}>
							{device.label}
						</option>
					))}
				</select>
			)}
			<button
				type='button'
				onClick={() => {
					setShowRecordingSettings(!showRecordingSettings);
				}}
				disabled={disabled || deviceList.length === 0} //iphone sometimes doesn't show any devices for some reason
				className={
					'text-text-light-dim disabled:text-slate-300 dark:text-text-dark-dim dark:disabled:text-elevation-dark-5'
				}
			>
				{showRecordingSettings ? (
					<XMarkIcon className='w-icon-standard ' />
				) : (
					<AdjustmentsHorizontalIcon className='w-icon-standard' />
				)}
			</button>
		</>
	);
}
