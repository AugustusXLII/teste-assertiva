const { Pool } = require('pg');

class ClienteService {
  constructor() {
    this.pool = new Pool({
      connectionString: 'postgresql://postgres:postgres@db:5432/assertiva'
    });
  }

  // CRIAÇÃO

  async criarCliente(cliente) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const insertClienteQuery = 'INSERT INTO clientes (nome, cpf) VALUES ($1, $2) RETURNING id';
      const clienteValues = [cliente.Nome, cliente.CPF];
      const { rows: clienteRows } = await client.query(
        insertClienteQuery,
        clienteValues
      );
      const clienteId = clienteRows[0].id;
      // Inserir telefones do cliente na tabela "telefones"
      if (cliente.Telefones && cliente.Telefones.length > 0) {
        await this.inserirTelefonesCliente(client, cliente.Telefones, clienteId);
      }
      // Inserir emails do cliente na tabela "emails"
      if (cliente.Emails && cliente.Emails.length > 0) {
        await this.inserirEmailsCliente(client, cliente.Emails, clienteId);
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }

  //ATUALIZAÇÃO

  async atualizarCliente(id, cliente) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      // Atualizar o cliente na tabela "clientes"
      const updateClienteQuery =
        'UPDATE clientes SET nome = $1, cpf = $2 WHERE id = $3';
      const clienteValues = [cliente.nome, cliente.cpf, cliente.id];
      await client.query(updateClienteQuery, clienteValues);

      // Excluir os telefones do cliente na tabela "telefones"
      await this.excluirTodosTelefones(client, cliente.id);

      // Inserir os novos telefones do cliente na tabela "telefones"
      if (cliente.telefones && cliente.telefones.length > 0) {
        await this.inserirTelefonesCliente(client, cliente.telefones, cliente.id)
      }

      // Excluir os emails do cliente na tabela "emails"
      await this.excluirTodosEmails(client, cliente.id);

      // Inserir os novos emails do cliente na tabela "emails"
      if (cliente.emails && cliente.emails.length > 0) {
        await this.inserirEmailsCliente(client, cliente.emails, cliente.id)
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }

  //EXCLUSÃO/////////////////////////////////////////////////////////

  async excluirCliente(id) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await this.excluirTodosEmails(client, id)
      await this.excluirTodosTelefones(client, id)
      const query = 'DELETE FROM Clientes WHERE id = $1';
      const values = [id];
      await client.query(query, values);

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }

  async excluirTodosTelefones(client, clienteId) {
    const query = 'DELETE FROM Telefones WHERE clienteid = $1';
    const values = [clienteId];
    await client.query(query, values);
    return true;
  }

  async excluirTodosEmails(client, clienteId) {
    const query = 'DELETE FROM Emails WHERE clienteid = $1';
    const values = [clienteId];
    await client.query(query, values);
    return true;
  }

  //INCLUSÃO/////////////////////////////////////////////////////////

  async inserirTelefonesCliente(client, telefones, clienteId){
    const insertTelefoneQuery = 'INSERT INTO telefones (clienteid, numero) VALUES ($1, $2)';
    const telefoneValues = telefones.map((numero) => [
      clienteId,
      numero,
    ]);
    await Promise.all(
      telefoneValues.map((values) =>
        client.query(insertTelefoneQuery, values)
      )
    );
  }

  async inserirEmailsCliente(client, emails, clienteId){
    const insertEmailsQuery = 'INSERT INTO emails (clienteid, endereco) VALUES ($1, $2)';
    const emailsValue = emails.map((endereco) => [
      clienteId,
      endereco,
    ]);
    await Promise.all(
      emailsValue.map((values) =>
        client.query(insertEmailsQuery, values)
      )
    );
  }


  //LEITURA/////////////////////////////////////////////////////////
  async obterCliente(id) {
    const client = await this.pool.connect();
    try {
      const query =
      'SELECT c.id, c.nome, c.cpf, t.numero, e.endereco ' +
      'FROM clientes c ' +
      'JOIN telefones t ON c.id = t.clienteid ' +
      'JOIN emails e ON c.id = e.clienteid ' +
      'WHERE c.id = $1 ';
      const values = [id];
      const { rows } = await client.query(query, values);
      return this.agruparRetorno(rows);

    } catch (error) {
      throw error
    }
  }

  async listarClientes(filtros) {
    const client = await this.pool.connect();

    try {
      // Selecionar os clientes com telefones e emails
      var query =
        'SELECT c.id, c.nome, c.cpf, t.numero, e.endereco ' +
        'FROM clientes c ' +
        'JOIN telefones t ON c.id = t.clienteid ' +
        'JOIN emails e ON c.id = e.clienteid ';
      query += this.adicionaFiltros(filtros);

      const { rows } = await client.query(query);
      return this.agruparRetorno(rows);

    } catch (error) {
      throw error;
    }
  }

  adicionaFiltros(filtros){

    var filtroSql = "";

    if(!filtros || (!filtros.ddd && !filtros.parteNome)){
      return filtroSql;
    }

    filtroSql += "WHERE ";

    if(filtros.ddd){
      filtroSql += "t.numero like '"+ filtros.ddd +"%'"
    }

    if(filtros.ddd && filtros.parteNome){
      filtroSql += " AND "
    }

    if(filtros.parteNome){
      filtroSql += "c.nome like '%"+ filtros.parteNome +"%'"
    }

    return filtroSql;
  }

  async agruparRetorno(rows) {
    // Agrupar telefones e e-mails
    const clientes = {};
    rows.forEach((row) => {
      const { id, nome, cpf, numero, endereco } = row;
      if (!clientes[id]) {
        clientes[id] = {
          id,
          nome,
          cpf,
          telefones: [],
          emails: [],
        };
      }
      if (numero && !clientes[id].telefones.includes(numero)) {
        clientes[id].telefones.push(numero);
      }
      if (endereco && !clientes[id].emails.includes(endereco)) {
        clientes[id].emails.push(endereco);
      }
    });
    // Retornar a lista de clientes
    return Object.values(clientes);
  }
}

module.exports = ClienteService;