import { useContext } from 'react';
import { NotificationContext } from 'src/context/NotificationProvider';

export default function useNotification() {
	return useContext(NotificationContext);
}
