module.exports = class ServicoCalculoFatura{

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