const { readFileSync } = require('fs');

class ServicoCalculoFatura{

  constructor(repositorio){
    this.repositorio = repositorio;
  }
  calcularTotalApresentacao(apresentacao){
    let total = 0;
    switch (this.repositorio.getPeca(apresentacao).tipo) {
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
          throw new Error(`Peça desconhecia: ${this.repositorio.getPeca(apresentacao).tipo}`);
      }
      return total;
  }

  
  calcularCredito(apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (this.repositorio.getPeca(apre).tipo === "comedia") 
      creditos += Math.floor(apre.audiencia / 5);
    return creditos;   
  }

  calcularTotalFatura(fatura) {
    return fatura.apresentacoes.reduce((total, apre) => total + this.calcularTotalApresentacao(apre), 0);
  }
  
  calcularTotalCreditos(fatura) {
    return fatura.apresentacoes.reduce((total, apre) => total + this.calcularCredito(apre), 0);
  }
  
}

class Repositorio {
  constructor() {
    this.pecas = JSON.parse(readFileSync('./pecas.json'));
  }

  getPeca(apresentacao) {
    const peca = this.pecas[apresentacao.id];
    if (!peca) throw new Error(`Peça desconhecida: ${apresentacao.id}`);
    return peca;
  }
}


function formatarMoeda(valor){
  return new Intl.NumberFormat("pt-BR",
                      { style: "currency", currency: "BRL",
                        minimumFractionDigits: 2 }).format(valor/100);
}


function gerarFaturaStr (fatura,calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    // corpo principal (após funções aninhadas)
    for (let apre of fatura.apresentacoes) {
        faturaStr += `  ${calc.repositorio.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura)} \n`;
    return faturaStr;
  }

// function gerarFaturaHTML(fatura,pecas){
//     let faturaData = {
//       cliente: fatura.cliente,
//       apresentacoes: fatura.apresentacoes.map(apre => {
//         return {
//           peca: getPeca(apre,pecas).nome,
//           total: formatarMoeda(calcularTotalApresentacao(apre,pecas)),
//           audiencia: apre.audiencia
//         }
//       }),
//       total: formatarMoeda(calcularTotalFatura(fatura,pecas)),
//       creditos: calcularTotalCreditos(fatura,pecas)
//     }

//     return `
//     <html>
//     <p> Fatura: ${faturaData.cliente} </p>
//     <ul>
//       ${faturaData.apresentacoes.map(apre => `
//         <li> ${apre.peca}: ${apre.total} (${apre.audiencia} assentos) </li>
//       `).join('')}
//     </ul>
//     <p> Valor total: ${faturaData.total} </p>
//     <p> Créditos acumulados: ${faturaData.creditos} </p>
//     </html>
//     `;

// }

const faturas = JSON.parse(readFileSync('./faturas.json'));
const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas,calc);
console.log(faturaStr);
// const faturaHTML = gerarFaturaHTML(faturas, pecas);
// console.log(faturaHTML);
