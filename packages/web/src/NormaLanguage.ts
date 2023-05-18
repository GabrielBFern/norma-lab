import {
    StreamLanguage,
    LanguageSupport,
    syntaxTree,
} from "@codemirror/language";
import { parse } from "norma-lab-wasm";
import type { CompletionContext } from "@codemirror/autocomplete";
import { linter, Diagnostic } from "@codemirror/lint";

const keywordsSugestion = [
    { label: "inc ", type: "keyword", detail: "Increment" },
    { label: "dec ", type: "keyword", detail: "Decrement" },
    { label: "ifz ", type: "keyword", detail: "If zero jump (true,false)" },
    { label: "ifnz ", type: "keyword", detail: "If not zero jump (true,false)" },
];

const keywords = keywordsSugestion.map(e => e.label.trim());


const language = StreamLanguage.define<{}>({
    startState() {
        return {};
    },
    token(stream, _state) {
        if (stream.match(/\/\/.*/)) return "comment";
        if (stream.match(/(?:[0-9][0-9_]*)/)) return "number";
        if (stream.match(/^\w+\s*(?=:)/)) return "labelName";
        if (stream.match(/^\w+/))
            return keywords.indexOf(stream.current()) >= 0
                ? "keyword"
                : "variableName";
        stream.next();
        return "invalid";
    },
});


let completeKeyword = function completeJSDoc(context: CompletionContext) {
    if (context.matchBefore(/^\s*(\w+:)?\s*\w*/) === null) {
        return null;
    }
    let word = context.matchBefore(/\w*/);
    if (word === null || (word.from == word.to && !context.explicit))
        return null;
    return {
        from: word.from,
        options: keywordsSugestion,
    };
};

let completeVariable = function completeJSDoc(context: CompletionContext) {
    let begin = context.matchBefore(/^(inc|dec|ifz|ifnz)\s+\w*/);
    if (begin === null) return null;
    let word = context.matchBefore(/\w*/);
    let tree = syntaxTree(context.state);
    let list = new Set();
    let collectVariable = (a) => {
        if (a.name === "variableName") {
            let t = context.state.sliceDoc(a.from, a.to);
            if (t != word.text) {
                list.add(t);
            }
        }
    };
    tree.iterate({ enter: collectVariable });
    context.state;

    return {
        from: word.from,
        options: [...list].map((e) => {
            return { label: e, type: "variable" };
        }),
    };
};

export const completions = [
    language.data.of({
        autocomplete: completeKeyword,
    }),
    language.data.of({
        autocomplete: completeVariable,
    }),
];


function normaLanguage() {
    return new LanguageSupport(language, [...completions]);
}



function posToOffset(doc, pos) {
    return doc.line(pos.line + 1).from + pos.ch;
}

function offsetToPos(doc, offset) {
    let line = doc.lineAt(offset);
    return { line: line.number - 1, ch: offset - line.from };
}

let normaLinter = linter((view) => {
    var found: Diagnostic[] = [];
    var array = view.state.doc.toString().split("\n");
    for (const [line, text] of array.entries()) {
        let r = parse(text);
        if (r !== null) {
            let { message, start, end } = r;
            let from = posToOffset(view.state.doc, {
                line,
                ch: start[1] - 1,
            });
            let to = posToOffset(view.state.doc, { line, ch: end[1] - 1 });
            found.push({
                from,
                to,
                message: message,
                severity: "error",
            });
        }
    }
    return found;
});




export { normaLanguage, normaLinter };