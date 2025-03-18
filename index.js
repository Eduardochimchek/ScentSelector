const telas = document.querySelectorAll('.tela');
const thumb = document.getElementById("thumb");
const slider = document.getElementById("slider");

var vage = 999;

let dragging = false;
let indiceAtual = 0;

const fundos = [
    './imagens/fundo_pg_principal.png',
    './imagens/fundo_pg_idade.png',
    './imagens/fundo_pg_oca_uso.png',
    './imagens/fundo_pg_momento.png',
    './imagens/fundo_pg_clima.png',
    './imagens/fundo_pg_sexo.png',
    './imagens/fundo_pg_sentimento.png',
    './imagens/fundo_pg_perfume.png',
    './imagens/fundo_pg_descubra.png',
    './imagens/fundo_pg_resultado.png'
];

document.body.style.backgroundImage = `url('${fundos[indiceAtual]}')`;

document.querySelectorAll(".opcSENT").forEach(element => {
    element.addEventListener("click", function () {
        document.querySelectorAll(".opcSENT").forEach(item => item.classList.remove("selected"));
        document.getElementById("inputSentimentoSel").value = ""; // Limpa input
        this.classList.add("selected"); // Adiciona classe 'selected'
    });
});

document.querySelector('.buttonWhatsapp').addEventListener('click', () => {
    telas.forEach(tela => tela.classList.remove('ativo'));
    document.querySelector('.pg_principal').classList.add('ativo');
});

document.querySelector('#buttonNovamente').addEventListener('click', function (){
    indiceAtual = 0; // Reinicia o índice para a primeira tela
    document.getElementById("inputFaixaEtaria").value = "";
    document.getElementById("inputOcasião").value = "";
    document.getElementById("inputPeriodo").value = "";
    document.getElementById("inputClima").value = "";
    document.getElementById("inputSexo").value = "";
    document.getElementById("inputSentimento").value = "";

    vage = 0;
    thumb.style.left = '0%';
    thumb.textContent = vage;  // Mostrar 0 como valor
    slider.value = 0; // Se estiver usando um slider de input HTML
    
    document.querySelectorAll(".opcSENT").forEach(item => item.classList.remove("selected"));
    atualizarTela(); // Atualiza a interface para exibir a primeira tela
});

function removerSelecao() {
    // Remove a seleção dos botões ao digitar no input
    document.querySelectorAll(".opcSENT").forEach(item => item.classList.remove("selected"));
}

function atualizarTela() {
    telas.forEach(tela => tela.classList.remove('ativo'));
    telas[indiceAtual].classList.add('ativo');
    document.body.style.backgroundImage = `url('${fundos[indiceAtual]}')`;
}

function avancar() {
    if (indiceAtual < telas.length - 1) {
        indiceAtual++;
        atualizarTela();
    }
}

function voltar() {
    if (indiceAtual > 0) {
        indiceAtual--;
        atualizarTela();
    }
}

function selSentimeto(element) {
    document.querySelectorAll('.opcSENTIMENTO').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
}

function selecionarSentimento() {
    let sentimentoSelecionado = document.querySelector(".opcSENT.selected");
    let sentimentoDigitado = document.getElementById("inputSentimentoSel").value.trim();

    if (!sentimentoSelecionado && !sentimentoDigitado) {
        msg("E", "Erro!", "Por favor, selecione ou informe um sentimento.");
        return;
    }

    document.getElementById("inputSentimento").value = sentimentoSelecionado ? sentimentoSelecionado.innerText : sentimentoDigitado;
    avancar();
}

function selecionarSexo(valor) {
    if (!valor) {
        msg("E", "Erro!", "Por favor, selecione uma opção de sexo.");
        return;
    }

    document.getElementById("inputSexo").value = valor;
    avancar();
}

function selecionarClima(valor) {
    if (!valor) {
        msg("E", "Erro!", "Por favor, selecione um clima.");
        return;
    }

    document.getElementById("inputClima").value = valor;
    avancar();
}

function selecionarMomento(valor) {
    if (!valor) {
        msg("E", "Erro!", "Por favor, selecione um momento do dia.");
        return;
    }

    document.getElementById("inputPeriodo").value = valor;
    avancar();
}

