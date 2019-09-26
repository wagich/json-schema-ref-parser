"use strict";

module.exports =
{
  schema: {
    definitions: {
      pet: {
        $ref: "definitions/pet.json"
      },
      thing: {
        $ref: "circular-external.json#/definitions/thing"
      },
      person: {
        $ref: "definitions/person.json"
      },
      parent: {
        $ref: "definitions/parent.json"
      },
      child: {
        $ref: "definitions/child.json"
      }
    }
  },

  pet: {
    title: "pet",
    type: "object",
    properties: {
      age: {
        type: "number"
      },
      name: {
        type: "string"
      },
      species: {
        enum: [
          "cat",
          "dog",
          "bird",
          "fish"
        ],
        type: "string"
      }
    },
  },

  child: {
    type: "object",
    properties: {
      parents: {
        items: {
          $ref: "parent.json"
        },
        type: "array"
      },
      name: {
        type: "string"
      }
    },
    title: "child"
  },

  parent: {
    type: "object",
    properties: {
      name: {
        type: "string"
      },
      children: {
        items: {
          $ref: "child.json"
        },
        type: "array"
      }
    },
    title: "parent"
  },

  person: {
    type: "object",
    properties: {
      spouse: {
        $ref: "person.json"
      },
      name: {
        type: "string"
      }
    },
    title: "person"
  }
};
