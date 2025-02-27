const { readFileSync } = require('fs');

class ServicoCalculoFatura{

  calcularTotalApresentacao(apresentacao,pecas){
    let total = 0;
    switch (getPeca(apresentacao,pecas).tipo) {
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
          throw new Error(`Peça desconhecia: ${getPeca(apresentacao,pecas).tipo}`);
      }
      return total;
  }

  
  calcularCredito(apre,pecas) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (getPeca(apre,pecas).tipo === "comedia") 
      creditos += Math.floor(apre.audiencia / 5);
    return creditos;   
  }

  calcularTotalFatura(fatura, pecas) {
    return fatura.apresentacoes.reduce((total, apre) => total + this.calcularTotalApresentacao(apre,pecas), 0);
  }
  
  calcularTotalCreditos(fatura,pecas) {
    return fatura.apresentacoes.reduce((total, apre) => total + this.calcularCredito(apre,pecas), 0);
  }
  

}



function getPeca(apresentacao, pecas) {
  const peca = pecas[apresentacao.id];
  if (!peca) throw new Error(`Peça desconhecida: ${apresentacao.id}`);
  return peca;
}


function formatarMoeda(valor){
  return new Intl.NumberFormat("pt-BR",
                      { style: "currency", currency: "BRL",
                        minimumFractionDigits: 2 }).format(valor/100);
}


function gerarFaturaStr (fatura, pecas,calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    // corpo principal (após funções aninhadas)
    for (let apre of fatura.apresentacoes) {
        faturaStr += `  ${getPeca(apre,pecas).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre,pecas))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura,pecas))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura,pecas)} \n`;
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
const pecas = JSON.parse(readFileSync('./pecas.json'));
const calc = new ServicoCalculoFatura();
const faturaStr = gerarFaturaStr(faturas, pecas,calc);
console.log(faturaStr);
// const faturaHTML = gerarFaturaHTML(faturas, pecas);
// console.log(faturaHTML);
