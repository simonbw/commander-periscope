import PubSub from 'pubsub-js';
import shortid from 'shortid';
import { ID } from '../../common/StateFields';
import { sleep, waitForSettled } from '../../common/util/AsyncUtil';

// TODO: Consider renaming this to DAO (Data Access Object)
// TODO: Garbage collection
export default class Resource {
  
  constructor(resourceName, pubsubName, createInstance, createOnNotFound = false) {
    this._resourceName = resourceName;
    this._pubsubName = pubsubName;
    this._createInstance = createInstance;
    this._createOnNotFound = createOnNotFound;
    this._instances = new Map(); // not Immutable.Map
    this._lastUpdates = new Map();
  }
  
  // TODO: Should we wrap pubsub entirely?
  getPubSubTopic(id, action = null) {
    return `${this._pubsubName}.${id}${action ? `.${action}` : ''}`;
  }
  
  publish(instance, action, data = {}) {
    const pubSubTopic = this.getPubSubTopic(instance.get(ID), action);
    PubSub.publish(
      pubSubTopic,
      { [this._resourceName]: instance, ...data }
    );
  }
  
  async create(id, ...rest) {
    if (this._instances.has(id)) {
      throw new Error(`${this._pubsubName} with id ${id} already exists`);
    }
    const instance = this._createInstance(this.coerceId(id), ...rest);
    this._instances.set(instance.get(ID), instance);
    return instance;
  }
  
  coerceId(id) {
    return id || shortid.generate();
  }
  
  async get(id, waitForUpdate = false) {
    if (!this._instances.has(id)) {
      if (this._createOnNotFound) {
        return this.create(id);
      } else {
        throw new Error(`${this._resourceName} with id ${id} not found`);
      }
    }
    if (waitForUpdate) {
      const lastUpdate = this._lastUpdates.get(id) || Promise.resolve();
      await waitForSettled(lastUpdate);
    }
    return this._instances.get(id);
  }
  
  async update(id, action, actionData, updater) {
    id = this.coerceId(id);
    const lastUpdate = this._lastUpdates.get(id) || Promise.resolve();
    
    // put all the async work into a promise so we can store it in _lastUpdates
    const updatePromise = (async () => {
      await waitForSettled(lastUpdate);
      if (process.env.NODE_ENV === 'dev') {
        await sleep(400); // artificial delay in dev
      }
      const instance = await updater(await this.get(id));
      if (!instance) {
        throw new Error(`updater returned ${instance}, ${this._resourceName} ${action}`);
      }
      this._instances.set(id, instance);
      this.publish(instance, action, actionData); // TODO: Do we really need to auto-publish?
      return instance;
    })();
    this._lastUpdates.set(id, updatePromise);
    return updatePromise;
  }
  
  async remove(id) {
    PubSub.unsubscribe(this.getPubSubTopic(id));
    // TODO: What should this return? Should this throw an error on not found?
    return this._instances.delete(id);
  }
}