const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const porta = 3000;

const lerDados = () => {
    const arquivo = fs.readFileSync('dados.json', 'utf8');
    const dadosConvertidos = JSON.parse(arquivo);
    return dadosConvertidos;
};

const salvarDados = (dados) => {
    const texto = JSON.stringify(dados, null, 2);
    fs.writeFileSync('dados.json', texto);
};

const mostrarEquipamentos = (req, res) => {
    const dados = lerDados();
    res.send(dados);
};

const novoEquipamento = (req, res) => {
    const dados = lerDados();

    const novoObjeto = {
        id: dados.length + 1,
        local: req.body.local,
        equipamento: req.body.equipamento,
        consumo_kwh: Number(req.body.consumo_kwh),
        mes_referencia: req.body.mes_referencia,
        status: req.body.status
    };

    dados.push(novoObjeto);
    salvarDados(dados);

    res.send({ mensagem: "Cadastrado com sucesso!" });
};

const atualizarEquipamento = (req, res) => {
    const dados = lerDados();
    const idProcurado = req.params.id;
    let achei = false;

    for (let i = 0; i < dados.length; i++) {
        if (dados[i].id == idProcurado) {
            dados[i].local = req.body.local;
            dados[i].equipamento = req.body.equipamento;
            dados[i].consumo_kwh = Number(req.body.consumo_kwh);
            dados[i].mes_referencia = req.body.mes_referencia;
            dados[i].status = req.body.status;
            achei = true;
        }
    }

    if (achei == true) {
        salvarDados(dados);
        res.send({ mensagem: "Atualizado com sucesso!" });
    } else {
        res.send({ mensagem: "Não foi encontrado para atualizar." });
    }
};

const excluirEquipamento = (req, res) => {
    const dados = lerDados();
    const idProcurado = req.params.id;
    let novaLista = [];

    for (let i = 0; i < dados.length; i++) {
        if (dados[i].id != idProcurado) {
            novaLista.push(dados[i]);
        }
    }

    salvarDados(novaLista);
    res.send({ mensagem: "Excluído com sucesso!" });
};

app.get('/equipamentos', mostrarEquipamentos);
app.post('/equipamentos', novoEquipamento);
app.put('/equipamentos/:id', atualizarEquipamento);
app.delete('/equipamentos/:id', excluirEquipamento);

app.listen(porta, () => {
    console.log(`Cliente: http://127.0.0.1:5500/client/`);
    console.log(`Servidor: http://127.0.0.1:${porta}/equipamentos`);
});