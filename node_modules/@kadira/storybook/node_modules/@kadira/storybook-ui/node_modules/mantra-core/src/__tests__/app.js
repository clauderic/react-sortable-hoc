import {expect} from 'chai';
import App from '../app';
const {describe, it} = global;

describe('App', () => {
  describe('constructor', () => {
    it('should fail if context is not provided', () => {
      const run = () => {
        return new App();
      };

      const errorMatch = /Context is required when creating a new app/;
      expect(run).to.throw(errorMatch);
    });
  });

  describe('loadModule', () => {
    it('should fail if initialized', () => {
      const app = new App({});
      app.__initialized = true;
      expect(app.loadModule.bind(app)).to.throw(/already initialized/);
    });

    it('should fail if there is no module', () => {
      const app = new App({});
      const errorMatch = /Should provide a module to load/;
      expect(app.loadModule.bind(app)).to.throw(errorMatch);
    });

    it('should fail if module is already loaded', () => {
      const app = new App({});
      const module = {};
      module.__loaded = true;
      const errorMatch = /This module is already loaded/;
      expect(app.loadModule.bind(app, module)).to.throw(errorMatch);
    });

    describe('has routes field', () => {
      it('should fail if routes is not a function', () => {
        const app = new App({});
        const module = {
          routes: {}
        };
        const errorMatch = /Module's routes field should be a function/;
        expect(app.loadModule.bind(app, module)).to.throw(errorMatch);
      });

      it('should save routes if it is a function', () => {
        const app = new App({});
        const module = {
          routes() {}
        };

        app.loadModule(module);
        expect(app._routeFns).to.be.deep.equal([ module.routes ]);
      });
    });

    it('should merge actions with app wide global actions', () => {
      const app = new App({});
      app.actions = {bb: 10};
      const module = {
        actions: {aa: 10}
      };

      app.loadModule(module);
      expect(app.actions).to.be.deep.equal({bb: 10, aa: 10});
    });

    it('should merge actions even actions is an empty field', () => {
      const app = new App({});
      app.actions = {bb: 10};
      const module = {};

      app.loadModule(module);
      expect(app.actions).to.be.deep.equal({bb: 10});
    });

    describe('has module.load', () => {
      it('should throw an error if module.load is not a function', () => {
        const context = {};
        const app = new App(context);
        const module = {
          load: 'not a function'
        };

        const run = () => app.loadModule(module);
        expect(run).to.throw(/module\.load should be a function/);
      });

      it('should call module.load with context and actions', done => {
        const context = {aa: 10};
        const app = new App(context);
        app.actions = {
          hello: {
            aa(c, a) {
              expect(c).to.deep.equal(context);
              expect(a).to.be.equal(20);
              done();
            }
          }
        };

        const module = {
          load(c, actions) {
            expect(c).to.be.equal(context);
            actions.hello.aa(20);
          },
        };

        app.loadModule(module);
      });
    });

    it('should mark the module as loaded', () => {
      const app = new App({});
      const module = {};

      app.loadModule(module);
      expect(module.__loaded).to.be.equal(true);
    });
  });

  describe('init', () => {
    it('should fail if initialized', () => {
      const app = new App({});
      app.__initialized = true;
      const errorMatch = /App is already initialized/;
      expect(app.init.bind(app)).to.throw(errorMatch);
    });

    it('should call all routes functions as the load order', () => {
      const app = new App({});
      const calledRoutes = [];
      const genRoute = index => {
        return () => calledRoutes.push(index);
      };

      app._routeFns = [
        genRoute(1),
        genRoute(2)
      ];

      app.init();
      expect(calledRoutes).to.deep.equal([ 1, 2 ]);
    });


    it('should mark as initialized', () => {
      const app = new App({});
      app.init();
      expect(app.__initialized).to.be.equal(true);
    });
  });
});
