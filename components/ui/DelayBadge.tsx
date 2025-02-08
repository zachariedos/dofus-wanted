import { Tooltip, TooltipContent, TooltipProvider, TooltipRoot, TooltipTrigger } from './tooltip';
import NumberFlow from '@number-flow/react';
import { useTranslation } from 'react-i18next';

interface DelayBadgeProps {
	lastSeenAt: Date | null;
	minDelay: number;
	maxDelay: number;
}

const formatTime = (date: Date) => {
	return date.toLocaleTimeString('fr-FR', {
		hour: '2-digit',
		minute: '2-digit'
	});
};
const DelayBadge = ({ lastSeenAt, minDelay, maxDelay }: DelayBadgeProps) => {
	const { t } = useTranslation();
	if (!lastSeenAt) {
		return (
			<div className="absolute top-2 left-2 bg-black/80 px-3 py-1 rounded-full z-10">
				<span className="font-bold text-gray-500">?</span>
			</div>
		);
	}

	const now = Date.now();
	const timeSinceLastSeen = (now - lastSeenAt.getTime()) / (1000 * 60);
	const timeUntilMinReappear = minDelay - timeSinceLastSeen;
	const timeUntilMaxReappear = maxDelay - timeSinceLastSeen;
	const minReappearTime = new Date(lastSeenAt.getTime() + minDelay * 60 * 1000);
	const maxReappearTime = new Date(lastSeenAt.getTime() + maxDelay * 60 * 1000);

	const getTimeDisplay = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = Math.floor(minutes % 60);

		return (
			<span className={'inline-flex items-center'}>
        {hours > 0 && <NumberFlow value={hours} prefix="~" suffix={'h'} />}
				{(mins > 0 || hours === 0) && (
					<NumberFlow value={mins} prefix={hours > 0 ? '' : '~'} suffix={'m'} />
				)}
      </span>
		);
	};

	const getDelayDisplay = () => {
		if (timeSinceLastSeen > maxDelay) return '?';
		if (timeSinceLastSeen < minDelay) {
			return getTimeDisplay(timeUntilMinReappear);
		}
		return getTimeDisplay(timeUntilMaxReappear);
	};

	const getDelayColor = () => {
		if (timeSinceLastSeen > maxDelay) return 'text-gray-500';
		return timeSinceLastSeen < minDelay ? 'text-red-500' : 'text-green-500';
	};

	const getTooltipText = () => {
		const baseText = t('common:apparition.last_seen_at', { time: formatTime(lastSeenAt) });

		if (timeSinceLastSeen > maxDelay) {
			return `${baseText}\n${t('common:apparition.any_time')}`;
		}

		if (timeSinceLastSeen < minDelay) {
			return `${baseText}\n${t('common:apparition.min_delay', { time: formatTime(minReappearTime) })}`;
		}

		return `${baseText}\n${t('common:apparition.max_delay', { time: formatTime(maxReappearTime) })}`;
	};

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipRoot useTouch>
					<TooltipTrigger asChild>
						<div className="absolute top-2 left-2 bg-black/80 px-3 py-1 rounded-full z-10">
            <span className={`font-bold ${getDelayColor()}`}>
              {getDelayDisplay()}
            </span>
						</div>
					</TooltipTrigger>
				</TooltipRoot>
				<TooltipContent>
					<p className="whitespace-pre-line">{getTooltipText()}</p>
				</TooltipContent>
			</Tooltip>

		</TooltipProvider>
	);
};

export default DelayBadge;