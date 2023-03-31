import {WidgetType, ViewPlugin, MatchDecorator, Decoration} from "@codemirror/view";

// TODO refazer

class HyperLink extends WidgetType {
    constructor(state) {
        super();
        this.state = state;
    }
    eq(other) {
        return (
            this.state.url === other.state.url
            && this.state.at === other.state.at
        );
    }
    toDOM() {
        const wrapper = document.createElement('a');
        wrapper.href = this.state.url;
        wrapper.target = "_blank";
        wrapper.innerHTML = `<i class="fas fa-link mx-1"></i>`;
        wrapper.className = "cm-link";
        wrapper.rel = "nofollow";
        wrapper.style.color = "rgb(59 130 246 / 0.5)"
        
        return wrapper;
    }
};

const linkDecorator = new MatchDecorator({
    regexp: /https?:\/\/\S+/ig,
    decorate: (add, from, to, match, view) => {
        const url = match[0];
        const start = to, end = to;
        const linkIcon = new HyperLink({at: start, url});
        add(start, end, Decoration.widget({widget: linkIcon, side: 1}));
    },
});

const urlPlugin = ViewPlugin.fromClass(
    class URLView {
        constructor(view) {
            this.decorator = linkDecorator;
            this.decorations = this.decorator.createDeco(view);
        }
        update(update) {
            if (update.docChanged || update.viewportChanged) {
                this.decorations = this.decorator.updateDeco(update, this.decorations);
            }
        }
    }, {decorations: v => v.decorations}
);

export { urlPlugin };