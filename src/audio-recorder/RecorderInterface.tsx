import clsx from 'clsx';

export default function RecorderInterface({
	Microphone,
	RecorderSettings,
}: {
	Microphone: React.ReactNode;
	RecorderSettings: React.ReactNode;
}) {
	return (
		<>
			<div className='flex shrink-0 justify-center gap-2 rounded-md p-2 lg:gap-4'>
				<div
					className={clsx(
						'p-auto flex h-16 w-16 content-center justify-center rounded-full border border-elevation-light-5 shadow-md dark:border-none dark:bg-elevation-dark-5'
					)}
				>
					{Microphone}
				</div>
				{RecorderSettings}
			</div>
		</>
	);
}
