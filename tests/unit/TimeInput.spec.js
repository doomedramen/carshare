import { shallowMount } from '@vue/test-utils';
import TimeInput from '@/components/TimeInput.vue';

describe('TimeInput.vue', () => {
  it('mounts', () => {
    const wrapper = shallowMount(TimeInput, {});
    expect(wrapper.isEmpty()).toBe(false)
  });

  it('should emit {hour, minute} object on change', () => {
    const wrapper = shallowMount(TimeInput, {});
    const hourSelectWrapper = wrapper.find({ ref: 'hour' })

    hourSelectWrapper.findAll('option').at(1).element.selected = true //a little hacky but works for selecting an option
    hourSelectWrapper.trigger('change')

    expect(wrapper.emitted().change).toBeTruthy()
    expect(wrapper.emitted().change[0][0]).toEqual({ hour: 1, minute: 0 })


  })
});
