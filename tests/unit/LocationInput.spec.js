import { shallowMount, createLocalVue } from '@vue/test-utils';
import LocationInput from '@/components/LocationInput.vue';
import setClickOutsideDirective from '../../setClickOutsideDirective'
import axios from 'axios';
import debouce from 'lodash/debounce';

let localVue = createLocalVue()
localVue = setClickOutsideDirective(localVue)

jest.mock('axios');

//mock api call
axios.get.mockImplementation(() => Promise.resolve({ data: mockData }));
//mock debounce
jest.mock("lodash/debounce", () =>
  jest.fn(fn => {
    fn.cancel = jest.fn();
    return fn;
  })
);

const mockData = [
  {
    place_id: 11111,
    lat: 1,
    lon: 1,
    display_name: "fake"
  },
  {
    place_id: 22222,
    lat: 2,
    lon: 2,
    display_name: "fake"
  },
  {
    place_id: 33333,
    lat: 3,
    lon: 3,
    display_name: "fake"
  }
];

describe('LocationInput.vue', () => {
  it('mounts', () => {
    const wrapper = shallowMount(LocationInput, { localVue });
    expect(wrapper.contains('div')).toBe(true)
  });
  it('take an input string and displays list of locations', done => {

    const wrapper = shallowMount(LocationInput, { localVue });
    const inputWrapper = wrapper.find({ ref: 'location' })
    const foundLocationsWrapper = wrapper.find({ ref: 'found-locations' })

    // //it should have lenth of 0 while there is no input
    expect(foundLocationsWrapper.isEmpty()).toBe(true)

    //input a value
    inputWrapper.setValue('acle')

    //wait for the mocked debounch and asyncData to return (next tick)
    localVue.nextTick(() => {
      expect(foundLocationsWrapper.isEmpty()).toBe(false)
      done()
    })

  });
});
