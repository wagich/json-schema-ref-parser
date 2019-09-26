"use strict";

const { expect } = require("chai");
const $RefParser = require("../../lib");
const helper = require("../utils/helper");
const path = require("../utils/path");

describe("Callback & Promise syntax", () => {
  for (let method of ["parse", "resolve", "dereference", "bundle"]) {
    describe(method + " method", () => {
      it("should call the callback function upon success", testCallbackSuccess(method));
      it("should call the callback function upon failure", testCallbackError(method));
      it("should resolve the Promise upon success", testPromiseSuccess(method));
      it("should reject the Promise upon failure", testPromiseError(method));
    });
  }

  function testCallbackSuccess (method) {
    return function (done) {
      let parser = new $RefParser();
      parser[method](path.rel("specs/internal/internal.json"), (err, result) => {
        try {
          expect(err).to.be.null;
          expect(result).to.be.an("object").and.ok;

          if (method === "resolve") {
            expect(result).to.equal(parser.$refs);
          }
          else {
            expect(result).to.equal(parser.schema);
          }
          done();
        }
        catch (e) {
          done(e);
        }
      });
    };
  }

  function testCallbackError (method) {
    return function (done) {
      $RefParser[method](path.rel("specs/invalid/invalid.json"), (err, result) => {
        try {
          expect(err).to.be.an.instanceOf(SyntaxError);
          expect(result).to.be.undefined;
          done();
        }
        catch (e) {
          done(e);
        }
      });
    };
  }

  function testPromiseSuccess (method) {
    return function () {
      let parser = new $RefParser();
      return parser[method](path.rel("specs/internal/internal.json"))
        .then((result) => {
          expect(result).to.be.an("object").and.ok;

          if (method === "resolve") {
            expect(result).to.equal(parser.$refs);
          }
          else {
            expect(result).to.equal(parser.schema);
          }
        });
    };
  }

  function testPromiseError (method) {
    return function () {
      return $RefParser[method](path.rel("specs/invalid/invalid.json"))
        .then(helper.shouldNotGetCalled)
        .catch((err) => {
          expect(err).to.be.an.instanceOf(SyntaxError);
        });
    };
  }
});
