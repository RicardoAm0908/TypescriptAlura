import { NegociacoesView, MensagemView } from '../views/index';
import { Negociacao, Negociacoes, NegociacaoParcial } from '../models/index';
import { logarTempoDeExecucao, domInject, throttle } from '../helpers/Decorators/index';
import { NegociacaoService } from '../services/index';

let timer = 0;

export class NegociacaoController {

    @domInject('#data')
    private _inputData: JQuery;

    @domInject('#quantidade')
    private _inputQuantidade: JQuery;

    @domInject('#valor')
    private _inputValor: JQuery;
    private _negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView');
    private _mensagemView = new MensagemView('#mensagemView');
    private _negociacaoService = new NegociacaoService();
    
    constructor() {
        this._negociacoesView.update(this._negociacoes);
    }

    @logarTempoDeExecucao(true)
    @throttle()
    adiciona() {
        let data = new Date(this._inputData.val().toString().replace(/-/g, ','))

        if(!this.ehDiaUtil(data)){
            this._mensagemView.update("Somente negociações em dia úteis, por favor");
            return;
        }

        const negociacao = new Negociacao(
            data, 
            parseInt(this._inputQuantidade.val().toString()),
            parseFloat(this._inputValor.val().toString())
        );

        this._negociacoes.adiciona(negociacao);

        this._negociacoesView.update(this._negociacoes);
        this._mensagemView.update('Negociação adicionada com sucesso!');
    }


    private ehDiaUtil(data: Date){
        return data.getDay() != DiaDaSemana.Domingo && data.getDay() != DiaDaSemana.Sábado
    }


    
    @throttle()
    importaDados() {
        this
            ._negociacaoService.obterNegociacoes(res => {
                if(res.ok){
                    return res;
                }else{
                    throw new Error(res.statusText);
                }
            })
            .then(negociacoes => {
                negociacoes.forEach(element => {
                    this._negociacoes.adiciona(element)
                });
                this._negociacoesView.update(this._negociacoes);
            });
    }
}


enum DiaDaSemana{
    Domingo, 
    Segunda,
    Terça,
    Quarta,
    Quinta,
    Sexta,
    Sábado
}