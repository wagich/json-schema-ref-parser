"use strict";

module.exports =
{
  self: {
    definitions: {
      thing: {
        $ref: "definitions/thing.json"
      }
    }
  },

  thing: {
    title: "thing",
    $ref: "thing.json",
    description: "This JSON Reference has additional properties (other than $ref). Normally, this creates a new type that extends the referenced type, but since this reference points to ITSELF, it doesn't do that.\n",
  },

  ancestor: {
    definitions: {
      person: {
        $ref: "definitions/person-with-spouse.json"
      },
      pet: {
        $ref: "definitions/pet.json"
      }
    }
  },

  personWithSpouse: {
    title: "person",
    properties: {
      spouse: {
        description: 'This JSON Reference has additional properties (other than $ref). This creates a new type that extends "person".\n',
        $ref: "person-with-spouse.json"
      },
      pet: {
        description: 'This JSON Reference has additional properties (other than $ref). This creates a new type that extends "pet".\n',
        $ref: "pet.json"
      },
      name: {
        type: "string"
      }
    }
  },

  animals: {
    definitions: {
      fish: {
        title: "fish",
        $ref: "#/definitions/animal"
      },
      cat: {
        title: "cat",
        $ref: "#/definitions/animal"
      },
      bird: {
        title: "bird",
        $ref: "#/definitions/animal"
      },
      animal: {
        type: "object",
        properties: {
          age: {
            type: "number"
          },
          name: {
            type: "string"
          }
        },
        title: "animal"
      },
      dog: {
        title: "dog",
        $ref: "#/definitions/animal"
      }
    }
  },

  pet: {
    title: "pet",
    type: {
      $ref: "animals.json#/definitions/cat/type"
    },
    properties: {
      age: {
        $ref: "animals.json#/definitions/bird/properties/age"
      },
      name: {
        $ref: "animals.json#/definitions/dog/properties/name"
      },
      species: {
        type: "string",
        enum: [
          "cat",
          "dog",
          "bird",
          "fish"
        ],
      },
    },
  },

  indirect: {
    definitions: {
      parent: {
        $ref: "definitions/parent-with-children.json"
      },
      child: {
        $ref: "definitions/child-with-parents.json"
      },
      pet: {
        $ref: "definitions/pet.json"
      }
    }
  },

  parentWithChildren: {
    title: "parent",
    properties: {
      name: {
        type: "string"
      },
      children: {
        items: {
          description: 'This JSON Reference has additional properties (other than $ref). This creates a new type that extends "child".\n',
          $ref: "child-with-parents.json"
        },
        type: "array"
      }
    }
  },

  childWithParents: {
    title: "child",
    properties: {
      parents: {
        items: {
          description: 'This JSON Reference has additional properties (other than $ref). This creates a new type that extends "parent".\n',
          $ref: "parent-with-children.json"
        },
        type: "array"
      },
      pet: {
        description: 'This JSON Reference has additional properties (other than $ref). This creates a new type that extends "pet".\n',
        $ref: "pet.json"
      },
      name: {
        type: "string"
      }
    }
  },

  indirectAncestor: {
    definitions: {
      pet: {
        $ref: "definitions/pet.json"
      },
      parent: {
        $ref: "definitions/parent-with-child.json"
      },
      child: {
        $ref: "definitions/child-with-children.json"
      }
    }
  },

  parentWithChild: {
    title: "parent",
    properties: {
      name: {
        type: "string"
      },
      child: {
        description: 'This JSON Reference has additional properties (other than $ref). This creates a new type that extends "child".\n',
        $ref: "child-with-children.json"
      }
    },
  },

  childWithChildren: {
    title: "child",
    properties: {
      pet: {
        description: 'This JSON Reference has additional properties (other than $ref). This creates a new type that extends "pet".\n',
        $ref: "pet.json"
      },
      name: {
        type: "string"
      },
      children: {
        items: {
          description: 'This JSON Reference has additional properties (other than $ref). This creates a new type that extends "child".\n',
          $ref: "child-with-children.json"
        },
        type: "array",
        description: "children"
      }
    },
  }
};
