const router = require("express").Router();
const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./data/lambda.sqlite3"
  },
  debug: true
};
const db = knex(knexConfig);

router.get("/", (req, res) => {
  db("bears")
    .then(bears => {
      res.status(200).json(bears);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  db("bears")
    .where({ id })
    .first()
    .then(bear => {
      res.status(200).json(bear);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
  if (!req.body.name) {
    return res
      .status(400)
      .json({ message: "Please provide a name for the bear." });
  }
  db("bears")
    .insert(req.body)
    .then(ids => {
      const id = ids[0];
      db("bears")
        .where({ id })
        .first()
        .then(bear => {
          res.status(201).json(bear);
        });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db("bears")
    .where({ id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "The Bear could not be found." });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;

  if (!req.body.name) {
    return res.status(400).json({ message: "Please provide an updated name." });
  }

  db("bears")
    .where({ id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: "The Bear could not be found." });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
