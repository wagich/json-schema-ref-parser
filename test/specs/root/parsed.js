"use strict";

module.exports =
{
  schema: {
    $ref: "definitions/root.json"
  },

  root: {
    $ref: "../definitions/extended.json"
  },

  extended: {
    title: "Extending a root $ref",
    $ref: "name.json"
  },

  name: {
    title: "name",
    required: [
      "first",
      "last"
    ],
    type: "object",
    properties: {
      last: {
        $ref: "./name.json#/properties/first"
      },
      first: {
        type: "string"
      }
    },
  }
};
