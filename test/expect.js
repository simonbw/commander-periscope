import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiImmutable from 'chai-immutable';

chai.use(chaiImmutable);
chai.use(chaiAsPromised);

export default chai.expect;