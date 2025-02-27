const { readFileSync } = require('fs');

module.exports = class Repositorio {
    constructor() {
      this.pecas = JSON.parse(readFileSync('./pecas.json'));
    }
  
    getPeca(apresentacao) {
      const peca = this.pecas[apresentacao.id];
      if (!peca) throw new Error(`Peça desconhecida: ${apresentacao.id}`);
      return peca;
    }
  }