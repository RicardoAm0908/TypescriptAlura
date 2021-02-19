import { NegociacoesView, MensagemView } from '../views/index';
import { Negociacao, Negociacoes, NegociacaoParcial, Igualavel } from '../models/index';
import { logarTempoDeExecucao, domInject, throttle } from '../helpers/Decorators/index';
import { NegociacaoService } from '../services/index';
import { imprime } from '../helpers/index';


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
        imprime(negociacao, this._negociacoes);
        this._negociacoesView.update(this._negociacoes);
        this._mensagemView.update('Negociação adicionada com sucesso!');
    }


    private ehDiaUtil(data: Date){
        return data.getDay() != DiaDaSemana.Domingo && data.getDay() != DiaDaSemana.Sábado
    }


    
    @throttle()
    async importaDados() {
        try{
            const negociacoesParaImportar = await this._negociacaoService
                 .obterNegociacoes(res => {
                     if(res.ok){
                         return res;
                     }else{
                         throw new Error(res.statusText);
                     }
                 })
                 const negociacoesJaImportadas = this._negociacoes.paraArray();
     
                 negociacoesParaImportar
                     .filter(negociacao => 
                         !negociacoesJaImportadas.some(jaImportada => 
                             negociacao.ehIgual(jaImportada)
                         )
                     )
                     .forEach(element => {
                         this._negociacoes.adiciona(element)
                     });
                 this._negociacoesView.update(this._negociacoes);

        }catch(ex) {
            this._mensagemView.update(ex.message);
        }
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