import Immutable from 'immutable';
import { ID } from '../../../src/common/StateFields';
import Resource from '../../../src/server/resources/Resource';
import expect from '../../expect';
import { wait } from '../../testUtils';

describe('Resource', () => {
  describe('.create', () => {
    it('should return a new instance', async () => {
      const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id }));
      const instance = await resource.create();
      expect(instance).to.exist;
      expect(instance).to.include.keys(ID);
      expect(instance.get(ID)).to.exist;
    });
    it('should create instances with different ids', async () => {
      const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id }));
      const instance1 = await resource.create();
      const instance2 = await resource.create();
      expect(instance1.get(ID)).to.exist;
      expect(instance2.get(ID)).to.exist;
      expect(instance1.get(ID)).to.not.equal(instance2.get(ID));
    });
  });
  
  describe('.get', () => {
    it('should return created instances', async () => {
      const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id }));
      const instance1 = await resource.create('custom_id');
      const instance2 = await resource.get('custom_id');
      expect(instance1.get(ID)).to.equal('custom_id');
      expect(instance2).to.equal(instance1);
    });
    
    it('should create missing instances when createOnError == true', async () => {
      const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id }), true);
      const instance = await resource.get('non-existent-id');
      expect(instance).to.exist;
      expect(instance.get(ID)).to.equal('non-existent-id');
    });
    
    it('should error on missing instances when createOnError == false', async () => {
      const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id }), false);
      await expect(resource.get('non-existent-id')).to.be.rejected;
    });
    
    it('waitForUpdate should wait for the last scheduled update to finish', async () => {
      const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id }), false);
      await resource.create('instance_id');
      resource.update('instance_id', '', '', (instance) => instance.set('updated', true));
      const dontWaitPromise = resource.get('instance_id', false);
      const waitPromise = resource.get('instance_id', true);
      
      expect(await dontWaitPromise).not.to.have.property('updated');
      expect(await waitPromise).to.have.property('updated', true);
    });
  });
  
  describe('.update', () => {
    it('should update an instance', async () => {
      const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id }));
      const preUpdate = await resource.create('instance_id');
      const updated = await resource.update('instance_id', 'action', {}, (instance) => instance.set('foo', 'bar'));
      expect(preUpdate.get('foo')).to.not.exist;
      expect(updated.get('foo')).to.equal('bar');
      expect(await resource.get('instance_id')).to.have.property('foo', 'bar');
    });
    
    it('should work with promises', async () => {
      const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id }));
      await resource.create('instance_id');
      const updated = await resource.update('instance_id', 'action', {}, async (instance) => {
        await (Promise.resolve());
        return instance.set('foo', 'bar');
      });
      expect(updated.get('foo')).to.equal('bar');
      expect(await resource.get('instance_id')).to.have.property('foo', 'bar');
    });
    
    it('should handle multiple updates without race condition', async () => {
      const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id, foo: '' }));
      await resource.create('instance_id');
      
      // Do a bunch of updates and verify that they happened in order
      const promises = [];
      const result = 'these letters should all come out in order';
      for (let c of result) {
        promises.push(resource.update('instance_id', 'action', {}, async (instance) => {
          await wait(Math.random() * 10);
          return instance.update('foo', foo => foo + c);
        }));
      }
      await Promise.all(promises);
      
      expect((await resource.get('instance_id')).get('foo')).to.equal(result);
    });
    
    it('upsert should work', async () => {
      const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id, foo: '' }), true);
      
      const instance1 = await resource.update(undefined, 'action', {}, (instance) => instance.set('foo', 1));
      const instance2 = await resource.update(undefined, 'action', {}, (instance) => instance.set('foo', 2));
      
      expect(instance1.get(ID)).to.not.equal(instance2.get(ID));
    });
    
    it('upsert should work without race conditions', async () => {
      const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id, foo: '' }), true);
      
      // Do a bunch of updates and verify that they happened in order
      const promises = [];
      const result = 'these letters should all come out in order';
      for (let c of result) {
        promises.push(resource.update('instance_id', 'action', {}, async (instance) => {
          await wait(Math.random() * 10);
          return instance.update('foo', foo => foo + c);
        }));
      }
      await Promise.all(promises);
      
      expect((await resource.get('instance_id')).get('foo')).to.equal(result);
    });
  });
  
  it('.remove()', async () => {
    const resource = new Resource('resource_name', 'pubsub_name', (id) => Immutable.Map({ id, foo: '' }));
    const instance = await resource.create();
    await resource.remove(instance.get(ID));
    await expect(resource.get(instance.get(ID))).to.be.rejected;
  });
  
  // TODO: Test publish and pubsub stuff.
});