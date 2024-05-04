
export const GlobalTextContext = {
    
    currentRawText : "",    
    onTextSubmitSubscriptions : [] as ((string: string) => void)[],
    
    subscribeToRawTextChanged(callback : (string: string) => void){
        this.onTextSubmitSubscriptions.push(callback);
    },
    
    unsubscribeToRawTextChanged(callback : (string: string) => void){
        const index = this.onTextSubmitSubscriptions.indexOf(callback);
        if(index > -1){
            this.onTextSubmitSubscriptions.splice(index, 1);
        }
    },

    updateRawText(text : string){
        this.currentRawText = text;
        this.onTextSubmitSubscriptions.forEach(callback => callback(text));
    }

}

