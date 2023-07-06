import '../../styles.css';
import './UserPage.css';

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../../API';
import UserData from '../../components/user/UserData';
import LoadingSpinner from '../../components/loader/LoadingSpinner';

export default function UserPage() {
	const { userId } = useParams();

	const [loading, setLoading] = React.useState(true);

	const [user, setUser] = React.useState<UserData>();

	useEffect(() => {
		API.REQUEST.get(`user/${userId}`) //
			.then((result) => setUser(result.data)) //
			.finally(() => setLoading(false));
	}, []);

	if (loading)
		return (
			<main className='flex-center h100p w100p'>
				<LoadingSpinner />
			</main>
		);

	if (!user) return <main className='flex-center h100p w100p'>User not found</main>;

	return (
		<main className='flex-column h100p w100p'>
			<section className='user-card flex-row small-gap'>
				<img className='avatar-image' src={user.imageUrl} alt='avatar'></img>
				<section className='info-card small-gap small-padding'>
					<span className='capitalize username'>{user.name}</span>
					<span className='flex-row small-gap'>
						{user.role.map((r, index) => (
							<span key={index} className='capitalize'>
								{r}
							</span>
						))}
					</span>
				</section>
			</section>
		</main>
	);
}
