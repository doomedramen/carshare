import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import DateTimeInput from '@/components/DateTimeInput.vue';
import TimeInput from '@/components/TimeInput.vue';
import setClickOutsideDirective from '../../setClickOutsideDirective'

let localVue = createLocalVue()
localVue = setClickOutsideDirective(localVue)

describe('DateTimeInput.vue', () => {
  it('mounts', () => {
    const wrapper = shallowMount(DateTimeInput, { localVue });
    expect(wrapper.isEmpty()).toBe(false)
  });


  it('should contain 1 TimeInput', () => {
    const wrapper = mount(DateTimeInput, { localVue });
    expect(wrapper.findAll(TimeInput).length).toBe(1)
  });

});
