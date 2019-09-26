"use strict";

const { expect } = require("chai");
const $RefParser = require("../../..");
const helper = require("../../utils/helper");
const path = require("../../utils/path");
const parsedSchema = require("./parsed");
const dereferencedSchema = require("./dereferenced");
const bundledSchema = require("./bundled");

describe("Schema with circular $refs that extend each other", () => {
  describe("$ref to self", () => {
    it("should parse successfully", async () => {
      let parser = new $RefParser();
      const schema = await parser.parse(path.rel("specs/circular-extended/circular-extended-self.json"));
      expect(schema).to.equal(parser.schema);
      expect(schema).to.deep.equal(parsedSchema.self);
      expect(parser.$refs.paths()).to.deep.equal([path.abs("specs/circular-extended/circular-extended-self.json")]);
      // The "circular" flag should NOT be set
      // (it only gets set by `dereference`)
      expect(parser.$refs.circular).to.equal(false);
    });

    it("should resolve successfully", helper.testResolve(
      path.rel("specs/circular-extended/circular-extended-self.json"),
      path.abs("specs/circular-extended/circular-extended-self.json"), parsedSchema.self,
      path.abs("specs/circular-extended/definitions/thing.json"), parsedSchema.thing
    ));

    it("should dereference successfully", async () => {
      let parser = new $RefParser();
      const schema = await parser.dereference(path.rel("specs/circular-extended/circular-extended-self.json"));
      expect(schema).to.equal(parser.schema);
      expect(schema).to.deep.equal(dereferencedSchema.self);
      // The "circular" flag should be set
      expect(parser.$refs.circular).to.equal(true);
    });

    it('should not dereference circular $refs if "options.$refs.circular" is "ignore"', async () => {
      let parser = new $RefParser();
      const schema = await parser.dereference(path.rel("specs/circular-extended/circular-extended-self.json"), { dereference: { circular: "ignore" }});
      expect(schema).to.equal(parser.schema);
      expect(schema).to.deep.equal(dereferencedSchema.self);
      // The "circular" flag should be set
      expect(parser.$refs.circular).to.equal(true);
    });

    it('should throw an error if "options.$refs.circular" is false', async () => {
      let parser = new $RefParser();

      try {
        await parser.dereference(path.rel("specs/circular-extended/circular-extended-self.json"), { dereference: { circular: false }});
        helper.shouldNotGetCalled();
      }
      catch (err) {
        // A ReferenceError should have been thrown
        expect(err).to.be.an.instanceOf(ReferenceError);
        expect(err.message).to.contain("Circular $ref pointer found at ");
        expect(err.message).to.contain("specs/circular-extended/circular-extended-self.json#/definitions/thing");

        // $Refs.circular should be true
        expect(parser.$refs.circular).to.equal(true);
      }
    });

    it("should bundle successfully", async () => {
      let parser = new $RefParser();
      const schema = await parser.bundle(path.rel("specs/circular-extended/circular-extended-self.json"));
      expect(schema).to.equal(parser.schema);
      expect(schema).to.deep.equal(bundledSchema.self);
      // The "circular" flag should NOT be set
      // (it only gets set by `dereference`)
      expect(parser.$refs.circular).to.equal(false);
    });
  });

  describe("$ref to ancestor", () => {
    it("should parse successfully", async () => {
      let parser = new $RefParser();
      const schema = await parser.parse(path.rel("specs/circular-extended/circular-extended-ancestor.json"));
      expect(schema).to.equal(parser.schema);
      expect(schema).to.deep.equal(parsedSchema.ancestor);
      expect(parser.$refs.paths()).to.deep.equal([path.abs("specs/circular-extended/circular-extended-ancestor.json")]);
      // The "circular" flag should NOT be set
      // (it only gets set by `dereference`)
      expect(parser.$refs.circular).to.equal(false);
    });

    it("should resolve successfully", helper.testResolve(
      path.rel("specs/circular-extended/circular-extended-ancestor.json"),
      path.abs("specs/circular-extended/circular-extended-ancestor.json"), parsedSchema.ancestor,
      path.abs("specs/circular-extended/definitions/person-with-spouse.json"), parsedSchema.personWithSpouse,
      path.abs("specs/circular-extended/definitions/pet.json"), parsedSchema.pet,
      path.abs("specs/circular-extended/definitions/animals.json"), parsedSchema.animals
    ));

    it("should dereference successfully", async () => {
      let parser = new $RefParser();
      const schema = await parser.dereference(path.rel("specs/circular-extended/circular-extended-ancestor.json"));
      expect(schema).to.equal(parser.schema);
      expect(schema).to.deep.equal(dereferencedSchema.ancestor.fullyDereferenced);
      // The "circular" flag should be set
      expect(parser.$refs.circular).to.equal(true);
      // Reference equality
      expect(schema.definitions.person.properties.spouse.properties)
        .to.equal(schema.definitions.person.properties);
      expect(schema.definitions.person.properties.pet.properties)
        .to.equal(schema.definitions.pet.properties);
    });

    it('should not dereference circular $refs if "options.$refs.circular" is "ignore"', async () => {
      let parser = new $RefParser();
      const schema = await parser.dereference(path.rel("specs/circular-extended/circular-extended-ancestor.json"), { dereference: { circular: "ignore" }});
      expect(schema).to.equal(parser.schema);
      expect(schema).to.deep.equal(dereferencedSchema.ancestor.ignoreCircular$Refs);
      // The "circular" flag should be set
      expect(parser.$refs.circular).to.equal(true);
    });

    it('should throw an error if "options.$refs.circular" is false', async () => {
      let parser = new $RefParser();

      try {
        await parser.dereference(path.rel("specs/circular-extended/circular-extended-ancestor.json"), { dereference: { circular: false }});
        helper.shouldNotGetCalled();
      }
      catch (err) {
        // A ReferenceError should have been thrown
        expect(err).to.be.an.instanceOf(ReferenceError);
        expect(err.message).to.contain("Circular $ref pointer found at ");
        expect(err.message).to.contain("specs/circular-extended/definitions/person-with-spouse.json#/properties/spouse");

        // $Refs.circular should be true
        expect(parser.$refs.circular).to.equal(true);
      }
    });

    it("should bundle successfully", async () => {
      let parser = new $RefParser();
      const schema = await parser.bundle(path.rel("specs/circular-extended/circular-extended-ancestor.json"));
      expect(schema).to.equal(parser.schema);
      expect(schema).to.deep.equal(bundledSchema.ancestor);
      // The "circular" flag should NOT be set
      // (it only gets set by `dereference`)
      expect(parser.$refs.circular).to.equal(false);
    });
  });

  describe("indirect circular $refs", () => {
    it("should parse successfully", async () => {
      let parser = new $RefParser();
      const schema = await parser.parse(path.rel("specs/circular-extended/circular-extended-indirect.json"));
      expect(schema).to.equal(parser.schema);
      expect(schema).to.deep.equal(parsedSchema.indirect);
      expect(parser.$refs.paths()).to.deep.equal([path.abs("specs/circular-extended/circular-extended-indirect.json")]);
      // The "circular" flag should NOT be set
      // (it only gets set by `dereference`)
      expect(parser.$refs.circular).to.equal(false);
    });

    it("should resolve successfully", helper.testResolve(
      path.rel("specs/circular-extended/circular-extended-indirect.json"),
      path.abs("specs/circular-extended/circular-extended-indirect.json"), parsedSchema.indirect,
      path.abs("specs/circular-extended/definitions/parent-with-children.json"), parsedSchema.parentWithChildren,
      path.abs("specs/circular-extended/definitions/child-with-parents.json"), parsedSchema.childWithParents,
      path.abs("specs/circular-extended/definitions/pet.json"), parsedSchema.pet,
      path.abs("specs/circular-extended/definitions/animals.json"), parsedSchema.animals
    ));

    it("should dereference successfully", async () => {
      let parser = new $RefParser();
      const schema = await parser.dereference(path.rel("specs/circular-extended/circular-extended-indirect.json"));
      expect(schema).to.equal(parser.schema);
      expect(schema).to.deep.equal(dereferencedSchema.indirect.fullyDereferenced);
      // The "circular" flag should be set
      expect(parser.$refs.circular).to.equal(true);
      // Reference equality
      expect(schema.definitions.parent.properties.children.items.properties)
        .to.equal(schema.definitions.child.properties);
      expect(schema.definitions.child.properties.parents.items.properties)
        .to.equal(schema.definitions.parent.properties);
      expect(schema.definitions.child.properties.pet.properties)
        .to.equal(schema.definitions.pet.properties);
    });

    it('should not dereference circular $refs if "options.$refs.circular" is "ignore"', async () => {
      let parser = new $RefParser();
      const schema = await parser.dereference(path.rel("specs/circular-extended/circular-extended-indirect.json"), { dereference: { circular: "ignore" }});
      expect(schema).to.equal(parser.schema);
      expect(schema).to.deep.equal(dereferencedSchema.indirect.ignoreCircular$Refs);
      // The "circular" flag should be set
      expect(parser.$refs.circular).to.equal(true);
    });

    it('should throw an error if "options.$refs.circular" is false', async () => {
      let parser = new $RefParser();

      try {
        await parser.dereference(path.rel("specs/circular-extended/circular-extended-indirect.json"), { dereference: { circular: false }});
        helper.shouldNotGetCalled();
      }
      catch (err) {
        // A ReferenceError should have been thrown
        expect(err).to.be.an.instanceOf(ReferenceError);
        expect(err.message).to.contain("Circular $ref pointer found at ");
        expect(err.message).to.contain("specs/circular-extended/definitions/child-with-parents.json#/properties/parents/items");

        // $Refs.circular should be true
        expect(parser.$refs.circular).to.equal(true);
      }
    });

    it("should bundle successfully", async () => {
      let parser = new $RefParser();
      const schema = await parser.bundle(path.rel("specs/circular-extended/circular-extended-indirect.json"));
      expect(schema).to.equal(parser.schema);
      expect(schema).to.deep.equal(bundledSchema.indirect);
      // The "circular" flag should NOT be set
      // (it only gets set by `dereference`)
      expect(parser.$refs.circular).to.equal(false);
    });
  });

  describe("indirect circular and ancestor $refs", () => {
    it("should parse successfully", async () => {
      let parser = new $RefParser();
      const schema = await parser.parse(path.rel("specs/circular-extended/circular-extended-indirect-ancestor.json"));
      expect(schema).to.equal(parser.schema);
      expect(schema).to.deep.equal(parsedSchema.indirectAncestor);
      expect(parser.$refs.paths()).to.deep.equal([path.abs("specs/circular-extended/circular-extended-indirect-ancestor.json")]);
      // The "circular" flag should NOT be set
      // (it only gets set by `dereference`)
      expect(parser.$refs.circular).to.equal(false);
    });

    it("should resolve successfully", helper.testResolve(
      path.rel("specs/circular-extended/circular-extended-indirect-ancestor.json"),
      path.abs("specs/circular-extended/circular-extended-indirect-ancestor.json"), parsedSchema.indirectAncestor,
      path.abs("specs/circular-extended/definitions/parent-with-child.json"), parsedSchema.parentWithChild,
      path.abs("specs/circular-extended/definitions/child-with-children.json"), parsedSchema.childWithChildren,
      path.abs("specs/circular-extended/definitions/pet.json"), parsedSchema.pet,
      path.abs("specs/circular-extended/definitions/animals.json"), parsedSchema.animals
    ));

    it("should dereference successfully", async () => {
      let parser = new $RefParser();
      const schema = await parser.dereference(path.rel("specs/circular-extended/circular-extended-indirect-ancestor.json"));
      expect(schema).to.equal(parser.schema);
      expect(schema).to.deep.equal(dereferencedSchema.indirectAncestor.fullyDereferenced);
      // The "circular" flag should be set
      expect(parser.$refs.circular).to.equal(true);
      // Reference equality
      expect(schema.definitions.parent.properties.child.properties)
        .to.equal(schema.definitions.child.properties);
      expect(schema.definitions.child.properties.children.items.properties)
        .to.equal(schema.definitions.child.properties);
      expect(schema.definitions.pet.properties)
        .to.equal(schema.definitions.child.properties.pet.properties);
    });

    it('should not dereference circular $refs if "options.$refs.circular" is "ignore"', async () => {
      let parser = new $RefParser();
      const schema = await parser.dereference(path.rel("specs/circular-extended/circular-extended-indirect-ancestor.json"), { dereference: { circular: "ignore" }});
      expect(schema).to.equal(parser.schema);
      expect(schema).to.deep.equal(dereferencedSchema.indirectAncestor.ignoreCircular$Refs);
      // The "circular" flag should be set
      expect(parser.$refs.circular).to.equal(true);
    });

    it('should throw an error if "options.$refs.circular" is false', async () => {
      let parser = new $RefParser();

      try {
        await parser.dereference(path.rel("specs/circular-extended/circular-extended-indirect-ancestor.json"), { dereference: { circular: false }});
        helper.shouldNotGetCalled();
      }
      catch (err) {
        // A ReferenceError should have been thrown
        expect(err).to.be.an.instanceOf(ReferenceError);
        expect(err.message).to.contain("Circular $ref pointer found at ");
        expect(err.message).to.contain("specs/circular-extended/definitions/child-with-children.json#/properties");

        // $Refs.circular should be true
        expect(parser.$refs.circular).to.equal(true);
      }
    });

    it("should bundle successfully", async () => {
      let parser = new $RefParser();
      const schema = await parser.bundle(path.rel("specs/circular-extended/circular-extended-indirect-ancestor.json"));
      expect(schema).to.equal(parser.schema);
      expect(schema).to.deep.equal(bundledSchema.indirectAncestor);
      // The "circular" flag should NOT be set
      // (it only gets set by `dereference`)
      expect(parser.$refs.circular).to.equal(false);
    });
  });

});
