const telas = document.querySelectorAll('.tela');
let indiceAtual = 0;

const thumb = document.getElementById("thumb");
const slider = document.getElementById("slider");

let dragging = false;


const fundos = [
    './imagens/fundo_pg_principal.png',  // Tela 1
    './imagens/fundo_pg_idade.png',         // Tela 2
    './imagens/fundo_pg_oca_uso.png',         // Tela 3
    './imagens/fundo_tela4.png',         // Tela 4
    './imagens/fundo_tela5.png',         // Tela 5
    './imagens/fundo_tela6.png',         // Tela 6
    './imagens/fundo_tela7.png',         // Tela 7
    './imagens/fundo_tela8.png',         // Tela 8
    './imagens/fundo_tela9.png'          // Tela 9
];

function atualizarTela() {
    // Remove a classe 'ativo' de todas as telas
    telas.forEach(tela => tela.classList.remove('ativo'));

    // Adiciona a classe 'ativo' na tela atual
    telas[indiceAtual].classList.add('ativo');

    // Altera o fundo conforme a tela atual
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

document.body.style.backgroundImage = `url('${fundos[indiceAtual]}')`;

// Função para manipular o movimento do mouse ou toque
function onMove(e) {
    if (!dragging) return;

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