function selecionarOcasiao(valor) {
    if (!valor) {
        msg("E", "Erro!", "Por favor, selecione uma ocasião.");
        return;
    }

    document.getElementById("inputOcasião").value = valor;
    avancar();
}

function selecionarIdade() {
    let faixaEtaria = parseInt(document.getElementById("inputIdade").value) || 0;  

    if(vage != 999){
        if(vage < 5){
            msg("E", "Erro!", "Por favor, selecione uma faixa etária válida.");
            return;
        }else{
            document.getElementById("inputFaixaEtaria").value = vage;
        }
    }else if(faixaEtaria < 5){
        msg("E", "Erro!", "Por favor, selecione uma faixa etária válida.");
        return;
    }else{
        document.getElementById("inputFaixaEtaria").value = faixaEtaria;
    }
    
    avancar();
}

function openWhatsApp() {
    var phoneNumber = "556692479111";
    var resultado = document.getElementById('textDivFim').innerHTML;
    var message = `Olá, realizei o quiz e meu resultado como perfume mais ideal para mim foi:  ${resultado} , estou interessado em saber mais sobre!`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
}

// Função para carregar o CSV e processá-lo com o PapaParse
async function loadCSV() {
    const response = await fetch('./model/perfumesAll.csv');
    const csvText = await response.text();
    return new Promise(resolve => {
        Papa.parse(csvText, {
            header: true, // Cabeçalhos de coluna no CSV
            skipEmptyLines: true, // Ignora linhas vazias
            complete: results => {
                const perfumes = results.data.map(perfume => {
                    let novoObjeto = {};
                    Object.keys(perfume).forEach(chave => {
                        let chaveLimpa = chave.trim(); // Remove espaços nos nomes das chaves
                        novoObjeto[chaveLimpa] = perfume[chave].trim(); // Remove espaços nos valores
                    });
                    return novoObjeto;
                });
                resolve(perfumes);
            }
        });
    });
}

// Função para calcular a similaridade entre os perfumes e as respostas do usuário
function calcularSimilaridade(perfumes, respostas) {
    let melhorPerfume = null;
    let maiorPontuacao = -1;
    
    // Função para normalizar texto (remover espaços e transformar em minúsculas)
    const normalizarTexto = texto => texto ? texto.trim().toLowerCase() : "";
    
    perfumes.forEach(perfume => {
        let pontuacao = 0;

        // Comparar os campos de cada perfume com as respostas
        ["Ocasião de Uso", "Período de Uso", "Clima", "Sexo", "Sentimento", "Estilo", "Intensidade"].forEach(campo => {
            if (normalizarTexto(perfume[campo]).includes(normalizarTexto(respostas[campo.toLowerCase()]))) {
                pontuacao++;
            }
        });

        // Validar faixa etária
        let faixaEtariaCSV = normalizarTexto(perfume['Faixa Etária']);
        let idadeUsuario = parseInt(respostas.faixaEtaria);

        if (faixaEtariaCSV.includes("-")) {
            let [min, max] = faixaEtariaCSV.split('-').map(num => parseInt(num.trim()));
            if (idadeUsuario >= min && idadeUsuario <= max) pontuacao++;
        } else {
            // Comparar a faixa etária como número
            let faixaEtariaCSVNumero = parseInt(faixaEtariaCSV);
            if (faixaEtariaCSVNumero === idadeUsuario) {
                pontuacao++;
            }
        }

        // Verifica se a pontuação do perfume atual é maior que a anterior
        if (pontuacao > maiorPontuacao) {
            maiorPontuacao = pontuacao;
            melhorPerfume = perfume;
        }
    });

    return melhorPerfume;
}

