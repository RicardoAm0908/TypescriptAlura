class MensagemView extends View<string> {

    template(model: string): string {
        return `
            <p class="alert alert-info">${model}</p>              
        `
    }

    update(model: string): void {
        this._elemento.innerHTML = this.template(model);
    }
}