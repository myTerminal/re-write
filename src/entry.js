#!/usr/bin/env node

import helper from './helper';
import reWrite from './re-write';

export default args => {
    const action = args[1].indexOf('undo') > -1 ? reWrite.undoIt : reWrite.doIt,
        items = helper.getInputAndOutputItems(action, args),
        input = items[0],
        output = items[1];

    action(input, output);
};
