import Notification from 'src/data/Notification';
import usePage from 'src/hooks/UsePage';

export default function useNotification() {
	return usePage<Notification>('notification/page');
}
