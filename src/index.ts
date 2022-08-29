export * from './reactive/atom';
export * from './reactive/hooks';
export * from './reactive/form';
export * from './reactive/utils';

export * from './components/For';
export * from './components/If';
export * from './components/Switch';

export * from './reactive/context';
export * from './reactive/store';

export { createApp, h, createFragment } from './renderer';
export { declareDirective } from './renderer/directives';

// TODO:

// create small navigation

// add onDestroy hook

// create working loop

// do not use clone in for loop

// return render fn if needed
