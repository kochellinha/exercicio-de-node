const fs = require("fs");
const readline = require("readline");
const { EventEmitter } = require("events");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const eventoResumo = new EventEmitter();

function executarAnalise() {
  rl.question("Digite o caminho do arquivo .txt: ", (caminho) => {
    console.time("Tempo de execução");

    fs.readFile(caminho, "utf-8", (err, data) => {
      if (err) {
        console.log("Erro ao ler o arquivo:", err.message);
        perguntarSeDesejaExecutarNovamente();
        return;
      }

      const linhas = data.split("\n");

      let somaNumeros = 0;
      let linhasComTexto = 0;

      linhas.forEach((linha) => {
        linha = linha.trim();

        if (linha === "") return;

        if (/^\d+$/.test(linha)) {
          somaNumeros += parseInt(linha);
        } else {
          linhasComTexto++;
        }
      });

      eventoResumo.emit("resumo", { somaNumeros, linhasComTexto });
    });
  });
}

eventoResumo.on("resumo", ({ somaNumeros, linhasComTexto }) => {
  console.log("\n Resumo da análise:");
  console.log(`- Soma das linhas numéricas: ${somaNumeros}`);
  console.log(`- Linhas com texto ou mistas: ${linhasComTexto}`);
  console.timeEnd("Tempo de execução");
  console.log();

  perguntarSeDesejaExecutarNovamente();
});

function perguntarSeDesejaExecutarNovamente() {
  rl.question("Deseja executar novamente? (s/n): ", (resposta) => {
    if (resposta.toLowerCase() === "s") {
      executarAnalise();
    } else {
      rl.close();
      console.log(" Programa encerrado.");
    }
  });
}

executarAnalise();