export type InputView_ExplainButtonSpan = {
    type : "Button"
    text : string; 
    OnClick? : () => void;
};
export type InputView_InputSpan = {
    type : "Input" 
    text : string,
    length : number,
    markedState : "Correct" | "NotAnswered" | "Unmarked",
    OnInputChange? : (value : string) => void
};
export type InputView_TextSpan = { 
    type: "Text",
    text : string,
    furigana? : string
};
export type InputView_Span = InputView_ExplainButtonSpan | InputView_InputSpan | InputView_TextSpan;