import PubSub from 'pubsub-js';
import shortid from 'shortid';

export default class Resource {
  
  constructor(resourceName, pubsubName, createInstance, createOnNotFound = false) {
    this._resourceName = resourceName;
    this._pubsubName = pubsubName;
    this._createInstance = createInstance;
    this._createOnNotFound = createOnNotFound;
    this._instances = new Map(); // not Immutable.Map
  }
  
  getPubSubTopic(id, action = null) {
    return `${this._pubsubName}.${id}${action ? `.${action}` : ''}`;
  }
  
  publish(instance, action, data = {}) {
    PubSub.publish(
      this.getPubSubTopic(instance.get('id'), action),
      { [this._resourceName]: instance, ...data }
    );
  }
  
  create(id, ...rest) {
    if (this._instances.has(id)) {
      return Promise.reject(new Error(`${this._pubsubName} with id ${id} already exists`));
    }
    const instance = this._createInstance(id || shortid.generate(), ...rest);
    this._instances.set(instance.get('id'), instance);
    return Promise.resolve(instance);
  }
  
  get(id) {
    if (!this._instances.has(id)) {
      if (this._createOnNotFound) {
        return this.create(id);
      } else {
        return Promise.reject(new Error(`${this._resourceName} with id ${id} not found`));
      }
    }
    return Promise.resolve(this._instances.get(id));
  }
  
  update(id, action, actionData, updater) {
    return this.get(id)
      .then(updater) // Put this here so updater can be async
      .then((instance) => {
        this._instances.set(id, instance);
        this.publish(instance, action, actionData);
        return instance;
      });
  }
  
  remove(id) {
    PubSub.unsubscribe(this.getPubSubTopic(id));
    return Promise.resolve(this._instances.remove(id));
  }
}