// Função para preencher valores vazios com base nos dados do CSV
function preencherCampos(respostas) {
    // Garantir que os valores sejam minúsculos para evitar problemas de comparação
    respostas.sentimento = respostas.sentimento ? respostas.sentimento.toLowerCase() : "";
    respostas.ocasião = respostas.ocasião ? respostas.ocasião.toLowerCase() : "";

    if (!respostas.estilo) {
        // Definir estilo baseado no sentimento
        const mapeamentoEstilo = {
            "confiança": "Moderno",
            "poder": "Sofisticado",
            "respeito": "Clássico",
            "conhecimento": "Intelectual"
        };
        respostas.estilo = mapeamentoEstilo[respostas.sentimento] || "Casual";
    }

    if (!respostas.intensidade) {
        // Definir intensidade baseada na ocasião
        const mapeamentoIntensidade = {
            "festa": "Forte",
            "trabalho": "Moderada",
            "jantar": "Moderada",
            "dia a dia": "Leve",
            "praia": "Leve",
            "aniversário": "Forte",
            "ocasião especial": "Forte"
        };
        respostas.intensidade = mapeamentoIntensidade[respostas.ocasião] || "Moderada";
    }

    if (!respostas.faixaEtaria) {
        // Definir uma faixa etária média baseada nos dados do CSV
        respostas.faixaEtaria = "23-35"; // Ajuste conforme necessário
    }

    return respostas;
}

// Função para recomendar o perfume com base nas respostas do usuário
async function recomendar() {
    // Obter as respostas dos inputs
    let respostas = {
        ocasião: document.getElementById("inputOcasião") ? document.getElementById("inputOcasião").value : "",
        periodo: document.getElementById("inputPeriodo") ? document.getElementById("inputPeriodo").value : "",
        clima: document.getElementById("inputClima") ? document.getElementById("inputClima").value : "",
        sexo: document.getElementById("inputSexo") ? document.getElementById("inputSexo").value : "",
        sentimento: document.getElementById("inputSentimento") ? document.getElementById("inputSentimento").value : "",
        estilo: document.getElementById("inputEstilo") ? document.getElementById("inputEstilo").value : "",
        faixaEtaria: document.getElementById("inputFaixaEtaria") ? document.getElementById("inputFaixaEtaria").value : "",
        intensidade: document.getElementById("inputIntensidade") ? document.getElementById("inputIntensidade").value : ""
    };

    // Preencher campos vazios
    respostas = preencherCampos(respostas);

    console.log(respostas); // Pode ser útil para depuração

    // Carregar os perfumes do CSV
    const perfumes = await loadCSV();

    // Calcular o melhor perfume com base nas respostas
    const melhorPerfume = calcularSimilaridade(perfumes, respostas);

    if (melhorPerfume) {
        // Remover "100ML", "50ML" ou qualquer outro tamanho com "ML" do nome utilizando regex
        const nomeSemML = melhorPerfume.Perfume.replace(/\s?\d+ML$/, '').trim();

        // Exibir o nome do melhor perfume na interface
        document.getElementById('textDivFim').innerHTML = nomeSemML;

        // Chamar a função para avançar, se necessário
        avancar();
    } else {
        // Caso não encontre um perfume adequado
        document.getElementById('textDivFim').innerHTML = "Nenhum perfume encontrado com essas características.";
    }
}


function onMove(e) {
    if (!dragging)
        return;

    const sliderRect = slider.getBoundingClientRect();
    let newLeft;

    if (e.type === "mousemove") {
        newLeft = e.clientX - sliderRect.left;
    } else if (e.type === "touchmove") {
        newLeft = e.touches[0].clientX - sliderRect.left;
    }

    // Limitar entre 0 e a largura do slider
    newLeft = Math.max(0, Math.min(newLeft, sliderRect.width));

    // Converter posição em idade (0 a 100)
    const age = Math.round((newLeft / sliderRect.width) * 100);

    // Aplicar posição e atualizar valor
    thumb.style.left = `${(age / 100) * 100}%`;
    thumb.textContent = age;

    vage = age;
}

thumb.addEventListener("mousedown", (e) => {
    dragging = true;
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", () => {
        dragging = false;
        document.removeEventListener("mousemove", onMove);
    });
});

// Suporte para toque em dispositivos móveis
thumb.addEventListener("touchstart", (e) => {
    dragging = true;
    document.addEventListener("touchmove", onMove);
    document.addEventListener("touchend", () => {
        dragging = false;
        document.removeEventListener("touchmove", onMove);
    });
});

function msg(tipo, titulo, descricao) {
    Swal.fire({
        title: titulo || "Atenção",
        text: descricao || "Algo aconteceu!",
        icon: tipo === "S" ? "success" : "error",
        confirmButtonText: "OK",
        timer: 3000, // Fecha automaticamente após 3 segundos
        showCancelButton: false,
        allowOutsideClick: false
    });
}