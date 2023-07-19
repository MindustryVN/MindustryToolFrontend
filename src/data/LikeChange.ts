import { UserLike } from 'src/data/UserLike';

export interface LikeChange {
	amount: number;
	userLike: UserLike;
}
