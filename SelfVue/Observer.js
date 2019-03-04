function Observer(data) {
    this.data = data;
    this.init();
}

Observer.prototype = {
  init() {
    Object.keys(this.data).forEach((key) => {
        this.ReactDefine(this.data, key, this.data[key]);
    });
  },
  ReactDefine(data, key, val) {
      let dep = new Dep();
      Object.defineProperty(data, key, {
         enumerable: true,
         configurable: true,
         get() {
             if (Dep.target) {
                 console.log('订阅者管理器添加 订阅者');
                 dep.addSubs(Dep.target);
             }
             console.log('Observe data get');
             return val;
         },
         set(newData) {
           if (val !== newData)  {
               console.log('Observe data set');
               val = newData;
               dep.notify();
           }
         },
      });
  },
};
