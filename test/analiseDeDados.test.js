const AnaliseDeDados = require("../src/analiseDeDados");

describe("Classe AnaliseDeDados", () => {
  let dados;

  beforeEach(() => {
    dados = new AnaliseDeDados();
    dados.adicionarDados([1])
    dados.adicionarDados([2])
    dados.adicionarDados([3])
  });


  test("Depositar valores númericos para o array de dados", async () => {
    dados.adicionarDados([4]);

    expect(dados.ordenarDados()).toEqual([1, 2, 3, 4]);
  });

  test("Limpar os valores do array de dados", async () => {
    dados.limparDados();

    expect(dados.ordenarDados()).toEqual([]);
  });

  test("Calcular a média dos valores do array fornecidos", async () => {
    dados.adicionarDados([6]);
    dados.adicionarDados([7]);

    expect(dados.calcularMedia()).toBe(3.8);
  });

  test("Calcular a mediana dos valores do array fornecidos", async () => {
    dados.adicionarDados([6], [9], [10], [12]);

    expect(dados.calcularMediana()).toBe(2.5);
  });

  test("Calcular a moda dos valores disponíveis na listagem", async () => {
    dados.adicionarDados([4], [5], [6], [7]);

    expect(dados.calcularModa()).toEqual([1, 2, 3, 4]);
  });

  test("Calcular a moda dos valores fornecidos", async () => {
    dados.adicionarDados([4], [5], [6], [7]);

    expect(dados.calcularVariancia()).toBe(1.25);
  });

  test("Calcular o desvio padrão com base nos dados disponibilizados, lembrando que está arredondado para 2 casas decimais", async () => {
    dados.adicionarDados([10], [11], [12]);

    expect(Math.round(dados.calcularDesvioPadrao(), 2)).toBe(4);
  });

  test("Encontar o menor valor que foi disponibilizado", async () => {
    dados.adicionarDados([0.1], [0.6]);

    expect(dados.encontrarMinimo()).toBe(0.1);
  });

  test("Encontar o maior valor da listagem fornecida", async () => {
    dados.adicionarDados([4]);

    expect(dados.encontrarMaximo()).toBe(4);
  });

  test("Caso não houver valores no array de dados e tentar encontrar o maior valor, retorna null", async () => {
    dados.limparDados();

    expect(dados.encontrarMaximo()).toEqual(null);
  });

  test("Normalizar dados fornecidos", async () => {
    expect(dados.normalizarDados()).toEqual([0, 0.5, 1]);
  });

  test("Calculando o percentil dos dados com base na soma deles", async () => {
    expect(dados.calcularPercentil(dados.calcularSoma())).toBe(1.12);
  });

  test("Calculando somente a soma dos dados fornecidos", async () => {
    expect(dados.calcularSoma()).toBe(6);
  });

  test("Calculando quantidade de produto", async () => {
    expect(dados.calcularProduto()).toBe(6);
  });

  test("Calculando amplitude", async () => {
    dados.limparDados();
    dados.adicionarDados([6]);
    dados.adicionarDados([7]);
    dados.adicionarDados([8]);

    expect(dados.calcularAmplitude()).toEqual(2);
  });


  test("Calculando Coeficiente Variacao (40,82....)", async () => {
    expect(dados.calcularCoeficienteVariacao()).toBeLessThan(41);
    expect(Math.round(dados.calcularCoeficienteVariacao(), 2)).toBe(41);
  });

  test("Removendo outliers(tendo como fator 2)", async () => {
    // Armazenando para comparação
    const dadosOriginais = [...dados.dados];

    dados.removerOutliers(2);

    // O número de dados não deve mudar
    expect(dados.dados.length).toBe(dadosOriginais.length);

    expect(dados.dados).toEqual([1, 2, 3]);
  });

  test("Calculando correlação dos valores(0,999999...)", async () => {
    expect(dados.calcularCorrelacao([1, 2, 3])).toBeLessThanOrEqual(1)
  });
});