  const url = "https://script.google.com/macros/s/AKfycbxJj8RuTnwC6NpV04kBtJv986OdlK0OZxnSWSnsHUvIdhjPzHJ99_2GTR2VPlEyfIxE/exec";

async function redesSociaisFavoritasMinhaEscola() {
    const dadosLocaisString = localStorage.getItem('respostaRedesSociais')
    if (dadosLocaisString) {
        const dadosLocais = JSON.parse(dadosLocaisString)
        console.table(dadosLocais)
        processarDados(dadosLocais)
    } else {
        const res = await fetch(url)
        const dados = await res.json()
        localStorage.setItem('respostaRedesSociais', JSON.stringify(dados))
        console.table(dados)
        processarDados(dados)
    }
}

let redeMaisA;

function contagem(array) {
    const contagemRedesSociais = array.reduce((acc, array) => {
        acc[array] = (acc[array] || 0) + 1
        return acc
    }, {})

    return contagemRedesSociais;
}

function processarDados(dados) {
    const redesSociais = dados.slice(1).map(redes => redes[1])
    const motivos = dados.slice(1).map(redes => redes[2])

    const valores = Object.values(contagem(redesSociais))
    const labels = Object.keys(contagem(redesSociais))

    const valoresM = Object.values(contagem(motivos))
    const labelsM = Object.keys(contagem(motivos))


    const indexMaior = valores.reduce((indiceMaior, numAtual, indiceAtual, array) => 
        numAtual > array[indiceMaior] ? indiceAtual : indiceMaior, 0);

    redeMaisA = labels[indexMaior]

    const data = [
        {
            values: valores,
            labels: labels,
            type: 'pie',
            textinfo: 'label+percent'
        }
    ]

    const layout = {
        plot_bgcolor: getCSS('--bg-color'),
        paper_bgcolor: getCSS('--bg-color'),
        height: 500,
        title: {
            text: 'Redes sociais que as pessoas da minha escola mais gostam',
            x: 0,
            font: {
                color: getCSS('--primary-color'),
                family: getCSS('--font'),
                size: 30
            }
        },
        legend: {
            font: {
                color: getCSS('--primary-color'),
                size: 16
            }
        }
    }

    const dataM = [
        {
            values: valoresM,
            labels: labelsM,
            type: 'pie',
            textinfo: 'label+percent'
        }
    ]

    const layoutM = {
        plot_bgcolor: getCSS('--bg-color'),
        paper_bgcolor: getCSS('--bg-color'),
        height: 500,
        title: {
            text: 'Motivos para acessarem as redes sociais:',
            x: 0,
            font: {
                color: getCSS('--primary-color'),
                family: getCSS('--font'),
                size: 30
            }
        },
        legend: {
            font: {
                color: getCSS('--primary-color'),
                size: 12
            }
        }
    }

    criarGrafico(data, layout)
    incluirTexto(`Como no mundo, a amostra de pessoas entrevistadas por mim, demonstra um apreço pelo <span>${redeMaisA}</span> em relação a outras redes.`)
    criarGrafico(dataM, layoutM)
}

redesSociaisFavoritasMinhaEscola()