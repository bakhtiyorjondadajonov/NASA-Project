const { planets } = require("../../models/planets.model");
exports.getAllPlanets = (req, res) => {
  return res.status(200).json(planets);
};
