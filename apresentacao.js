const formatarMoeda = require('./utils.js')

module.exports = function gerarFaturaStr (fatura,calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    // corpo principal (após funções aninhadas)
    for (let apre of fatura.apresentacoes) {
        faturaStr += `  ${calc.repositorio.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura)} \n`;
    return faturaStr;
  }
