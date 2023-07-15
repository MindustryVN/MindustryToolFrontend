import { UserLike } from 'src/components/like/UserLike';

export interface LikeChange {
	amount: number;
	userLike: UserLike;
}
