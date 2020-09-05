import { db } from '../models/index.js';
import { logger } from '../config/logger.js';

// Poderia importar Grade diretamente de gradeModel
const Grade = db.gradeModel;

const create = async (req, res) => {
  const { name, subject, type, value } = req.body;
  const newGrade = new Grade({
    name,
    subject,
    type,
    value,
  });

  try {
    await newGrade.save();
    res.send({ message: 'Grade inserido com sucesso' });
    logger.info(`POST /grade - ${JSON.stringify()}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};

// Encontrar grade por name
const findAll = async (req, res) => {
  const name = req.query.name;

  //condicao para o filtro no findAll
  // $options:'i' é para consulta insensível a maiúsculas/minúsculas
  let condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};

  try {
    const grades = await Grade.find(condition);
    // Se valido com !grades, posso ter [], que não é falsy
    if (!grades.length) res.status(404).send('Nenhuma informação encontrada!');

    // Mudar _id para id por conta do código do frontend da aplicação
    const gradesList = grades.map(({ _id, name, subject, type, value }) => {
      return {
        id: _id,
        name,
        subject,
        type,
        value,
      };
    });

    res.send(gradesList);
    logger.info(`GET /grade`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Erro ao listar todos os documentos' });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const findOne = async (req, res) => {
  const { id } = req.params;

  try {
    const grade = await Grade.findById({ _id: id });

    if (!grade) res.status(404).send('Nenhuma informação encontrada!');

    res.send(grade);
    logger.info(`GET /grade - ${id}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar o Grade id: ' + id });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const update = async (req, res) => {
  // Essa validação poderia ser feita no frontend
  // deixando o botão de envio desabilitado até que algo fosse digitado
  if (!req.body) {
    return res.status(400).send({
      message: 'Nehnum dado informado para atualizacao',
    });
  }

  const { id } = req.params;

  try {
    // Atualiza qualquer campo informado no body
    // Por isso, neste caso, é melhor findByIdAndUpdate que find + save
    const grade = await Grade.findByIdAndUpdate({ _id: id }, req.body, {
      new: true, // new: retornar documento já atualizado
    });

    if (!grade) res.status(404).send('Nenhuma informação encontrada!');

    res.send(grade);

    logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar a Grade id: ' + id });
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const grade = await Grade.findByIdAndDelete({ _id: id });

    if (!grade) res.status(404).send('Registro não encontrado!');

    res.send('Registro excluído com sucesso!');

    logger.info(`DELETE /grade - ${id}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Nao foi possivel deletar o Grade id: ' + id });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

const removeAll = async (req, res) => {
  try {
    const data = await Grade.deleteMany();

    if (!data) res.status(404).send('Nenhum registro não encontrado!');

    logger.info(`DELETE /grade`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao excluir todos as Grades' });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

export default { create, findAll, findOne, update, remove, removeAll };
