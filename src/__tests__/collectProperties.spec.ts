/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-05-30 18:28
 */
import { action, computed, observable } from 'mobx';
import collectProperties from '../collectProperties';

test('collect properties from observable class', () => {

	class Model {

		@observable age = 10;

		@computed get name() {
			return 20;
		}

		set name(v) {
			this.age = v;
		}

		@action.bound setAge() {
			this.age++;
		}
	}

	const properties = collectProperties(new Model());
	expect(properties).toEqual(['$mobx', 'age', 'name', 'setAge']);
});

test('collect properties from observable object', () => {

	const model = observable({
		age: 10,
		get name() {
			return 20;
		},
	});

	(model as any).setAge = action('action', () => model.age++);

	const properties = collectProperties(model);
	expect(properties).toEqual(['$mobx', 'age', 'name', 'setAge']);

});
