class MensagemView extends View {
    template(model) {
        return `
            <p class="alert alert-info">${model}</p>              
        `;
    }
    update(model) {
        this._elemento.html(this.template(model));
    }
}
