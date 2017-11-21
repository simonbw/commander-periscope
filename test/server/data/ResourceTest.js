import Immutable from '../../node_modules/immutable/dist/immutable';
import Resource from '../../src/data/Resource';
import expect from '../expect';
import { shouldReject } from '../../testUtils';

describe('Resource', () => {
  describe('.create', () => {
    it('should return a new instance', () => {
      return new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id }))
        .create()
        .then(instance => {
          expect(instance).to.exist;
          expect(instance).to.include.keys('id');
          expect(instance.get('id')).to.exist;
        });
    });
  });
  
  describe('.get', () => {
    it('should return created instances', () => {
      const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id }));
      return resource
        .create('custom_id')
        .then(() => {
          return resource.get('custom_id');
        })
        .then((instance) => {
          expect(instance).to.exist;
          expect(instance.get('id')).to.equal('custom_id');
        })
    });
    
    it('should create missing instances when createOnError == true', () => {
      return new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id }), true)
        .get('non-existent-id')
        .then(instance => {
          expect(instance).to.exist;
          expect(instance.get('id')).to.equal('non-existent-id');
        });
    });
    
    it('should error on missing instances when createOnError == false', () => {
      return new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id }), false)
        .get('non-existent-id')
        .then(shouldReject, (error) => {
          // expect(error.statusCode).to.equal(404);
        })
    });
  });
  
  // TODO: Test update
  
  // TODO: Test pubsub. Maybe that means we should incorporate pubsub into Resource
});