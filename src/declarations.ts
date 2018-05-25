/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-05-22 17:28
 */

import Vue from 'vue';

export type VueClass<V> = { new(...args: any[]): V & Vue } & typeof Vue;
