const ClienteServiceReq = require('../service/ClienteService');
const express = require('express')

const router = express.Router()
const ClienteService = new ClienteServiceReq;

// Rota para listar todos os clientes
router.get('/clientes', async (req, res) => {
  try {
    const filtros = {
      ddd: req.query.ddd,
      parteNome: req.query.nome
    }

    const clientes = await ClienteService.listarClientes(filtros);
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para obter um cliente específico
router.get('/cliente/', async (req, res) => {
    try {
      const clientes = await ClienteService.obterCliente(req.query.id);
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Rota para criar um novo cliente
router.post('/clientes', async (req, res) => {
  const cliente = {
    CPF: req.body.CPF,
    Nome: req.body.Nome,
    Emails: req.body.Emails,
    Telefones: req.body.Telefones
  };

  try {
    const novoCliente = await ClienteService.criarCliente(cliente);
    res.status(201).json(novoCliente);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Rota para atualizar um cliente
router.put('/clientes/', async (req, res) => {
   const cliente = {
        id: req.body.id,
        cpf: req.body.cpf,
        nome: req.body.nome,
        emails: req.body.emails,
        telefones: req.body.telefones
   };

  try {
    const clienteAtualizado = await ClienteService.atualizarCliente(cliente.id, cliente);
    res.json(clienteAtualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Rota para excluir um cliente
router.delete('/clientes/', async (req, res) => {
  try {
    console.log(req.query, req.query.id)
    await ClienteService.excluirCliente(req.query.id);
    res.json({ message: 'Cliente removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
