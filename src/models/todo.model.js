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

todoSchema.static('search', async function (q, id) {
  const t = this;

  const searchPartial = async (q) => {
    return await t
      .find({
        title: new RegExp(q, 'gi'),
        owner: id,
      })
      .limit(25)
      .lean()
      .exec();
  };

  const searchFull = async (q) => {
    return await t
      .find(
        {
          $text: {
            $search: q,
            $caseSensitive: false,
            $diacriticSensitive: false,
          },
          owner: id,
        },
        { score: { $meta: 'textScore' } }
      )
      .limit(25)
      .lean()
      .sort({ score: { $meta: 'textScore' } })
      .exec();
  };

  try {
    let data;
    data = await searchFull(q);

    if (!data) {
      data = await searchPartial(q);
    }

    if (data.length === 0) {
      data = await searchPartial(q);
    }

    return data;
  } catch (error) {
    throw error;
  }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
