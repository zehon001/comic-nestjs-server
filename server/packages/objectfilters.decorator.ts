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

export function ObjectFilters(filter_map:any):MethodDecorator{
    const map = filter_map;
    return function(target:any,key:string){
        const src = target;
        console.log('执行装饰器',target)
        console.log('执行装饰器',key)
        function test(...args){
            console.log('调用杉树')
            return cloneWithFilters(src.apply(this,args),map)
        }
        return 
    } 
}