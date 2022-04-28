const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    versionKey: false,
  }
);

todoSchema.index(
  {
    title: 'text',
    description: 'text',
  },
  {
    name: 'todo_search_text_index',
    weights: { title: 5, description: 2 },
  }
);

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
