import Immutable from 'immutable';
import Resource from '../../../src/server/data/Resource';
import expect from '../../expect';
import { shouldReject, wait } from '../../testUtils';

describe('Resource', () => {
  describe('.create', () => {
    it('should return a new instance', async () => {
      const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id }));
      const instance = await resource.create();
      expect(instance).to.exist;
      expect(instance).to.include.keys('id');
      expect(instance.get('id')).to.exist;
    });
    it('should create instances with different ids', async () => {
      const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id }));
      const instance1 = await resource.create();
      const instance2 = await resource.create();
      expect(instance1.get('id')).to.exist;
      expect(instance2.get('id')).to.exist;
      expect(instance1.get('id')).to.not.equal(instance2.get('id'));
    });
  });
  
  describe('.get', () => {
    it('should return created instances', async () => {
      const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id }));
      const instance1 = await resource.create('custom_id');
      const instance2 = await resource.get('custom_id');
      expect(instance1.get('id')).to.equal('custom_id');
      expect(instance2).to.equal(instance1);
    });
    
    it('should create missing instances when createOnError == true', async () => {
      const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id }), true);
      const instance = await resource.get('non-existent-id');
      expect(instance).to.exist;
      expect(instance.get('id')).to.equal('non-existent-id');
    });
    
    it('should error on missing instances when createOnError == false', async () => {
      const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id }), false);
      expect(resource.get('non-existent-id')).to.be.rejected;
    });
  });
  
  describe('.update', () => {
    it('should update an instance', async () => {
      const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id }));
      const preUpdate = await resource.create('id');
      const updated = await resource.update('id', 'action', {}, (instance) => instance.set('foo', 'bar'));
      expect(preUpdate.get('foo')).to.not.exist;
      expect(updated.get('foo')).to.equal('bar');
      expect(await resource.get('id')).to.have.property('foo', 'bar');
    });
    
    it('should work with promises', async () => {
      const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id }));
      await resource.create('id');
      const updated = await resource.update('id', 'action', {}, async (instance) => {
        await (Promise.resolve());
        return instance.set('foo', 'bar');
      });
      expect(updated.get('foo')).to.equal('bar');
      expect(await resource.get('id')).to.have.property('foo', 'bar');
    });
    
    it('should handle multiple updates without race condition', async () => {
      const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id, foo: '' }));
      await resource.create('id');
      
      // Do a bunch of updates and verify that they happened in order
      const promises = [];
      const result = 'these letters should all come out in order';
      for (let c of result) {
        promises.push(resource.update('id', 'action', {}, async (instance) => {
          await wait(Math.random() * 10); // TODO: Do something faster
          return instance.update('foo', foo => foo + c);
        }));
      }
      await Promise.all(promises);
      
      expect((await resource.get('id')).get('foo')).to.equal(result);
    });
    
    it('upsert should work', async () => {
      const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id, foo: '' }), true);
      
      const instance1 = await resource.update(undefined, 'action', {}, (instance) => instance.set('foo', 1));
      const instance2 = await resource.update(undefined, 'action', {}, (instance) => instance.set('foo', 2));
      
      expect(instance1.get('id')).to.not.equal(instance2.get('id'));
    });
    
    it('upsert should work without race conditions', async () => {
      const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id, foo: '' }), true);
      
      // Do a bunch of updates and verify that they happened in order
      const promises = [];
      const result = 'these letters should all come out in order';
      for (let c of result) {
        promises.push(resource.update('id', 'action', {}, async (instance) => {
          await wait(Math.random() * 10); // TODO: Do something faster
          return instance.update('foo', foo => foo + c);
        }));
      }
      await Promise.all(promises);
      
      expect((await resource.get('id')).get('foo')).to.equal(result);
    });
  });
  
  it('.remove()', async () => {
    const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id, foo: '' }));
    const instance = await resource.create();
    await resource.remove(instance.get('id'));
    expect(resource.get(instance.get('id'))).to.be.rejected;
  });
  
  // TODO: Test publish and pubsub stuff.
});