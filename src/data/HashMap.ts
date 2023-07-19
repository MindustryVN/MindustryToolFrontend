interface IHash<V> {
	[map: string]: V;
}

class TimeOject<T> {
	time: number;
	object: T;

	constructor(time: number, object: T) {
		this.time = time;
		this.object = object;
	}
}

export class HashMap<V> {
	map: IHash<TimeOject<V>> = {};

	put(key: string, value: V): V {
		this.map[key] = new TimeOject(new Date().getMilliseconds(), value);
		return value;
	}

	get(key: string): V {
		return this.map[key].object;
	}

	ensureSize(size: number) {
		let mapSize = Object.keys(this.map).length;
		if (mapSize > size) {
            let m = Number.MAX_VALUE;
            let k ;
            for (let key in Object.keys(this.map)) {
                if (this.map[key].time < m){
                    m = this.map[key].time;
                    k = key 
                }
            }

            if (k){
                delete this.map[k];
            }
        }
	}


}
