function Compile(el, vm) {
    this.vm = vm;
    this.el = document.querySelector(el);
    this.fragment = null;
    this.init();
}

Compile.prototype = {
    init: function () {
        if (this.el) {
            this.fragment =  this.nodeToFragment(this.el);
            this.compileElement(this.fragment);
            this.el.appendChild(this.fragment);
        } else {
            throw new Error('不存在此id');
        }
    },
    nodeToFragment(el) {
        const fragment = document.createDocumentFragment();
        let child = el.firstChild;
        while (child) {
            // 移动DOM到虚拟DOM
            fragment.appendChild(child);
            child = el.firstChild;
        }
        return fragment;
    },
    compileElement(fragment) {
      let childNodes = fragment.childNodes;
      [].slice.call(childNodes).forEach((node) => {
         const reg = /\{\{(.*)\}\}/;
         const text = node.textContent;
         if (this.isElementNode(node)) {
             this.compile(node);
         } else if (this.isTextNode(node) && reg.test(text)) {
             this.compileText(node, reg.exec(text)[1]);
         }

         if (node.childNodes && node.childNodes.length) {
             this.compileElement(node);
         }
      });
    },
    compile(node) {
        let attrs = node.attributes;
        Array.prototype.forEach.call(attrs, (attr) => {
           const { name, value } = attr;
           if (this.isDirective(name)) {
               const dir = name.substring(2);
               if (this.isEventDirective(name)) {
                   this.compileEvent(node, this.vm, value, dir);
               } else { // v-model
                    this.compileModelEvent(node, this.vm, value, dir);
               }
           }
        });
    },
    // value => exp
    compileModelEvent(node, vm, exp, dir) {
        let data = vm[exp];
        this.modelUpdater(node, data);

        new Watcher(vm, exp, (value) => {
            this.modelUpdater(node, value);
        });
        node.addEventListener('input', (e) => {
            const newData = e.target.value;
            if (data !== newData) {
                // 以下两行上下位置调换会导致数据在watcher的之后新数据没有及时更新
                data = newData;
                vm[exp] = newData;
            }
        })
    },
    compileText(node, exp) {
        let data = this.vm[exp];
        this.updateText(node, data);

        new Watcher(this.vm, exp, (value) => {
            this.updateText(node, value);
        });
    },
    updateText: function (node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    },
    modelUpdater: function(node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '' : value;
    },
    // 绑定指令事件
    compileEvent(node, vm, value, dir) {
        const Event = value.split(':')[1];
        // SelfVue 是否存在方法
        const fn = vm.method && vm.method[value];
        if (Event && fn) {
            node.addEventListener(Event, fn.bind(vm), false);
        }
    },
    isDirective: function(attr) {
        return attr.indexOf('v-') == 0;
    },
    isEventDirective: function(dir) {
        return dir.indexOf('on:') === 0;
    },
    isElementNode: function (node) {
        return node.nodeType == 1;
    },
    isTextNode: function(node) {
        return node.nodeType == 3;
    }
};
