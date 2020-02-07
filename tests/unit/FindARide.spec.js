import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import FindARide from '@/components/FindARide.vue';
import DateTimeInput from '@/components/DateTimeInput.vue';
import LocationInput from '@/components/LocationInput.vue';
import setClickOutsideDirective from '../../setClickOutsideDirective'

let localVue = createLocalVue()
localVue = setClickOutsideDirective(localVue)


describe('FindARide.vue', () => {
  it('mounts', () => {
    const wrapper = shallowMount(FindARide, { localVue });
    expect(wrapper.isEmpty()).toBe(false)
  });

  it('should contain 2 DateTimeInputs', () => {
    const wrapper = mount(FindARide, { localVue });
    expect(wrapper.findAll(DateTimeInput).length).toBe(2)
  });

  it('should contain 2 LocationInputs', () => {
    const wrapper = mount(FindARide, { localVue });
    expect(wrapper.findAll(LocationInput).length).toBe(2)
  });

  it('have a disabled submit button as default', () => {
    const wrapper = mount(FindARide, {});
    const submitButtonWrapper = wrapper.find({ ref: 'submit' })

    // console.log(submitButtonWrapper.html());
    //all inputs empty, select should be disabled
    expect(submitButtonWrapper.attributes('disabled')).toEqual('disabled')

    // //TODO fill in all 4 inputs
    // const locationInputsWrapper = wrapper.findAll('input')
    // // console.log(locationInputsWrapper.at(0).html())
    // locationInputsWrapper.at(0).setValue('acle')
    // locationInputsWrapper.at(0).setValue('lowestoft')

    //TODO check button not disabled
  })
});
