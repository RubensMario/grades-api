import mongoose from 'mongoose';

// Definir esquema para os dados da collection
const Schema = mongoose.Schema;

// Esquema para os dados inseridos na colection grades-clolection
const gradeSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  subject: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
  value: {
    type: Number,
    require: true,
    min: 0,
  },
  lastModified: {
    type: Date,
    default: Date.now, // Definir valor padrão caso o valor não seja informado
  },
});

// Aplicar esquema da collection informado acima definindo modelo Grade
// Definir classe Grade
//(toda nova grade inserida no bd é uma instância dessa classe)
const Grade = mongoose.model('Grade', gradeSchema, 'grades-collection');

export { Grade };
