function SelfVue(options) {
    Object.assign(this, options);

    Object.keys(this.data).forEach((key) => {
        this.proxyKeys(key);
    });

    observe(this.data);
    new Compile(this.el, this);
}

SelfVue.prototype = {
  proxyKeys(key) {
      Object.defineProperty(this, key, {
          enumerable: false,
          configurable: true,
          get() {
              console.log('SelfVue data get');
              return this.data[key];
          },
          set(newData) {
              console.log('SelfVue data set')
              if (this.data[key] !== newData) {
                this.data[key] = newData;
                console.log(this.data[key])
              }
          },
      })
  },
};

function observe(value, vm) {
    if (!value || typeof value !== 'object') {
        return;
    }
    return new Observer(value);
};
