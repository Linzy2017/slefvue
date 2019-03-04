function Dep() {
    this.subs = [];
}

Dep.prototype= {
    target: null,
    addSubs(subs) {
      this.subs.push(subs);
    },
    notify: function() {
        this.subs.forEach((sub) => {
            sub.update();
        });
    },
};
