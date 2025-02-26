const { readFileSync } = require('fs');

function gerarFaturaStr (fatura, pecas) {
    let totalFatura = 0;
    let creditos = 0;
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    const formato = formatarMoeda;

    function calcularTotalApresentacao(apresentacao){
      let total = 0;
      switch (getPeca(apresentacao).tipo) {
        case "tragedia":
          total = 40000;
          if (apresentacao.audiencia > 30) {
            total += 1000 * (apresentacao.audiencia - 30);
          }
          break;
        case "comedia":
          total = 30000;
          if (apresentacao.audiencia > 20) {
             total += 10000 + 500 * (apresentacao.audiencia - 20);
          }
          total += 300 * apresentacao.audiencia;
          break;
        default:
            throw new Error(`Peça desconhecia: ${getPeca(apresentacao).tipo}`);
        }
        return total;
    }

    function getPeca(apresentacao) {
      const peca = pecas[apresentacao.id];
      if (!peca) throw new Error(`Peça desconhecida: ${apresentacao.id}`);
      return peca;
    }

    function calcularCredito(apre) {
      let creditos = 0;
      creditos += Math.max(apre.audiencia - 30, 0);
      if (getPeca(apre).tipo === "comedia") 
         creditos += Math.floor(apre.audiencia / 5);
      return creditos;   
    }

    function formatarMoeda(valor){
      return new Intl.NumberFormat("pt-BR",
                          { style: "currency", currency: "BRL",
                            minimumFractionDigits: 2 }).format(valor);
    }
  
    for (let apre of fatura.apresentacoes) {
      let total = calcularTotalApresentacao(apre);
 
      // mais uma linha da fatura
      faturaStr += `  ${getPeca(apre).nome}: ${formato(total/100)} (${apre.audiencia} assentos)\n`;
      totalFatura += total;
      creditos += calcularCredito(apre);
    }
    faturaStr += `Valor total: ${formato(totalFatura/100)}\n`;
    faturaStr += `Créditos acumulados: ${creditos} \n`;
    return faturaStr;
  }

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);
