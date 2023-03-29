import {
    StateEffect,
    StateField,
} from "@codemirror/state";
import {
    EditorView,
    Decoration,
} from "@codemirror/view";

// Effects can be attached to transactions to communicate with the extension
const addMarks = StateEffect.define<{ from: number; to: number }>(),
    filterMarks = StateEffect.define();

// This value must be added to the set of extensions to enable this
const markField = StateField.define({
    // Start with an empty set of decorations
    create() {
        return Decoration.none;
    },
    // This is called whenever the editor updates—it computes the new set
    update(value, tr) {
        // Move the decorations to account for document changes
        value = value.map(tr.changes);
        // If this transaction adds or removes decorations, apply those changes
        for (let effect of tr.effects) {
            if (effect.is(addMarks))
                value = value.update({
                    add: [
                        debugMark.range(
                            effect.value.from,
                            effect.value.to
                        ),
                    ],
                });
            else if (effect.is(filterMarks)) {
                value = value.update({ filter: (_) => false });
            }
        }
        return value;
    },
    // Indicate that this field provides a set of decorations
    provide: (f) => EditorView.decorations.from(f),
});
const debugMark = Decoration.mark({
    attributes: { style: "background-color: rgba(255, 255, 0, 0.4)" },
});


class DebugHandler {
    readonly editor: EditorView;
    constructor(editor: EditorView) {
        this.editor = editor;
    }

    currentLine(line: number) {
        let l = this.editor.state.doc.line(line);
        let effects: StateEffect<unknown>[] = [];
        if (l.length === 0) return false;
        effects.push(addMarks.of({ from: l.from, to: l.to }));
        this.editor.dispatch({ effects });
    }

    clearCursorDebug() {
        let effects: StateEffect<unknown>[] = [];
        effects.push(filterMarks.of(null));
        this.editor.dispatch({ effects });
    };


}



const debuglineTheme = EditorView.baseTheme({
    ".cm-debugline": { textDecoration: "underline 3px red" },
});

const debugExtension = [debuglineTheme, markField];


export { debugExtension, DebugHandler };
