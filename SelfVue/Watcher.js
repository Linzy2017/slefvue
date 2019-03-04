function Watcher(vm, exp, fn) {
    this.fn = fn;
    this.vm = vm;
    this.exp = exp;
    this.value = this.init();
}

Watcher.prototype = {
  init() {
    Dep.target = this;
    // 触发 SelfVue 的get => Observe的 get => Dep addSubs
    let value = this.vm.data[this.exp];
    Dep.target = null;
    return value;
  },
  update() {
      console.log('watcher update')
    let value = this.vm.data[this.exp];
      console.log(value)
    let oldValue = this.value;
    if (value !== oldValue) {
        this.value = value;
        this.fn.call(this.vm, value, oldValue);
    }
  },
};
