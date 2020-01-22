function cloneDecorators(from, to) {
	Reflect.getMetadataKeys(from).forEach(key => {
		const value = Reflect.getMetadata(key, from);
		Reflect.defineMetadata(key, value, to);
	});
}

const cloneWithFilters = function (data,filter_map) {
    if (data == null) {
        return data;
    }
    if(data.toJSON)data = data.toJSON();
    var newData = new data.constructor();
    if (data.constructor == Object || data.constructor == Array) {
        for (const k in data) {
            if (!filter_map[k]&&data.hasOwnProperty(k)) {
                newData[k] = cloneWithFilters(data[k],filter_map);
            }
        }
    } else {
        newData = data;
    }
    return newData;
};

const filters = {

    map:{},
    find:function(data){
        return cloneWithFilters(data,this.map);
    }
}

export function CrudFilters(filter_map:any) {
    console.log("初始化装饰器");
    filters.map = filter_map;
	return function(target) {
        const controller = target.prototype;
        for(let k in filters){
            if(k==='map')continue;
            const srcMethod = controller[k];
            controller[k] = async function test(...args) {
				return filters[k](await srcMethod.apply(this, args));
			};
			cloneDecorators(srcMethod, controller[k]);
        }
	};
}
