import { useContext } from 'react';
import { MeContext } from 'src/context/MeProvider';

export default function useMe() {
	return useContext(MeContext);
}
